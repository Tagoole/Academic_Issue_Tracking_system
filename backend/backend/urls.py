from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

FRONTEND_EXCLUDES = "|".join([
    "api/",
    "admin/",
    "static/",
    "media/",
])

urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(f'^(?!{FRONTEND_EXCLUDES}).*$', TemplateView.as_view(template_name='index.html'), name='reactapp'),  # Catch-all for React routing
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

    