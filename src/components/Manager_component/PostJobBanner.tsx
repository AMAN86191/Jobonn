import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Plus, Zap, Gauge, Award, Pencil } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

interface PostJobBannerProps {
  onPress?: () => void;
}

const PostJobBanner: React.FC<PostJobBannerProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={onPress}>
      {/* Abstract Design Waves & Glow in Background */}
      <View style={styles.glowCircle} />
      <View style={styles.waveCircle1} />
      <View style={styles.waveCircle2} />

      {/* Coded Illustration on the Right */}
      <View style={styles.illustrationContainer}>

        <Image
          source={require('../../../assets/images/manager_banner.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

      </View>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Top/Main Section */}
        <View style={styles.topSection}>
          <View style={styles.tagRow}>
            <Zap color="#FBBF24" size={RFValue(9)} fill="#FBBF24" />
            <Text style={styles.tagText}>Smart Hiring</Text>
          </View>
          <Text style={styles.title}>Hire faster with{"\n"}smart matching</Text>
          <Text style={styles.subtitle}>Post a job — get top candidates in 24h</Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Features Row */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Pencil color="#A78BFA" size={RFValue(10)} />
              </View>
              <Text style={styles.featureText}>Easy Job{'\n'}Posting</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Gauge color="#A78BFA" size={RFValue(10)} />
              </View>
              <Text style={styles.featureText}>Faster{"\n"}Shortlisting</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Award color="#A78BFA" size={RFValue(10)} />
              </View>
              <Text style={styles.featureText}>Quality{"\n"}Hires</Text>
            </View>
          </View>

          {/* Coded Post Job Button */}
          <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
            <Plus color={Colors.white} size={RFValue(10)} strokeWidth={3} />
            <Text style={styles.btnText}>Post Job</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1B4B', // Deep dark violet/purple background matching the image
    borderRadius: wp('4%'),
    padding: wp('4%'),
    overflow: 'hidden',
    marginBottom: hp('1.5%'),
    minHeight: hp('20%'),
    position: 'relative',
    width: wp('96%'),
    alignSelf: 'center',
  },
  glowCircle: {
    position: 'absolute',
    right: wp('10%'),
    top: -wp('5%'),
    width: wp('45%'),
    height: wp('45%'),
    borderRadius: wp('22.5%'),
    backgroundColor: '#7C3AED',
    opacity: 0.15,
    zIndex: 1,
  },
  waveCircle1: {
    position: 'absolute',
    width: wp('55%'),
    height: wp('55%'),
    borderRadius: wp('27.5%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    top: -wp('10%'),
    right: -wp('10%'),
    zIndex: 1,
  },
  waveCircle2: {
    position: 'absolute',
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('20%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
    bottom: -wp('10%'),
    right: -wp('5%'),
    zIndex: 1,
  },
  illustrationContainer: {
    position: 'absolute',
    right: wp('1%'),
    top: hp('2.5%'),
    width: wp('35%'),
    height: hp('12%'),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  illustration: {
    width: wp('47%'),
    height: wp('47%'),
    resizeMode: 'contain',
  },
  magnifyingGlass: {
    position: 'absolute',
    left: -wp('4%'),
    bottom: -wp('2%'),
    width: wp('11%'),
    height: wp('11%'),
  },
  glassCircle: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4338CA', // Indigo border color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  glassHandle: {
    position: 'absolute',
    width: wp('1.8%'),
    height: wp('4.5%'),
    backgroundColor: '#4338CA',
    borderRadius: wp('0.9%'),
    bottom: 0,
    right: 0,
    transform: [{ rotate: '-45deg' }],
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 3, // Above background elements
  },
  topSection: {
    maxWidth: wp('58%'),
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    marginBottom: hp('0.5%'),
  },
  tagText: {
    fontSize: RFValue(8.5),
    color: '#FBBF24', // Amber/gold color
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: RFValue(13.5),
    fontWeight: '800',
    color: Colors.white,
    lineHeight: hp('2.5%'),
    marginBottom: hp('0.3%'),
  },
  subtitle: {
    fontSize: RFValue(8.5),
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: hp('1.5%'),
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.2%'),
    maxWidth: wp('60%'),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  featureIconContainer: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    borderRadius: wp('2.75%'),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  featureText: {
    fontSize: RFValue(6.8),
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    lineHeight: hp('1.1%'),
  },
  divider: {
    width: 1,
    height: hp('2.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED', // Vibrant purple button
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
    gap: wp('1.5%'),
  },
  btnText: {
    color: Colors.white,
    fontSize: RFValue(9.5),
    fontWeight: '700',
  },
});

export default PostJobBanner;
