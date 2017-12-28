from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render

# from django.views.generic import ListView
import json
import os
import requests
from rest_framework import viewsets
from trutyi.serializers import TermSerializer

class TermListView(viewsets.ViewSet):
    serializer_class = TermSerializer

    def create(self, request):
        request_data = json.loads(request.body.decode('ascii'))
        serializer = TermSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        token = os.environ['QUIZLET_HARDCODED_TOKEN']
        set_id = os.environ['QUIZLET_HARDCODED_SET_ID']
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        url = f'https://api.quizlet.com/2.0/sets/{set_id}/terms'
        resp = requests.post(url, headers=headers, data=serializer.data)
        try:
            resp.raise_for_status()
        except Exception as ex:
            return HttpResponseBadRequest(str(ex))
        return HttpResponse()

def auth_redirect(request):
    if 'state' not in request.GET or 'code' not in request.GET:
        HttpResponseBadRequest("Something went wrong. 'state' and 'code' should be included")
    return render(
        request,
        'auth_redirect.html',
        {'payload': json.dumps({
            'state': request.GET['state'],
            'code': request.GET['code'],
        })}
    )
