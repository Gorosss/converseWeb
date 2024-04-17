import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal } from 'react-native';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext.jsx';
import { logoutStorage } from './LoginStorage.jsx';
import GroupModal from './GroupModal.jsx'; // Importa el componente de popup para crear nuevo grupo o unirse a uno existente

const App = () => {
  const { user, setUser } = useContext(UserContext);
  const { username, userId } = user;

  const [groupMessages, setGroupMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentGroupId, setCurrentGroupId] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false); // Estado para controlar la visibilidad del popup de nuevo grupo o unión a grupo
  const [groupModelMode, setGroupModelMode] = useState('create'); // Estado para controlar el modo del popup de nuevo grupo o unión a grupo
  const socket = useRef(null);



  useEffect(() => {

    socket.current = io('http://localhost:3000', {
      auth: {
        userId: userId,
        username: username,
        serverOffset: 0
      }
    });


    socket.current.on('chat message', (msg, serverOffset, username) => {

      setGroupMessages(prevMessages => prevMessages.concat(msg));
      if (msg.length != 0) {
        setMessages(msg[0].messages)
      }
      console.log("groupMessages", groupMessages)
    });


    socket.current.on('chat new message', (msg, serverOffset, username, groupMessagesEdit) => {

      console.log(groupMessagesEdit)
      let msgFormated = { id: msg.id, content: msg.content, user_id: msg.user_id, users: { username: username } };
      groupMessagesEdit.find(group => group.groupId === msg.group_id).messages.push(msgFormated);
      setGroupMessages(groupMessagesEdit);
      setMessages(prevMessages => prevMessages.concat(msgFormated))



    });

    socket.current.on('join group', (msg, username, groupMessagesEdit) => {

      console.log("aaaaaaaaaaaaaaddd",msg)

      setGroupMessages(prevMessages => prevMessages.concat(msg));

      console.log("groupMessages", groupMessages)
    });


    socket.current.on('create group', (msg, username, groupMessagesEdit) => {

      console.log("aaaaaaaaaaaaaaddd",msg)

      setGroupMessages(prevMessages => prevMessages.concat(msg));

      console.log("groupMessages", groupMessages)
    });


    return () => {
      socket.current.disconnect();
    };
  }, [username]);




  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.current.emit('chat new message', inputMessage, currentGroupId, userId, groupMessages);
      setInputMessage('');
    }
  };

  const handleLogout = () => {
    socket.current.disconnect();
    setUser({ userId: '', username: '', password: '', login: false });
    logoutStorage();
  };

  const handleLoadMsgGroup = (groupId, groupMessages) => {
    setCurrentGroupId(groupId);
    setMessages(groupMessages);
  }

  const handleToggleGroupModal = (mode) => {
    setGroupModelMode(mode);
    setShowGroupModal(!showGroupModal); // Mostrar o ocultar el popup de nuevo grupo o unión a grupo
  }

  // Función para crear un nuevo grupo o unirse a uno existente
  const handleGroupAction = (groupName, groupPassword, action) => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa', action)
    if (action === 'create') {
      // Crear nuevo grupo
      console.log('Creando nuevo grupo:', groupName, 'con contraseña:', groupPassword);
      socket.current.emit('create group', groupName, groupPassword, userId);
      // Lógica para crear el grupo...
    } else if (action === 'join') {
      // Unirse a grupo existente
      console.log('Uniéndose al grupo:', groupName, 'con contraseña:', groupPassword);
      socket.current.emit('join group', groupName, groupPassword, userId);
    }
    setShowGroupModal(false);
  }

  const handleLeaveGroup = (groupId) => {
    socket.current.emit('leave group', groupId, userId);
    let groupMessagesEdit = groupMessages.filter(group => group.groupId !== groupId);
    setGroupMessages(groupMessagesEdit);
    if (groupId === currentGroupId) {
      setMessages([]);
    }


  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.logoutContainer}>
          <Button title="Cerrar sesión" onPress={handleLogout} />
        </View>
        <View>
          <View>
            {groupMessages.length === 0 ? <Text>No hay mensajes</Text> : (
              groupMessages.map((group, index) => {
                console.log("groupMessages2", groupMessages)
                return (
                  <View key={group.groupId} style={styles.messagesContainer}>
                    <Button title={group.groupName} onPress={() => handleLoadMsgGroup(group.groupId, group.messages)} />
                    <Button title="Leave Group" onPress={() => handleLeaveGroup(group.groupId)} />

                  </View>
                );
              })
            )}
            <Button title="Join group" onPress={() => handleToggleGroupModal('join')} />
            <Button title="Create group" onPress={() => handleToggleGroupModal('create')} />
          </View>

          <View style={styles.chatContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {messages.length === 0 ? <Text>No hay mensajes</Text> : (
                messages.map((message, index) => {
                  console.log("messages", messages)
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
      {/* Popup para crear nuevo grupo o unirse a uno */}
      <GroupModal
        visible={showGroupModal}
        onClose={handleToggleGroupModal}
        onSubmit={handleGroupAction}
        mode={groupModelMode}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
