from django.contrib import admin
from .models import PriceAlert

@admin.register(PriceAlert)
class PriceAlertAdmin(admin.ModelAdmin):
    list_display = ('base_currency', 'target_currency', 'condition', 'target_price', 'is_active', 'created_at')
    list_filter = ('is_active', 'condition', 'market_type')