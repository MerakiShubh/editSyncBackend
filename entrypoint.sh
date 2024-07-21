#!/bin/sh

# Wait for the backend service to be available
while ! nc -z backend 3000; do
  echo "Waiting for the backend service..."
  sleep 2
done

# Start NGINX
nginx -g 'daemon off;'
