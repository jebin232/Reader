import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity,  StyleSheet ,Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import StoryCreation from './StoryCreation';
import StoryDiscovery from './StoryDiscovery';
import FavoritesPage from './FavoritesPage';
import CategoryPage from './CategoryPage';
import ReadingPage from './ReadingPage';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Homes">
      <Stack.Screen name="Homes" component={CategoryPage} options={{ headerShown: false }} />
      <Stack.Screen name="Reading" component={ReadingPage} />
    </Stack.Navigator>
  );
};

const App = ({ }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#000000' },
      
        }}
      >
        <Tab.Screen
    name="Home"
    component={HomeStack}
    options={{
      tabBarLabel: 'Home',
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name="home" size={focused ? 24 : 20} color={focused ? 'white' : 'gray'} />
      ),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000', // Background color for the header
      },
      headerTitleStyle: {
        color: '#FFF', // Text color for the header title
      },
    }}
  />
  <Tab.Screen
    name="Search"
    component={StoryDiscovery}
    options={{
      tabBarLabel: 'Search',
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name="search-sharp" size={focused ? 24 : 20} color={focused ? 'white' : 'gray'} />
      ),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000', // Background color for the header
      },
      headerTitleStyle: {
        color: '#FFF', // Text color for the header title
      },
    }}
  />
  <Tab.Screen
    name="Favorites"
    component={FavoritesPage}
    options={{
      tabBarLabel: 'My Library',
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name="library" size={focused ? 24 : 20} color={focused ? 'white' : 'gray'} />
      ),
      headerTitle: 'My Library',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000', // Background color for the header
      },
      headerTitleStyle: {
        color: '#FFF', // Text color for the header title
      },
    }}
  />
  <Tab.Screen
    name="Story"
    component={StoryCreation}
    options={{
      tabBarLabel: 'Upload',
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name="create" size={focused ? 24 : 20} color={focused ? 'white' : 'gray'} />
      ),
      headerTitle: 'Story Creation',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000', // Background color for the header
      },
      headerTitleStyle: {
        color: '#FFF', // Text color for the header title
      },
    }}
  />
</Tab.Navigator>
    </NavigationContainer>
  );
};


export default App;
