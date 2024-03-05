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
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_POST, require_GET
from rest_framework.decorators import api_view
from django.contrib.sessions.models import Session
from .models import Task, Company
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
import json


def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})
        
class CompanyListView(APIView):
    def get(self, request, format=None):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserRegistrationView(APIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User successfully registered.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@login_required
def logout_view(request):
    logout(request)
    return Response({"message": "Logout successful"})
    
@api_view(['POST'])
@require_POST
@csrf_exempt
@permission_classes([AllowAny])
def user_login(request):
    data = json.loads(request.body.decode('utf-8'))
    username = data.get('username', '')
    password = data.get('password', '')
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        session = request.session.session_key
        serializer = UserSerializer(user)
        user_info = serializer.data
        return JsonResponse({'message': 'Login successful', 'user': user_info, 'session': session})
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    
@require_GET
def check_authentication(request):
    """
    View to check if the user is authenticated.
    """
    if request.user.is_authenticated:
        return JsonResponse({'message': 'Authenticated'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    try:
        user = request.user
        if not user:
            return Response({'detail': 'User not in request'}, status=400)
        
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response({'detail': 'User not found'}, status=404)
    except Exception as e:
        return Response({'detail': str(e)}, status=500)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    if request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            created_task_id = serializer.data['id']
            created_task = Task.objects.get(id=created_task_id)
            response = TaskSerializer(created_task)
            return Response(response.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_tasks(request):
    user = request.user
    if not user:
        return Response({'detail': 'User not in session'}, status=400)

    tasks = Task.objects.filter(assigned_user__id=user.id)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_task_status(request, task_id):
    if request.method == 'PATCH':
        task = get_object_or_404(Task, id=task_id)
        data = json.loads(request.body.decode('utf-8'))

        # Extract 'status' from the JSON data
        new_status = data.get('status')

        # Check if new_status is provided and not None
        if new_status is not None:
            task.status = new_status
            task.save()
            serializer = TaskSerializer(task)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@api_view(['PATCH'])
@login_required
def update_password(request):
    user = request.user
    new_password = json.loads(request.body.decode('utf-8')).get('newPassword')

    if new_password:
        # Validate the new password (you can add more validation if needed)
        if len(new_password) < 8:
            return JsonResponse({'error': 'New password must be at least 8 characters long'}, status=400)

        # Update the user's password
        user.set_password(new_password)
        user.save()

        return JsonResponse({'message': 'Password updated successfully'}, status=200)
    else:
        return JsonResponse({'error': 'New password not provided'}, status=400)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    if request.method == 'PATCH':
        task = get_object_or_404(Task, id=task_id)
        data = json.loads(request.body.decode('utf-8'))

        # Extract 'status' from the JSON data
        new_title = data.get('title')
        new_desc = data.get('new_description')
        new_user = data.get('assigned_user')
        new_due_date = data.get('due_date')

        task.title = new_title
        task.description = new_desc
        task.assigned_user = new_user
        task.due_date = new_due_date
        task.save()
        serializer = TaskSerializer(task)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

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
        return Response({'detail': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    
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
    return JsonResponse({"tasks": tasks_data})

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