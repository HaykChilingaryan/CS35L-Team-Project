from django.urls import path
from .views import  UserRegistrationView, UserListView, UserLogoutView, UserView, get_user_tasks
from .views import user_login, check_authentication, get_user_from_session, create_task, update_task_status,delete_all_users,delete_all_tasks


urlpatterns = [
    path('auth/register', UserRegistrationView.as_view()),
    path('users', UserListView.as_view()),
    path('auth/logout', UserLogoutView.as_view()),
    path('users/me/', UserView.as_view()),
    path('api/login/', user_login, name='user_login'),
    path('api/check-auth/', check_authentication, name='check_authentication'),
    path('api/get-user', get_user_from_session, name='get_user_from_session'),
    path('api/tasks/', create_task, name='create_task'),
    path('users/me/tasks', get_user_tasks, name='get_user_tasks'),
    path('users/me/tasks/<uuid:task_id>', update_task_status, name='update_task_status'),
    path('delete-all-users/', delete_all_users, name='delete_all_users'),
    path('delete-all-tasks/', delete_all_tasks, name='delete_all_users')
]
