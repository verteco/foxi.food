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
    # Since Digital Ocean is not routing to frontend properly,
    # we'll serve a basic HTML that loads the React app
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Foxi.food - Loading...</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            text-align: center;
            color: white;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .info {
            background: rgba(255,255,255,0.2);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍔 Foxi.food</h1>
        <p>Welcome to Foxi.food - Food Ordering Platform</p>
        <div class="info">
            <p><strong>Frontend Status:</strong> React app should be served by nginx</p>
            <p><strong>API Status:</strong> Available at <a href="/api/" style="color: white;">/api/</a></p>
            <p>If you're seeing this page, the frontend nginx routing needs configuration in Digital Ocean.</p>
        </div>
    </div>
</body>
</html>"""
    return HttpResponse(html)
