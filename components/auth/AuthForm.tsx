import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Lock, Mail, Phone, Building2, UserCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';
import { UserRole } from '@/types';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  loading: boolean;
  error?: string;
}

export default function AuthForm({ type, onSubmit, loading, error }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('client');

  const handleSubmit = () => {
    if (type === 'login') {
      onSubmit({ email, password });
    } else {
      onSubmit({
        email,
        password,
        firstName,
        lastName,
        phone,
        company,
        role,
      });
    }
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Input
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        leftIcon={<Mail size={20} color={Colors.neutral[500]} />}
        fullWidth
      />

      <Input
        label="Password"
        placeholder={type === 'login' ? "Enter your password" : "Create a password"}
        secureTextEntry
        isPassword
        value={password}
        onChangeText={setPassword}
        leftIcon={<Lock size={20} color={Colors.neutral[500]} />}
        fullWidth
      />

      {type === 'register' && (
        <>
          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <Input
                label="First Name"
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                leftIcon={<User size={20} color={Colors.neutral[500]} />}
                fullWidth
              />
            </View>
            <View style={styles.halfColumn}>
              <Input
                label="Last Name"
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                leftIcon={<User size={20} color={Colors.neutral[500]} />}
                fullWidth
              />
            </View>
          </View>

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            leftIcon={<Phone size={20} color={Colors.neutral[500]} />}
            fullWidth
          />

          <Input
            label="Company (Optional)"
            placeholder="Enter your company name"
            value={company}
            onChangeText={setCompany}
            leftIcon={<Building2 size={20} color={Colors.neutral[500]} />}
            fullWidth
          />

          <Text style={styles.label}>I am a:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'client' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('client')}
            >
              <Building2 
                size={20} 
                color={role === 'client' ? Colors.primary[600] : Colors.neutral[500]} 
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'client' && styles.roleTextActive,
                ]}
              >
                Client (Shipper)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'transporter' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('transporter')}
            >
              <UserCircle 
                size={20} 
                color={role === 'transporter' ? Colors.primary[600] : Colors.neutral[500]} 
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'transporter' && styles.roleTextActive,
                ]}
              >
                Transporter (Driver)
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Button
        title={type === 'login' ? 'Sign In' : 'Create Account'}
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        style={styles.submitButton}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: Colors.error[50],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error[500],
  },
  errorText: {
    color: Colors.error[600],
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfColumn: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.xs,
    color: Colors.neutral[700],
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  roleButtonActive: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  roleText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    color: Colors.neutral[700],
  },
  roleTextActive: {
    color: Colors.primary[700],
    fontWeight: '500',
  },
  submitButton: {
    marginTop: spacing.md,
  },
});