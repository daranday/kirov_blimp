#!/usr/bin/env python
import tornado.ioloop
import tornado.web
import tornado.websocket
from subprocess import call
import json
import Motion_Controller as rpi
import logging

logger = logging.getLogger('web_control')
logger.setLevel(logging.INFO)
logger.propagate = False
fh = logging.handlers.RotatingFileHandler('web_control.log', mode='a', maxBytes=5*1024*1024, 
                                 backupCount=2, encoding=None, delay=0)
formatter = logging.Formatter('%(asctime)s - %(message)s')
fh.setFormatter(formatter)
logger.addHandler(fh)

clients = []

class IndexHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(request):
		request.render("controller.html")

class WebSocketChatHandler(tornado.websocket.WebSocketHandler):
	def check_origin(self, origin):
		return True

	def open(self, *args):
		# print("open", "WebSocketChatHandler")
		logger.info("opened new WebSocketChatHandler")
		clients.append(self)

	def on_message(self, message):
		# print message
		for client in clients:
			client.write_message(message)
		message = json.loads(message)
		# print message
		logger.info("message: %s" % message)
		rpi.setServoAngle(90 + 90 * message['l']['x'])
		rpi.setMotorThrottle(50 * message['r'])
				
	def on_close(self):
		clients.remove(self)

handlers = [(r'/control_signal', WebSocketChatHandler), (r'/', IndexHandler),
			(r"/js/(.*)", \
				 tornado.web.StaticFileHandler, \
				 {"path":r"js/"}),
			(r"/css/(.*)", \
				 tornado.web.StaticFileHandler, \
				 {"path":r"css/"})
]
app = tornado.web.Application(handlers)

if __name__ == '__main__':
	rpi.setServoAngle(90)
	rpi.setMotorThrottle(0)

	try:
		host = '192.168.0.100'
		port = 8888
		print 'Web control at %s:%s' % (host, port)
		app.listen(port)
		tornado.ioloop.IOLoop.instance().start()
	except KeyboardInterrupt:
		rpi.setServoAngle(90)
		rpi.setMotorThrottle(0)
	finally:
		print "Gracefully shutting down from SIGINT (Ctrl-C)"
