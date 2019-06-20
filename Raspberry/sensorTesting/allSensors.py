import os
import time
os.system('clear')

#import pressure sensor
import time
import board
import busio
import adafruit_bmp3xx

#import ADC
try:
    from ADCPi import ADCPi
    
except ImportError:
    print("Failed to import ADCPi from python system path")
    print("Importing from parent folder instead")
    try:
        import sys
        sys.path.append('..')
        from ADCPi import ADCPi
    except ImportError:
        raise ImportError(
            "Failed to import library from parent folder")



#define SEALEVELPRESSURE_HPA (1013.25)

# ADC I2C setup
i2c = busio.I2C(board.SCL, board.SDA)
bmp = adafruit_bmp3xx.BMP3XX_I2C(i2c)
adc = ADCPi(0x68, 0x68, 18)

#bmp setup
bmp.pressure_oversampling = 8
bmp.temperature_oversampling = 2

adc.set_conversion_mode(1)
            
while True:

  # clear the console
  os.system('clear')
  print("Channel 1:")
  print("")
  print("")
  humidity = adc.read_voltage(1)
  time.sleep(1)
  temperature = adc.read_voltage(2)
  windspeed = 0#adc.read_voltage(3)
  
# read from adc channels and print to screen
  print("Humidity sensor values")
  print(humidity)
  
  
  print("Temperature  sensor") 
  print(temperature)
  
  print("Wind speed sensor values")
  print(windspeed)
  
  

# read pressure and temp from pressure sensor
  print("")
  print("Air Pressure sensor values:")
  print("Pressure: {:6.1f}".format(bmp.pressure))
  print("Temperature: {:5.2f}".format(bmp.temperature))

# loop delay
  time.sleep(0.4)
