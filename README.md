# kirov_blimp
This is an blimp project that integrates live video transmission, navigation and control into one raspberry pi model B+. Raspberry pis are widely used as control units for a variety of adhoc hobby projects and prove computationally sufficient for controlling air vehicles and lightweight enough as a substitute for normal arduino + mini cam recorders. In this tutorial I will explain the ways I have experimented and implemented different modules, so without further ado let's dive in!

Control:
the control setup is built on top of wifi connection between the raspberry pi and a smartphone or laptop. on the raspberry pi, a tornado server opens a websocket port and serves a webpage with control UI. On the client side, you could either open the webpage and use touch control, or connect via websocket using another applications. To start the server, run start.sh in the repo. I have created a myo script that uses gestures to control throttle and navigation pose. The python script only supports windows so far.

Streaming:
The control webpage already contains a mjpg video stream next to the control knobs and it works right out of the box. To start streaming via mjpg, run start.sh in the repo, and terminate using end.sh. the video quality for mpjg protocol is midrange and it has relatively low latency: ~300ms. Other methods include gstreamer (~100ms) or netcat + mplayer (~200ms). They require extra setup steps and needs some tweaking depending on which platform you are on.

