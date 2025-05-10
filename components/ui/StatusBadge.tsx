import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { JobStatus } from '@/types';

interface StatusBadgeProps {
  status: JobStatus;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ 
  status, 
  style, 
  textStyle,
  size = 'md',
}: StatusBadgeProps) {
  const getStatusInfo = (status: JobStatus) => {
    switch (status) {
      case 'draft':
        return { color: Colors.jobStatus.draft, text: 'Draft' };
      case 'pending':
        return { color: Colors.jobStatus.pending, text: 'Pending' };
      case 'accepted':
        return { color: Colors.jobStatus.accepted, text: 'Accepted' };
      case 'picked_up':
        return { color: Colors.jobStatus.picked_up, text: 'Picked Up' };
      case 'in_transit':
        return { color: Colors.jobStatus.in_transit, text: 'In Transit' };
      case 'delivered':
        return { color: Colors.jobStatus.delivered, text: 'Delivered' };
      case 'completed':
        return { color: Colors.jobStatus.completed, text: 'Completed' };
      case 'cancelled':
        return { color: Colors.jobStatus.cancelled, text: 'Cancelled' };
      default:
        return { color: Colors.neutral[400], text: 'Unknown' };
    }
  };

  const { color, text } = getStatusInfo(status);

  return (
    <View 
      style={[
        styles.badge,
        styles[size],
        { backgroundColor: `${color}20` },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text 
        style={[
          styles.text, 
          styles[`${size}Text`],
          { color },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '500',
  },
  // Size variants
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  lg: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 16,
  },
});