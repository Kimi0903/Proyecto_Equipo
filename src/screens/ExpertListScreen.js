import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';


const experts = [
  {
    id: '1',
    name: 'María López',
    specialty: 'Redes y conectividad',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    id: '2',
    name: 'Carlos Ramírez',
    specialty: 'Hardware y reparación',
    rating: 4.6,
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
  },
  {
    id: '3',
    name: 'Ana Torres',
    specialty: 'Ciberseguridad',
    rating: 4.9,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
];

const ExpertListScreen = ({ navigation }) => {
  const renderExpert = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ExpertProfile', { expert: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Text style={styles.rating}>
          {'⭐'.repeat(Math.round(item.rating))} ({item.rating.toFixed(1)}/5)
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Expertos Disponibles</Text>
      <FlatList
        data={experts}
        renderItem={renderExpert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#2563eb',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  specialty: { fontSize: 14, color: '#666', marginTop: 4 },
  rating: { marginTop: 6, fontSize: 14, fontWeight: '600', color: '#2563eb' },
});

export default ExpertListScreen;
