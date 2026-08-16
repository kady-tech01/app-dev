from django.urls import path
from .views import PriceAlertCreateView, PriceAlertDeleteView

urlpatterns = [
    path('alerts/', PriceAlertCreateView.as_view(), name='alert-create'),
    path('alerts/<int:id>/', PriceAlertDeleteView.as_view(), name='alert-delete'),
]