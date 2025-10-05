import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const safeSetItem = async (key, value) => {
    if (value === null || value === undefined) {
      console.warn(`⚠️ No se guardará ${key} porque es null/undefined`);
      await AsyncStorage.removeItem(key);
      return false;
    }
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error guardando ${key}:`, error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://10.0.2.2:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data !== 'object') {
        throw new Error("Respuesta del servidor inválida");
      }

      if (data.success) {
        const tokenSaved = await safeSetItem("token", data.token);
        
        let userSaved = false;
        if (data.user && typeof data.user === 'object') {
          userSaved = await safeSetItem("user", JSON.stringify(data.user));
        }

        if (tokenSaved) {
          Alert.alert("Éxito", "Inicio de sesión correcto");
          navigation.navigate("Home");
        } else {
          Alert.alert("Error", "No se pudo guardar la sesión. Intenta nuevamente.");
        }
      } else {
        Alert.alert("Error", data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      
      if (error.message.includes('Network request failed')) {
        Alert.alert("Error", "No se pudo conectar al servidor. Verifica tu conexión.");
      } else if (error.message.includes('HTTP')) {
        Alert.alert("Error", "Error del servidor. Intenta más tarde.");
      } else {
        Alert.alert("Error", "Error inesperado. Verifica la consola para más detalles.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800",
        }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.button, 
                styles.primaryButton,
                loading && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#2563eb" />
              ) : (
                <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.secondaryButton,
                loading && styles.buttonDisabled
              ]}
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert("Info", "Función de recuperación en desarrollo")
              }
              disabled={loading}
            >
              <Text style={[
                styles.linkText,
                loading && styles.linkTextDisabled
              ]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, justifyContent: "center" },
  backgroundImageStyle: { opacity: 0.8 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(37, 99, 235, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: { width: "100%", maxWidth: 320, alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "white", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, color: "white", marginBottom: 30, textAlign: "center" },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "white",
    marginBottom: 15,
  },
  button: { width: "100%", paddingVertical: 15, borderRadius: 25, alignItems: "center", marginTop: 10 },
  primaryButton: { backgroundColor: "white" },
  primaryButtonText: { color: "#2563eb", fontSize: 18, fontWeight: "bold" },
  secondaryButton: { borderWidth: 2, borderColor: "white", backgroundColor: "transparent" },
  secondaryButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  linkText: { color: "white", marginTop: 15, fontSize: 14, textDecorationLine: "underline" },
});

export default LoginScreen;