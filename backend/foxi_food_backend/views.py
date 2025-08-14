from django.shortcuts import redirect
from django.http import HttpResponse

def redirect_to_frontend(request):
    """
    Temporary redirect from Django to frontend
    This is a workaround for Digital Ocean routing issues
    """
    # For now, just return a simple HTML that redirects
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Redirecting...</title>
        <meta http-equiv="refresh" content="0; url=/index.html">
    </head>
    <body>
        <p>Redirecting to frontend...</p>
        <script>window.location.href = '/index.html';</script>
    </body>
    </html>
    """
    return HttpResponse(html)

def serve_frontend(request, path=''):
    """
    Serve the React frontend index.html for all non-API routes
    This should be handled by nginx but as a fallback we handle it here
    """
    # Return a message indicating frontend should be served by nginx
    return HttpResponse(
        "<h1>Frontend should be served by nginx</h1>"
        "<p>If you see this, nginx routing is not working correctly.</p>"
        "<p>Please check Digital Ocean App Platform configuration.</p>",
        status=503
    )
