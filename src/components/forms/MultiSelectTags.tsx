import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { X } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface MultiSelectTagsProps {
  label: string;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  error?: string;
  placeholder?: string;
  options?: string[];
}

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({ label, tags, onAddTag, onRemoveTag, error, placeholder, options }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAddTag(trimmed);
      setInputValue('');
    }
  };

  const toggleTag = (option: string) => {
    if (tags.includes(option)) {
      onRemoveTag(option);
    } else {
      onAddTag(option);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {options ? (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = tags.includes(option);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionChip, isSelected && styles.optionChipActive]}
                onPress={() => toggleTag(option)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={[styles.inputWrapper, error ? styles.errorBorder : null]}>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => onRemoveTag(tag)} style={styles.removeBtn}>
                  <X size={wp('3%')} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={() => handleAdd(inputValue)}
              placeholder={tags.length === 0 ? (placeholder || 'Type and press enter') : ''}
              placeholderTextColor={Colors.textSecondary}
              blurOnSubmit={false}
            />
          </View>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    minHeight: hp('5%'),
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.05,
    shadowRadius: wp('1%'),
    elevation: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    borderRadius: wp('1.5%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.4%'),
    marginRight: wp('1.5%'),
    marginBottom: hp('0.5%'),
  },
  tagText: {
    ...Typography.caption,
    color: Colors.primary,
    marginRight: wp('1%'),
  },
  removeBtn: {
    padding: wp('0.5%'),
  },
  input: {
    flex: 1,
    minWidth: wp('20%'),
    ...Typography.caption,
    color: Colors.textPrimary,
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('1%'),
    margin: 0,
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginTop: hp('0.5%'),
  },
  optionChip: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: Colors.white,
  },
});

export default MultiSelectTags;
