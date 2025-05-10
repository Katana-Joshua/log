import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import AuthForm from '@/components/auth/AuthForm';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';
import { UserRole } from '@/types';

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    company?: string;
    role: UserRole;
  }) => {
    // Validate form data
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phone) {
      setError('Please fill all required fields.');
      return;
    }

    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      role: data.role,
      isVerified: false,
    };

    const { error } = await signUp(data.email, data.password, userData);
    
    if (error) {
      setError('Registration failed. Please try again with a different email.');
    } else {
      // Navigate to verification screen or login
      router.replace('/auth/verification');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.logo}>LogisticsPro</Text>
            <Text style={styles.subtitle}>
              Create an account to get started
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.description}>
              Fill in your details to create a new account
            </Text>

            <AuthForm
              type="register"
              onSubmit={handleRegister}
              loading={isLoading}
              error={error || undefined}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary[600],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.neutral[600],
  },
  formContainer: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 16,
    color: Colors.neutral[600],
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
    marginLeft: spacing.xs,
  },
});