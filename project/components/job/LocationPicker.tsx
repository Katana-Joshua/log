import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { MapPin, Navigation } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';
import { Location as LocationType } from '@/types';

interface LocationPickerProps {
  onLocationSelected: (location: LocationType) => void;
  initialLocation?: LocationType;
  title?: string;
  buttonText?: string;
}

export default function LocationPicker({
  onLocationSelected,
  initialLocation,
  title = 'Select Location',
  buttonText = 'Confirm Location',
}: LocationPickerProps) {
  const [mapRegion, setMapRegion] = useState({
    latitude: initialLocation?.latitude || 0.347596,
    longitude: initialLocation?.longitude || 32.582520,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    initialLocation || null
  );
  
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      
      if (!initialLocation) {
        try {
          setLoading(true);
          // Get current location
          const location = await Location.getCurrentPositionAsync({});
          setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          
          setSelectedLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          // Reverse geocode to get address
          const addressResponse = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          if (addressResponse.length > 0) {
            const addressData = addressResponse[0];
            const formattedAddress = `${addressData.street || ''} ${addressData.name || ''}, ${addressData.city || ''}, ${addressData.region || ''}, ${addressData.country || ''}`;
            setAddress(formattedAddress);
          }
          
        } catch (error) {
          console.error('Error getting location:', error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [initialLocation]);
  
  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    
    try {
      setLoading(true);
      // Reverse geocode to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
      
      if (addressResponse.length > 0) {
        const addressData = addressResponse[0];
        const formattedAddress = `${addressData.street || ''} ${addressData.name || ''}, ${addressData.city || ''}, ${addressData.region || ''}, ${addressData.country || ''}`;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelected({
        ...selectedLocation,
        address,
      });
    }
  };
  
  const handleGoToCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // Reverse geocode to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (addressResponse.length > 0) {
        const addressData = addressResponse[0];
        const formattedAddress = `${addressData.street || ''} ${addressData.name || ''}, ${addressData.city || ''}, ${addressData.region || ''}, ${addressData.country || ''}`;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            pinColor={Colors.primary[600]}
          />
        )}
      </MapView>
      
      <View style={styles.currentLocationButton}>
        <Button
          icon={<Navigation size={20} color="white" />}
          title=""
          variant="primary"
          size="sm"
          onPress={handleGoToCurrentLocation}
        />
      </View>
      
      <View style={styles.addressContainer}>
        <Input
          leftIcon={<MapPin size={20} color={Colors.neutral[500]} />}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          fullWidth
        />
      </View>
      
      <Button
        title={buttonText}
        variant="primary"
        fullWidth
        onPress={handleConfirmLocation}
        disabled={!selectedLocation}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: Colors.neutral[800],
  },
  map: {
    width: Dimensions.get('window').width - spacing.md * 2,
    height: 300,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  currentLocationButton: {
    position: 'absolute',
    top: 60,
    right: 30,
    zIndex: 100,
  },
  addressContainer: {
    marginBottom: spacing.md,
  },
});