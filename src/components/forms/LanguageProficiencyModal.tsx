import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';
import { X, Check } from 'lucide-react-native';

const { height } = Dimensions.get('window');

const LANGUAGES_LIST = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Kannada', 'Marathi',
  'Malayalam', 'Gujarati', 'Punjabi', 'Odia', 'Assamese', 'Urdu', 'Konkani',
  'Bodo', 'Manipuri'
];

type Proficiency = 'Beginner' | 'Proficient' | 'Expert';
type ComfortSkill = 'Reading' | 'Writing' | 'Speaking';

export interface LanguageData {
  language: string;
  proficiency: Proficiency | '';
  comfortableIn: ComfortSkill[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: LanguageData) => void;
  existingLanguages?: string[];
  initialData?: LanguageData | null;
}

const LanguageProficiencyModal: React.FC<Props> = ({ visible, onClose, onSave, existingLanguages = [], initialData }) => {
  const [language, setLanguage] = useState<string>('');
  const [proficiency, setProficiency] = useState<Proficiency | ''>('');
  const [comfortableIn, setComfortableIn] = useState<ComfortSkill[]>([]);

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setLanguage(initialData.language);
        setProficiency(initialData.proficiency);
        setComfortableIn(initialData.comfortableIn);
      } else {
        setLanguage('');
        setProficiency('');
        setComfortableIn([]);
      }
      setShowLanguagePicker(false);
      setSearchQuery('');
    }
  }, [visible, initialData]);

  const toggleComfort = (skill: ComfortSkill) => {
    if (comfortableIn.includes(skill)) {
      setComfortableIn(comfortableIn.filter(s => s !== skill));
    } else {
      setComfortableIn([...comfortableIn, skill]);
    }
  };

  const isLanguageAlreadyAdded = language !== '' && existingLanguages.includes(language) && (!initialData || initialData.language !== language);
  const isValid = language !== '' && proficiency !== '' && comfortableIn.length > 0 && !isLanguageAlreadyAdded;

  const handleSave = () => {
    if (isValid) {
      onSave({ language, proficiency, comfortableIn });
      onClose();
    }
  };

  const filteredLanguages = LANGUAGES_LIST.filter(l => l.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.sheet}>
          {!showLanguagePicker ? (
            <View style={styles.content}>
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Language proficiency</Text>
                  <Text style={styles.subtitle}>Strengthen your resume by letting recruiters know you can communicate in multiple languages</Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.label, isLanguageAlreadyAdded && { color: Colors.danger }]}>Language*</Text>
                <TouchableOpacity style={[styles.inputWrapper, isLanguageAlreadyAdded && { borderBottomColor: Colors.danger }]} onPress={() => setShowLanguagePicker(true)}>
                  <Text style={[styles.inputText, !language && { color: Colors.textTertiary }]}>
                    {language || 'Select a language'}
                  </Text>
                </TouchableOpacity>
                {isLanguageAlreadyAdded && (
                  <Text style={styles.errorText}>This language is already added to your profile. Please select a different one.</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Proficiency*</Text>
                <View style={styles.pillsContainer}>
                  {(['Beginner', 'Proficient', 'Expert'] as Proficiency[]).map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[styles.pill, proficiency === level && styles.pillSelected]}
                      onPress={() => setProficiency(level)}
                    >
                      <Text style={[styles.pillText, proficiency === level && styles.pillTextSelected]}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>You are comfortable in*</Text>
                <View style={styles.pillsContainer}>
                  {(['Reading', 'Writing', 'Speaking'] as ComfortSkill[]).map(skill => {
                    const isSelected = comfortableIn.includes(skill);
                    return (
                      <TouchableOpacity
                        key={skill}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => toggleComfort(skill)}
                      >
                        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{skill} {isSelected ? '✓' : '+'}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]} disabled={!isValid} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowLanguagePicker(false)} style={styles.backBtn}>
                  <X color={Colors.textPrimary} size={RFValue(12)} />
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Select Language</Text>
              </View>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Language"
                  placeholderTextColor={Colors.textTertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <FlatList
                data={filteredLanguages}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingBottom: hp('5%') }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.languageOption}
                    onPress={() => {
                      setLanguage(item);
                      setShowLanguagePicker(false);
                    }}
                  >
                    <Text style={styles.languageOptionText}>{item}</Text>
                    {language === item && <Check color={Colors.primary} size={20} />}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    height: height * 0.8,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: wp('5%'),
  },
  header: {
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.4%'),
  },
  subtitle: {
    fontSize: RFValue(9.5),
    color: Colors.textSecondary,
    lineHeight: RFValue(16),
  },
  fieldContainer: {
    marginBottom: hp('3%'),
  },
  label: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
    // fontWeight: '600',
    marginBottom: hp('1%'),
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: hp('1%'),
  },
  inputText: {
    fontSize: RFValue(11),
    color: Colors.textPrimary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: RFValue(10),
    marginTop: hp('0.5%'),
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  pill: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  pillSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: RFValue(9),
    color: Colors.textPrimary,
  },
  pillTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: hp('2%'),
  },
  cancelBtn: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    marginRight: wp('2%'),
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontSize: RFValue(10),
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
  },
  saveBtnDisabled: {
    backgroundColor: Colors.border,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: RFValue(11),
    fontWeight: '600',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  backBtn: {
    marginRight: wp('3%'),
  },
  pickerTitle: {
    fontSize: RFValue(11),
    // fontWeight: '600',
    color: Colors.textPrimary,
  },
  searchContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: hp('1%'),
  },
  searchInput: {
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    paddingVertical: hp('1%'),
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  languageOptionText: {
    fontSize: RFValue(10),
    color: Colors.textPrimary,
  }
});

export default LanguageProficiencyModal;
