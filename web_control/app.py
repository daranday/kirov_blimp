import tornado.ioloop
import tornado.web
import tornado.websocket
from subprocess import call
import json
import Motion_Controller as rpi

clients = []

class IndexHandler(tornado.web.RequestHandler):
  @tornado.web.asynchronous
  def get(request):
    request.render("controller.html")

class WebSocketChatHandler(tornado.websocket.WebSocketHandler):
  def check_origin(self, origin):
        return True

  def open(self, *args):
    print("open", "WebSocketChatHandler")
    clients.append(self)

  def on_message(self, message):        
    # print message
    for client in clients:
        client.write_message(message)
    message = json.loads(message)
    # print message
    rpi.setServoAngle(90 + 90 * message['left']['horizontal'])
    rpi.setMotorThrottle(50 * message['right'])
        
  def on_close(self):
    clients.remove(self)

handlers = [(r'/control_signal', WebSocketChatHandler), (r'/', IndexHandler),
            (r"/js/(.*)", \
               tornado.web.StaticFileHandler, \
               {"path":r"js/"})
]
app = tornado.web.Application(handlers)

if __name__ == '__main__':
    # call("ip addr show wlan0 | grep 'inet '", shell=True)
    rpi.setServoAngle(90)
    rpi.setMotorThrottle(0)

    try:
        app.listen(8888)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        rpi.setServoAngle(90)
        rpi.setMotorThrottle(0)
    finally:
        print "Gracefully shutting down from SIGINT (Ctrl-C)"
        exit(0)