import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Check, Clock, MapPin, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import { COMMUTE_MODES, DISTANCE_RANGES, FREQUENCY_OPTIONS, calculateCO2Savings } from '@/constants/commute';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function LogCommuteScreen() {
  const { user, addCommuteLog, isAddingLog } = useApp();
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState('');
  const [commuteTime, setCommuteTime] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');

  const toggleMode = (modeId: string) => {
    setSelectedModes(prev => 
      prev.includes(modeId) 
        ? prev.filter(id => id !== modeId)
        : [...prev, modeId]
    );
  };

  const handleSubmit = () => {
    if (!user) {
      Alert.alert('Error', 'Please register first');
      router.push('/auth');
      return;
    }

    if (selectedModes.length === 0) {
      Alert.alert('Error', 'Please select at least one commute mode');
      return;
    }

    if (!selectedDistance) {
      Alert.alert('Error', 'Please select your commute distance');
      return;
    }

    if (!commuteTime.trim()) {
      Alert.alert('Error', 'Please enter your commute time');
      return;
    }

    if (!selectedFrequency) {
      Alert.alert('Error', 'Please select how often you commute');
      return;
    }

    const time = parseInt(commuteTime);
    if (isNaN(time) || time <= 0) {
      Alert.alert('Error', 'Please enter a valid commute time in minutes');
      return;
    }

    const co2Saved = calculateCO2Savings(selectedModes, selectedDistance, selectedFrequency);

    const logData = {
      modes: selectedModes,
      distanceRange: selectedDistance,
      commuteTime: time,
      frequency: selectedFrequency,
      co2Saved,
      date: new Date().toISOString().split('T')[0],
    };

    addCommuteLog(logData);

    Alert.alert(
      'Great Job!',
      `You saved ${co2Saved.toFixed(1)} kg of CO₂! Keep up the green commuting!`,
      [
        {
          text: 'View Impact',
          onPress: () => router.push('/(tabs)/dashboard'),
        },
        {
          text: 'Log Another',
          onPress: () => {
            setSelectedModes([]);
            setSelectedDistance('');
            setCommuteTime('');
            setSelectedFrequency('');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.authPrompt}
        >
          <Text style={styles.authTitle}>Join EcoPulse</Text>
          <Text style={styles.authSubtitle}>
            Register to start logging your green commute
          </Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.authButtonText}>Get Started</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MapPin size={20} color={Colors.light.primary} /> Commute Mode
        </Text>
        <Text style={styles.sectionSubtitle}>Select all modes you used (you can pick multiple)</Text>
        
        <View style={styles.modesGrid}>
          {COMMUTE_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                selectedModes.includes(mode.id) && styles.modeCardSelected,
              ]}
              onPress={() => toggleMode(mode.id)}
            >
              {selectedModes.includes(mode.id) && (
                <View style={styles.checkmark}>
                  <Check size={16} color={Colors.light.card} />
                </View>
              )}
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text
                style={[
                  styles.modeLabel,
                  selectedModes.includes(mode.id) && styles.modeLabelSelected,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MapPin size={20} color={Colors.light.primary} /> Distance Range
        </Text>
        <Text style={styles.sectionSubtitle}>How far is your one-way commute?</Text>
        
        <View style={styles.optionsGrid}>
          {DISTANCE_RANGES.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.optionCard,
                selectedDistance === range.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedDistance(range.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedDistance === range.id && styles.optionTextSelected,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Clock size={20} color={Colors.light.primary} /> Commute Time
        </Text>
        <Text style={styles.sectionSubtitle}>How long does your one-way trip take?</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter time in minutes"
            value={commuteTime}
            onChangeText={setCommuteTime}
            keyboardType="numeric"
            placeholderTextColor={Colors.light.muted}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Calendar size={20} color={Colors.light.primary} /> Frequency
        </Text>
        <Text style={styles.sectionSubtitle}>How often do you make this commute?</Text>
        
        <View style={styles.optionsGrid}>
          {FREQUENCY_OPTIONS.map((freq) => (
            <TouchableOpacity
              key={freq.id}
              style={[
                styles.optionCard,
                selectedFrequency === freq.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedFrequency(freq.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedFrequency === freq.id && styles.optionTextSelected,
                ]}
              >
                {freq.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.submitSection}>
        <TouchableOpacity
          style={[styles.submitButton, isAddingLog && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isAddingLog}
        >
          <Text style={styles.submitButtonText}>
            {isAddingLog ? 'Calculating Impact...' : 'Log My Commute'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.light.card,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: Colors.light.card,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: Colors.light.card,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  authButtonText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 16,
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modeCard: {
    width: (width - 60) / 2,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  modeCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.light.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
  },
  modeLabelSelected: {
    color: Colors.light.card,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  optionCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.light.card,
  },
  inputContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  submitSection: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});
