import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Leaf, Users, TrendingUp, Award, Plus, BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, communityStats, commuteLogs } = useApp();

  const userTotalCO2 = commuteLogs
    .filter(log => log.userId === user?.id)
    .reduce((sum, log) => sum + log.co2Saved, 0);

  const userLogsThisWeek = commuteLogs
    .filter(log => {
      const logDate = new Date(log.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return log.userId === user?.id && logDate > weekAgo;
    })
    .reduce((sum, log) => sum + log.co2Saved, 0);

  if (!user) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Leaf size={60} color={Colors.light.card} />
            <Text style={styles.heroTitle}>Welcome to EcoPulse</Text>
            <Text style={styles.heroSubtitle}>
              Track your green commute and help save the planet, one trip at a time
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Green Commuting?</Text>
          
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Leaf size={32} color={Colors.light.primary} />
              <Text style={styles.featureTitle}>Reduce CO₂</Text>
              <Text style={styles.featureText}>Lower your carbon footprint</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Users size={32} color={Colors.light.primary} />
              <Text style={styles.featureTitle}>Join Community</Text>
              <Text style={styles.featureText}>Connect with eco-warriors</Text>
            </View>
            
            <View style={styles.featureCard}>
              <TrendingUp size={32} color={Colors.light.primary} />
              <Text style={styles.featureTitle}>Track Progress</Text>
              <Text style={styles.featureText}>Monitor your impact</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Award size={32} color={Colors.light.primary} />
              <Text style={styles.featureTitle}>Earn Badges</Text>
              <Text style={styles.featureText}>Unlock achievements</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        style={styles.welcomeSection}
      >
        <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        <Text style={styles.welcomeSubtext}>Ready to make a green impact today?</Text>
      </LinearGradient>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Leaf size={24} color={Colors.light.primary} />
            <Text style={styles.statValue}>{userTotalCO2.toFixed(1)} kg</Text>
            <Text style={styles.statLabel}>Total CO₂ Saved</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color={Colors.light.primary} />
            <Text style={styles.statValue}>{userLogsThisWeek.toFixed(1)} kg</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
      </View>

      <View style={styles.communitySection}>
        <Text style={styles.sectionTitle}>Community Impact</Text>
        
        <View style={styles.communityCard}>
          <View style={styles.communityStats}>
            <View style={styles.communityStat}>
              <Users size={20} color={Colors.light.primary} />
              <Text style={styles.communityValue}>{communityStats?.totalUsers || 0}</Text>
              <Text style={styles.communityLabel}>Green Commuters</Text>
            </View>
            
            <View style={styles.communityStat}>
              <Leaf size={20} color={Colors.light.primary} />
              <Text style={styles.communityValue}>{(communityStats?.totalCO2Saved || 0).toFixed(1)} kg</Text>
              <Text style={styles.communityLabel}>CO₂ Saved</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.push('/(tabs)/log-commute')}
        >
          <Plus size={24} color={Colors.light.card} />
          <Text style={styles.primaryActionText}>Log Today&apos;s Commute</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryAction}
          onPress={() => router.push('/(tabs)/dashboard')}
        >
          <BarChart3 size={20} color={Colors.light.primary} />
          <Text style={styles.secondaryActionText}>View Full Impact</Text>
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
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.light.card,
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.light.card,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: Colors.light.card,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 24,
  },
  ctaButtonText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  welcomeSection: {
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.light.card,
    textAlign: 'center',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: Colors.light.card,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginTop: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  communitySection: {
    padding: 20,
  },
  communityCard: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  communityStat: {
    alignItems: 'center',
  },
  communityValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginTop: 8,
  },
  communityLabel: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  actionsSection: {
    padding: 20,
    paddingBottom: 40,
  },
  primaryAction: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryActionText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginLeft: 8,
  },
  secondaryAction: {
    backgroundColor: Colors.light.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryActionText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});
