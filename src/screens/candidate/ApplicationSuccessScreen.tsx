import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import AppBackground from '../../components/layout/AppBackground';
import CustomButton from '../../components/buttons/CustomButton';
import Animated, { FadeInDown, BounceIn } from 'react-native-reanimated';

const ApplicationSuccessScreen = ({ navigation }: any) => {
  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={styles.content}>
          <Animated.View entering={BounceIn.duration(1000)} style={styles.iconContainer}>
            <CheckCircle2 color={Colors.success} size={wp('25%')} strokeWidth={1.5} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(800)} style={styles.textContainer}>
            <Text style={styles.title}>Application Submitted!</Text>
            <Text style={styles.subtitle}>
              Your application for <Text style={styles.highlight}>Senior React Native Developer</Text> at <Text style={styles.highlight}>TechCorp Solutions</Text> has been successfully submitted.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.statusCard}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Pending Review</Text>
            </View>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(1000).duration(800)} style={styles.footer}>
          <CustomButton
            title="Track Application"
            onPress={() => {
              navigation.replace('CandidateHome');
            }}
          />
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.replace('CandidateHome')}
          >
            <Text style={styles.browseText}>Continue Browsing</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: hp('4%'),
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp('3%'),
    paddingHorizontal: wp('5%'),
  },
  highlight: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statusCard: {
    backgroundColor: Colors.white,
    padding: wp('5%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    opacity: 0.8
  },
  statusLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: hp('1%'),
  },
  statusBadge: {
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
  },
  statusBadgeText: {
    ...Typography.bodySmall,
    color: Colors.warning,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: hp('2%'),
  },
  browseBtn: {
    marginTop: hp('2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
  },
  browseText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default ApplicationSuccessScreen;
