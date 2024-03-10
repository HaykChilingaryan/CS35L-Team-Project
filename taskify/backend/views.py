from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from .serializers import TaskSerializer, UserRegistrationSerializer, UserSerializer, CompanySerializer
from rest_framework.decorators import permission_classes, authentication_classes
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET
from rest_framework.decorators import api_view
from django.contrib.sessions.models import Session
from .models import Task, Company
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import json
from django.db.models.functions import Lower
from django.db.models import Q
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags



def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})
        
class CompanyListView(APIView):
    def get(self, request, format=None):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        raw_password = request.data.get('password')
        if serializer.is_valid():
            user = User.objects.create_user(**serializer.validated_data)

            subject = 'Welcome to Taskify!'
            message = render_to_string('welcome_email.html', {'user': user, 'raw_password': raw_password})
            plain_message = strip_tags(message)
            to_email = [user.email]
            send_mail(subject, plain_message, None, to_email, html_message=message)
            return Response({'message': 'User successfully registered.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class UserListView(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
def logout_view(request):
    try:
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@require_POST
@csrf_exempt
@permission_classes([AllowAny])
def user_login(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username', '')
        password = data.get('password', '')
        
        if not username or not password:
            return Response({'message': 'Both username and password are required'}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            session = request.session.session_key
            serializer = UserSerializer(user)
            user_info = serializer.data
            return Response({'message': 'Login successful', 'user': user_info, 'session': session})
        else:
            return Response({'message': 'Invalid credentials'}, status=401)
    except Exception as e:
        return Response({'message': str(e)}, status=500)
    
@require_GET
def check_authentication(request):
    """
    View to check if the user is authenticated.
    """
    if request.user.is_authenticated:
        return JsonResponse({'message': 'Authenticated'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'message': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    try:
        user = request.user
        if not user:
            return Response({'message': 'User not authenticated'}, status=401)
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        return Response({'message': str(e)}, status=500)

@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def task_request(request):
    try:
        user = request.user
        if not user:
            return Response({'message': 'User not in session'}, status=status.HTTP_400_BAD_REQUEST)

        if request.method == 'POST':
            if user.is_manager:
                serializer = TaskSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    created_task_id = serializer.data['id']
                    created_task = Task.objects.get(id=created_task_id)
                    response = TaskSerializer(created_task)
                    return Response({'message': "Task Successfully Created", 'task': response.data}, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Not Authorized to create Task", status=status.HTTP_403_FORBIDDEN)

        elif request.method == 'GET':
            ordering_param = request.query_params.get('ordering', 'title')
            ordering_field = ordering_param.lower()
            search_query = request.query_params.get('search', '')

            if user.is_manager:
                users_in_company = User.objects.filter(company=user.company)

                if search_query:
                    tasks = Task.objects.filter(
                        Q(title__icontains=search_query) | Q(description__icontains=search_query),
                        assigned_user__in=users_in_company
                    ).order_by(Lower(ordering_field))
                else:
                    tasks = Task.objects.filter(assigned_user__in=users_in_company).order_by(Lower(ordering_field))
            else:
                if search_query:
                    tasks = Task.objects.filter(
                        Q(title__icontains=search_query) | Q(description__icontains=search_query),
                        assigned_user__id=user.id
                    ).order_by(Lower(ordering_field))
                else:
                    tasks = Task.objects.filter(assigned_user__id=user.id).order_by(Lower(ordering_field))

            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PATCH':
            task_id = request.data.get('id')
            if not task_id:
                return Response({'message': "Task ID is required for PATCH request"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return Response({'message': "Task not found"}, status=status.HTTP_404_NOT_FOUND)

            if user.is_manager or user == task.assigned_user:
                serializer = TaskSerializer(instance=task, data=request.data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': "Permission denied: You cannot update this task"}, status=status.HTTP_403_FORBIDDEN)

    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': "Unable to perform the requested operation"}, status=status.HTTP_400_BAD_REQUEST)
   

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_task_status(request, task_id):
    if request.method == 'PATCH':
        task = get_object_or_404(Task, id=task_id)
        data = json.loads(request.body.decode('utf-8'))

        new_status = data.get('status')

        if new_status is not None:
            task.status = new_status
            task.save()
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid or missing "status" field in the request data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PATCH'])
@login_required
def update_password(request):
    user = request.user
    new_password = json.loads(request.body.decode('utf-8')).get('newPassword')

    if new_password:
        # Validate the new password (you can add more validation if needed)
        if user.check_password(new_password):
            return Response({'message': 'New password must be different from the current password'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({'message': 'New password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's password
        user.set_password(new_password)
        user.save()
        logout(request)

        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'New password not provided'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_all_users(request):
    try:
        # Delete all users
        User.objects.all().delete()
        return Response({'message': 'All users deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)@api_view(['DELETE'])
        
@api_view(['DELETE']) 
def delete_all_tasks(request):
    try:
        # Delete all users
        Task.objects.all().delete()
        return Response({'message': 'All tasks deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def create_company(request):
    if request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_by_company(request, company_id):
    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

    users = User.objects.filter(company=company)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_by_id(request, company_id):
    try:
        company = Company.objects.get(id=company_id)
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Company.DoesNotExist:
        return Response({'message': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_all_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_tasks_for_company(request, company_id):
    company = get_object_or_404(Company, id=company_id)
    users_in_company = User.objects.filter(company=company)
    tasks = Task.objects.filter(assigned_user__in=users_in_company)
    serializer = TaskSerializer(tasks, many=True)
    tasks_data = serializer.data
    return Response({"tasks": tasks_data})

@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    user = get_object_or_404(User, id=user_id)
    serializer = UserSerializer(user)
    return JsonResponse(serializer.data)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (AllowAny, )

    def get(request, format=None):
        return Response({ 'success': 'CSRF cookie set' })