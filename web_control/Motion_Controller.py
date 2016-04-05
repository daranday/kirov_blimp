#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM
import time
import math
from Tkinter import *


# ===========================================================================
# Example Code
# ===========================================================================

# Initialise the PWM device using the default address
pwm = PWM(0x40)
channels = [0, 1, 2]
motorChannels = [4, 5]
# Note if you'd like more debug output you can instead run:
#pwm = PWM(0x40, debug=True)

frequency = 50 # Hz
pwm.setPWMFreq(frequency)

servoMin = 0.6 # ms high time for 0 degrees
servoMax = 2.6 # ms high time for 180 degrees

motorMin = 1.0 # ms
motorMax = 2.0 # ms

def setServoAngle(angle):
  # print 'Changing servo angles'
  angle = float(angle)
  if angle < 0 or angle > 180:
    raise Exception("Angle out of bounds.")

  highTick = int((angle / 180.0 * (servoMax - servoMin) + servoMin) / (1.0 / frequency * 1000) * 4096)
  for channel in channels:
    # print highTick
    pwm.setPWM(channel, 0, highTick)

def setMotorThrottle(percentage):
  # print 'Changing motor throttles'
  percentage = float(percentage)
  highTick = int((percentage / 60.0 * (motorMax - motorMin) + motorMin) / (1.0 / frequency * 1000) * 4095)
  for channel in motorChannels:
    # print highTick
    pwm.setPWM(channel, 0, highTick)

def setRawMs(channel, ms):
  highTick = int(ms / (1.0 / frequency * 1000) * 4096)
  print highTick
  pwm.setPWM(channel, 0, highTick)


if __name__ == '__main__':

  master = Tk()
  w1 = Scale(master, from_=0, to=180, orient=HORIZONTAL, command=setServoAngle)
  w1.set(0)
  w1.pack()
  w2 = Scale(master, from_=0, to=100, orient=HORIZONTAL, command=setMotorThrottle)
  w2.set(0)
  w2.pack()

  mainloop()  