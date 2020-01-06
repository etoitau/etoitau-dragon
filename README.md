# CS50W-Final Project
Web Programming with Python and JavaScript

## Dragon Curve Maker

### Short Writeup 
A tool for making fractal curves in the style of the Heighway dragon curve. A user can save patterns, look at the ones made by others, and upvote their favorites. This is implemented in Django and hosted on Heroku

### What's in each file
    .
    ├── dragon                  # this app
    │   ├── migrations          # django system files
    │   ├── static/dragon       # static files
    │   │   ├── drawscripts.js  # scripts to set up the pattern drawing page and input
    │   │   ├── favicon.ico     # bookmark icon
    │   │   ├── helpers.js      # javascript functions for doing operations on patterns
    │   │   ├── prism.js        # background image
    │   │   ├── styles.css      # css styles
    │   │   ├── svgthumb.js     # javascript for setting up thumbnails of patterns
    │   │   ├── viewer.js       # javascript for pattern viewer and explorer
    │   │   └── viewscripts.js  # javascript for setting up view page
    │   ├── templates/dragon    # html templates
    │   │   ├── draw.html       # draw page
    │   │   ├── index.html      # front page
    │   │   ├── layout.html     # other pages extend this. Navbar, etc
    │   │   ├── login.html      # login page
    │   │   ├── register.html   # registration page
    │   │   └── view.html       # page for viewing/exploring pattern
    │   ├── __init__.py         # for django
    │   ├── admin.py            # register models and customize view
    │   ├── apps.py             # default django
    │   ├── models.py           # ORM definitions 
    │   ├── tests.py            # default django
    │   ├── urls.py             # app url routing
    │   └── views.py            # route handling
    ├── etoitaudragon           # webapp
    │   ├── __init__.py         # for django
    │   ├── settings.py         # configuration
    │   ├── urls.py             # overall url routing
    │   └── wsgi.py             # webserver
    ├── .gitignore              # exclude files only applicable to my machine
    ├── Procfile                # for webserver
    ├── README.md               # this
    ├── favicon.ico             # bookmark icon
    ├── manage.py               # main application file
    └── requirements.txt        # necessary to install these to run app

### Other info
On the web:
https://dragoncurve.herokuapp.com

Github:
https://github.com/etoitau/etoitau-dragon

Youtube walkthrough:
https://youtu.be/WKoNRlTRVCQ

### License
Copyright 2019-2020 [Kyle Chatman](http://www.kchatman.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see https://www.gnu.org/licenses/