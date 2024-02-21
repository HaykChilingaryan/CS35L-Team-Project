from django.urls import path
from .views import UserLoginView, UserRegistrationView, UserListView, UserLogoutView, UserProfileView


urlpatterns = [
    path('auth/login', UserLoginView.as_view()),
    path('auth/register', UserRegistrationView.as_view()),
    path('users', UserListView.as_view()),
    path('auth/logout', UserLogoutView.as_view()),
    path('users/me/profile/', UserProfileView.as_view()),
]
