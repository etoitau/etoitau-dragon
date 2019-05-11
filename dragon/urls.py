"""dragon urls"""

from django.urls import path
from dragon import views


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register_view, name="register"),
    path("draw", views.draw, name="draw"),
    path("save", views.save, name="save"),
    path("view", views.view, name="view"),
    path("vote", views.vote, name="vote"),
    path("delete", views.delete, name="delete"),
]