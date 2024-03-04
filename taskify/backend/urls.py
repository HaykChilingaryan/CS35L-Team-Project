from django.urls import path
from .views import  CompanyListView, UserRegistrationView, UserListView, UserLogoutView, UserView, create_company, get_all_tasks, get_company_by_id, get_tasks_for_company, get_user_by_id, get_user_tasks, get_users_by_company, update_task
from .views import user_login, check_authentication, get_user_from_session, create_task, update_task_status,delete_all_users,delete_all_tasks


urlpatterns = [
    path('auth/register', UserRegistrationView.as_view()),
    path('auth/login/', user_login, name='user_login'),
    path('auth/logout', UserLogoutView.as_view()),
    path('auth/session/user', get_user_from_session, name='get_user_from_session'),
    path('users/me/tasks/', create_task, name='create_task'),
    path('users/me/tasks/', get_user_tasks, name='get_user_tasks'),
    path('users/me/tasks/status/<uuid:task_id>', update_task_status, name='update_task_status'),
    path('users/me/tasks/<uuid:task_id>', update_task, name='update_task'),
    path('users/<uuid:user_id>/', get_user_by_id, name='get-user-by-id'),
    path('company/', create_company, name='create-company'),
    path('company/<uuid:company_id>/', get_company_by_id, name='get-company-by-id'),
    path('company/<uuid:company_id>/users/', get_users_by_company, name='get-users-by-company'),
    path('company/<uuid:company_id>/tasks/', get_tasks_for_company, name='get_tasks_for_company'),
    
    #Test purposes only
    path('users', UserListView.as_view()),    
    path('api/check-auth/', check_authentication, name='check_authentication'),    
    path('delete-all-users/', delete_all_users, name='delete_all_users'),
    path('delete-all-tasks/', delete_all_tasks, name='delete_all_tasks'),
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('tasks/', get_all_tasks, name='get-all-tasks'),
]
