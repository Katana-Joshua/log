import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import AuthForm from '@/components/auth/AuthForm';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: { email: string; password: string }) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.replace('/(tabs)/');
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
              The logistics platform for businesses and transporters
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.description}>
              Enter your credentials to access your account
            </Text>

            <AuthForm
              type="login"
              onSubmit={handleLogin}
              loading={isLoading}
              error={error || undefined}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Create an account</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.md,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: '500',
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
  registerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
    marginLeft: spacing.xs,
  },
});