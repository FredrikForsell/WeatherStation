
import time
import board
import busio
import adafruit_ads1x15.ads1015 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# Create the I2C bus
i2c = busio.I2C(board.SCL, board.SDA)

# Create the ADC object using the I2C bus
ads = ADS.ADS1015(i2c)
ads2 = ADS.ADS1015(i2c,1,None,ADS.Mode.SINGLE,0x4a)
# Create single-ended input on channel 0
#chan0 = AnalogIn(ads, ADS.P0)



# Create differential input between channel 0 and 1
chan0 = AnalogIn(ads,ADS.P0)
chan1 = AnalogIn(ads,ADS.P3)

chan3 = AnalogIn(ads2,ADS.P0)
chan4 = AnalogIn(ads2,ADS.P2)
#chan1 = AnalogIn(ads, ADS.P2, ADS.P3)


while True:
    print("0: {:>5} V {:>5.3f}".format(chan0.value, chan0.voltage))
    time.sleep(0)
    print("3: {:>5} V {:>5.3f}".format(chan1.value, chan1.voltage))
    print("ADS 2 : 0: {:>5} V {:>5.3f}".format(chan3.value, chan3.voltage))
    print("ADS 2 : 2: {:>5} V {:>5.3f}".format(chan4.value, chan4.voltage))
    time.sleep(0)
    print("________________________")

    time.sleep(2)
