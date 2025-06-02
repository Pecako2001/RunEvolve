import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export default function HomeScreen({ navigation }: NativeStackScreenProps<any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Page</Text>
      <Button title="Statistics" onPress={() => navigation.navigate('Statistics')} />
    </View>
  );
}
