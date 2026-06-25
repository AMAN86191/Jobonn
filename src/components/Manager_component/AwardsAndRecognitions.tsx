import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Award } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import RAnimated, { FadeInDown } from 'react-native-reanimated';

interface AwardsAndRecognitionsProps {
  awards: any[];
}

const AwardsAndRecognitions: React.FC<AwardsAndRecognitionsProps> = React.memo(({ awards }) => {
  console.log(awards);
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <RAnimated.View entering={FadeInDown.duration(400).delay(180)} style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <Award color="#F59E0B" size={RFValue(12)} />
          <Text style={styles.sectionCardTitle}>Awards & Recognitions</Text>
        </View>
      </View>

      <View style={styles.timelineContainer}>
        {awards.map((item, index) => (
          <View key={index} style={styles.timelineRow}>
            {/* Left side: Timeline Line & Dot */}
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, index === 0 ? styles.timelineDotActive : null]} />
              {index !== awards.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* Right side: Content */}
            <View style={styles.timelineContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.yearText}>{item.title || item.tittle}</Text>
                <Text style={styles.yearText}>{item.date}</Text>
              </View>
              <Text style={styles.descText}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </RAnimated.View>
  );
});

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('2%'),
    marginBottom: hp('1.2%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  sectionCardTitle: {
    fontSize: RFValue(11),
    fontWeight: '800',
    color: '#1F2937',
  },
  timelineContainer: {
    paddingLeft: wp('1%'),
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: wp('6%'),
    alignItems: 'center',
  },
  timelineDot: {
    width: wp('3.5%'),
    height: wp('3.5%'),
    borderRadius: wp('2%'),
    backgroundColor: '#D1D5DB', // default gray
    zIndex: 2,
    marginTop: hp('0.5%'),
  },
  timelineDotActive: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#D1D5DB',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: -hp('0.5%'),
    marginBottom: -hp('0.5%'),
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: wp('3%'),
    paddingBottom: hp('2.5%'),
  },
  yearText: {
    fontSize: RFValue(9),
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: hp('0.5%'),
  },
  descText: {
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    lineHeight: RFValue(12),
    fontWeight: '500',
    textAlign: "justify",
    width: wp('60%')
  },
});

export default AwardsAndRecognitions;
