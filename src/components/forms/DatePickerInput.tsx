import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import { Calendar } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface DatePickerInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  placeholder?: string;
  mode?: 'date' | 'year' | 'datetime';
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({ label, value, onChange, error, placeholder, mode = 'date' }) => {
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    if (mode === 'date') {
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    }
    return date.getFullYear().toString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputWrapper, error ? styles.errorBorder : null]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value ? formatDate(value) : (placeholder || 'Select date')}
        </Text>
        <Calendar size={wp('4.5%')} color={Colors.textSecondary} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <DatePicker
        modal
        open={open}
        date={value || new Date()}
        mode={mode === 'year' ? 'date' : mode} // react-native-date-picker doesn't have 'year' mode, but we can filter it
        onConfirm={(date) => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        theme="dark"
        buttonColor={Colors.black}
      />
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
    height: hp('5%'),
    minHeight: 44,
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
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
});

export default DatePickerInput;
