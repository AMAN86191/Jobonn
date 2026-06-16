import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { XCircle, CheckCircle2 } from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import { Colors } from '../../theme/Colors';
import CustomInput from '../inputs/CustomInput';

export interface AwardData {
  title: string;
  description: string;
  date: string;
}

interface AddAwardModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (award: AwardData) => void;
  initialData?: AwardData | null;
}

const AddAwardModal: React.FC<AddAwardModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateString, setDateString] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (isVisible) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setDateString(initialData.date);
      } else {
        setTitle('');
        setDescription('');
        setDateString('');
      }
    }
  }, [isVisible, initialData]);

  const handleSave = () => {
    if (!title.trim() || !dateString.trim()) {
      // Basic validation
      return;
    }
    onSave({ title, description, date: dateString });
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialData ? 'Edit Award' : 'Add Award'}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <XCircle size={RFValue(15)} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
            <CustomInput
              label="Award Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Best Startup 2023"
            />

            <TouchableOpacity onPress={() => setIsDatePickerOpen(true)} activeOpacity={0.8}>
              <View pointerEvents="none">
                <CustomInput
                  label="Date / Year"
                  value={dateString}
                  placeholder="Select Date"
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <DatePicker
              modal
              open={isDatePickerOpen}
              date={dateString && !isNaN(new Date(dateString).getTime()) ? new Date(dateString) : new Date()}
              mode="date"
              onConfirm={(selectedDate) => {
                setIsDatePickerOpen(false);
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const formattedDate = `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
                setDateString(formattedDate);
              }}
              onCancel={() => {
                setIsDatePickerOpen(false);
              }}
            />

            <CustomInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of the award..."
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleSave} activeOpacity={0.8}>
              <CheckCircle2 color={Colors.white} size={wp('4%')} />
              <Text style={styles.confirmBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 35, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    width: '100%',
    padding: wp('4%'),
    maxHeight: hp('80%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: hp('1.1%'),
  },
  modalTitle: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalScroll: {
    paddingBottom: hp('1%'),
paddingHorizontal:wp('0.6%')
  },
  modalFooter: {
    flexDirection: 'row',
    gap: wp('3%'),
    marginTop: hp('1%'),
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: RFValue(11),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    gap: wp('1.5%'),
  },
  confirmBtnText: {
    fontSize: RFValue(11),
    color: Colors.white,
    fontWeight: '700',
  },
});

export default AddAwardModal;
