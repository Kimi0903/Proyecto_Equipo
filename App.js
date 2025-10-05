import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProblemFormScreen from './src/screens/ProblemFormScreen';
import ExpertListScreen from './src/screens/ExpertListScreen';
import ExpertProfileScreen from './src/screens/ExpertProfileScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Inicio', headerBackVisible: false }}
        />
        <Stack.Screen 
          name="ProblemForm" 
          component={ProblemFormScreen}
          options={{ title: 'Reportar Problema' }}
        />
        <Stack.Screen 
          name="ExpertList" 
          component={ExpertListScreen}
          options={{ title: 'Expertos Disponibles' }}
        />
        <Stack.Screen 
          name="ExpertProfile" 
          component={ExpertProfileScreen}
          options={{ title: 'perfil' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
