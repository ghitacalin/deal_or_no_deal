from django.contrib import admin
from django.urls import path
from . import views
from .game_engine.select_briefcase import select_briefcase

urlpatterns = [
    path('', views.home_page, name='home'), 
    path('select-briefcase/', select_briefcase, name="select_briefcase"),

]