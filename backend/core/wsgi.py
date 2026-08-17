import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()

# 📍 كود إنشاء الأدمن تلقائياً على Render
from django.contrib.auth import get_user_model
User = get_user_model()

try:
    username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'khadidja')
    email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
    password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'smail1965')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"==> Superuser '{username}' created successfully!")
except Exception as e:
    print(f"==> Error creating superuser: {e}")