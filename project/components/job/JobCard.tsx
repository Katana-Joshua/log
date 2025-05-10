import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CalendarClock, Truck, BanknoteIcon } from 'lucide-react-native';
import { Job } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Card from '@/components/ui/Card';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  userRole?: 'client' | 'transporter';
}

export default function JobCard({ job, showActions = true, userRole = 'client' }: JobCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleViewDetails = () => {
    router.push(`/(tabs)/jobs/${job.id}`);
  };

  const renderFooter = () => {
    if (!showActions) return null;

    return (
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={handleViewDetails}
      >
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Card
      variant="elevated"
      style={styles.card}
      footer={renderFooter()}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.jobId}>Job #{job.id.slice(0, 8)}</Text>
          <Text style={styles.createdAt}>{formatDate(job.createdAt)}</Text>
        </View>
        <StatusBadge status={job.status} />
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <MapPin size={20} color={Colors.primary[600]} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {job.pickupLocation.address || 'Location address'}
            </Text>
          </View>
        </View>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>
        
        <View style={styles.locationRow}>
          <MapPin size={20} color={Colors.error[500]} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Dropoff</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {job.dropoffLocation.address || 'Location address'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <BanknoteIcon size={16} color={Colors.success[600]} />
          <Text style={styles.infoText}>{job.price.toLocaleString()} UGX</Text>
        </View>
        
        {job.distance && (
          <View style={styles.infoItem}>
            <Truck size={16} color={Colors.neutral[600]} />
            <Text style={styles.infoText}>{job.distance} km</Text>
          </View>
        )}
        
        {job.startTime && (
          <View style={styles.infoItem}>
            <CalendarClock size={16} color={Colors.warning[500]} />
            <Text style={styles.infoText}>{formatDate(job.startTime)}</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  jobId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  createdAt: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  locationContainer: {
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  locationTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  locationAddress: {
    fontSize: 16,
    color: Colors.neutral[800],
  },
  dividerContainer: {
    paddingLeft: 10,
    marginVertical: 2,
  },
  divider: {
    height: 20,
    width: 1,
    backgroundColor: Colors.neutral[300],
    marginLeft: 9,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.neutral[700],
  },
  viewDetailsButton: {
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: Colors.primary[600],
    fontSize: 16,
    fontWeight: '500',
  },
});