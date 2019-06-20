
import os
import time
os.system('clear')
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
adc = ADCPi(0x68, 0x68, 18)
            
while True:

  # clear the console
  os.system('clear')


# read from adc channels and print to screen
  print("Channel 1:")
  print("")
  print("Wind speed in (m/s):")
  print(adc.read_voltage(3))

# wait 0.2 seconds before reading the pins again
  time.sleep(0.1)
