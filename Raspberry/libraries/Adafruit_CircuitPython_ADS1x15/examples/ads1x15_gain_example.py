import time
import board
import busio
#import adafruit_ads1x15.ads1015 as ADS
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# Create the I2C bus
i2c = busio.I2C(board.SCL, board.SDA)

# Create the ADS object
#ads = ADS.ADS1015(i2c)
ads = ADS.ADS1115(i2c)

# Create a sinlge ended channel on Pin 0
#   Max counts for ADS1015 = 2047
#                  ADS1115 = 32767
chan0 = AnalogIn(ads, ADS.P0)
chan1 = AnalogIn(ads, ADS.P1)
chan2 = AnalogIn(ads, ADS.P2)
chan3 = AnalogIn(ads, ADS.P3)
# The ADS1015 and ADS1115 both have the same gain options.
#
#       GAIN    RANGE (V)
#       ----    ---------
#        2/3    +/- 6.144
#          1    +/- 4.096
#          2    +/- 2.048
#          4    +/- 1.024
#          8    +/- 0.512
#         16    +/- 0.256
#
gains = (2/3, 1, 2, 4, 8, 16)

while True:
    ads.gain = gains[0]
    print('0: {:5} {:5.3f}'.format(chan0.value, chan0.voltage), end='')
    print('1: {:5} {:5.3f}'.format(chan1.value, chan1.voltage), end='')
    print('2: {:5} {:5.3f}'.format(chan2.value, chan2.voltage), end='')
    print('3: {:5} {:5.3f}'.format(chan3.value, chan3.voltage), end='')
    print()
    time.sleep(2)
