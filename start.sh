cd web_control && ./app.py &
sleep 1
cd streaming && ./live_http.sh &
