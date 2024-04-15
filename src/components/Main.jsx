import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import LoginScreen from './Login.jsx';
import ChatScreen from './Chat.jsx';
import { loadUserSession } from '../components/LoginStorage.jsx';
import { useNavigation } from '@react-navigation/native';




const Main = () => {
  const { user , setUser } = useContext(UserContext); // Accessing the user context
  const { login } = user; // Destructuring the login state from the user context


  const navigation = useNavigation();

  useEffect(() => {
    // Cargar la sesión del usuario cuando se monta el componente Main
    let userData = loadUserSession(setUser);
    

  }, []);
  

  return (
    <>
      {login ? <ChatScreen /> : <LoginScreen />}
    </>
  );
};

export default Main;
