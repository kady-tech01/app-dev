from rest_framework import serializers
from .models import PriceAlert

class PriceAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceAlert
        fields = [
            'id', 
            'device_push_token', 
            'base_currency', 
            'target_currency', 
            'market_type', 
            'target_price', 
            'condition', 
            'is_active', 
            'created_at'
        ]