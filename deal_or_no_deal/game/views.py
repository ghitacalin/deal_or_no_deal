from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def home_page(request):
    return HttpResponse("Deal or No Deal - Jocul este în construcție!")