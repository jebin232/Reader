import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity, Text ,ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import DropDownPicker from 'react-native-dropdown-picker';

// Initialize Firebase with your own configuration
const firebaseConfig = {
  // Your Firebase configuration details
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
const categories = [
  { label: 'Drama', value: 'Drama' },
  { label: 'Romantic', value: 'Romantic' },
  { label: 'Science-Fiction', value: 'Science-Fiction' },
  { label: 'Mystery', value: 'Mystery' },
];

const StoryCreation = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [storyContent, setStoryContent] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChooseCoverImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access the photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const { uri, fileName } = result;
        setCoverImage({ uri, fileName });
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const handleCreateStory = async () => {
    try {
      setLoading(true);
      if (!selectedCategory) {
        Alert.alert('Incomplete Information', 'Please select a category for your story.');
        return;
      }

      // Upload cover image to Firebase Storage
      const imageRef = firebase.storage().ref().child(`covers/${coverImage.fileName}`);
      const response = await fetch(coverImage.uri);
      const blob = await response.blob();
      await imageRef.put(blob);

      // Get the download URL of the uploaded image
      const imageUrl = await imageRef.getDownloadURL();

      // Create a new story document in Firebase Firestore with the selected category
      const storyData = {
        title,
        description,
        coverImageUrl: imageUrl,
        content: storyContent,
        category: selectedCategory, // Add category field
        // Add other story data fields as needed
      };
      await firebase.firestore().collection('stories').add(storyData);

      // Reset form fields
      setTitle('');
      setDescription('');
      setCoverImage(null);
      setStoryContent('');
      setSelectedCategory(null);

      // Show success message
      Alert.alert('Success', 'Story created successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error creating story:', error);
      // Show error message
      Alert.alert('Error', 'Failed to create the story. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.load}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Cover Image */}
      <TouchableOpacity style={styles.imageContainer} onPress={handleChooseCoverImage}>
        {coverImage ? (
          <Image source={{ uri: coverImage.uri }} style={styles.coverImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>Choose Cover Image</Text>
        )}
      </TouchableOpacity>

      {/* Title Input */}
      <TextInput
        placeholder="Enter title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />

      {/* Description Input */}
      <TextInput
        placeholder="Enter description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        style={styles.input}
      />
      <DropDownPicker
        open={open}
        value={selectedCategory}
        items={categories.map((item) => ({ label: item.label, value: item.value }))}
        setOpen={setOpen}
        setValue={(value) => setSelectedCategory(value)}
        setItems={null}
        style={styles.dropdown}
        placeholder="Select Category"
        dropDownContainerStyle={styles.dropDownContainer}
        dropDownDirection="BOTTOM"
      />

      {/* Story Content Input */}
      <TextInput
        placeholder="Enter story content"
        value={storyContent}
        onChangeText={(text) => setStoryContent(text)}
        multiline
        style={[styles.input, styles.contentInput]}
      />

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, !coverImage && styles.disabledButton]}
        onPress={handleCreateStory}
        disabled={!title || !description || !coverImage || !selectedCategory}
      >
        <Text style={styles.buttonText}>Create Story</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    fontSize: 18,
    color: '#888',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    color: '#121212',
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 40,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  dropDownContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  load: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default StoryCreation;