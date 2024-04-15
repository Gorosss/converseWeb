import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext.jsx';
import { logoutStorage } from './LoginStorage.jsx'

const App = () => {
  const { user, setUser } = useContext(UserContext);
  const { username, userId } = user;

  const [groupMessages, setGroupMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const socket = io('http://localhost:3000', {
    auth: {
      userId: userId,
      username: username,
      serverOffset: 0
    }
  });

  useEffect(() => {
    socket.on('chat message', (msg, serverOffset, username) => {
      console.log(msg, serverOffset, username)
      setGroupMessages(prevMessages => [...prevMessages, { msg }]);
      socket.auth.serverOffset = serverOffset;
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit('chat message', inputMessage);
      setInputMessage('');
    }
  };

  const handleLogout = () => {
    socket.disconnect();
    setUser({ userId: '', username: '', password: '', login: false });
    logoutStorage();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.logoutContainer}>
          <Button title="Cerrar sesión" onPress={handleLogout} />
        </View>
        <View>
          

          <View style={styles.chatContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {groupMessages.length === 0 ? <Text>No hay mensajes</Text> : (
                groupMessages[0].msg.map((group, index) => {
                  return (
                    group.map((message, index) => {

                      return (
                        <View key={message.id} style={[styles.message, message.users.username === username && styles.myMessage]}>
                          <View>
                            <Text>{message.users.username}</Text>
                          </View>
                          <View style={styles.msgContainer}>
                            <Text>{message.content}</Text>
                          </View>
                        </View>
                      );
                    })
                  );
                })
              )}
            </ScrollView>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="Type a message"
              />
              <Button title="Enviar" onPress={sendMessage} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 36,
    alignItems: 'center',


  },
  chatContainer: {
    flex: 1,
    width: 400,
    borderWidth: 1,
    borderColor: '#eee',
    height: 300,
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    height: 300,
  },
  messagesContainer: {
    width: '100%',
  },
  msgContainer: {
    flex: 1,
  },
  message: {
    alignSelf: 'flex-start',
    maxWidth: '250px',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#0cf',
    borderRadius: 4,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgb(17, 126, 44)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 9999,
    borderColor: '#eee',
    paddingHorizontal: 8,
    marginRight: 8,
    color: '#6c7575',
    backgroundColor: '#3b3b3b',
  },
});

export default App;
