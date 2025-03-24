import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'Login@signup.com',
    position: 'UI Designer',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Logging in with:', { 
        email: formData.email, 
        password: formData.password 
      });
      // Add your login logic here
      navigation.navigate('Recording'); // Redirect after login
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log('Registering with:', formData);
      // Add your registration logic here
      navigation.navigate('Recording'); // Redirect after registration
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" />
      <Navigation navigation={navigation} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.helloText}>Hello,</Text>
            
            {isLogin ? (
              <Text style={styles.welcomeText}>Welcome back! Please login to continue.</Text>
            ) : (
              <>
                <Text style={styles.welcomeText}>Hello designer, welcome to the registration page.</Text>
                <Text style={styles.subWelcomeText}>Please fill out the form to get more complete features.</Text>
                <Text style={styles.loginPrompt}>Please click login below if you already have an account!</Text>
              </>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.toggleButton, isLogin && styles.activeToggleButton]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleButtonText, isLogin && styles.activeToggleButtonText]}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, !isLogin && styles.activeToggleButton]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleButtonText, !isLogin && styles.activeToggleButtonText]}>SIGN UP</Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.nameInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                  />
                </View>
                <View style={[styles.inputContainer, styles.nameInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {!isLogin && (
              <View style={styles.positionRow}>
                <TouchableOpacity
                  style={[
                    styles.positionButton, 
                    formData.position === 'UI Designer' && styles.selectedPositionButton
                  ]}
                  onPress={() => handleChange('position', 'UI Designer')}
                >
                  <Text style={[
                    styles.positionButtonText, 
                    formData.position === 'UI Designer' && styles.selectedPositionButtonText
                  ]}>
                    UI Designer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.positionButton, 
                    formData.position === 'UX Designer' && styles.selectedPositionButton
                  ]}
                  onPress={() => handleChange('position', 'UX Designer')}
                >
                  <Text style={[
                    styles.positionButtonText, 
                    formData.position === 'UX Designer' && styles.selectedPositionButtonText
                  ]}>
                    UX Designer
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={isLogin ? "Password" : "Enter Password"}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Retype Password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                  secureTextEntry
                />
              </View>
            )}

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'LOGIN' : 'REGISTER'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  helloText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  subWelcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  loginPrompt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  toggleButton: {
    paddingBottom: 12,
    marginRight: 24,
  },
  activeToggleButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  activeToggleButtonText: {
    color: '#000',
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  positionRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  positionButton: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  selectedPositionButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  positionButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedPositionButtonText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthScreen;