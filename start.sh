#!/bin/bash
echo "🚀 Starting QuizQuest..."
echo "Open: http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""

# Start queue worker in background
php artisan queue:work --quiet &
QUEUE_PID=$!

# Trap to kill queue worker on exit
trap "kill $QUEUE_PID 2>/dev/null" EXIT

# Start server
php artisan serve
