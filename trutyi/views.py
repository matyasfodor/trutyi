from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect
import urllib

# from django.views.generic import ListView
import json
import os
import requests
from rest_framework import viewsets
from trutyi.serializers import TermSerializer
import base64

class TermListView(viewsets.ViewSet):
    serializer_class = TermSerializer

    def create(self, request):
        request_data = json.loads(request.body.decode())
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

# Perhaps this could be realtive to base?
REDIRECT_URI = 'https://enigmatic-savannah-14867.herokuapp.com/auth-redirect/'

def auth(request):
    data = {
        'response_type': 'code',
        'client_id': os.environ['QUIZLET_CLIENT_ID'],
        'scope': 'read write_set write_group',
        # Not csrf safe
        'state': 'the',
        'redirect_uri': REDIRECT_URI,
    }
    url = 'https://quizlet.com/authorize?{}'.format(urllib.parse.urlencode(data))
    return redirect(url)

def auth_redirect(request):
    if 'state' not in request.GET or 'code' not in request.GET:
        HttpResponseBadRequest("Something went wrong. 'state' and 'code' should be included")
    client_id = os.environ['QUIZLET_CLIENT_ID']
    secret = os.environ['QUIZLET_SECRET_KEY']
    auth_token = base64.b64encode('{}:{}'.format(client_id, secret).encode()).decode()
    headers = {
        'Authorization': 'Basic {}'.format(auth_token),
    }
    data = {
        'grant_type': 'authorization_code',
        'code': request.GET['code'],
        'redirect_uri': REDIRECT_URI,
    }
    url = 'https://api.quizlet.com/oauth/token?{}'.format(urllib.parse.urlencode(data))
    resp = requests.post(url, headers=headers)
    resp.raise_for_status()
    return render(
        request,
        'auth_redirect.html',
        {'payload': resp.text}
    )
