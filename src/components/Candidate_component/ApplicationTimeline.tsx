import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Check, Clock, Eye, Star, XCircle } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'selected' | 'rejected';

interface TimelineStepProps {
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
  icon: React.ReactNode;
  isLast?: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ title, subtitle, status, icon, isLast }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconColumn}>
        <View style={[
          styles.iconBox,
          status === 'completed' && styles.iconBoxCompleted,
          status === 'current' && styles.iconBoxCurrent,
          status === 'upcoming' && styles.iconBoxUpcoming,
          status === 'error' && styles.iconBoxError,
        ]}>
          {icon}
        </View>
        {!isLast && (
          <View style={[
            styles.line,
            status === 'completed' && styles.lineCompleted,
            status === 'error' && styles.lineError,
          ]} />
        )}
      </View>
      <View style={styles.contentColumn}>
        <Text style={[
          styles.stepTitle,
          status === 'upcoming' && styles.textUpcoming,
          status === 'error' && styles.textError,
        ]}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

interface ApplicationTimelineProps {
  currentStatus: ApplicationStatus;
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ currentStatus }) => {

  const getStatusState = (stepIndex: number, currentStepIndex: number, isRejected: boolean) => {
    if (isRejected && stepIndex === currentStepIndex) return 'error';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const statusMap = ['pending', 'reviewed', 'shortlisted', 'selected'];
  const currentIndex = currentStatus === 'rejected' ? 3 : statusMap.indexOf(currentStatus);
  const isRejected = currentStatus === 'rejected';

  const iconSize = wp('4%');

  const steps = [
    {
      title: 'Application Submitted',
      subtitle: 'Your application has been received and is pending review.',
      icon: getStatusState(0, currentIndex, false) === 'completed'
        ? <Check color={Colors.white} size={iconSize} />
        : <Clock color={Colors.primary} size={iconSize} />
    },
    {
      title: 'Application Reviewed',
      subtitle: 'The hiring team has reviewed your application.',
      icon: getStatusState(1, currentIndex, false) === 'completed'
        ? <Check color={Colors.white} size={iconSize} />
        : <Eye color={getStatusState(1, currentIndex, false) === 'current' ? Colors.white : Colors.textSecondary} size={iconSize} />
    },
    {
      title: 'Shortlisted',
      subtitle: 'You have been shortlisted for the next round.',
      icon: getStatusState(2, currentIndex, false) === 'completed'
        ? <Check color={Colors.white} size={iconSize} />
        : <Star color={getStatusState(2, currentIndex, false) === 'current' ? Colors.white : Colors.textSecondary} size={iconSize} />
    },
    {
      title: isRejected ? 'Application Rejected' : 'Selected',
      subtitle: isRejected ? 'Unfortunately, the company decided not to move forward.' : 'Congratulations! You have been selected for the role.',
      icon: isRejected
        ? <XCircle color={Colors.white} size={iconSize} />
        : <Check color={getStatusState(3, currentIndex, isRejected) === 'completed' || getStatusState(3, currentIndex, isRejected) === 'current' ? Colors.white : Colors.textSecondary} size={iconSize} />
    }
  ];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <TimelineStep
          key={index}
          title={step.title}
          subtitle={step.subtitle}
          status={getStatusState(index, currentIndex, isRejected)}
          icon={step.icon}
          isLast={index === steps.length - 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp('2%'),
  },
  stepContainer: {
    flexDirection: 'row',
  },
  iconColumn: {
    alignItems: 'center',
    width: wp('10%'),
    marginRight: wp('3%'),
  },
  iconBox: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconBoxCompleted: {
    backgroundColor: Colors.success,
  },
  iconBoxCurrent: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBoxUpcoming: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBoxError: {
    backgroundColor: Colors.danger,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: -hp('0.5%'),
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: Colors.success,
  },
  lineError: {
    backgroundColor: Colors.danger,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: hp('4%'),
  },
  stepTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.5%'),
  },
  stepSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: hp('2.2%'),
  },
  textUpcoming: {
    color: Colors.textSecondary,
  },
  textError: {
    color: Colors.danger,
  },
});

export default ApplicationTimeline;
