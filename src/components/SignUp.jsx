import React, { useState , useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserController } from '../controllers/userController.jsx';

import { UserContext } from '../context/UserContext.jsx'; 
import { loginStorage } from './LoginStorage.jsx'





const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user, setUser } = useContext(UserContext);


  const navigation = useNavigation();


  const handleSignUp = async () => {

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    // Aquí podrías agregar la lógica para registrar al usuario, por ejemplo, con Firebase
    console.log('Usuario registrado:', { username, password });
    try {
      const userIdBD = await UserController.signUp(username, password);
      console.log('Usuario registrado:', userIdBD);
      setUser({ ...user, userId:userIdBD , username: inputUsername, password: inputPassword, login: true });
      loginStorage(userIdBD, inputUsername, inputPassword);
      // Aquí puedes navegar a la página de inicio de sesión u otra página relevante
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }

    // Limpia el formulario después del registro exitoso
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleLogin = () => {
    navigation.navigate('Main');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="SignUp" onPress={handleSignUp} />
      <Button title="Back" onPress={handleLogin} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpPage;
