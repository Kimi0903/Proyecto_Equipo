import React, { useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

const ExpertProfileScreen = ({ route }) => {
  const { expert } = route.params;

  // Datos iniciales
  const defaultSkills = ['React Native', 'Node.js', 'MySQL', 'UI/UX Design', 'Testing'];
  const defaultReviews = [
    { user: 'Carlos P.', comment: 'Excelente atención y conocimientos.', rating: 5 },
    { user: 'Ana G.', comment: 'Muy profesional y paciente explicando.', rating: 4 },
    { user: 'Luis R.', comment: 'Cumple con todo lo prometido.', rating: 5 },
  ];

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [currentUser, setCurrentUser] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [tempUserName, setTempUserName] = useState('');
  const [registeredUserName, setRegisteredUserName] = useState('');

  // Clave única para almacenar las reseñas de este experto
  const STORAGE_KEY = `@reviews_${expert.id}`;

  // Cargar reseñas al iniciar el componente
  useEffect(() => {
    loadReviews();
    loadCurrentUser();
  }, []);

  // Cargar reseñas desde AsyncStorage
  const loadReviews = async () => {
    try {
      const storedReviews = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        setReviews(expert.reviews && expert.reviews.length > 0 ? expert.reviews : defaultReviews);
        await AsyncStorage.setItem(
          STORAGE_KEY, 
          JSON.stringify(expert.reviews && expert.reviews.length > 0 ? expert.reviews : defaultReviews)
        );
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      setReviews(expert.reviews && expert.reviews.length > 0 ? expert.reviews : defaultReviews);
    }
  };

  const loadCurrentUser = async () => {
  try {
    // Intentar primero con "user" (donde realmente se guarda)
    let userString = await AsyncStorage.getItem("user");
    
    // Si no se encuentra, intentar con "userData" (por si acaso)
    if (!userString) {
      userString = await AsyncStorage.getItem("userData");
      console.log('No se encontró "user", buscando en "userData"...');
    }
    
    if (userString) {
      const user = JSON.parse(userString);
      console.log('Usuario cargado:', user);
      
      // Buscar nombre en múltiples propiedades
      const userName = user.name || user.userName || user.username || user.nombre || user.displayName || 'Usuario';
      
      setCurrentUser(userName);
      console.log('Nombre establecido:', userName);
    } else {
      console.log('No se encontró información del usuario');
      setCurrentUser('Usuario');
    }
  } catch (error) {
    console.error('Error al cargar usuario:', error);
    setCurrentUser('Usuario');
  }
};

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  // Función para cambiar a modo anónimo
  const switchToAnonymous = () => {
    setShowUserModal(true);
  };

  // Función para cambiar a modo usuario registrado
  const switchToRegistered = () => {
    setIsAnonymous(false);
    setCurrentUser(registeredUserName);
  };

  // Confirmar modo anónimo con nombre personalizado
  const confirmAnonymousMode = () => {
    if (tempUserName.trim()) {
      setCurrentUser(tempUserName);
      setIsAnonymous(true);
      setShowUserModal(false);
      setTempUserName('');
    } else {
      // Si no ingresa nombre, usar uno por defecto
      setCurrentUser('Usuario Anónimo');
      setIsAnonymous(true);
      setShowUserModal(false);
      setTempUserName('');
    }
  };

  // Cancelar modo anónimo
  const cancelAnonymousMode = () => {
    setShowUserModal(false);
    setTempUserName('');
  };

  // Función mejorada para agregar reseñas
  const handleAddReview = async () => {
    if (newComment.trim() === '' || newRating === 0) return;

    try {
      const token = await AsyncStorage.getItem("token");
      
      // Crear nueva reseña
      const newReview = {
        user: currentUser,
        comment: newComment,
        rating: newRating,
        date: new Date().toISOString(),
        expertId: expert.id,
        isAnonymous: isAnonymous
      };

      // Opción 1: Guardar en el backend
      if (token) {
        const response = await fetch("http://10.0.2.2:3000/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment: newComment,
            rating: newRating,
            expertId: expert.id,
            isAnonymous: isAnonymous,
            displayName: currentUser
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const updatedReviews = [...reviews, { ...newReview, ...data.review }];
            setReviews(updatedReviews);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
            setNewComment('');
            setNewRating(0);
            alert('Reseña enviada exitosamente!');
            return;
          }
        }
      }

      // Opción 2: Fallback - guardar solo localmente
      const updatedReviews = [...reviews, { ...newReview, local: true }];
      setReviews(updatedReviews);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
      setNewComment('');
      setNewRating(0);
      alert('Reseña guardada localmente!');

    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      alert("No se pudo enviar la reseña. Intenta de nuevo.");
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Image source={{ uri: expert.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{expert.name}</Text>
          <Text style={styles.specialty}>{expert.specialty}</Text>

          {/* Rating dinámico basado en comentarios */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                style={[
                  styles.star,
                  { color: star <= averageRating ? '#facc15' : '#d1d5db' },
                ]}
              >
                ★
              </Text>
            ))}
            <Text style={styles.ratingText}>
              {averageRating.toFixed(1)}/5 ({reviews.length} reseñas)
            </Text>
          </View>
        </View>

        {/* Secciones existentes... */}

        {/* Reseñas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Reseñas ({reviews.length})
          </Text>
          
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUserContainer}>
                    <Text style={styles.reviewName}>
                      {review.user}
                      {review.isAnonymous && (
                        <Text style={styles.anonymousBadge}> (Anónimo)</Text>
                      )}
                    </Text>
                  </View>
                  <Text style={styles.reviewDate}>
                    {review.date ? formatDate(review.date) : 'Fecha no disponible'}
                  </Text>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
                <Text style={styles.reviewRating}>
                  {'⭐'.repeat(review.rating)} ({review.rating}/5)
                </Text>
                {review.local && (
                  <Text style={styles.localBadge}>Guardado localmente</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noReviews}>Aún no hay reseñas. ¡Sé el primero en comentar!</Text>
          )}

          {/* Agregar nueva reseña */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Deja tu reseña</Text>
          
          {/* Selector de identidad MEJORADO */}
          <View style={styles.identitySelector}>
            <Text style={styles.identityLabel}>Comentar como:</Text>
            <View style={styles.identityButtons}>
              <TouchableOpacity 
                style={[
                  styles.identityButton, 
                  !isAnonymous && styles.identityButtonActive
                ]}
                onPress={switchToRegistered}
              >
                <Text style={[
                  styles.identityButtonText,
                  !isAnonymous && styles.identityButtonTextActive
                ]}>
                  Mi Usuario
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.identityButton, 
                  isAnonymous && styles.identityButtonActive
                ]}
                onPress={switchToAnonymous}
              >
                <Text style={[
                  styles.identityButtonText,
                  isAnonymous && styles.identityButtonTextActive
                ]}>
                  Anónimo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MOSTRAR EL NOMBRE REAL DEL USUARIO */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.currentUser}>
              {isAnonymous 
                ? `Comentando como: ${currentUser} (Anónimo)`
                : `Comentando como: ${currentUser}`
              }
            </Text>
            {!isAnonymous && registeredUserName && (
              <Text style={styles.userNameReal}>
                👤 {registeredUserName}
              </Text>
            )}
          </View>

          {/* Estrellas seleccionables para nueva reseña */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                style={[styles.star, { color: star <= newRating ? '#facc15' : '#d1d5db' }]}
                onPress={() => setNewRating(star)}
              >
                ★
              </Text>
            ))}
            <Text style={styles.selectedRating}>({newRating}/5)</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity 
            style={[
              styles.button, 
              (newComment.trim() === '' || newRating === 0) && styles.buttonDisabled
            ]} 
            onPress={handleAddReview}
            disabled={newComment.trim() === '' || newRating === 0}
          >
            <Text style={styles.buttonText}>Enviar reseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para nombre anónimo personalizado */}
      <Modal
        visible={showUserModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelAnonymousMode}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comentar como Anónimo</Text>
            <Text style={styles.modalSubtitle}>
              Elige un nombre para mostrar en tu reseña anónima (opcional):
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Usuario123, Cliente Satisfecho, etc."
              value={tempUserName}
              onChangeText={setTempUserName}
              maxLength={30}
            />
            
            <Text style={styles.modalHint}>
              Si dejas este campo vacío, se mostrará como "Usuario Anónimo"
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelAnonymousMode}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmAnonymousMode}
              >
                <Text style={styles.modalButtonTextConfirm}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 20, alignItems: 'center' },
  headerCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  specialty: { fontSize: 18, color: '#6b7280', marginBottom: 6 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  star: { fontSize: 26, marginHorizontal: 2 },
  ratingText: { fontSize: 16, color: '#374151', marginLeft: 8 },
  selectedRating: { fontSize: 14, color: '#374151', marginLeft: 8 },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  
  // Nuevos estilos para mostrar el nombre del usuario
  userInfoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  currentUser: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  userNameReal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  
  // ... (otros estilos se mantienen igual)
  identitySelector: {
    marginBottom: 15,
  },
  identityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  identityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  identityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  identityButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  identityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  identityButtonTextActive: {
    color: '#fff',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 10,
  },
  modalHint: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalButtonConfirm: {
    backgroundColor: '#2563eb',
  },
  modalButtonTextCancel: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextConfirm: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Estilos existentes para reviews
  reviewCard: { 
    marginBottom: 15, 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUserContainer: {
    flex: 1,
  },
  reviewName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  reviewDate: { fontSize: 12, color: '#9ca3af' },
  reviewText: { fontSize: 14, color: '#4b5563', marginBottom: 5, lineHeight: 20 },
  reviewRating: { fontSize: 14, color: '#facc15' },
  anonymousBadge: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  localBadge: {
    fontSize: 10,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  noReviews: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ExpertProfileScreen;