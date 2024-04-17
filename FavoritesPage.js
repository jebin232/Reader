import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const FavoritesPage = () => {
  const [favoriteStories, setFavoriteStories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavoriteStories = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

        // Fetch the favorite stories from Firebase Firestore based on the stored IDs
        const stories = await Promise.all(
          favorites.map(async (id) => {
            const snapshot = await firebase.firestore().collection('stories').doc(id).get();
            if (snapshot.exists) {
              return { id: snapshot.id, ...snapshot.data() };
            }
            return null;
          })
        );

        setFavoriteStories(stories.filter(Boolean));
      } catch (error) {
        console.error('Error fetching favorite stories:', error);
      }
    };

    fetchFavoriteStories();
  }, []);

  const renderStoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Reading', { storyId: item.id })} style={styles.storyItem}>
      <Image source={{ uri: item.coverImageUrl }} style={styles.coverImage} />
      <View style={styles.storyInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (favoriteStories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite stories found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        data={favoriteStories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Dark background color
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#121212'    },
  emptyText: {
    fontSize: 16,
    color: 'white',
  },
  flatListContentContainer: {
    paddingBottom: 16,
  },
  storyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#333333', // Darker background color
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  storyInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#ffffff', // White text color
  },
  description: {
    fontSize: 14,
    color: 'black',
  },
});

export default FavoritesPage;
