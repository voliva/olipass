# http://localhost:8081/debugger-ui/ <= debugger URL

emulator -avd Nexus_5X_API_28 -noskin

adb reverse tcp:8081 tcp:8081
adb forward tcp:8082 tcp:8082
adb forward tcp:8083 tcp:8083

# https://github.com/realm/realm-js/issues/465
