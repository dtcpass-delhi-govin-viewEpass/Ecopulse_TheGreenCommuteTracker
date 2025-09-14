import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Leaf, Heart, Users, Target, Mail, ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function AboutScreen() {
  const { user, logout } = useApp();

  const handleEmailPress = () => {
    Linking.openURL('mailto:hello@ecopulse.app?subject=EcoPulse Feedback');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://ecopulse.app');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        style={styles.header}
      >
        <Leaf size={60} color={Colors.light.card} />
        <Text style={styles.headerTitle}>EcoPulse</Text>
        <Text style={styles.headerSubtitle}>Smart Green Commute Tracker</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={24} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.sectionText}>
            EcoPulse empowers individuals to make a positive environmental impact through sustainable commuting choices. 
            We believe that small daily actions can create significant change when multiplied across communities.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={24} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Why Green Commuting Matters</Text>
          </View>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🌍</Text>
              <Text style={styles.benefitText}>Reduces carbon emissions and air pollution</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>💪</Text>
              <Text style={styles.benefitText}>Improves personal health and fitness</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>💰</Text>
              <Text style={styles.benefitText}>Saves money on fuel and parking</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🚗</Text>
              <Text style={styles.benefitText}>Reduces traffic congestion</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🧘</Text>
              <Text style={styles.benefitText}>Reduces stress and improves mental health</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Tips for Sustainable Travel</Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>1</Text>
              <Text style={styles.tipText}>
                <Text style={styles.tipTitle}>Walk or Bike:</Text> For short distances under 5km, 
                walking or cycling is often faster and always greener.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>2</Text>
              <Text style={styles.tipText}>
                <Text style={styles.tipTitle}>Public Transport:</Text> Buses and trains can carry 
                many people efficiently, reducing per-person emissions.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>3</Text>
              <Text style={styles.tipText}>
                <Text style={styles.tipTitle}>Carpool:</Text> Share rides with colleagues or 
                neighbors to split emissions and costs.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>4</Text>
              <Text style={styles.tipText}>
                <Text style={styles.tipTitle}>Electric Vehicles:</Text> If you must drive, 
                consider switching to an electric or hybrid vehicle.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>5</Text>
              <Text style={styles.tipText}>
                <Text style={styles.tipTitle}>Combine Trips:</Text> Plan your route to combine 
                multiple errands in one journey.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Leaf size={24} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>How We Calculate CO₂ Savings</Text>
          </View>
          <Text style={styles.sectionText}>
            Our calculations are based on average emission factors from transportation studies:
          </Text>
          <View style={styles.emissionsList}>
            <Text style={styles.emissionItem}>🚗 Car (Petrol): 171g CO₂/km</Text>
            <Text style={styles.emissionItem}>🚌 Public Bus: 89g CO₂/km</Text>
            <Text style={styles.emissionItem}>🚊 Metro/Train: 41g CO₂/km</Text>
            <Text style={styles.emissionItem}>⚡ Electric Vehicle: 53g CO₂/km</Text>
            <Text style={styles.emissionItem}>🚶 Walking/Biking: 0g CO₂/km</Text>
          </View>
          <Text style={styles.sectionText}>
            We compare your chosen transport method against the average car to calculate your CO₂ savings.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
            <Mail size={20} color={Colors.light.primary} />
            <Text style={styles.contactButtonText}>Send Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={handleWebsitePress}>
            <ExternalLink size={20} color={Colors.light.primary} />
            <Text style={styles.contactButtonText}>Visit Website</Text>
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.userSection}>
            <Text style={styles.userTitle}>Account</Text>
            <View style={styles.userInfo}>
              <Text style={styles.userInfoText}>Logged in as: {user.name}</Text>
              {user.email && <Text style={styles.userInfoText}>Email: {user.email}</Text>}
              <Text style={styles.userInfoText}>
                Account Type: {user.isAnonymous ? 'Anonymous' : 'Registered'}
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with 💚 for a greener planet
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.light.card,
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.card,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginLeft: 12,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 32,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  tipsList: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.light.card,
    backgroundColor: Colors.light.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  tipTitle: {
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
  },
  emissionsList: {
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    gap: 8,
  },
  emissionItem: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'monospace',
  },
  contactSection: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
  },
  contactButtonText: {
    fontSize: 16,
    color: Colors.light.primary,
    marginLeft: 8,
    fontWeight: '600' as const,
  },
  userSection: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  userInfo: {
    marginBottom: 16,
    gap: 4,
  },
  userInfoText: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  logoutButton: {
    backgroundColor: Colors.light.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: Colors.light.muted,
  },
});
