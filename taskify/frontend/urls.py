from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('profile', index),
    path('tasklist', index),
    path('login', index),
    path('calendar', index)
]
