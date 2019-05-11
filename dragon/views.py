"""Routing for dragon"""

import logging
import json

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, HttpResponseBadRequest
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.models import User
from dragon.models import Pattern, Vote
from django.conf import settings
from django.db.models import Q

if settings.DEBUG:
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.INFO)


def delete(request):
    """incoming request to delete pattern from ajax"""
    logging.info('delete called')
    patternid = int(request.body.decode('utf-8'))
    try:
        this_pattern = Pattern.objects.get(id=patternid).delete()
        return HttpResponse("deleted", content_type="application/json")
    except:
        return HttpResponse("error", content_type="application/json")


def draw(request):
    """associated with the draw page"""
    logging.info('draw called')
    # if logged in, provide info about user and patterns user has saved
    if request.user.is_authenticated:
        logging.info('is authenticated')
        context = {
            "user": request.user,
            "user_patterns": Pattern.objects.filter(creator=request.user),
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
    # if searched for a user, get all patterns by user - exact match
    if request.GET.get("username"):
        logging.info('searched for user %s', request.GET.get("username"))
        qs = Pattern.objects.filter(
            creator__username=request.GET.get("username"))
    # if searched with a search term, get patterns with 'like' match on username or pattern name
    elif request.GET.get("search_term"):
        logging.info('searched for %s', request.GET.get("search_term"))
        search_term = request.GET.get("search_term")
        qs = Pattern.objects.filter(
            Q(name__contains=search_term) | Q(
                creator__username__contains=search_term)
        )[:10]
    else:
        qs = Pattern.objects.order_by("-score")[:10]
    context["top_patterns"] = qs
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
        user = authenticate(
            request, username=user_info["username"], password=user_info["pass1"])
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    # if coming via GET, serve registration form
    else:
        return render(request, "dragon/register.html")


def save(request):
    """when user submits a pattern"""
    p_name = request.POST["pattern_name"]
    p_data = request.POST["pattern_data"]
    created = False
    i = 0
    while not created:
        # if name they gave is already used by this user, add a number
        if not i:
            add = ""
        else:
            add = str(i)
        new_pattern, created = Pattern.objects.get_or_create(
            creator_id=request.user.id,
            name=p_name + add,
            defaults={"data": p_data}
        )
        if not created:
            i += 1
    return HttpResponseRedirect(reverse("index"))


def view(request):
    """get request to view a pattern"""
    # get current user
    this_user = User.objects.get(id=request.user.id)
    # creator specified in GET request
    creator = request.GET.get("username")
    # look up in DB
    try:
        pattern_creator = User.objects.get(username=creator)
    except User.DoesNotExist:
        return HttpResponseBadRequest(content="Missing or incorrect username")
    # pattern name specified in GET request
    pattern_name = request.GET.get("pattern_name")
    # look up pattern in DB
    try:
        this_pattern = Pattern.objects.get(
            creator=pattern_creator, name=pattern_name)
    except Pattern.DoesNotExist:
        return HttpResponseBadRequest(content="Missing or incorrect pattern name")
    # check for past vote
    context = {
        "pattern": this_pattern,
        "voted": Vote.objects.filter(voter=this_user, voted_for=this_pattern),
    }
    return render(request, "dragon/view.html", context)


def vote(request):
    """incoming vote from ajax"""
    logging.info('vote called')
    data = json.loads(request.body.decode('utf-8'))
    this_vote, created = Vote.objects.get_or_create(
        voter_id=data["voterid"], voted_for_id=data["patternid"])
    this_pattern = Pattern.objects.get(id=data["patternid"])
    this_pattern.score += 1
    this_pattern.save()
    if created:
        return HttpResponse("Vote cast", content_type="application/json")
    else:
        return HttpResponse("Already voted", content_type="application/json")
