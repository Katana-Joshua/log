import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Eye, EyeOff } from 'lucide-react-native';
import { spacing } from '@/constants/Layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  fullWidth?: boolean;
  isPassword?: boolean;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  fullWidth = false,
  isPassword = false,
  ...props
}: InputProps) {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        (leftIcon || rightIcon || isPassword) && styles.inputWithIcon,
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={Colors.neutral[400]}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        
        {isPassword ? (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            onPress={toggleSecureEntry}
            accessibilityLabel={secureTextEntry ? "Show password" : "Hide password"}
          >
            {secureTextEntry ? (
              <Eye size={20} color={Colors.neutral[500]} />
            ) : (
              <EyeOff size={20} color={Colors.neutral[500]} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : null}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.xs,
    color: Colors.neutral[700],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    backgroundColor: Colors.background.light,
  },
  inputWithIcon: {
    paddingRight: 0,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: Colors.neutral[800],
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIconContainer: {
    paddingLeft: spacing.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: spacing.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: Colors.error[500],
  },
  errorText: {
    color: Colors.error[500],
    fontSize: 14,
    marginTop: spacing.xs,
  },
});