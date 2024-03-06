from django.urls import path
from .views import  CompanyListView, UserRegistrationView, UserListView, GetCSRFToken, create_company, get_all_tasks, get_company_by_id, get_csrf_token, get_tasks_for_company, get_user_by_id, get_users_by_company, update_task
from .views import user_login, check_authentication, create_get_task, update_task_status,delete_all_users,delete_all_tasks, logout_view, get_user, update_password


urlpatterns = [
    path('auth/register', UserRegistrationView.as_view()),
    path('auth/login/', user_login, name='user_login'),
    path('auth/logout/', logout_view, name='user_logout'),
    path('users/me/', get_user, name='get_user_from_session'),
    path('users/me/tasks/', create_get_task, name='create_get_task'),
    #path('users/me/tasks/', get_user_tasks, name='get_user_tasks'),
    path('users/me/tasks/status/<uuid:task_id>', update_task_status, name='update_task_status'),
    path('users/me/tasks/<uuid:task_id>', update_task, name='update_task'),
    path('users/<uuid:user_id>/', get_user_by_id, name='get-user-by-id'),
    path('company/', create_company, name='create-company'),
    path('company/<uuid:company_id>/', get_company_by_id, name='get-company-by-id'),
    path('company/<uuid:company_id>/users/', get_users_by_company, name='get-users-by-company'),
    path('company/<uuid:company_id>/tasks/', get_tasks_for_company, name='get_tasks_for_company'),
    path('csrf-token/', GetCSRFToken.as_view()),
    path('users/me/pass', update_password, name='update_password'),

    
    #Test purposes only
    path('users', UserListView.as_view()),    
    path('authenticated/', check_authentication, name='check_authentication'),    
    path('delete-all-users/', delete_all_users, name='delete_all_users'),
    path('delete-all-tasks/', delete_all_tasks, name='delete_all_tasks'),
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('tasks/', get_all_tasks, name='get-all-tasks'),
    path('token/', get_csrf_token, name='get_csrf_token')
]
