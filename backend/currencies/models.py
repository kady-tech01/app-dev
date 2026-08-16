from django.db import models

class Currency(models.Model):
    code = models.CharField(max_length=10, unique=True)  # EUR, USD, CAD...
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)
    flag_emoji = models.CharField(max_length=10, blank=True, null=True)
    is_popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name_en}"


class ExchangeRate(models.Model):
    MARKET_CHOICES = (
        ('official', 'Official Rate'),
        ('parallel', 'Parallel / Square Rate'),
    )

    base_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='base_rates')
    target_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='target_rates')
    rate_buy = models.DecimalField(max_digits=12, decimal_places=4)   # سعر الشراء
    rate_sell = models.DecimalField(max_digits=12, decimal_places=4)  # سعر البيع
    market_type = models.CharField(max_length=20, choices=MARKET_CHOICES, default='official')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('base_currency', 'target_currency', 'market_type')

    def __str__(self):
        return f"{self.base_currency.code} -> {self.target_currency.code} ({self.market_type}): Buy {self.rate_buy} / Sell {self.rate_sell}"