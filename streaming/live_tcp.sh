#raspivid -t 999999 -w 1280 -h 720 -fps 20 -o - | nc 192.168.0.102 5001 
target='Hal.local'
echo ''
while true; do 
    nc -v -z -w 3 $target 5001 2&> /dev/null 2&> /dev/null
    if [ $? = 0 ]; then
        echo 'Starting Capture'
        sleep 0.2
        raspivid -t 0 -w 1280 -h 720 -fps 20 -o - | nc $target  5001
    else
        echo -e "\e[1AWaiting for listener..."
    fi
    sleep 1
done
