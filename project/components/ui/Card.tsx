import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Text,
  TextStyle,
} from 'react-native';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export default function Card({
  children,
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  footer,
  footerStyle,
  variant = 'elevated',
}: CardProps) {
  return (
    <View style={[styles.container, styles[variant], style]}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        </View>
      )}
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
      
      {footer && (
        <View style={[styles.footer, footerStyle]}>
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.light,
    marginVertical: spacing.sm,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  filled: {
    backgroundColor: Colors.neutral[100],
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  content: {
    padding: spacing.md,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
  },
});