import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { StatusBar } from 'expo-status-bar';
import 'firebase/compat/firestore'; 
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons (or another icon library you prefer)


const CategoryPage = ({ navigation }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comicsCategory1, setComicsCategory1] = useState([]);
  const [comicsCategory2, setComicsCategory2] = useState([]);
  const [comicsCategory3, setComicsCategory3] = useState([]);
  const [comicsCategory4, setComicsCategory4] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        setLoading(true);
        const imageRefs = await firebase.storage().ref('slider_images').listAll();
        const urls = await Promise.all(
          imageRefs.items.map(async (item) => {
            return await item.getDownloadURL();
          })
        );
        setImageUrls(urls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
        setLoading(false);
      }
    };

    fetchImageUrls();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < imageUrls.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, imageUrls]);

  const fetchComicData = async (category) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection('stories')
        .where('category', '==', category)
        .get();

      const comicData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return comicData;
    } catch (error) {
      console.error(`Error fetching comics for ${category}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchComics = async () => {
      setComicsCategory1(await fetchComicData('Drama'));
      setComicsCategory2(await fetchComicData('Romantic'));
      setComicsCategory3(await fetchComicData('Science-Fiction'));
      setComicsCategory4(await fetchComicData('Mystery'));
    };

    fetchComics();
  }, []);

  const handleComicPress = (comicname) => {
    navigation.navigate('Reading', { storyId: comicname })
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.slideshowContainer}>
        <Swiper
          style={styles.wrapper}
          height={330}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={3}
          loop={true}
          index={currentIndex}
        >
          {imageUrls.map((url, index) => (
            <View key={index} style={styles.slide}>
              <Image source={{ uri: url }} style={styles.image} />
            </View>
          ))}
        </Swiper>
      </View>

      <CategorySection title="Drama" icon="ios-film" data={comicsCategory1} onPress={handleComicPress} />
      <CategorySection title="Romantic" icon="ios-heart" data={comicsCategory2} onPress={handleComicPress} />
      <CategorySection title="Science-Fiction" icon="ios-rocket" data={comicsCategory3} onPress={handleComicPress} />
      <CategorySection title="Mystery" icon="ios-search" data={comicsCategory4} onPress={handleComicPress} />
  
    </ScrollView>
  );
};

const CategorySection = ({ title, icon, data, onPress }) => (
  <View style={styles.categoryContainer}>
    <View style={styles.categoryHeader}>
      <Ionicons name={icon} size={24} color="#ffffff" style={styles.icon} />
      <Text style={styles.heading}>{title}</Text>
    </View>
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.comicContainer} onPress={() => onPress(item.id)}>
          <Image source={{ uri: item.coverImageUrl }} style={styles.comicThumbnail} />
          <Text style={styles.comicTitle}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color
  },
  
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  slideshowContainer: {
    flex: 1,
    marginTop: 10, // Added margin for separation
    backgroundColor: '#333', // Darker background color for the slideshow
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  image: {
    width: '100%',
    height: 310,
    resizeMode: 'cover',
  },
  heading: {
    color: '#ffffff', // White text color
    marginTop: 20,
    marginBottom: 7,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  comicContainer: {
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#292929', // Darker background color for comics
    borderWidth: 1, // Added border for a cleaner look
    borderColor: '#333', // Border color
  },
  comicThumbnail: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  comicTitle: {
    color: '#ffffff', // White text color
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
    padding: 8,
    fontSize: 14,
  },
});

export default CategoryPage;