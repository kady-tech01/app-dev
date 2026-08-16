from django.urls import path
from .views import CurrencyListView, ExchangeRateListView

urlpatterns = [
    path('currencies/', CurrencyListView.as_view(), name='currency-list'),
    path('rates/', ExchangeRateListView.as_view(), name='rate-list'),
]