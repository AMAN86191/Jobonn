import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getAllScheduledInterviews } from '../../api/CompanyHomeProvider';
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
import { useDispatch } from 'react-redux';
import { updateHiringProcessSlice } from '../../redux/CompanyHomeSlice';
import Toast from 'react-native-toast-message';



const TABS = [
  { label: 'Today', active: true },
  { label: 'Upcoming', active: false },

];

const parseDateString = (dateStr: string) => {
  try {
    const months = {
      january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
      july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
    } as any;
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1].toLowerCase()] || '01';
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    console.log('Error parsing date string:', e);
  }
  return dateStr;
};

const parseTimeString = (timeStr: string) => {
  try {
    const cleanStr = timeStr.trim();
    const hasAmPm = cleanStr.toLowerCase().includes('am') || cleanStr.toLowerCase().includes('pm');
    if (hasAmPm) {
      const isPm = cleanStr.toLowerCase().includes('pm');
      const timePart = cleanStr.replace(/(am|pm)/i, '').trim();
      let [hours, minutes] = timePart.split(':');
      let hoursNum = parseInt(hours);
      if (isPm && hoursNum < 12) {
        hoursNum += 12;
      }
      if (!isPm && hoursNum === 12) {
        hoursNum = 0;
      }
      return `${String(hoursNum).padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    } else {
      const parts = cleanStr.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
      }
    }
  } catch (e) {
    console.log('Error parsing time string:', e);
  }
  return timeStr;
};

const getInterviewCategory = (dateStr: string, status: string) => {
  if (!dateStr) return 'Upcoming';
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

    if (dateStr === todayStr) {
      return 'Today';
    }

    const interviewDate = new Date(dateStr);
    const todayDate = new Date(todayStr);

    if (interviewDate < todayDate) {
      return 'Completed';
    } else {
      return 'Upcoming';
    }
  } catch (e) {
    return 'Upcoming';
  }
};

const ManagerInterviewsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Today');
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      console.log('Fetching all scheduled interviews...');
      const response = await getAllScheduledInterviews();
      console.log('All Scheduled Interviews API Response:', response);
      if (response && response.status && Array.isArray(response.data)) {
        const mapped = response.data.map((item: any) => {
          const cand = item.user?.candidate || {};
          const userObj = item.user || {};
          const jobObj = item.job || {};
          const jobTitle = jobObj.job_title?.job_name || 'React Js Developer';

          let formattedDate = item.interview_date || '';
          let dayOfWeek = '';
          if (item.interview_date) {
            try {
              const d = new Date(item.interview_date);
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              dayOfWeek = days[d.getDay()];
            } catch (e) { }
          }

          let formattedTime = item.interview_time || '';
          if (item.interview_time) {
            try {
              const parts = item.interview_time.split(':');
              if (parts.length >= 2) {
                let hours = parseInt(parts[0]);
                const minutes = parts[1];
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
              }
            } catch (e) { }
          }

          return {
            id: String(item.id),
            candidate_id: cand.id,
            candidateName: userObj.name || 'Candidate',
            role: cand.designation || jobTitle,
            date: formattedDate,
            rawDate: item.interview_date,
            day: dayOfWeek || 'Today',
            time: formattedTime,
            rawTime: item.interview_time,
            type: item.interview_type === 'online' ? 'Video Call' : 'In-Person',
            rawType: item.interview_type || 'online',
            platform: item.interview_type === 'online' ? 'Interview Type' : 'Interview Type',
            mode: item.interview_type === 'online' ? 'Online' : 'On-site',
            status: getInterviewCategory(item.interview_date, item.status),
            rawStatus: item.status,
            applicant: {
              id: item.id,
              candidate_id: cand.id,
              status: item.status,
              user: userObj,
              job: jobObj,
              rawApplication: item,
            }
          };
        });
        setInterviews(mapped);
      }
    } catch (error) {
      console.log('Error fetching scheduled interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchInterviews();
    });
    return unsubscribe;
  }, [navigation]);

  const handleRescheduleConfirm = async (date: string, time: string, mode: string) => {
    if (!selectedInterviewId) return;
    const interviewObj = interviews.find(i => i.id === selectedInterviewId);
    if (!interviewObj) return;

    const candidateId = interviewObj.candidate_id;
    const applicationId = interviewObj.id;

    const payload = {
      status: 'interview_schedule',
      interview_type: mode.toLowerCase(),
      interview_date: parseDateString(date),
      interview_time: parseTimeString(time),
    };

    try {
      setUpdating(true);
      console.log('Rescheduling interview via API:', { candidateId, applicationId, payload });
      const response = await dispatch(updateHiringProcessSlice({ candidateId, applicationId, payload }) as any).unwrap();
      console.log('Reschedule response:', response);

      if (response && (response.status === true || response.status_code === 200 || response.status_code === '200')) {
        Toast.show({
          type: 'success',
          text1: 'Interview Rescheduled',
          text2: 'The interview has been successfully rescheduled.',
        });
        setModalVisible(false);
        fetchInterviews();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Reschedule Failed',
          text2: response?.message || 'Failed to reschedule interview',
        });
      }
    } catch (e: any) {
      console.log('Error rescheduling interview:', e);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e?.message || 'Something went wrong',
      });
    } finally {
      setUpdating(false);
    }
  };

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
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: hp('5%') }} />
        ) : interviews.filter(interview => interview.status === activeTab).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No interviews scheduled for {activeTab.toLowerCase()}</Text>
          </View>
        ) : (
          interviews.filter(interview => interview.status === activeTab).map((interview, index) => (
            <TouchableOpacity
              key={interview.id}
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate('CandidateApplicationFullView', { applicant: interview.applicant });
              }}
            >
              <RAnimated.View
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
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: hp('8%') }} />
      </ScrollView>

      {/* Reschedule Modal */}
      <ScheduleInterviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleRescheduleConfirm}
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
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('8%'),
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: hp('2%'),
    marginHorizontal: wp('2%'),
    elevation: 1,
  },
  emptyStateText: {
    fontSize: RFValue(11),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});

export default ManagerInterviewsScreen;
