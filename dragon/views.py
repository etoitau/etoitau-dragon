"""Routing for dragon"""

import logging
import json

from django.shortcuts import render

from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.models import User
from dragon.models import *
from django.conf import settings

if settings.DEBUG:
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.INFO)


def draw(request):
    """associated with the draw page"""
    logging.info('draw called')
    if request.user.is_authenticated:
        logging.info('is authenticated')
        context = {
            "user": request.user
        }
    else:
        logging.info('is not authenticated')
        context = {
            "user": None
        }
    return render(request, "dragon/draw.html", context)

def index(request):
    """associated with the index page"""
    logging.info('index called')
    if request.user.is_authenticated:
        logging.info('is authenticated')
        context = {
            "user": request.user
        }
    else:
        logging.info('is not authenticated')
        context = {
            "user": None
        }
    return render(request, "dragon/index.html", context)

def login_view(request):
    """associated with the login page"""
    if request.method == 'POST':
        logging.info('login called post')
        try:
            username = request.POST["username"]
        except KeyError:
            return render(request, "dragon/login.html", {"message": "Missing username"})
        else:
            try:
                password = request.POST["password"]
            except KeyError:
                return render(request, "dragon/login.html", {"message": "Missing password"})
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "dragon/login.html", {"message": "Invalid credentials"})
    else:
        logging.info('login called get')
        return render(request, "dragon/login.html", {"message": None})

def logout_view(request):
    """log a user out"""
    logging.info('logout called')
    logout(request)
    return render(request, "dragon/login.html", {"message": "Logged out"})


def register_view(request):
    """associated with the register page"""
    if request.method == 'POST':
        # check they provided all info and collect it
        user_info = dict()
        for key in ['username', "email", "pass1", "pass2"]:
            if not request.POST[key]:
                return render(request, "dragon/register.html", {"message": f"Missing {key}"})
            else:
                user_info[key] = request.POST[key]
        # check passwords match
        if user_info["pass1"] != user_info["pass2"]:
            return render(request, "dragon/register.html", {"message": "Passwords don't match"})
        # create the new user
        try:
            new_user = User.objects.create_user(
                username=user_info["username"],
                password=user_info["pass1"],
                email=user_info["email"],
                is_staff=False
            )
            new_user.save()
        except:
            return HttpResponseServerError("There was a problem creating the new user")
        # log user in and redirect to index
        user = authenticate(request, username=user_info["username"], password=user_info["pass1"])
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    # if coming via GET, serve registration form
    else:
        return render(request, "dragon/register.html")
