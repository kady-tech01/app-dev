import requests
from django.utils import timezone
from .models import PriceAlert
from currencies.models import ExchangeRate

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_expo_push_notification(token, title, body):
    """إرسال إشعار فوري إلى جهاز المستخدم عبر Expo API"""
    payload = {
        "to": token,
        "sound": "default",
        "title": title,
        "body": body,
        "priority": "high",
    }
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(EXPO_PUSH_URL, json=payload, headers=headers, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"Error sending push notification: {e}")
        return False


def check_and_trigger_alerts():
    """فحص جميع التنبيهات النشطة وإرسال إشعارات للمستخدمين المستحقين"""
    active_alerts = PriceAlert.objects.filter(is_active=True).select_related(
        'base_currency', 'target_currency'
    )

    for alert in active_alerts:
        # البحث عن أحدث سعر صرف مطابق للتنبيه
        rate = ExchangeRate.objects.filter(
            base_currency=alert.base_currency,
            target_currency=alert.target_currency,
            market_type=alert.market_type
        ).first()

        if not rate:
            continue

        # نستخدم سعر الشراء (Rate Buy) للتحقق من الشرط
        current_price = rate.rate_buy
        is_triggered = False

        if alert.condition == 'ABOVE' and current_price >= alert.target_price:
            is_triggered = True
        elif alert.condition == 'BELOW' and current_price <= alert.target_price:
            is_triggered = True

        if is_triggered:
            market_label = "الموازي (السكوار)" if alert.market_type == 'parallel' else "الرسمي"
            title = f"🚨 تنبيه السعر: {alert.base_currency.code}/{alert.target_currency.code}"
            body = (
                f"وصل سعر {alert.base_currency.code} إلى {current_price} DZD "
                f"في السوق {market_label}!"
            )

            # إرسال الإشعار للجهاز
            sent = send_expo_push_notification(alert.device_push_token, title, body)

            if sent:
                # تعطل التنبيه بعد إرساله حتى لا يزعج المستخدم بتكرار الإشعار
                alert.is_active = False
                alert.triggered_at = timezone.now()
                alert.save()