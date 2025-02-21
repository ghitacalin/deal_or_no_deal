from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json

game_progress = {
    'user_briefcase': None,
    "opened_briefcases": [],
    'game_briefcases': [],
    'rounds': {
        1: 6,
        2: 4,
        3: 3,
        4: 3,
        5: 3,
        6: 2,
        7: 1,
        8: None
    },
    'current_round': None,
    'opened_count': 0
}


@csrf_exempt
def select_briefcase(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            briefcase_id = data.get('briefcase_id')
            briefcase_number = data.get('briefcase_number')

            if game_progress['user_briefcase'] is None:
                game_progress['user_briefcase'] = {
                    'id': briefcase_id,
                    'number': briefcase_number
                }
                game_progress['current_round'] = 1
                return JsonResponse({
                    'message': f'Ai selectat cutia {briefcase_number} ca fiind a ta',
                    "current_round": game_progress['current_round'],
                    'boxes_to_open': game_progress['rounds'][1]
                })
            
            if briefcase_id in game_progress['opened_briefcases']:
                return JsonResponse({"error": "Aceasta cutie a fost deja deschisa."}, status=400)
            
            if game_progress['user_briefcase']['id'] != briefcase_id:
                try:
                    with connection.cursor() as cursor:
                        cursor.execute("SELECT amount, unit_measure FROM briefcases_amount WHERE id=%s", [briefcase_id])
                        result = cursor.fetchone()
                    
                    if result:
                        amount, unit_measure = result
                        game_progress['opened_briefcases'].append({
                            "id": briefcase_id,
                            "number": briefcase_number,
                            "amount": amount,
                            "unit_measure": unit_measure
                        })

                        game_progress['opened_count'] +=1
                        
                        for i, briefcase in enumerate(game_progress['game_briefcases']):
                            if briefcase['id'] == briefcase_id:
                                game_progress['game_briefcases'].pop(i)
                                break

                        response_data = {
                            'message': f"Ai deschis cutia {briefcase_number}",
                            'amount': amount,
                            'unit_measure': unit_measure,
                            'remaining_briefcases': game_progress['game_briefcases'],
                            'current_round': game_progress['current_round'],
                            'opened_count': game_progress['opened_count'],
                            'boxes_to_open': game_progress['rounds'][game_progress['current_round']]
                        }

                        if game_progress['opened_count'] >= game_progress['rounds'][game_progress['current_round']]:
                            game_progress['current_round'] +=1
                            game_progress['opened_count'] = 0

                            offer_value = 1000

                            response_data['message'] = f"Oferta Băncii: {offer_value} RON"
                            response_data['bank_offer'] = offer_value

                            return JsonResponse(response_data)

                        return JsonResponse(response_data)
                    else:
                        return JsonResponse({"error": "ID-ul cutiei nu există în baza de date!"}, status=400)

                except Exception as e:
                    return JsonResponse({"error": "Eroare la interogarea bazei de date.", "details": str(e)}, status=500)
                    

        except Exception as e:
            return JsonResponse({'error': "A aparut o eroare la procesarea cererii." , 'details': str(e)}, status=400)
    else:
        return JsonResponse({'error': "Metoda acceptata este POST."}, status=405)