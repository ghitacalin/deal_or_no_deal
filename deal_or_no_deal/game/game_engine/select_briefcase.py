from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def select_briefcase(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            briefcase_number = data.get('briefcase')
            print(briefcase_number)

            return JsonResponse({'message': f'Cutia {briefcase_number} a fost procesata cu success'})
        except Exception as e:
            return JsonResponse({'error': "A aparut o eroare la procesarea cererii." , 'details': str(e)}, status=400)
    else:
        return JsonResponse({'error': "Metoda acceptata este POST."}, status=405)