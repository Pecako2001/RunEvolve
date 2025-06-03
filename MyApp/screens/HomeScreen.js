import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import styles from '../styles/HomeScreenStyles';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Home" />
      <Text style={styles.text}>This is the home screen.</Text>
      <CustomButton title="Go to Details" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}
