import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface AvatarProps {
  source?: { uri: string } | null;
  size?: number;
  initials?: string;
  style?: ViewStyle;
  backgroundColor?: string;
}

export default function Avatar({ 
  source, 
  size = 40, 
  initials,
  style,
  backgroundColor,
}: AvatarProps) {
  // Generate a consistent background color based on initials if not provided
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    
    if (!initials) return Colors.primary[500];
    
    // Simple hash function to generate a color from initials
    const charCodeSum = initials
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    const colorOptions = [
      Colors.primary[500],
      Colors.primary[600],
      Colors.primary[700],
      Colors.success[500],
      Colors.success[600],
      Colors.warning[500],
      Colors.warning[600],
    ];
    
    return colorOptions[charCodeSum % colorOptions.length];
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
    >
      {source?.uri ? (
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      ) : (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize: size * 0.4,
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initialsText: {
    color: Colors.background.light,
    fontWeight: '600',
  },
});