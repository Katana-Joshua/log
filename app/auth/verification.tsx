import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';

export default function VerificationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle2 size={80} color={Colors.success[500]} />
        </View>
        
        <Text style={styles.title}>Registration Successful</Text>
        
        <Text style={styles.description}>
          Your account has been created successfully. You can now sign in with your credentials.
        </Text>
        
        <Button
          title="Go to Login"
          variant="primary"
          size="lg"
          fullWidth
          style={styles.button}
          onPress={() => router.replace('/auth/login')}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need help?</Text>
        <TouchableOpacity>
          <Text style={styles.contactLink}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: Colors.background.light,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 16,
    color: Colors.neutral[600],
  },
  contactLink: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
    marginLeft: spacing.xs,
  },
});