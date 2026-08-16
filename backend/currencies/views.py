from rest_framework import generics
from .models import Currency, ExchangeRate
from .serializers import CurrencySerializer, ExchangeRateSerializer

class CurrencyListView(generics.ListAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer


class ExchangeRateListView(generics.ListAPIView):
    queryset = ExchangeRate.objects.select_related('base_currency', 'target_currency').all()
    serializer_class = ExchangeRateSerializer