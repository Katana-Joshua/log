import React from 'react';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function JobsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background.light,
        },
        headerTintColor: Colors.neutral[800],
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Jobs',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Job',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Job Details',
        }}
      />
    </Stack>
  );
}