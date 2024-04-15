import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './src/components/Main.jsx';
import SignUpPage from './src/components/SignUp.jsx'; 
import { UserContextProvider } from './src/context/UserContext.jsx';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <UserContextProvider>
          <Stack.Navigator
           screenOptions={{
            headerShown: false // Oculta la barra de navegación
          }}>
            <Stack.Screen
              name="Main"
              component={Main}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpPage}
            />
          </Stack.Navigator>
        </UserContextProvider>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});