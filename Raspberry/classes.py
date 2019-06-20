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



class FileManager():
  
    
    def __init__(self,temporaryData, uploadData,uploadDataRealtime,stationId,serverKey,serverUrl,serverUrlRealtimeData):
        self.temporaryData = temporaryData
        self.uploadData = uploadData
        self.uploadDataRealtime = uploadDataRealtime
        self.stationId = stationId
        self.serverKey = serverKey
        self.serverUrl = serverUrl
        self.serverUrlRealtimeData = serverUrlRealtimeData
        
        
        
        
    def storeReadingsTemprary(self,dateTime,readings):
        #Readings should be object {temperature:22,windspeed:10,windDirection:122,pressure:1022,humidity:33,time:'2019-01-22 22:30'}
        
        
        fileName = dateTime.strftime("%Y-%m-%d&%H")+".json"
        
        
        # Check if json file exists for current hour
        exists = os.path.isfile(self.temporaryData+fileName)
        
        #File name with path used for writing to file
        jsonFile = self.temporaryData+fileName
        if exists:
            # Try to load json file. If unable to open delete file
            try:
                with open(jsonFile, 'r') as f:
                    print("Added minute values to EXISTING file for this hour: "+fileName)
                    data = json.load(f)
                    data.append(readings)
                with open(jsonFile, 'w') as f:  
                    json.dump(data,f)
            except:
                os.remove(jsonFile)
        else:
            # try to create json file for this hour. If unable dont do anything
            try:
                with open(jsonFile, 'w') as f:
                    print("Adding minute values to NEW file for this hour: "+fileName)
                    data = []
                    data.append(readings)
                    json.dump(data,f)
            except:
                return
            print("Successfully added minute values to new file.. Return line 68"+fileName)
            return
        
    def moveFilesToUploadQueue(self):
        #look for files to move that are old and calculate their values
        currentTime = datetime.datetime.now()
        for filename in os.listdir(self.temporaryData):
            if filename.endswith(".json"):
                timeString = filename.split(".")
                fileDate = datetime.datetime.strptime(timeString[0], '%Y-%m-%d&%H')
                if currentTime.hour != fileDate.hour or currentTime.day != fileDate.day:
                    print("Prosesserer fil og flytter til upload queue: "+filename)
                    self.calculateValues(self.temporaryData+filename,'test',timeString[0])
        return 0
    def storeRealTimeReadings(self,dateTime,readings):
        #Readings should be object {temperature:22,windSpeed:10,windDirection:122,pressure:1022,humidity:33,time:'2019-01-22 22:30'}
        
        #dateTime.strftime("%Y-%m-%d&%H")
        fileName = "tempReadings.json"
        
        
        # Check if json file exists for current hour
        exists = os.path.isfile(self.uploadDataRealtime+fileName)
        
        #File name with path used for writing to file
        jsonFile = self.uploadDataRealtime+fileName
        if exists:
            # Try to load json file. If unable to open delete file
            try:
                data =""
                with open(jsonFile, 'r') as f:
                    print("Adding realtimevalues to file "+fileName)
                    data = json.load(f)
                    data.append(readings)
                with open(jsonFile, 'w') as f:  
                    json.dump(data,f)
            except:
                os.remove(jsonFile)
        else:
            # try to create json file for this hour. If unable dont do anything
            try:
                with open(jsonFile, 'w') as f:
                    print("Added minute values to NEW file for this hour: "+fileName)
                    data = []
                    data.append(readings)
                    json.dump(data,f)
            except:
                return
            return
    def calculateValues(self,jsonFile,mesureTime,timeString):
        uploadObject = {'averageTemperature':0,'maxTemperature':-1000,'minTemperature':2000,'minTemperatureTime':0,'maxTemperatureTime':0,
                        'averageWindspeed':0,'maxWindspeed':-1000,'minWindspeed':2000,'minWindspeedTime':0,'maxWindspeedTime':0,
                        'averageHumidity':0,'maxHumidity':-1000,'minHumidity':2000,'minHumidityTime':0,'maxHumidityTime':0,
                        'averagePressure':0,'maxPressure':-1000,'minPressure':2000,'minPressureTime':0,'maxPressureTime':0,
                        'averageTemperature':0,'maxTemperature':-1000,'minTemperature':2000,'minTemperatureTime':0,'maxTemperatureTime':0,
                        'averageWindDirection':None,
                        'mesureHour':'','stationId':self.stationId,'serverKey':self.serverKey
                        }
        data = []
        with open(jsonFile, 'r') as f:
                    print("Appended to file:"+jsonFile)
                    data = json.load(f)
        vindVectors = []
        temperatures = []
        windspeeds = []
        humidities = []
        pressures = []
        
        for observation in data:
            
            # Observations should not be considered are None (null).
            if observation['windspeed']  is not None:
                # Append windspeeds for average
                windspeeds.append(observation['windspeed'])
                #Find min/max windspeed
                if observation['windspeed'] > uploadObject['maxWindspeed']:
                    uploadObject['maxWindspeed'] = observation['windspeed']
                    uploadObject['maxWindspeedTime'] = observation['time']
                    
                if observation['windspeed'] < uploadObject['minWindspeed']:
                    uploadObject['minWindspeed'] = observation['windspeed']
                    uploadObject['minWindspeedTime'] = observation['time']
            
            if observation['temperature'] is not None:
                # Append temperatures for average
                temperatures.append(observation['temperature'])
                #Find min/max temperature
                if observation['temperature'] > uploadObject['maxTemperature']:
                    uploadObject['maxTemperature'] = observation['temperature']
                    uploadObject['maxTemperatureTime'] = observation['time']
                    
                if observation['temperature'] < uploadObject['minTemperature']:
                    uploadObject['minTemperature'] = observation['temperature']
                    uploadObject['minTemperatureTime'] = observation['time']
           
            if observation['humidity'] is not None:
                # Append temperatures for average
                humidities.append(observation['humidity'])
                 #Find min/max humidity
                if observation['humidity'] > uploadObject['maxHumidity']:
                    uploadObject['maxHumidity'] = observation['humidity']
                    uploadObject['maxHumidityTime'] = observation['time']
                    
                if observation['humidity'] < uploadObject['minHumidity']:
                    uploadObject['minHumidity'] = observation['humidity']
                    uploadObject['minHumidityTime']  = observation['time']
            
            if observation['pressure'] is not None:
                # Append pressures for average
                pressures.append(observation['pressure'])
                #Find min/max pressure
                if observation['pressure'] > uploadObject['maxPressure']:
                    uploadObject['maxPressure'] = observation['pressure']
                    uploadObject['maxPressureTime'] = observation['time']
                if observation['pressure'] < uploadObject['minPressure']:
                    uploadObject['minPressure'] = observation['pressure']
                    uploadObject['minPressureTime'] = observation['time']
            # Calculate wind direction vectors. These will be averaged later
            if observation['windspeed'] is not None or observation['windDirection'] is not None:
                # calculate wind vectors
                vindVector = {'v':0,'u':0}
                vindVector['u'] = -observation['windspeed']*math.sin(2*math.pi*observation['windDirection']/360)
                vindVector['v'] = -observation['windspeed']*math.cos(2*math.pi*observation['windDirection']/360)
                vindVectors.append(vindVector)
        
        # Find averages and check for empety arrays (no observations)
        if len(windspeeds) != 0:
            uploadObject['averageWindspeed'] = sum(windspeeds)/len(windspeeds)
        
        if len(temperatures) != 0:
            uploadObject['averageTemperature'] = sum(temperatures)/len(temperatures)
        
        if len(humidities) != 0:
            uploadObject['averageHumidity'] = sum(humidities)/len(humidities)
         
        if len(temperatures) != 0:
            uploadObject['averagePressure'] = sum(pressures)/len(pressures)
        
        if len(temperatures) != 0:
            uploadObject['averageTemperature'] = sum(temperatures)/len(temperatures)
            
        #Process the vind vectors to find the average vind direction
        
        if len(vindVectors) != 0:
            uSum = 0;
            vSum = 0
            
            for vectorObject in vindVectors:
                uSum += vectorObject['u']
                vSum += vectorObject['v']
            uAvg = uSum/len(vindVectors)
            vAvg = vSum/len(vindVectors)
            uploadObject['averageWindDirection'] = (math.atan2(uAvg,vAvg)*360/2/math.pi)+180
        
        uploadPath = datetime.datetime.strptime(timeString, '%Y-%m-%d&%H')
        uploadObject['measureHour'] = uploadPath.strftime('%Y-%m-%d %H:%M:%S')
        # Try to create new file in uploadqueue, if not successful try again later 
        try:
            with open(self.uploadData+timeString+'.json', 'w') as outfile:
                json.dump(uploadObject, outfile)
                os.remove(jsonFile)
        except:
            return
            
        
        return
    def uploadDataToServer(self):
        for filename in os.listdir(self.uploadData):
            if filename.endswith(".json"):
                with open(self.uploadData+filename, 'r') as f:
                    data = json.load(f)
                    
                    # Try to upload data to server. If not successful stop the process
                    try:
                        request = requests.Session()
                        request.verify = False
                        response = request.post(self.serverUrl, data=json.dumps(data))
                        print("Try done")
                    except:
                        print("Failed to contact server. Will try again later.")
                        return
                    #data was successfully sent
                    status = response.text
                    print("Hour values upload: Server responded with the following status: "+status)
                    # Responses from server: 0 success (all data uploaded), 1 failed to authenticate to server, 2 stationId not correct, 3 Data uploaded but some values were not saved
                    if(response.status_code == 200):
                        if status == "0" or status == "3":
                            os.remove(self.uploadData+filename)
                            
                            print("Uploaded hour values to server and deleted: "+filename)
                            return
                            
                            
    def uploadRealtimeDataToServer(self):
        for filename in os.listdir(self.uploadDataRealtime):
            if filename.endswith(".json"):
                with open(self.uploadDataRealtime+filename, 'r') as f:
                    data = json.load(f)
                    packet = {'serverKey':self.serverKey,'values':data,'stationId':self.stationId}
                    
                    # Try to upload data to server. If not successful stop the process
                    try:
                        request = requests.Session()
                        request.verify = False
                        response = request.post(self.serverUrlRealtimeData, data=json.dumps(packet))
                    except:
                       print("Failed to contact server for REALTIME VALUES. Will try again later.")
                       return
                    #data was successfully sent
                    status = response.text
                    print("Minute values upload: Server responded with the following status: "+status)
                    # Responses from server: 0 success (all data uploaded), 1 failed to authenticate to server, 2 stationId not correct, 3 Data uploaded but some values were not saved
                    if(response.status_code == 200):
                        if status == "0" or status == "3":
                            os.remove(self.uploadDataRealtime+filename)
                            
                            print("Uploaded real time data "+filename)
                            return





class TemperatureSensor():
    #Kobles på A2
    temperatureOffset = 0
    ADCChannel = None
    def __init__(self,temperatureOffset, ADCChannel):
        self.temperatureOffset = temperatureOffset
        self.ADCChannel = ADCChannel
        
    def readValue(self):
        # read sensor value and calculate temperature
        try:
            voltage = self.ADCChannel.voltage
            temperature = (-40)+(100/3.32)*voltage+self.temperatureOffset
        except:
            return None
        return temperature

class HumiditySensor():
    # Kobles på A0
    humidityPercentOffset = 0
    ADCChannel = None
    def __init__(self,humidityPercentOffset,ADCChannel):
        self.humidityPercentOffset = humidityPercentOffset
        self.ADCChannel = ADCChannel
    def readValue(self):
        try:
            voltage = self.ADCChannel.voltage
            humidity = (100/3.314)*voltage+self.humidityPercentOffset
        except:
            return None
        return humidity

class PressureSensor():

    pressureOffset = 0
    sensorChannel = None
    def __init__(self,pressureOffset,sensorChannel):
        self.pressureOffset = pressureOffset
        self.sensorChannel = sensorChannel

    def readValue(self):
    # read sensor value and calculate pressure
        
        try:
            pressure = self.sensorChannel.pressure + self.pressureOffset
        except:
            return None
        return pressure        

class WindSpeedSensor():
    #Kobles på channel A3 på Venstre chip
    windSpeedOffset = 0
    ADCChannel = None
    def __init__(self,windSpeedOffset,ADCChannel):
        self.windSpeedOffset = windSpeedOffset
        self.ADCChannel = ADCChannel
    def readValue(self):
        try:
            voltage = self.ADCChannel.voltage
            windSpeed = (50/3.28)*voltage+self.windSpeedOffset
            if windSpeed <= 0.1:
                return 0
        except:
            return None
        return windSpeed


class WindDirectionSensor():
    #Kobles på channel A0 på Venstre chip
    windDirectionOffset = 0
    ADCChannel = None
    def __init__(self,windDirectionOffset,ADCChannel):
        self.windDirectionOffset = windDirectionOffset
        self.ADCChannel = ADCChannel
    def readValue(self):
    # read sensor value and calculate temperature
        try:
            
            voltage = self.ADCChannel.voltage
            windDirection = (360/3.282)*voltage+self.windDirectionOffset
        except:
            return None
        return windDirection
    
    
    
class ValueQueue():
    valueArr = None
    maxSize = None
    def __init__(self,maxSize = 10):
        self.valueArr = []
        self.maxSize = maxSize
    def addValue(self,value):
        if value == None:
            return 0
        if(len(self.valueArr) < self.maxSize):
            self.valueArr.append(value)
        else:
            self.valueArr.pop(0)
            self.valueArr.append(value)
        return 0
    def printQueue(self):
        print("--- Queue ---") 
        for mesurement in self.valueArr:
           print(mesurement) 
        print("--- end ---") 
        return None
    
    def findAverage(self):
        if len(self.valueArr) == 0:
            return None
        average = 0
        for value in self.valueArr:
            average+=value
        average = average/len(self.valueArr)
        return average


    @staticmethod
    def findAverageWinddirection(windSpeedArray,windDirectionArray):
        vindVectors = []
        uSum = 0
        vSum=0
        if len(windSpeedArray) != len(windDirectionArray) or len(windDirectionArray) == 0:
            return None
        for i in range(len(windDirectionArray)):        
            vindVector = {'v':0,'u':0}
            vindVector['u'] = -windSpeedArray[i]*math.sin(2*math.pi*windDirectionArray[i]/360)
            vindVector['v'] = -windSpeedArray[i]*math.cos(2*math.pi*windDirectionArray[i]/360)
            vindVectors.append(vindVector)
        
        for vectorObject in vindVectors:
            uSum += vectorObject['u']
            vSum += vectorObject['v']
        uAvg = uSum/len(vindVectors)
        vAvg = vSum/len(vindVectors)
        windDirectionAverage = (math.atan2(uAvg,vAvg)*360/2/math.pi)+180       
        return windDirectionAverage
