from rest_framework import serializers

class TermSerializer(serializers.Serializer):
    term = serializers.CharField(max_length=256)
    definition = serializers.CharField(max_length=1256)
