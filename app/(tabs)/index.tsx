import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobStore } from '@/stores/jobStore';
import { Plus, TrendingUp, Clock, Package } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JobCard from '@/components/job/JobCard';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';
import { Job } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { jobs, fetchJobs, isLoading } = useJobStore();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user) {
      fetchJobs(user.id, user.role);
    }
  }, [user]);

  useEffect(() => {
    // Take the 3 most recent jobs for the dashboard
    setRecentJobs(jobs.slice(0, 3));
  }, [jobs]);

  const isClient = user?.role === 'client';
  const isTransporter = user?.role === 'transporter';

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) => (
    <Card variant="elevated" style={styles.statCard}>
      <View style={styles.statContent}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        <View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </Card>
  );

  const navigateToCreateJob = () => {
    router.push('/jobs/create');
  };

  const navigateToFindJobs = () => {
    router.push('/jobs');
  };

  const navigateToAllJobs = () => {
    router.push('/jobs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>{user?.firstName || 'User'}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {isClient && (
            <>
              <StatCard
                title="Active Jobs"
                value={jobs.filter(job => ['pending', 'accepted', 'picked_up', 'in_transit'].includes(job.status)).length.toString()}
                icon={<Clock size={20} color={Colors.primary[600]} />}
                color={Colors.primary[500]}
              />
              <StatCard
                title="Completed"
                value={jobs.filter(job => job.status === 'completed').length.toString()}
                icon={<Package size={20} color={Colors.success[600]} />}
                color={Colors.success[500]}
              />
            </>
          )}

          {isTransporter && (
            <>
              <StatCard
                title="Available Jobs"
                value={jobs.filter(job => job.status === 'pending').length.toString()}
                icon={<Clock size={20} color={Colors.warning[600]} />}
                color={Colors.warning[500]}
              />
              <StatCard
                title="In Progress"
                value={jobs.filter(job => ['accepted', 'picked_up', 'in_transit'].includes(job.status)).length.toString()}
                icon={<TrendingUp size={20} color={Colors.primary[600]} />}
                color={Colors.primary[500]}
              />
            </>
          )}
        </View>

        <View style={styles.actionCard}>
          {isClient && (
            <>
              <Text style={styles.actionTitle}>Need to ship something?</Text>
              <Text style={styles.actionDescription}>
                Create a new job and get connected with transporters.
              </Text>
              <Button
                title="Create New Job"
                icon={<Plus size={20} color={Colors.background.light} />}
                variant="primary"
                onPress={navigateToCreateJob}
                style={styles.actionButton}
              />
            </>
          )}

          {isTransporter && (
            <>
              <Text style={styles.actionTitle}>Looking for work?</Text>
              <Text style={styles.actionDescription}>
                Browse available jobs and start earning.
              </Text>
              <Button
                title="Find Available Jobs"
                variant="primary"
                onPress={navigateToFindJobs}
                style={styles.actionButton}
              />
            </>
          )}
        </View>

        <View style={styles.recentJobsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Jobs</Text>
            <TouchableOpacity onPress={navigateToAllJobs}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <LoadingIndicator message="Loading jobs..." />
          ) : recentJobs.length > 0 ? (
            recentJobs.map(job => (
              <JobCard key={job.id} job={job} userRole={user?.role} />
            ))
          ) : (
            <Text style={styles.emptyText}>No jobs found. {isClient ? 'Create your first job!' : 'Start browsing for jobs!'}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: Colors.primary[600],
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 16,
    color: Colors.primary[100],
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.background.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  statCard: {
    width: '48%',
    padding: spacing.sm,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[800],
  },
  actionCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: spacing.xs,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: spacing.md,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  recentJobsContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    padding: spacing.lg,
    color: Colors.neutral[500],
  },
});