from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
import os

# Serve frontend HTML files from the project root directory
FRONTEND_DIR = settings.BASE_DIR

def serve_frontend(request, path='admindashboard.html'):
    """Serve static HTML files from the project root."""
    # Security: only allow known extensions
    safe_exts = ('.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf')
    if not any(path.endswith(ext) for ext in safe_exts):
        path = path + '.html'
    full_path = os.path.join(FRONTEND_DIR, path)
    if not os.path.exists(full_path):
        from django.http import Http404
        raise Http404(f"File not found: {path}")
    return serve(request, path, document_root=FRONTEND_DIR)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Serve root → redirect to signin
    path('', serve_frontend, {'path': 'signin.html'}),
    re_path(r'^(?P<path>.+)$', serve_frontend),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
