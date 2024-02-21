from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserAuthenticationSerializer, UserRegistrationSerializer, UserSerializer


# Create your views here.
class UserLoginView(APIView):
    serializer_class = UserAuthenticationSerializer
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(request=request, username=username, password=password)

            if user is not None:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                success_message = f"User {user.username} has successfully logged in."
                return Response({'message': success_message, 'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Incorrect username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'message': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)
        

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
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"message": "Welcome to your profile, {user.username}!"})  