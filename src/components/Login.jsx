import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { UserContext } from '../context/UserContext.jsx'; 
import { loginStorage } from './LoginStorage.jsx'
import { useNavigation } from '@react-navigation/native';
import { UserController } from '../controllers/userController.jsx';


const LoginScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const { username, password, login } = user; // Destructuring the values from the user context

  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (inputUsername && inputPassword) {

      try {
        const userIdBD = await UserController.login(inputUsername, inputPassword);
        setUser({ ...user, userId:userIdBD.userId , username: inputUsername, password: inputPassword, login: true });
        loginStorage(userIdBD.userId, inputUsername, inputPassword);
        // Aquí puedes navegar a la página de inicio de sesión u otra página relevante
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setInputUsername}
        value={inputUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setInputPassword}
        value={inputPassword}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="SignUp" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#6c7575',
    backgroundColor: '#3b3b3b'
  },
});

export default LoginScreen;