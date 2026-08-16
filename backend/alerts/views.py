from rest_framework import generics
from .models import PriceAlert
from .serializers import PriceAlertSerializer

class PriceAlertCreateView(generics.CreateAPIView):
    queryset = PriceAlert.objects.all()
    serializer_class = PriceAlertSerializer


class PriceAlertDeleteView(generics.DestroyAPIView):
    queryset = PriceAlert.objects.all()
    serializer_class = PriceAlertSerializer
    lookup_field = 'id'