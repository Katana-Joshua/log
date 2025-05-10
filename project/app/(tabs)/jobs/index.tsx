import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobStore } from '@/stores/jobStore';
import { Plus, Filter } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import JobCard from '@/components/job/JobCard';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';
import { Job, JobStatus } from '@/types';

export default function JobsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { jobs, fetchJobs, isLoading } = useJobStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  useEffect(() => {
    filterJobs(activeFilter);
  }, [jobs, activeFilter]);

  const loadJobs = async () => {
    if (user) {
      await fetchJobs(user.id, user.role);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const filterJobs = (filterStatus: JobStatus | 'all') => {
    if (filterStatus === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.status === filterStatus));
    }
  };

  const navigateToCreateJob = () => {
    router.push('/jobs/create');
  };

  const renderFilterButton = (title: string, status: JobStatus | 'all') => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === status && styles.activeFilterButton,
      ]}
      onPress={() => setActiveFilter(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          activeFilter === status && styles.activeFilterButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const isClient = user?.role === 'client';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Jobs</Text>
        {isClient && (
          <Button
            title="New Job"
            icon={<Plus size={20} color={Colors.background.light} />}
            size="sm"
            onPress={navigateToCreateJob}
          />
        )}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {renderFilterButton('All', 'all')}
          {isClient ? (
            <>
              {renderFilterButton('Draft', 'draft')}
              {renderFilterButton('Pending', 'pending')}
            </>
          ) : (
            renderFilterButton('Available', 'pending')
          )}
          {renderFilterButton('Active', 'accepted')}
          {renderFilterButton('In Transit', 'in_transit')}
          {renderFilterButton('Completed', 'completed')}
        </ScrollView>
      </View>

      {isLoading ? (
        <LoadingIndicator message="Loading jobs..." />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard job={item} userRole={user?.role || 'client'} />
          )}
          contentContainerStyle={styles.jobsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary[600]]}
              tintColor={Colors.primary[600]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isClient
                  ? `No ${activeFilter === 'all' ? '' : activeFilter} jobs found. Create one now!`
                  : `No ${activeFilter === 'all' ? '' : activeFilter} jobs available right now.`}
              </Text>
              {isClient && (
                <Button
                  title="Create Job"
                  variant="primary"
                  onPress={navigateToCreateJob}
                  style={styles.emptyButton}
                />
              )}
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  filtersScroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 100,
    marginRight: spacing.sm,
    backgroundColor: Colors.neutral[100],
  },
  activeFilterButton: {
    backgroundColor: Colors.primary[600],
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  activeFilterButtonText: {
    color: Colors.background.light,
  },
  jobsList: {
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    minWidth: 150,
  },
});