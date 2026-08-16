from django.db import models
from currencies.models import Currency, ExchangeRate

class PriceAlert(models.Model):
    CONDITION_CHOICES = (
        ('ABOVE', 'Greater than or equal (>=)'),
        ('BELOW', 'Less than or equal (<=)'),
    )

    device_push_token = models.CharField(max_length=255)  # Expo / Firebase Push Token
    base_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='alerts_base')
    target_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='alerts_target')
    market_type = models.CharField(max_length=20, choices=ExchangeRate.MARKET_CHOICES, default='parallel')
    
    target_price = models.DecimalField(max_digits=12, decimal_places=4)
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    
    is_active = models.BooleanField(default=True)
    triggered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alert: {self.base_currency.code}/{self.target_currency.code} {self.condition} {self.target_price}"