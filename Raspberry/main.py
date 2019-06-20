#!/usr/bin/python3
import datetime
import threading
import time
import datetime
import os
import random
import json
import datetime
import math
import requests
import board
import busio
import adafruit_ads1x15.ads1015 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import adafruit_bmp3xx
#import parameters
from parameters import *
from multiprocessing import Process
#import classes
from classes import *
#set parameters
fileManager = FileManager(temporaryData,uploadData,uploadDataRealtime,stationId,serverKey,serverUrl,serverUrlRealtimeData)








def printValues():
    print("----------------------------------------------")
    print("Temperature: "+str(temperatureQueue.findAverage()))
    try:
        print("")
    except:
        print()    
    try:
        print("Humidity: "+str(humidityQueue.findAverage()))
    except:
        print()
    try:
        print("Windspeed: "+str(windSpeedQueue.findAverage()))
    except:
        print()    
    try:
        print("")
        print("WindDirection: "+str(ValueQueue.findAverageWinddirection(windSpeedQueue.valueArr,windDiretionQueue.valueArr)))
    except:
        print()    
    try:
        print("Pressure: "+str(pressureQueue.findAverage()))
    except:
        print()    
    return None

# --- Sensor object names ---
# --- sensorName.readValue() ---
#temperatureS
#humidityS
#windSpeedS
#WindDirectionS


#Main loop
# Finn starttid
startTime = time.time()

# Setup ADC unit
i2c = busio.I2C(board.SCL, board.SDA)

# Create the ADC object using the I2C bus
try:
    #-- ADC 1 --
    ads1 = ADS.ADS1015(i2c)
    # Windspeed:
    channel1 = AnalogIn(ads1, ADS.P3)
    # WindDirection
    channel2 = AnalogIn(ads1, ADS.P0)    
except Exception as e:
    ads1 = None


    
try:
    ads2 = ADS.ADS1015(i2c,1,None,ADS.Mode.SINGLE,0x4a)
    #-- ADC 2 --
    # Humidity
    channel3 = AnalogIn(ads2, ADS.P0)
    # Temperature
    channel4 = AnalogIn(ads2, ADS.P2)    
except Exception as e:
    ads2 = None


# Create differensial channels and pass this to the sensor classes




#Setup pressure sensor
try:
    bmp = adafruit_bmp3xx.BMP3XX_I2C(i2c)
    bmp.pressure_oversampling = 8
    bmp.temperature_oversampling = 2
except:
    bmp = None
    print("error connecting BMP sensor")


# Create sensor objects
try:
    windSpeedS = WindSpeedSensor(0,channel2)
except:
    windSpeedS = WindSpeedSensor(0,None)
try:
    windDirectionS = WindDirectionSensor(0,channel1)
except:
    windDirectionS = WindDirectionSensor(0,None)

try:
    temperatureS =  TemperatureSensor(0,channel4)
except:
    temperatureS =  TemperatureSensor(0,None)
try:
    humidityS = HumiditySensor(0,channel3)
except:
    humidityS = HumiditySensor(0,None)
    print()

try:
    pressureS = PressureSensor(0,bmp)
except:
    pressureS = PressureSensor(0,None)





# Create differential input between channel 0 and 1
#chan = AnalogIn(ads, ADS.P0, ADS.P1)

# Create queue objects
temperatureQueue = ValueQueue(10)
humidityQueue= ValueQueue(10)
windSpeedQueue= ValueQueue(10)
windDiretionQueue = ValueQueue(10)
pressureQueue = ValueQueue(10)



while True:
    time.sleep(60.0 - datetime.datetime.now().second)
    print("assumed time: " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    # Add values from sensors to queue
    if windSpeedS.ADCChannel == None or windDirectionS.ADCChannel == None or ads1 == None:
        try:
            #-- ADC 1 --
            ads1 = ADS.ADS1015(i2c)
            # Windspeed:
            channel1 = AnalogIn(ads1, ADS.P3)
            # WindDirection
            channel2 = AnalogIn(ads1, ADS.P0)    
        except Exception as e:
            ads1 = None
            print("Unable to reconnect to ADC1")
        if ads1 != None:
            try:
                windSpeedS = WindSpeedSensor(0,channel2)
                windDirectionS = WindDirectionSensor(0,channel1)
                print("Reconnected to ADC1")
            except:
                windDirectionS = WindDirectionSensor(0,None)
                windSpeedS = WindSpeedSensor(0,None)
    
    if temperatureS.ADCChannel == None or humidityS.ADCChannel == None or ads2 == None:
        try:
            ads2 = ADS.ADS1015(i2c,1,None,ADS.Mode.SINGLE,0x4a)
            #-- ADC 2 --
            # Humidity
            channel3 = AnalogIn(ads2, ADS.P0)
            # Temperature
            channel4 = AnalogIn(ads2, ADS.P2)    
        except Exception as e:
            print("Unable to reconnect to ADC2")
            ads2 = None
        if ads2 != None:
            try:
                temperatureS =  TemperatureSensor(0,channel4)
                humidityS = HumiditySensor(0,channel3)
                print("Reconnected to ADC2")

            except:
                humidityS = HumiditySensor(0,None)
                temperatureS =  TemperatureSensor(0,None)

    if bmp == None or pressureS.sensorChannel == None:
        try:
            print("test")
            bmp = adafruit_bmp3xx.BMP3XX_I2C(i2c)
            bmp.pressure_oversampling = 8
            bmp.temperature_oversampling = 2
            pressureS = PressureSensor(0,bmp)
        except:
            bmp = None
            print("Unable to reconnect to BMP sensor")

    temperatureQueue.addValue(temperatureS.readValue())
    humidityQueue.addValue(humidityS.readValue())
    windSpeedQueue.addValue(windSpeedS.readValue())
    windDiretionQueue.addValue(windDirectionS.readValue())
    pressureQueue.addValue(pressureS.readValue())
    # Find winddirection average
    averageWinddirection = ValueQueue.findAverageWinddirection(windSpeedQueue.valueArr,windDiretionQueue.valueArr)
    #printValues()
    # Store 10 min average values in temprary file
    print("    Running fileManager.storeReadingsTemprary")
    fileManager.storeReadingsTemprary(datetime.datetime.now(),{'temperature':temperatureQueue.findAverage(),'windspeed':windSpeedQueue.findAverage(),'windDirection':averageWinddirection,'pressure':pressureQueue.findAverage(),'humidity':humidityQueue.findAverage(),'time':format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))})
    
    print("    Running fileManager.moveFilesToUploadQueue")
    fileManager.moveFilesToUploadQueue()
    
    print("    Multiprocess for fileManager.uploadDataToServer")
    try:
        p2.terminate()
    except NameError:
        print("no process to terminate")
        
    p2 = Process(target = fileManager.uploadDataToServer)
    p2.start()
    #fileManager.uploadDataToServer()
    
    print("    Running fileManager.storeRealTimeReadings")
    fileManager.storeRealTimeReadings(datetime.datetime.now(),{'temperature':temperatureS.readValue(),'windSpeed':windSpeedS.readValue(),'windDirection':windDirectionS.readValue(),'pressure':pressureS.readValue(),'humidity':humidityS.readValue(),'mesure_time':format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:00"))})
    
    print("    Multiprocess for fileManager.uploadRealtimeDataToServer")
    try:
        p.terminate()
    except NameError:
        print("no process to terminate")
        
    p = Process(target = fileManager.uploadRealtimeDataToServer)
    p.start()
    #p.join() #Waits until the process is done

    
    #fileManager.uploadRealtimeDataToServer()
    
    
    
    
    
    print("_________________________________________")
    
    #time.sleep(10)

