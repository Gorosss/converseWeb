import { AsyncStorage } from 'react-native';
import { UserContext } from '../context/UserContext'; 
import React, { useContext, useState } from 'react';




export async function loadUserSession (setUser)  {

    try {
        let userData;
        // Verificar si AsyncStorage está disponible (en React Native)
        if (AsyncStorage) {
            userData = await AsyncStorage.getItem('userSession');
        } else {
            // En el navegador web, usar localStorage
            userData = localStorage.getItem('userSession');
        }

        return userData ? setUser(JSON.parse(userData)) : null;
        
    } catch (error) {
        console.error('Error al cargar la sesión del usuario:', error);
    }
};

const saveUserSession = async (userData) => {
    try {
        if (AsyncStorage) {
            await AsyncStorage.setItem('userSession', JSON.stringify(userData));
        } else {
            localStorage.setItem('userSession', JSON.stringify(userData));
        }
    } catch (error) {
        console.error('Error al guardar la sesión del usuario:', error);
    }
};

const clearUserSession = async () => {
    try {
        if (AsyncStorage) {
            await AsyncStorage.removeItem('userSession');
        } else {
            localStorage.removeItem('userSession');
        }
    } catch (error) {
        console.error('Error al eliminar la sesión del usuario:', error);
    }
};

export function loginStorage(userId, username, password) {
    

    // Lógica para iniciar sesión...
    // Por ejemplo, verificar credenciales en el servidor
    const loggedInUser = { userId, username, password, login: true };
    // Guardar la sesión del usuario
    saveUserSession(loggedInUser);
};

export function logoutStorage  () {

    // Lógica para cerrar sesión...
    // Eliminar la sesión del usuario
    clearUserSession();
};