import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarDays,
  Video,
  Clock,
  MapPin,
  CalendarClock
} from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import ScheduleInterviewModal from '../../components/Manager_component/ScheduleInterviewModal';
import { scheduledInterviews } from '../../data/jobonnStaticData';

const SCHEDULED_INTERVIEWS = scheduledInterviews;

const TABS = [
  { label: 'Today', active: true },
  { label: 'Upcoming', active: false },
  { label: 'Completed', active: false },
];

const ManagerInterviewsScreen = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [interviews, setInterviews] = useState(SCHEDULED_INTERVIEWS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFDFD" />


      <MainManagerHeader title='Scheduled Interviews' subtitle='Organize and attend your interviews on time' />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>




        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab.label)}
              >
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Interview Cards */}
        {interviews.filter(interview => {
          if (activeTab === 'Completed') return interview.status === 'Completed';
          if (activeTab === 'Upcoming') return interview.status !== 'Completed';
          return interview.status !== 'Completed';
        }).map((interview, index) => (
          <RAnimated.View
            key={interview.id}
            entering={FadeInDown.duration(400).delay(index * 100)}
            style={[styles.card, { borderLeftColor: Colors.primary }]}
          >
            {/* Card Header */}
            <View style={styles.cardHeaderRow}>
              <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.avatarText, { color: Colors.primary }]}>
                  {interview.candidateName.charAt(0)}
                </Text>
              </View>
              <View style={styles.cardHeaderInfo}>
                <View style={styles.nameStatusRow}>
                  <Text style={styles.candidateName}>{interview.candidateName}</Text>
                  <View style={styles.statusPill}>
                    <View style={[styles.statusDot, { backgroundColor: Colors.primary }]} />
                    <Text style={[styles.statusText, { color: Colors.primary }]}>{interview.status}</Text>
                  </View>
                </View>
                <Text style={styles.candidateRole}>{interview.role}</Text>
              </View>
              <TouchableOpacity
                style={styles.rescheduleBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedInterviewId(interview.id);
                  setModalVisible(true);
                }}
              >
                <CalendarClock size={RFValue(10.5)} color={Colors.textSecondary} strokeWidth={2.5} />
                <Text style={styles.rescheduleTxt}>Reschedule</Text>
              </TouchableOpacity>
            </View>

            {/* Details Box */}
            <View style={[styles.detailsBox, { backgroundColor: Colors.primaryLight + '50' }]}>
              {/* Date */}
              <View style={styles.detailCol}>
                <CalendarDays size={RFValue(10.5)} color={Colors.textPrimary} strokeWidth={2} style={{ marginTop: hp('0.2%') }} />
                <View>
                  <Text style={styles.detailMain}>{interview.date}</Text>
                  <Text style={styles.detailSub}>{interview.day}</Text>
                </View>
              </View>

              <View style={styles.dividerVertical} />

              {/* Time */}
              <View style={styles.detailCol}>
                <Clock size={RFValue(10.5)} color={Colors.textPrimary} strokeWidth={2} style={{ marginTop: hp('0.2%') }} />
                <View>
                  <Text style={styles.detailMain}>{interview.time}</Text>
                  <Text style={styles.detailSub}>{interview.duration}</Text>
                </View>
              </View>

              <View style={styles.dividerVertical} />

              {/* Location */}
              <View style={styles.detailCol}>
                {interview.type === 'Video Call' ? (
                  <Video size={RFValue(10.5)} color={Colors.textPrimary} strokeWidth={2} style={{ marginTop: hp('0.2%') }} />
                ) : (
                  <MapPin size={RFValue(10.5)} color={Colors.textPrimary} strokeWidth={2} style={{ marginTop: hp('0.2%') }} />
                )}
                <View>
                  <Text style={styles.detailMain}>{interview.platform}</Text>
                  <Text style={styles.detailSub}>{interview.mode}</Text>
                </View>
              </View>
            </View>

          </RAnimated.View>
        ))}

        {/* Bottom Alert Box */}
        {/* <RAnimated.View entering={FadeInDown.duration(400).delay(400)} style={styles.alertBox}>
          <View style={styles.alertLeft}>
            <View style={styles.alertIconBg}>
              <Bell size={RFValue(11)} color={Colors.primary} strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.alertTitle}>Stay Ready, Stay Ahead!</Text>
              <Text style={styles.alertDesc}>Your next interview is in <Text style={{ fontWeight: '800', color: Colors.primary }}>1 day</Text> at <Text style={{ fontWeight: '800', color: Colors.primary }}>10:30 AM</Text></Text>
            </View>
          </View>

        </RAnimated.View> */}

        <View style={{ height: hp('8%') }} />
      </ScrollView>

      {/* Reschedule Modal */}
      <ScheduleInterviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(date, time, mode) => {
          setInterviews(prev =>
            prev.map(item => {
              if (item.id === selectedInterviewId) {
                return {
                  ...item,
                  date,
                  time,
                  mode: mode === 'Online' ? 'Online' : 'On-site',
                  type: mode === 'Online' ? 'Video Call' : 'In-Person',
                  platform: mode === 'Online' ? 'Google Meet' : 'Office Room A',
                };
              }
              return item;
            })
          );
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1.5%'),
    backgroundColor: '#FDFDFD',
  },

  content: { paddingHorizontal: wp('2%'), paddingTop: hp('1%') },

  tabsScroll: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
  },
  tabChip: {
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginRight: wp('2%'),
    backgroundColor: Colors.white,
  },
  tabChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabChipText: {
    fontSize: RFValue(8.5),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabChipTextActive: {
    color: Colors.white,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('1.5%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderLeftWidth: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('1%'),
  },
  avatar: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('30%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: RFValue(13), fontWeight: '800' },
  cardHeaderInfo: { flex: 1, justifyContent: 'center' },
  nameStatusRow: { flexDirection: 'row', alignItems: 'center', gap: wp('2%'), marginBottom: hp('0.2%') },
  candidateName: { fontSize: RFValue(11.5), fontWeight: '800', color: Colors.textPrimary },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  statusDot: { width: wp('1.2%'), height: wp('1.2%'), borderRadius: wp('0.6%') },
  statusText: { fontSize: RFValue(7.5), fontWeight: '800' },
  candidateRole: { fontSize: RFValue(8.8), color: Colors.textSecondary, fontWeight: '500' },

  detailsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginBottom: hp('1.5%'),
  },
  detailCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp('1.5%'),
  },
  detailMain: {
    fontSize: RFValue(8.2),
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: hp('0.1%'),
  },
  detailSub: {
    fontSize: RFValue(7.2),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginHorizontal: wp('2%'),
  },

  actionsRow: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  rescheduleBtn: {
    flexDirection: 'row',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: hp('0.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1.5%'),
    borderRadius: wp('1.5%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: Colors.white,
  },
  rescheduleTxt: { fontSize: RFValue(9), color: Colors.textSecondary, fontWeight: '700' },
  startBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2.5%'),
    gap: wp('1.5%'),
  },
  startTxt: { fontSize: RFValue(9), color: Colors.white, fontWeight: '800' },

  alertBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  alertLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    zIndex: 2,
  },
  alertIconBg: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: hp('0.2%'),
  },
  alertDesc: {
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  alertRight: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('1.5%'),
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  viewCalTxt: {
    fontSize: RFValue(8),
    fontWeight: '800',
    color: '#7C3AED',
  },
  alertBgGraphic: {
    position: 'absolute',
    right: -wp('8%'),
    bottom: -hp('3%'),
    opacity: 0.4,
    zIndex: 1,
    transform: [{ rotate: '15deg' }]
  }
});

export default ManagerInterviewsScreen;
