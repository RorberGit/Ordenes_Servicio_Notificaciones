from django.urls import path
from .views.roles import CreateRolView, GetAllRolView, GetOneRolView, UpdateRolView, DeleteRolView
from .views.users import CreateUserView, GetAllUserView, GetOneUserView, UpdateUserView, DeleteUserView

urlpatterns = [
    # Rutas para Rol
    path('roles/', GetAllRolView.as_view(),
         name='get_all_roles'),
    path('roles/create/',
         CreateRolView.as_view(), name='create_rol'),
    path('roles/<uuid:pk>/',
         GetOneRolView.as_view(), name='get_one_rol'),
    path('roles/<uuid:pk>/update/',
         UpdateRolView.as_view(), name='update_rol'),
    path('roles/<uuid:pk>/delete/',
         DeleteRolView.as_view(), name='delete_rol'),

    # Rutas para User
    path('users/', GetAllUserView.as_view(),
         name='get_all_users'),
    path('users/create/', CreateUserView.as_view(),
         name='create_user'),
    path('users/<uuid:pk>/',
         GetOneUserView.as_view(), name='get_one_user'),
    path('users/<uuid:pk>/update/',
         UpdateUserView.as_view(), name='update_user'),
    path('users/<uuid:pk>/delete/',
         DeleteUserView.as_view(), name='delete_user'),
]
