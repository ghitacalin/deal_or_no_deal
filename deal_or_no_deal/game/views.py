from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from game.game_engine.select_briefcase import game_progress
import random


# Create your views here.

def home_page(request):
    global game_progress

    game_progress['user_briefcase'] = None
    game_progress['opened_briefcases'] = []

    with connection.cursor() as cursor:
        sql = ("SELECT id, amount, unit_measure FROM briefcases_amount")
        cursor.execute(sql)
        results = cursor.fetchall()

    briefcases_data = [{'id':row[0], 'amount': row[1], 'unit_measure': row[2]} for row in results]
    random.shuffle(briefcases_data)

    briefcases = [{'id': briefcases_data[i]['id'], 'number': i + 1, 'amount': briefcases_data[i]['amount'], 'unit_measure': briefcases_data[i]['unit_measure']} for i in range(len(briefcases_data))]
    
    game_progress['game_briefcases'] = briefcases

    return render(request, 'game.html', {'briefcases': briefcases})