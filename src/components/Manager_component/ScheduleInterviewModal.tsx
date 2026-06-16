import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Calendar, Clock, XCircle } from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import { Colors } from '../../theme/Colors';

interface ScheduleInterviewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (scheduledDate: string, scheduledTime: string, mode: string) => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMode, setInterviewMode] = useState('Online');

  const handleConfirm = () => {
    if (!interviewDate || !interviewTime) {
      Alert.alert('Required', 'Please pick a valid Date and Time.');
      return;
    }
    onConfirm(interviewDate, interviewTime, interviewMode);
    // Reset local inputs upon success
    setInterviewDate('');
    setInterviewTime('');
    setInterviewMode('Online');
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Interview</Text>
              <TouchableOpacity onPress={onClose}>
                <XCircle size={RFValue(16)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.modalLabel}>Interview Date</Text>
                  <TouchableOpacity
                    style={styles.pickerTrigger}
                    onPress={() => setOpenDatePicker(true)}
                  >
                    <Text style={[styles.pickerValue, !interviewDate && { color: Colors.textSecondary }]} numberOfLines={1}>
                      {interviewDate || 'Select Date'}
                    </Text>
                    <Calendar size={RFValue(11)} color={Colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.col}>
                  <Text style={styles.modalLabel}>Interview Time</Text>
                  <TouchableOpacity
                    style={styles.pickerTrigger}
                    onPress={() => setOpenTimePicker(true)}
                  >
                    <Text style={[styles.pickerValue, !interviewTime && { color: Colors.textSecondary }]} numberOfLines={1}>
                      {interviewTime || 'Select Time'}
                    </Text>
                    <Clock size={RFValue(11)} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.modalLabel, { marginTop: hp('2%') }]}>Interview Type</Text>
              <View style={styles.modeContainer}>
                {['Online', 'Onsite'].map(mode => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.modeBadge,
                      interviewMode === mode && styles.modeBadgeActive,
                    ]}
                    onPress={() => setInterviewMode(mode)}
                  >
                    <Text
                      style={[
                        styles.modeBadgeText,
                        interviewMode === mode && styles.modeBadgeTextActive,
                      ]}
                    >
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalInfoBox}>
                <Calendar size={RFValue(11)} color={Colors.primary} />
                <Text style={styles.modalInfoText}>Candidate will be notified once scheduled.</Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      <DatePicker
        modal
        mode="date"
        open={openDatePicker}
        date={date}
        onConfirm={selectedDate => {
          setOpenDatePicker(false);
          setDate(selectedDate);
          setInterviewDate(
            selectedDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          );
        }}
        onCancel={() => setOpenDatePicker(false)}
      />

      <DatePicker
        modal
        mode="time"
        open={openTimePicker}
        date={date}
        onConfirm={selectedTime => {
          setOpenTimePicker(false);
          setDate(selectedTime);
          setInterviewTime(
            selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          );
        }}
        onCancel={() => setOpenTimePicker(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 35, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    padding: wp('5%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: RFValue(13),
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalBody: {
    marginBottom: hp('2.5%'),
  },
  modalLabel: {
    fontSize: RFValue(9.2),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.8%'),
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1.2%'),
  },
  pickerValue: {
    fontSize: RFValue(9.2),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  modalInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    backgroundColor: Colors.primaryLight,
    padding: wp('3%'),
    borderRadius: 10,
    marginTop: hp('2%'),
  },
  modalInfoText: {
    fontSize: RFValue(8.2),
    color: Colors.primary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: hp('1.3%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelBtnText: {
    fontSize: RFValue(9.2),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: hp('1.3%'),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  confirmBtnText: {
    fontSize: RFValue(9.2),
    color: Colors.white,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: wp('3%'),
  },
  col: {
    flex: 1,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: wp('2%'),
  },
  modeBadge: {
    flex: 1,
    paddingVertical: hp('1%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadgeActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modeBadgeText: {
    fontSize: RFValue(8.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  modeBadgeTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
});

export default ScheduleInterviewModal;
