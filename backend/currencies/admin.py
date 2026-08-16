from django.contrib import admin
from .models import Currency, ExchangeRate

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name_en', 'name_ar', 'is_popular')
    search_fields = ('code', 'name_en', 'name_ar')

@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ('base_currency', 'target_currency', 'market_type', 'rate_buy', 'rate_sell', 'updated_at')
    list_filter = ('market_type',)