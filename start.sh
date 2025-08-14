#!/bin/bash

# Start Django backend in background
cd /app/backend
gunicorn --bind 127.0.0.1:8000 --workers 3 foxi_food_backend.wsgi:application &

# Start nginx in foreground
nginx -g 'daemon off;'
