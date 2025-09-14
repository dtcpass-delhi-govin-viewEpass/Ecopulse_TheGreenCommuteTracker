import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Leaf, User, Mail, Calendar, Briefcase } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export default function AuthScreen() {
  const { register, isRegistering } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '' as Gender | '',
    profession: '',
  });
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleRegister = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!isAnonymous && !formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email or choose anonymous login');
      return;
    }

    const userData = {
      name: formData.name.trim(),
      email: isAnonymous ? undefined : formData.email.trim(),
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender || undefined,
      profession: formData.profession.trim() || undefined,
      isAnonymous,
    };

    register(userData);
    router.replace('/(tabs)');
  };

  const handleAnonymousLogin = () => {
    setIsAnonymous(true);
    setFormData(prev => ({ ...prev, email: '', age: '', gender: '', profession: '' }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Leaf size={48} color="white" />
            <Text style={styles.title}>EcoPulse</Text>
            <Text style={styles.subtitle}>Smart Green Commute Tracker</Text>
          </View>
        </LinearGradient>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isAnonymous ? 'Quick Anonymous Start' : 'Create Your Profile'}
          </Text>

          <View style={styles.inputGroup}>
            <User size={20} color={Colors.light.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholderTextColor={Colors.light.muted}
            />
          </View>

          {!isAnonymous && (
            <>
              <View style={styles.inputGroup}>
                <Mail size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address *"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.muted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Calendar size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Age (optional)"
                  value={formData.age}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.light.muted}
                />
              </View>

              <View style={styles.inputGroup}>
                <User size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Gender (optional)</Text>
                  <View style={styles.genderOptions}>
                    {(['male', 'female', 'other', 'prefer-not-to-say'] as const).map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.genderOption,
                          formData.gender === option && styles.genderOptionSelected
                        ]}
                        onPress={() => setFormData(prev => ({ ...prev, gender: option }))}
                      >
                        <Text style={[
                          styles.genderOptionText,
                          formData.gender === option && styles.genderOptionTextSelected
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Briefcase size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Profession (optional)"
                  value={formData.profession}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, profession: text }))}
                  placeholderTextColor={Colors.light.muted}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleRegister}
            disabled={isRegistering}
          >
            <Text style={styles.buttonText}>
              {isRegistering ? 'Creating Profile...' : 'Get Started'}
            </Text>
          </TouchableOpacity>

          {!isAnonymous && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleAnonymousLogin}
            >
              <Text style={styles.secondaryButtonText}>Continue Anonymously</Text>
            </TouchableOpacity>
          )}

          {isAnonymous && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                setIsAnonymous(false);
                setFormData({
                  name: formData.name,
                  email: '',
                  age: '',
                  gender: '',
                  profession: '',
                });
              }}
            >
              <Text style={styles.secondaryButtonText}>Create Full Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 16,
  },
  pickerContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  pickerLabel: {
    fontSize: 16,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  genderOptionSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  genderOptionText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  genderOptionTextSelected: {
    color: 'white',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
