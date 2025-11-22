from django.urls import path
from .views.roles import CreateRolView, GetOneRolView, UpdateRolView, DeleteRolView, RolGetAllView
from .views.users.create import CreateUserView
from .views.users.delete import DeleteUserView
from .views.users.getall import GetAllUserView
from .views.users.getone import GetOneUserView
from .views.users.update import UpdateUserView
from .views.users.getall_paginated import UsuariosGetAllPaginatedView
from .views.users.ActivateUserView import ActivateUserView
from .views.users.PendingUsersView import PendingUsersView

urlpatterns = [
    # Rutas para Rol
    path('roles/getall/', RolGetAllView.as_view(),
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
    path('users/getone/',
         GetOneUserView.as_view(), name='get_one_user'),
    path('users/<int:pk>/update/',
         UpdateUserView.as_view(), name='update_user'),
    path('users/<uuid:pk>/delete/',
         DeleteUserView.as_view(), name='delete_user'),
    path('users/getall-paginated/',
         UsuariosGetAllPaginatedView.as_view(), name='Todos los usuarios con paginación'),

    path('users/activar/<str:username>/',
         ActivateUserView.as_view(), name='activar-usuario'),
    path('users/pendientes/', PendingUsersView.as_view(),
         name='usuarios-pendientes'),
]
