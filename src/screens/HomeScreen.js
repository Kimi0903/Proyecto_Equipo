import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const HomeScreen = ({navigation}) => {
  const problemCategories = [
    {
      id: 1,
      title: 'Hardware',
      description: 'Problemas con componentes físicos',
      icon: '💻',
      color: '#ef4444',
    },
    {
      id: 2,
      title: 'Software',
      description: 'Errores en aplicaciones y sistema',
      icon: '🔧',
      color: '#3b82f6',
    },
    {
      id: 3,
      title: 'Redes',
      description: 'Conectividad e internet',
      icon: '🌐',
      color: '#10b981',
    },
    {
      id: 4,
      title: 'Programación',
      description: 'Desarrollo y código',
      icon: '👨‍💻',
      color: '#8b5cf6',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Reportar Problema',
      subtitle: 'Describe tu issue técnico',
      action: () => navigation.navigate('ProblemForm'),
    },
    {
      id: 2,
      title: 'Ver Expertos',
      subtitle: 'Busca ayuda especializada',
      action: () => navigation.navigate('ExpertList'),
    },
    {
      id: 3,
      title: 'Mis Consultas',
      subtitle: 'Historial de soporte',
      action: () => navigation.navigate('ConsultaUser'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>
          <Text style={styles.subtitleText}>
            ¿En qué podemos ayudarte hoy?
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.action}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías de Problemas</Text>
          <View style={styles.categoriesGrid}>
            {problemCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {backgroundColor: category.color + '15'},
                ]}
                onPress={() => navigation.navigate('ProblemForm', {category})}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryTitle, {color: category.color}]}>
                  {category.title}
                </Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1,247</Text>
              <Text style={styles.statLabel}>Expertos Activos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Problemas Resueltos</Text>
            </View>
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
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen;