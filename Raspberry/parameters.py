# Define filepaths with reference in current working directory
temporaryData = '/home/pi/Documents/weatherStation/data/temporaryMesurements/'
uploadData = '/home/pi/Documents/weatherStation/data/uploadQueue/'
uploadDataRealtime = '/home/pi/Documents/weatherStation/data/realTimeQueue/'

# Set the id for the station. Either 1 or 2
stationId = 2
# Serverkey, this is used for authentication when submitting data to the server. The same key can be used for different weatherstations
serverKey = 'InsertSecretKey'
# Server URL, this points to the php file used for uploading hour values
serverUrl = 'http://www.hessdalen.org/weather19/submitData.php'
# Server URL for realtime upload (minute values)
serverUrlRealtimeData = 'http://www.hessdalen.org/weather19/submtDataRealTime.php'

# Offsets for mesurements. Here you can add a offset for different readings
#Temperatureoffset: Degrees C
temperatureOffset = 0
# Humidity offset: humidity percentage %
humidityOffset = 0
#Pressure offset: hPa
pressureOffset = 0
#Windspeed offset: m/s
windSpeedOffset = 0
#Winddirection offset: degrees
windDirectionOffset = 0
