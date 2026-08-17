import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()

# 📍 كود إنشاء أو تحديث صلاحيات الـ Superuser تلقائياً
try:
    from django.contrib.auth import get_user_model
    User = get_user_model()

    username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'khadidja')
    email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
    password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'smail1965')

    user, created = User.objects.get_or_create(
        username=username,
        defaults={'email': email, 'is_staff': True, 'is_superuser': True}
    )

    # ضبط كلمة المرور بشكل مشفر وتأكيد صلاحيات Admin
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()

    if created:
        print(f"==> Superuser '{username}' created successfully!")
    else:
        print(f"==> Superuser '{username}' password and permissions updated successfully!")

except Exception as e:
    print(f"==> Error setting up superuser: {e}")