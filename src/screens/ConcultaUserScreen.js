import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';

const initialConsultas = [
  {
    id: '1',
    title: 'Problema con login',
    category: 'Software',
    expert: 'Kim',
    status: 'En proceso',
    date: '25/09/2025',
  },
  {
    id: '2',
    title: 'Falla de red Wi-Fi',
    category: 'Redes',
    expert: 'María López',
    status: 'Resuelta',
    date: '20/09/2025',
  },
];

const ConsultaUserScreen = () => {
  const [consultas, setConsultas] = useState(initialConsultas);
  const [modalVisible, setModalVisible] = useState(false);
  const [newConsultaTitle, setNewConsultaTitle] = useState('');
  const [newConsultaCategory, setNewConsultaCategory] = useState('');

  // Función para agregar nueva consulta
  const handleAddConsulta = () => {
    if (!newConsultaTitle || !newConsultaCategory) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const newConsulta = {
      id: (consultas.length + 1).toString(),
      title: newConsultaTitle,
      category: newConsultaCategory,
      expert: 'Pendiente',
      status: 'Abierta',
      date: new Date().toLocaleDateString(),
    };

    setConsultas([newConsulta, ...consultas]);
    setModalVisible(false);
    setNewConsultaTitle('');
    setNewConsultaCategory('');
  };

  const renderConsulta = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.info}>Categoría: {item.category}</Text>
      <Text style={styles.info}>Experto: {item.expert}</Text>
      <Text style={styles.info}>Estado: {item.status}</Text>
      <Text style={styles.info}>Fecha: {item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Consultas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Nueva Consulta</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={consultas}
        renderItem={renderConsulta}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
      />

      {/* Modal para crear nueva consulta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Consulta</Text>
            <TextInput
              style={styles.input}
              placeholder="Título del problema"
              value={newConsultaTitle}
              onChangeText={setNewConsultaTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Categoría (Software, Hardware, etc.)"
              value={newConsultaCategory}
              onChangeText={setNewConsultaCategory}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Agregar" onPress={handleAddConsulta} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  info: { fontSize: 14, color: '#6b7280', marginBottom: 2 },


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ConsultaUserScreen;