import React, { useState } from 'react';
import { ImageBackground, Text, Linking, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

function App() {

  const [phone, setPhone] = useState('');

  const submitHandler = () => {
    let phoneNumber = '+91' + phone;
    phoneNumber = phoneNumber.substring(1, phoneNumber.length)
    const url = `https://api.WhatsApp.com/send?phone=${phoneNumber}`
    Linking.openURL(url);
    console.log(url);
  }

  return (
    <ImageBackground style={styles.background} source={require('./assets/background.jpg')}>
      <View style={styles.container}>
        <Text style={styles.title}>Send Messages on whatsapp without saving numbers</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={phone}
            keyboardType={'numeric'}
            placeholder="Enter number"
            onChangeText={phone => setPhone(phone)}
          />
          <TouchableOpacity style={styles.icon} onPress={submitHandler}>
            <FontAwesome name="whatsapp" size={35} color="green" />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={styles.thanks}
        onPress={() => Linking.openURL('https://amanraj.me/')}>
        Developed by AmanRaj1608
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Search Bar
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  title: {
    margin: 20,
    marginBottom: 50,
    textAlign: 'center',
    borderRadius: 20,
    backgroundColor: '#5c969e',
    fontSize: 25,
    color: '#f1f6f9'
  },
  form: {
    flexDirection: 'row',
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 234, 234, 0.9)',
    marginHorizontal: 30
  },
  input: {
    flexGrow: 1,
    marginHorizontal: 30
  },
  icon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(234, 151, 173, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    borderRadius: 50,
  },
  thanks: {
    position: 'absolute',
    color: '#283c63',
    fontSize: 16,
    padding: 5,
    borderRadius: 10,
    bottom: 20,
    backgroundColor: '#c4edde',
    textDecorationLine: 'underline'
  },
});

export default App;
