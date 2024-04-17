import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const GroupModal = ({ visible, onClose, onSubmit, mode }) => {
  const [groupName, setGroupName] = useState('');
  const [groupPassword, setGroupPassword] = useState('');

  const handleSubmit = () => {
    // Validar que se ingresen tanto el nombre como la contraseña del grupo
    if (!groupName.trim() || !groupPassword.trim()) {
      return;
    }

    // Llamar a la función onSubmit con los datos ingresados
    onSubmit(groupName, groupPassword, mode);
    // Cerrar el modal después de enviar los datos
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'create' ? 'Crear Grupo' : 'Unirse a un Grupo'}
          </Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Nombre del grupo"
          />
          <TextInput
            style={styles.input}
            value={groupPassword}
            onChangeText={setGroupPassword}
            placeholder="Contraseña del grupo"
            secureTextEntry={true}
          />
          <Button title={mode === 'create' ? 'Crear Grupo' : 'Unirse al Grupo'} onPress={handleSubmit} />
          <Button title="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
});

export default GroupModal;
