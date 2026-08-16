from django.db.models.signals import post_save
from django.dispatch import receiver
from currencies.models import ExchangeRate
from .tasks import check_and_trigger_alerts

@receiver(post_save, sender=ExchangeRate)
def trigger_alerts_on_rate_update(sender, instance, **kwargs):
    """عند تعديل أي سعر في الداتابيز يتم فحص التنبيهات فوراً"""
    check_and_trigger_alerts()