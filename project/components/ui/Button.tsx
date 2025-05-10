import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...props
}: ButtonProps) {
  // Determine styles based on variant and size
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const iconWrapperStyle = [
    styles.iconWrapper,
    iconPosition === 'left' ? { marginRight: spacing.sm } : { marginLeft: spacing.sm },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={
            variant === 'outline' || variant === 'ghost' 
              ? Colors.primary[600] 
              : Colors.background.light
          } 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontWeight: '600',
  },
  iconWrapper: {
    
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary[600],
  },
  primaryText: {
    color: Colors.background.light,
  },
  
  secondary: {
    backgroundColor: Colors.primary[100],
  },
  secondaryText: {
    color: Colors.primary[700],
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  outlineText: {
    color: Colors.primary[600],
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary[600],
  },
  
  danger: {
    backgroundColor: Colors.error[500],
  },
  dangerText: {
    color: Colors.background.light,
  },
  
  // Sizes
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  smText: {
    fontSize: 14,
  },
  
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  mdText: {
    fontSize: 16,
  },
  
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  lgText: {
    fontSize: 18,
  },
});