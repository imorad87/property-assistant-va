/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity, useColorScheme,
  View,
  PermissionsAndroid,
} from 'react-native';

import SmsAndroid from 'react-native-get-sms-android';

import {
  Colors, Header
} from 'react-native/Libraries/NewAppScreen';

import { io } from 'socket.io-client';

import SmsListener from 'react-native-android-sms-listener'



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConnected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const thesocket = io('ws://10.0.0.5:3001', {
      transports: ['websocket'],
    });

    thesocket.on('connect', () => {
      setConnected(true);
      setSocket(thesocket);
    });

    thesocket.on('disconnect', () => {
      setConnected(false);
      setSocket(null);
    });

    const readPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: "Property VA",
            message:
              "READ SMS?",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Can Read SMS");
        } else {
          console.log("Read SMS permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }

    const requestSendSMSPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: "Property VA",
            message:
              "Send SMS?",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Can SEND_SMS");
        } else {
          console.log("SEND_SMS permission denied");
        }
      } catch (err) {
        console.warn(err);
      }


    };

    readPermissions();
    requestSendSMSPermission();

   
      try {

        SmsListener.addListener(message => {
          console.info(message)
        });

        console.log("🚀 ~ file: App.tsx ~ line 115 ~ startListener ~ mAdded listener");
      } catch (error) {
        console.log(JSON.stringify(error));
      }



  }, []);




  if (socket) {
    socket.on('sms-send-event', (data) => {
      SmsAndroid.autoSend(
        data.number,
        data.msg,
        (fail) => {
          console.log('Failed with this error: ' + fail);
        },
        (success) => {
        },
      );
      console.log(data);
    })
  }




  const sendMessage = () => {
    SmsAndroid.autoSend(
      '01147799399',
      "hello",
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (success) => {
        // console.log(success)
      },
    );
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }; ``

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>Connected:{isConnected ? 'Yes' : 'No'}</Text>
          {/* 
          <TouchableOpacity style={{ padding: 10, backgroundColor: 'blue', marginBottom: 10, }} onPress={requestCameraPermission}>
            <Text>Click</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={{ padding: 10, backgroundColor: 'blue' }} onPress={sendMessage}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
