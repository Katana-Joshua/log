import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JobStatus } from '@/types';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Layout';

interface JobStatusStepperProps {
  status: JobStatus;
  direction?: 'horizontal' | 'vertical';
}

export default function JobStatusStepper({ 
  status, 
  direction = 'vertical' 
}: JobStatusStepperProps) {
  const steps: JobStatus[] = [
    'pending',
    'accepted',
    'picked_up',
    'in_transit',
    'delivered',
    'completed'
  ];

  const getStepName = (status: JobStatus): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'picked_up': return 'Picked Up';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'completed': return 'Completed';
      default: return '';
    }
  };

  const currentStepIndex = steps.indexOf(status);

  // Skip the stepper if the job is cancelled or draft
  if (status === 'cancelled' || status === 'draft') {
    return (
      <View style={styles.cancelledContainer}>
        <Text style={[styles.statusText, { color: Colors.jobStatus[status] }]}>
          {status === 'cancelled' ? 'Job Cancelled' : 'Job Draft'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      direction === 'horizontal' ? styles.horizontalContainer : {}
    ]}>
      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isActive = index === currentStepIndex;
        
        return (
          <View 
            key={step}
            style={[
              styles.stepContainer,
              direction === 'horizontal' ? styles.horizontalStepContainer : {}
            ]}
          >
            <View style={styles.stepHeader}>
              <View 
                style={[
                  styles.stepIndicator,
                  isCompleted ? styles.completedIndicator : styles.pendingIndicator,
                  isActive ? styles.activeIndicator : {}
                ]}
              >
                {isCompleted && (
                  <View style={styles.completedDot} />
                )}
              </View>
              
              {index < steps.length - 1 && (
                <View 
                  style={[
                    direction === 'vertical' ? styles.verticalLine : styles.horizontalLine,
                    isCompleted ? styles.completedLine : styles.pendingLine
                  ]}
                />
              )}
            </View>
            
            <View style={styles.stepContent}>
              <Text 
                style={[
                  styles.stepTitle,
                  isActive ? styles.activeTitle : isCompleted ? styles.completedTitle : {}
                ]}
              >
                {getStepName(step)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    width: '100%',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  horizontalStepContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    zIndex: 1,
  },
  activeIndicator: {
    borderWidth: 3,
    borderColor: Colors.primary[600],
  },
  completedIndicator: {
    backgroundColor: Colors.primary[600],
  },
  pendingIndicator: {
    backgroundColor: Colors.neutral[200],
  },
  completedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.background.light,
  },
  verticalLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    width: 2,
    height: 40,
  },
  horizontalLine: {
    position: 'absolute',
    left: 24,
    top: 11,
    height: 2,
    width: '100%',
  },
  completedLine: {
    backgroundColor: Colors.primary[600],
  },
  pendingLine: {
    backgroundColor: Colors.neutral[200],
  },
  stepContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  activeTitle: {
    fontWeight: '600',
    color: Colors.primary[600],
  },
  completedTitle: {
    color: Colors.neutral[800],
  },
  cancelledContainer: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
});