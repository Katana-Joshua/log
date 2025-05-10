import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Colors from '@/constants/Colors';

export default function Index() {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator message="Loading..." />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
  },
});