#!/usr/bin/python3
import time
import board
import busio
import adafruit_bmp3xx

# I2C setup
i2c = busio.I2C(board.SCL, board.SDA)
bmp = adafruit_bmp3xx.BMP3XX_I2C(i2c)

# SPI setup
# from digitalio import DigitalInOut, Direction
# spi = busio.SPI(board.SCK, board.MOSI, board.MISO)
# cs = DigitalInOut(board.D5)
# bmp = adafruit_bmp3xx.BMP3XX_SPI(spi, cs)

bmp.pressure_oversampling = 8
bmp.temperature_oversampling = 2

while True:
    print("Pressure: {:6.1f}  Temperature: {:5.2f}".format(bmp.pressure, bmp.temperature))
    time.sleep(1)
