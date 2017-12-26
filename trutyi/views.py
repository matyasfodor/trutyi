from django.http import HttpResponse

from django.views.generic import ListView

class TermListView(ListView):

    def get(self, *args, **kwargs):
        return HttpResponse('Hello word')