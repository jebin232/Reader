import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet ,ScrollView,ActivityIndicator} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';



const firebaseConfig = {
  // Your Firebase configuration details
  // ...
  apiKey: "AIzaSyD44mOJNzLMajBoFpJbc18OAcJZM0b6s4c",
  authDomain: "read-3fea5.firebaseapp.com",
  projectId: "read-3fea5",
  storageBucket: "read-3fea5.appspot.com",
  messagingSenderId: "1099279435162",
  appId: "1:1099279435162:web:c2f711a64467b177f66623",
  measurementId: "G-K0961JNDZE"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const ReaderPage = ({ route }) => {
  const { storyId } = route.params;
  const [story, setStory] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyRef = firebase.firestore().collection('stories').doc(storyId);
        const snapshot = await storyRef.get();
        if (snapshot.exists) {
          const storyData = snapshot.data();
          setStory(storyData);
          setLikeCount(storyData.likes || 0);
        } else {
          console.log('Story does not exist.');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [storyId]);

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      const index = favorites.indexOf(storyId);

      if (index !== -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(storyId);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));

      const message = index !== -1 ? 'Removed from favorites' : 'Added to favorites';
      Alert.alert('Favorite', message);

      setIsFav(index === -1);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

        setIsFav(favorites.includes(storyId));
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [storyId]);

  const toggleLike = () => {
    setIsLiked((prevLiked) => !prevLiked);

    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);

    firebase
      .firestore()
      .collection('stories')
      .doc(storyId)
      .update({
        likes: newLikeCount,
      })
      .then(() => {
        console.log('Like count updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating like count:', error);
      });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
    } else {
      const content = story.content;
      const options = { language: 'en' };
      Speech.speak(content, options);
    }
    setIsSpeaking((prevSpeaking) => !prevSpeaking);
  };

  const toggleTamilSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
    } else {
      const content = story.tam;
      const options = { language: 'ta' };
      Speech.speak(content, options);
    }
    setIsSpeaking((prevSpeaking) => !prevSpeaking);
  };

  if (!story) {
    return (
      <View style={styles.load}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />

      <Image source={{ uri: story.coverImageUrl }} style={styles.coverImage} />
      <Text style={styles.title}>{story.title}</Text>

      <View style={styles.storyActions}>
        <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
          <Text style={styles.actionButtonText}>{likeCount} {isLiked ? 'Unlike' : 'Like'}</Text>
          <FontAwesome
            name={isLiked ? 'thumbs-up' : 'thumbs-up'}
            size={24}
            color={isLiked ? 'red' : 'black'}
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
          <Text style={styles.actionButtonText}>{isFav ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
          <FontAwesome
            name={isFav ? 'heart' : 'heart-o'}
            size={24}
            color={isFav ? 'red' : 'black'}
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.playbackActions}>
        <TouchableOpacity style={styles.playbackButton} onPress={toggleSpeech}>
          <Text style={styles.playbackButtonText}>{isSpeaking ? ' Stop' : 'Play'} in English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playbackButton} onPress={toggleTamilSpeech}>
          <Text style={styles.playbackButtonText}>{isSpeaking ? 'Stop' : 'Play'} in Tamil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.storyContent}>{story.content}</Text>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  load: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  coverImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
    textAlign: 'center',
  },
  storyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#55aaff',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  actionButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
  },
  storyContent: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    paddingHorizontal: 16,
  },
  playbackActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playbackButton: {
    backgroundColor: '#ffaa55',
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    flex: 1,
  },
  playbackButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  stopButton: {
    backgroundColor: '#ff5555',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 8,
  },
  stopButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  favoriteIcon: {
    textAlign: 'center',
  },
});

export default ReaderPage;