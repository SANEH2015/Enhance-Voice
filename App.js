import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration (keep your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAAeMzxELk_y_KNdR7U8PDeUQALpkHcfJ8",
  authDomain: "voice-record-c0b0b.firebaseapp.com",
  projectId: "voice-record-c0b0b",
  storageBucket: "voice-record-c0b0b.firebasestorage.app",
  messagingSenderId: "926943973191",
  appId: "1:926943973191:web:0b56b2a6a06175921bc662",
  measurementId: "G-JMV996X1X4"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true); // Default to Login view
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('UI Designer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-navigate if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('RecordingScreen'); // Use 'replace' to prevent going back
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          firstName,
          lastName,
          email,
          position,
          createdAt: new Date()
        });
      }
      // Navigation handled by onAuthStateChanged
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return false;
    }
    if (!isLogin) {
      if (!firstName || !lastName || password !== confirmPassword) {
        Alert.alert('Error', 'Please fill all fields and ensure passwords match');
        return false;
      }
    }
    return true;
  };

  const handleAuthError = (error) => {
    let message = 'Authentication failed. Please try again.';
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email already in use.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password.';
        break;
    }
    Alert.alert('Error', message);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          
          {!isLogin && (
            <View style={styles.nameContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {!isLogin && (
            <View style={styles.positionContainer}>
              <TouchableOpacity
                style={[
                  styles.positionButton, 
                  position === 'UI Designer' && styles.positionButtonActive
                ]}
                onPress={() => setPosition('UI Designer')}
              >
                <Text style={styles.positionButtonText}>UI Designer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.positionButton, 
                  position === 'UX Designer' && styles.positionButtonActive
                ]}
                onPress={() => setPosition('UX Designer')}
              >
                <Text style={styles.positionButtonText}>UX Designer</Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  positionButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  positionButtonActive: {
    backgroundColor: '#000',
  },
  positionButtonText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default AuthScreen;