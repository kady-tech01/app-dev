from rest_framework import serializers
from .models import Currency, ExchangeRate

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name_en', 'name_ar', 'flag_emoji', 'is_popular']


class ExchangeRateSerializer(serializers.ModelSerializer):
    base_currency_code = serializers.ReadOnlyField(source='base_currency.code')
    target_currency_code = serializers.ReadOnlyField(source='target_currency.code')

    class Meta:
        model = ExchangeRate
        fields = [
            'id', 
            'base_currency_code', 
            'target_currency_code', 
            'rate_buy', 
            'rate_sell', 
            'market_type', 
            'updated_at'
        ]