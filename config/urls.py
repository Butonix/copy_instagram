from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
from django.views import defaults as default_views
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
  
    # Django Admin, use {% url 'admin:index' %}
    url(settings.ADMIN_URL, admin.site.urls),

    # User management
    url(r'^users/', include('nomadgram.users.urls', namespace='users')),
    url(r'^accounts/', include('allauth.urls')),
    
    # Your stuff: custom urls includes go here
    url(r'^images/', include('images.urls', namespace='images')),
    url(r'^notifications/', include('nomadgram.notification.urls', namespace='notifications')),

    # url(r'^api-token-auth/', obtain_jwt_token),  # Added by jaeeonjin for jwt
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls'))

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # 요건 media 관련 요청

# 어드민에서 오른쪽 사이드바 
if settings.DEBUG:
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            url(r'^__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
