import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import io from "socket.io-client";
import { UserContext } from "../context/UserContext.jsx";
import { logoutStorage } from "./LoginStorage.jsx";
import GroupModal from "./GroupModal.jsx"; // Importa el componente de popup para crear nuevo grupo o unirse a uno existente

import { IconButton } from "react-native-paper";

const App = () => {
  const { user, setUser } = useContext(UserContext);
  const { username, userId } = user;

  const [groupMessages, setGroupMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState("");
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false); // Estado para controlar la visibilidad del popup de nuevo grupo o unión a grupo
  const [groupModelMode, setGroupModelMode] = useState("create"); // Estado para controlar el modo del popup de nuevo grupo o unión a grupo
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      auth: {
        userId: userId,
        username: username,
        serverOffset: 0,
      },
    });

    socket.current.on("chat message", (msg, serverOffset, username) => {
      setGroupMessages((prevMessages) => prevMessages.concat(msg));
      if (msg.length != 0) {
        setMessages(msg[0].messages);
        setCurrentGroupId(msg[0].groupId);
        setCurrentGroupName(msg[0].groupName);
      }
      console.log("groupMessages", groupMessages);
    });

    socket.current.on(
      "chat new message",
      (msg, serverOffset, username, groupMessagesEdit) => {
        console.log(groupMessagesEdit);
        let msgFormated = {
          id: msg.id,
          content: msg.content,
          user_id: msg.user_id,
          users: { username: username },
        };
        groupMessagesEdit
          .find((group) => group.groupId === msg.group_id)
          .messages.push(msgFormated);
        setGroupMessages(groupMessagesEdit);
        setMessages((prevMessages) => prevMessages.concat(msgFormated));
      }
    );

    socket.current.on("join group", (msg, username, groupMessagesEdit) => {
      console.log("msg", msg);

      setGroupMessages((prevMessages) => prevMessages.concat(msg));

      console.log("groupMessages", groupMessages);
    });

    socket.current.on("create group", (msg, username, groupMessagesEdit) => {
      console.log("msg", msg);

      setGroupMessages((prevMessages) => prevMessages.concat(msg));

      console.log("groupMessages", groupMessages);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [username]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.current.emit(
        "chat new message",
        inputMessage,
        currentGroupId,
        userId,
        groupMessages
      );
      setInputMessage("");
    }
  };

  const handleLogout = () => {
    console.log("aaaaaaaaaaaaa");
    socket.current.disconnect();
    setUser({ userId: "", username: "", password: "", login: false });
    logoutStorage();
  };

  const handleLoadMsgGroup = (groupId, groupName, groupMessages) => {
    setCurrentGroupName(groupName);
    setCurrentGroupId(groupId);
    setMessages(groupMessages);
  };

  const handleToggleGroupModal = (mode) => {
    setGroupModelMode(mode);
    setShowGroupModal(!showGroupModal);
  };

  const handleGroupAction = (groupName, groupPassword, action) => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa", action);
    if (action === "create") {
      console.log("Creating new group:", groupName, "w pass:", groupPassword);
      socket.current.emit("create group", groupName, groupPassword, userId);
    } else if (action === "join") {
      console.log("Joining group:", groupName, "w pass:", groupPassword);
      socket.current.emit("join group", groupName, groupPassword, userId);
    }
    setShowGroupModal(false);
  };

  const handleLeaveGroup = (groupId) => {
    socket.current.emit("leave group", groupId, userId);
    let groupMessagesEdit = groupMessages.filter(
      (group) => group.groupId !== groupId
    );
    setGroupMessages(groupMessagesEdit);
    if (groupId === currentGroupId) {
      setMessages([]);
    }
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const buttonRef = useRef();

  const toggleMenu = async () => {
    buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
      console.log(x, y, width, height, pageX, pageY);
      setMenuPosition({ x: pageX - 100, y: pageY + height });
      setIsMenuVisible(!isMenuVisible);
    });
  };

  const handleMenuClick = () => {
    console.log("click");
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.chatMessageMainContainer}>
          <View style={styles.groupChatContainer}>
            <View style={styles.header}>
              <Text style={styles.textTitle}>Chats</Text>
              <TouchableOpacity
                style={styles.verticalDots}
                ref={buttonRef}
                onPress={toggleMenu}
              >
                <IconButton
                  icon="dots-vertical"
                  iconColor="rgb(204, 204, 204)"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {groupMessages.length === 0 ? (
                <></>
              ) : (
                groupMessages.map((group, index) => {
                  return (
                    <TouchableOpacity
                      key={group.groupId}
                      onPress={() =>
                        handleLoadMsgGroup(
                          group.groupId,
                          group.groupName,
                          group.messages
                        )
                      }
                      style={[
                        styles.groupsContainer,
                        currentGroupId == group.groupId &&
                          styles.openGroupContainer,
                      ]}
                    >
                      <View style={styles.groupNameButtonTouchable}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.groupNameButton}
                        >
                          {group.groupName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.button, styles.leaveButton]}
                        onPress={() => handleLeaveGroup(group.groupId)}
                      >
                        <Text style={styles.buttonText}>X</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>

          <View style={styles.chatContainer}>
            <View style={styles.header}>
              <Text style={styles.textTitle}>{currentGroupName}</Text>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.length === 0 ? (
                <></>
              ) : (
                messages.map((message, index) => {
                  return (
                    <View
                      key={message.id}
                      style={[
                        styles.message,
                        message.users.username === username && styles.myMessage,
                      ]}
                    >
                      <View style={styles.msgUser}>
                        <Text style={styles.textColorUserName}>{message.users.username}</Text>
                      </View>
                      <View style={styles.msgContainer}>
                        <Text style={styles.textColor}>{message.content}</Text>
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
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.optionsContainer,
            { display: isMenuVisible ? "contents" : "none" },
          ]}
        >
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View
              style={[
                styles.modalContent,
                { top: menuPosition.y, left: menuPosition.x },
              ]}
            >
              <TouchableOpacity onPress={() => handleToggleGroupModal("join")}>
                <Text style={styles.menuOption}>Join group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleToggleGroupModal("create")}
              >
                <Text style={styles.menuOption}>Create group</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLogout()}>
                <Text style={styles.menuOption}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

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
  chatMessageMainContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "#111b21",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a3942",
    marginBottom: 10,
  },
  modalContent: {
    position: "absolute",
    backgroundColor: "#233138",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    width: 150,
  },
  menuOption: {
    fontSize: 16,
    paddingVertical: 8,
    color: "rgb(204, 204, 204)",
  },
  verticalDots: {
    marginLeft: "auto",
  },

  optionsContainer: {
    zIndex: 100,
  },

  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 36,
    alignItems: "center",
  },
  groupChatContainer: {
    flex: 1,
    marginRight: 10,
    width: 200,
  },
  chatContainer: {
    flex: 1,
    width: 400,
    borderWidth: 1,
    borderColor: "#2a3942",
    height: "100%",
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    height: 300,
    marginHorizontal: 20,
  },
  groupsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111b21",
    borderTopWidth: 1,
    borderTopColor: "#1c262c",
  },
  openGroupContainer: {
    backgroundColor: "#2a3942",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  groupNameButton: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  groupNameButtonTouchable: {
    maxWidth: "70%",
  },
  message: {
    alignSelf: "flex-start",
    maxWidth: 250,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#2a3942",
    borderRadius: 4,
    marginLeft: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#005c4b",
    marginRight: 10,
  },
  msgUser: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  textColor: {
    color: "#fff",
  },
  textColorUserName: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a3942",
    marginTop: 6,
  },
  input: {
    flex: 1,
    borderColor: "#202c33",
    color: "#6c7575",
    backgroundColor: "#3b3b3b",
    height: "100%",
    paddingLeft: 10,
  },
  sendButton: {
    backgroundColor: "#1a2329",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  textTitle: {
    color: "#fff", // Color blanco para el texto
    fontSize: 20, // Tamaño de fuente
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#2a3942", // Fondo azul claro
    height: "50px", // Altura del contenedor
  },
});

export default App;
