import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import * as Contacts from 'expo-contacts';

function App() {

  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([]);

  const submitHandler = async () => { 
    console.log(phone);
    console.log(contacts[0].phoneNumbers[0].number);
  }

  React.useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          console.log(data.length);
          setContacts(data);
        }
      }
    })();
  }, []);

  return (
    <ImageBackground style={styles.background} source={require('./assets/background.jpg')}>
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={phone}
            keyboardType={'numeric'}
            placeholder="Enter phone number"
            onChangeText={phone => setPhone(phone)}
          />
          <TouchableOpacity style={styles.icon} onPress={submitHandler}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contactList}>
        <FlatList
          data={contacts}
          renderItem={({ item }) => <Text style={styles.item}>{'•  ' + item.name}</Text>}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Search Bar
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  form: {
    flexDirection: 'row',
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 234, 234, 0.9)',
    marginHorizontal: 20
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

  contactList: {
    marginTop: 20,
    padding: 10,
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
    backgroundColor: 'rgba(234, 234, 234, 0.9)',
    borderRadius: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    color: 'black',
  },
});


export default App;
