import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

const ProblemFormScreen = ({navigation, route}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(route?.params?.category?.title || '');
  const [urgency, setUrgency] = useState('media');

  const urgencyLevels = [
    {value: 'baja', label: 'Baja', color: '#10b981'},
    {value: 'media', label: 'Media', color: '#f59e0b'},
    {value: 'alta', label: 'Alta', color: '#ef4444'},
  ];

  const categories = [
    'Hardware',
    'Software',
    'Redes',
    'Programación',
    'Móviles',
    'Seguridad',
  ];

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !category) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const problemData = {
      title: title.trim(),
      description: description.trim(),
      category,
      urgency,
      createdAt: new Date().toISOString(),
    };

    // Aquí enviarías los datos a tu backend
    console.log('Problema reportado:', problemData);
    
    Alert.alert(
      'Problema Reportado',
      'Tu problema ha sido enviado. Te conectaremos con un experto pronto.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ExpertList'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Describe tu problema</Text>
          
          {/* Título del problema */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título del problema *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: Mi computadora no enciende"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Categoría */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategory(cat)}>
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === cat && styles.categoryChipTextSelected,
                      ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción detallada *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe tu problema con el mayor detalle posible. ¿Cuándo ocurre? ¿Qué intentaste hacer?"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* Nivel de urgencia */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nivel de urgencia</Text>
            <View style={styles.urgencyContainer}>
              {urgencyLevels.map(level => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.urgencyButton,
                    urgency === level.value && {
                      backgroundColor: level.color,
                      borderColor: level.color,
                    },
                  ]}
                  onPress={() => setUrgency(level.value)}>
                  <Text
                    style={[
                      styles.urgencyButtonText,
                      urgency === level.value && styles.urgencyButtonTextSelected,
                    ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Enviar Problema</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 120,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 5,
  },
  categoryChip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryChipTextSelected: {
    color: 'white',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  urgencyButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  urgencyButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  urgencyButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProblemFormScreen;