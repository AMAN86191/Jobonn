import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronDown } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface DropdownInputProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const DropdownInput: React.FC<DropdownInputProps> = ({ label, value, options, onSelect, error, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputWrapper, error ? styles.errorBorder : null]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value || placeholder || 'Select option'}
        </Text>
        <ChevronDown size={wp('4.5%')} color={Colors.textSecondary} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} activeOpacity={1}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item)}>
                  <Text style={[styles.optionText, value === item && styles.optionTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1.5%'),
    width: '100%',
  },
  label: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: hp('0.6%'),
  },
  inputWrapper: {
    height: hp('4.5%'),
    minHeight: 35,
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.05,
    shadowRadius: wp('1%'),
    elevation: 1,
  },
  valueText: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textSecondary,
  },
  errorBorder: {
    borderColor: Colors.danger,
    borderWidth: 1.5,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: hp('0.5%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    padding: wp('5%'),
    maxHeight: hp('50%'),
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionText: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default DropdownInput;
