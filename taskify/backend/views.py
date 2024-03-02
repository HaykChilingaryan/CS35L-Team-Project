from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import TaskSerializer, UserRegistrationSerializer, UserSerializer
from rest_framework.decorators import permission_classes
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from rest_framework.decorators import api_view
from django.contrib.sessions.models import Session
from .models import Task
from django.shortcuts import get_object_or_404


import json
        

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

class UserLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        # Filter tasks based on the requesting user
        return Task.objects.filter(assigned_user=user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@permission_classes([IsAuthenticated])  
class UserView(APIView):
    def get(self, request):
        user_profile = User.objects.get(user=request.user)
        serializer = UserSerializer(user_profile)
        return Response(serializer.data)
    


@csrf_exempt  # To allow POST requests from different domains (CSRF exemption for simplicity, handle CSRF properly in production)
@require_POST
def user_login(request):
    # Parse JSON data from the request
    data = json.loads(request.body.decode('utf-8'))

    username = data.get('username', '')
    password = data.get('password', '')

    # Authenticate user
    user = authenticate(request, username=username, password=password)

    if user is not None:
        # Login successful
        login(request, user)
        session_id = request.session.session_key
        return JsonResponse({'message': 'Login successful ', "username": user.username, "session": session_id})
    else:
        # Login failed
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
    
def get_user_with_session_id(session_id):
    try:
        # Retrieve the session object from the database using the session ID
        session = Session.objects.get(session_key=session_id)

        # Access the user ID associated with the session
        user_id = session.get_decoded().get('_auth_user_id')

        # Retrieve the user object using the user ID
        user = User.objects.get(pk=user_id)

        return user
    except Session.DoesNotExist:
        return None
    except User.DoesNotExist:
        return None
    
@api_view(['GET'])
def get_user_from_session(request):
    permission_classes=[IsAuthenticated]
    try:
        # Retrieve the session ID from the request
        session_id = request.GET.get('session_id')

        if not session_id:
            return Response({'detail': 'Session ID is required'}, status=400)

        # Retrieve the user from the session ID
        user = get_user_with_session_id(session_id)
        
        if user:
            # Serialize the user data as needed
            username = user.username
            firstName = user.first_name
            lastName = user.last_name
            return Response({'username': username,'first_name': firstName, 'last_name': lastName, "id": user.id})
        else:
            return Response({'detail': 'User not found'}, status=404)
    except Exception as e:
        return Response({'detail': str(e)}, status=500)
    
@api_view(['POST'])
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
def get_user_tasks(request):
    session_id = request.GET.get('sessionId')
    if not session_id:
        return Response({'detail': 'Session ID is required'}, status=400)
    session = Session.objects.get(session_key=session_id)
    user_id = session.get_decoded().get('_auth_user_id')
    
    if not user_id:
        return Response({"detail": "userId parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    tasks = Task.objects.filter(assigned_user__id=user_id)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@csrf_exempt  # For simplicity. In a real application, use proper CSRF protection
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