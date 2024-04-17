import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, FlatList, Text, TouchableOpacity, Image, TextInput, StyleSheet ,ActivityIndicator} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useNavigation } from '@react-navigation/native';


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
  

  const StoryDiscovery = () => {
    const [stories, setStories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      // Fetch stories from Firebase Firestore
      const fetchStories = async () => {
        try {
          setLoading(true);
  
          let query = firebase.firestore().collection('stories');
  
          if (searchQuery) {
            query = query.where('title', '>=', searchQuery).where('title', '<=', searchQuery + '\uf8ff');
          }
  
          const snapshot = await query.get();
          const fetchedStories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStories(fetchedStories);
          setLoading(false);
  
        } catch (error) {
          setLoading(false);
          console.error('Error fetching stories:', error);
        }
      };
  
      fetchStories();
    }, [searchQuery]);
  
    const renderStoryItem = ({ item }) => (
      <TouchableOpacity onPress={() => navigation.navigate('Reading', { storyId: item.id })}>
        <View style={styles.storyItem}>
          <Image
            source={{ uri: item.coverImageUrl }}
            style={styles.storyImage}
            resizeMode="cover" // Maintain aspect ratio and cover the container
          />
          <View style={styles.storyInfo}>
            <Text style={styles.storyTitle}>{item.title}</Text>
            <Text style={styles.storyDescription}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  
    if (loading == true) {
      return (
        <View style={styles.load}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
  
        <TextInput
          style={styles.searchInput}
          placeholder="Search stories"
          placeholderTextColor="#ffffff" // Text color when the input is not focused
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.header}>For you</Text>
  
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.storyList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    header: {
      marginBottom: 5,
      fontWeight: 'bold',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 20,
      borderBottomColor: '#ffffff', // White border color
      color: '#ffffff', // White text color
    },
    searchInput: {
      borderStyle: 'solid',
      backgroundColor: '#333333', // Dark background color
      borderColor: '#ffffff', // White border color
      padding: 8,
      borderRadius: 8,
      marginBottom: 16,
      color: '#ffffff', // White text color
    },
    storyList: {
      paddingBottom: 16,
    },
    storyItem: {
      alignItems: 'center',
      marginBottom: 16,
      backgroundColor: '#333333', // Dark background color
      borderRadius: 8,
      padding: 16,
      elevation: 2,
    },
    separator: {
      height: 1,
      backgroundColor: 'lightgray',
      marginVertical: 8,
    },
    storyImage: {
      width: 300,
      height: 170,
      borderRadius: 8,
      marginRight: 16,
    },
    storyInfo: {
      flex: 1,
    },
    storyTitle: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#ffffff', // White text color
    },
    storyDescription: {
      fontSize: 14,
      color: 'gray',
      textAlign: 'justify',
      justifyContent: 'center',
      color: '#ffffff', // White text color
    },
    load: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212', // Dark background color
    },
  });
  
  export default StoryDiscovery;