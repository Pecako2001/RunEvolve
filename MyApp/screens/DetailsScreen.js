import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Header from '../components/Header';
import styles from '../styles/DetailsScreenStyles';
import { fetchPosts } from '../services/api';

export default function DetailsScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Details" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.title}</Text>
        )}
      />
    </View>
  );
}
