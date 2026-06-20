import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';
import { Plus } from 'lucide-react-native';

import CustomInput from '../inputs/CustomInput';
import DropdownInput from '../forms/DropdownInput';
import DatePickerInput from '../forms/DatePickerInput';
import MultiSelectTags from '../forms/MultiSelectTags';
import LanguageProficiencyModal from '../forms/LanguageProficiencyModal';
import UploadCard from '../forms/UploadCard';

// ProfileInfoForm
export const ProfileInfoForm = ({ editData, setEditData }: any) => (
  <>
    <CustomInput label="Full Name" value={editData.name} onChangeText={(text: string) => setEditData({ ...editData, name: text })} placeholder="Enter name" />
    <CustomInput label="Job Title" value={editData.job_title} onChangeText={(text: string) => setEditData({ ...editData, job_title: text })} placeholder="Enter job title" />
    <CustomInput label="Location" value={editData.current_location} onChangeText={(text: string) => setEditData({ ...editData, current_location: text })} placeholder="Enter location" />
    <CustomInput label="Email" value={editData.email} onChangeText={(text: string) => setEditData({ ...editData, email: text })} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
    <CustomInput label="Phone" value={editData.phone} onChangeText={(text: string) => setEditData({ ...editData, phone: text })} placeholder="Enter phone" keyboardType="phone-pad" />
  </>
);

// ProfessionalDetailsForm
export const ProfessionalDetailsForm = ({ editData, setEditData }: any) => {
  const isExperienced = editData.experience_level && editData.experience_level !== 'Fresher';
  return (
    <>
      <CustomInput label="Job Title" value={editData.job_title} onChangeText={(text: string) => setEditData({ ...editData, job_title: text })} placeholder="Enter current job title" />
      <DropdownInput label="Experience Level" placeholder="Select experience level" value={editData.experience_level} options={['Fresher', 'Intermediate', 'Senior', 'Executive']} onSelect={(val: string) => setEditData({ ...editData, experience_level: val })} />
      {isExperienced && (
        <>
          <View style={{ flexDirection: 'row', gap: wp('2%') }}>
            <View style={{ flex: 1 }}>
              <DropdownInput label="Exp. Years" placeholder="Years" value={editData.exp_years} options={Array.from({ length: 31 }, (_, i) => String(i))} onSelect={(val: string) => setEditData({ ...editData, exp_years: val })} />
            </View>
            <View style={{ flex: 1 }}>
              <DropdownInput label="Exp. Months" placeholder="Months" value={editData.exp_months} options={Array.from({ length: 12 }, (_, i) => String(i))} onSelect={(val: string) => setEditData({ ...editData, exp_months: val })} />
            </View>
          </View>
          <CustomInput label="Current Company" value={editData.current_company} onChangeText={(text: string) => setEditData({ ...editData, current_company: text })} placeholder="Enter current company" />
          <CustomInput label="Current Location" value={editData.current_location} onChangeText={(text: string) => setEditData({ ...editData, current_location: text })} placeholder="e.g. Bangalore" />
          <CustomInput label="Current CTC" value={editData.ctc} onChangeText={(text: string) => setEditData({ ...editData, ctc: text })} placeholder="e.g. 8" keyboardType="numeric" />
        </>
      )}
    </>
  );
};

// SkillsForm
export const SkillsForm = ({ editData, setEditData }: any) => (
  <MultiSelectTags
    label="Skills"
    placeholder="Type skill and press enter"
    tags={editData.skills || []}
    onAddTag={(tag: string) => setEditData({ ...editData, skills: [...(editData.skills || []), tag] })}
    onRemoveTag={(tag: string) => setEditData({ ...editData, skills: (editData.skills || []).filter((t: string) => t !== tag) })}
  />
);

export const ExperienceForm = ({ editData, updateExperience, addExperience, removeExperience }: any) => {
  const parseDateString = (dateStr: any): Date | null => {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    
    try {
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        return new Date(parsed);
      }
    } catch {}

    const parts = String(dateStr).split('-');
    if (parts.length === 3) {
      let day, month, year;
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
      }
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    
    return null;
  };

  const formatDateToString = (date: Date): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('1.5%') }}>
        <Text style={{ fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary }}>Work Experience</Text>
        <TouchableOpacity onPress={addExperience} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: wp('2%'), paddingVertical: hp('0.5%'), borderRadius: 6 }}>
          <Plus size={RFValue(9)} color={Colors.white} />
          <Text style={{ color: Colors.white, fontSize: RFValue(9), marginLeft: wp('1%'), fontWeight: '600' }}>Add</Text>
        </TouchableOpacity>
      </View>
      {(editData.work_experience || []).map((exp: any, index: number) => (
        <View key={index} style={{ backgroundColor: '#F9FAFB', padding: wp('3%'), borderRadius: 12, marginBottom: hp('1.5%'), borderWidth: 1, borderColor: '#E5E7EB' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') }}>
            <Text style={{ fontSize: RFValue(9.5), fontWeight: '700', color: Colors.textSecondary }}>Experience #{index + 1}</Text>
            <TouchableOpacity onPress={() => removeExperience(index)}>
              <Text style={{ color: Colors.danger, fontSize: RFValue(9), fontWeight: '600' }}>Remove</Text>
            </TouchableOpacity>
          </View>
          <CustomInput label="Job Title" value={exp.position} onChangeText={(text: string) => updateExperience(index, 'position', text)} placeholder="Enter job title" />
          <CustomInput label="Company Name" value={exp.company} onChangeText={(text: string) => updateExperience(index, 'company', text)} placeholder="Enter company name" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: wp('1.5%') }}>
              <DatePickerInput
                label="Start Date"
                placeholder="Select Date"
                value={parseDateString(exp.startDate)}
                onChange={(date: Date) => updateExperience(index, 'startDate', formatDateToString(date))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: wp('1.5%') }}>
              {exp.endDate?.toLowerCase() === 'present' ? (
                <View style={{ pointerEvents: 'none', opacity: 0.7 }}>
                  <CustomInput
                    label="End Date"
                    value="Present"
                    onChangeText={() => {}}
                    placeholder="Present"
                    editable={false}
                  />
                </View>
              ) : (
                <DatePickerInput
                  label="End Date"
                  placeholder="Select Date"
                  value={parseDateString(exp.endDate)}
                  onChange={(date: Date) => updateExperience(index, 'endDate', formatDateToString(date))}
                />
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp('1%') }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                if (exp.endDate?.toLowerCase() === 'present') {
                  updateExperience(index, 'endDate', '');
                } else {
                  updateExperience(index, 'endDate', 'Present');
                }
              }}
              activeOpacity={0.7}
            >
              <View style={{
                width: wp('4%'),
                height: wp('4%'),
                minWidth: 16,
                minHeight: 16,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: wp('1.5%'),
                backgroundColor: exp.endDate?.toLowerCase() === 'present' ? Colors.primary : 'transparent'
              }}>
                {exp.endDate?.toLowerCase() === 'present' && (
                  <View style={{ width: wp('2%'), height: wp('2%'), minWidth: 8, minHeight: 8, borderRadius: 2, backgroundColor: Colors.white }} />
                )}
              </View>
              <Text style={{ fontSize: RFValue(9), color: Colors.textPrimary, fontWeight: '500' }}>Currently working here (Present)</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
};

// EducationForm
export const EducationForm = ({ editData, setEditData }: any) => (
  <>
    <DropdownInput
      label="Highest Qualification"
      placeholder="Select qualification"
      value={editData.highest_qualification}
      options={['B.Tech', 'M.Tech', 'B.Sc', 'BCA', 'MCA', 'Other']}
      onSelect={(val: string) => setEditData({ ...editData, highest_qualification: val })}
    />
    <CustomInput
      label="College Name"
      value={editData.institute_name}
      onChangeText={(text: string) => setEditData({ ...editData, institute_name: text })}
      placeholder="Enter your college or university name"
    />
    <DatePickerInput
      label="Passing Year"
      placeholder="Select graduation year"
      value={editData.passing_year}
      onChange={(date: Date) => setEditData({ ...editData, passing_year: date })}
      mode="year"
    />
    <CustomInput
      label="Percentage / CGPA"
      value={editData.percentage_cgpa}
      onChangeText={(text: string) => setEditData({ ...editData, percentage_cgpa: text })}
      placeholder="Enter final percentage or CGPA"
      keyboardType="numeric"
    />
  </>
);

// PersonalDetailsForm
export const PersonalDetailsForm = ({ editData, setEditData }: any) => (
  <>
    <DatePickerInput
      label="Date of Birth"
      placeholder="Select date of birth"
      value={editData.dob}
      onChange={(date: Date) => setEditData({ ...editData, dob: date })}
    />
    <DropdownInput
      label="Gender"
      placeholder="Select gender"
      value={editData.gender}
      options={['Male', 'Female', 'Other']}
      onSelect={(val: string) => setEditData({ ...editData, gender: val })}
    />
    <DropdownInput
      label="Marital Status"
      placeholder="Select marital status"
      value={editData.marital_status}
      options={['Single', 'Married', 'Divorced', 'unmarried']}
      onSelect={(val: string) => setEditData({ ...editData, marital_status: val })}
    />
    <CustomInput label="City" value={editData.city} onChangeText={(text: string) => setEditData({ ...editData, city: text })} placeholder="e.g. Hanumangarh" />
    <CustomInput label="State" value={editData.state} onChangeText={(text: string) => setEditData({ ...editData, state: text })} placeholder="e.g. Rajasthan" />
  </>
);

// SummaryForm
export const SummaryForm = ({ editData, setEditData }: any) => (
  <CustomInput label="Profile Summary" value={editData.profile_summery} onChangeText={(text: string) => setEditData({ ...editData, profile_summery: text })} placeholder="Enter profile summary" multiline numberOfLines={3} />
);

// CareerPreferenceForm
export const CareerPreferenceForm = ({ editData, setEditData }: any) => (
  <>
    <CustomInput label="Preferred Location" value={editData.preferred_location} onChangeText={(text: string) => setEditData({ ...editData, preferred_location: text })} placeholder="e.g. Remote, Bangalore" />
    <CustomInput label="Expected Salary" value={editData.expected_salary} onChangeText={(text: string) => setEditData({ ...editData, expected_salary: text })} placeholder="e.g. 12" keyboardType="numeric" />
    <DropdownInput
      label="Preferred Shift"
      placeholder="Select"
      value={editData.availability}
      options={['Day Shift', 'Night Shift', 'Flexible']}
      onSelect={(val: string) => setEditData({ ...editData, availability: val })}
    />
    <MultiSelectTags
      label="Preferred Job Types"
      placeholder="Select job types"
      tags={editData.preferred_job_types || []}
      onAddTag={(tag: string) => setEditData({ ...editData, preferred_job_types: [...(editData.preferred_job_types || []), tag] })}
      onRemoveTag={(tag: string) => setEditData({ ...editData, preferred_job_types: (editData.preferred_job_types || []).filter((t: string) => t !== tag) })}
      options={['Full-time', 'Part-time', 'Contract', 'Remote']}
    />
    <DropdownInput
      label="Notice Period"
      placeholder="Notice Period"
      value={editData.notice_period}
      options={['Immediate', '15 Days', '30 Days', '60 Days', '90 Days']}
      onSelect={(val: string) => setEditData({ ...editData, notice_period: val })}
    />
  </>
);

// LanguagesForm
export const LanguagesForm = ({ editData, setEditData, removeLanguage }: any) => {
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [editingLangIndex, setEditingLangIndex] = useState<number | null>(null);

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('1.5%') }}>
        <Text style={{ fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary }}>Languages</Text>
        <TouchableOpacity
          onPress={() => { setEditingLangIndex(null); setIsLangModalVisible(true); }}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: wp('2%'), paddingVertical: hp('0.5%'), borderRadius: 6 }}
        >
          <Plus size={RFValue(9)} color={Colors.white} />
          <Text style={{ color: Colors.white, fontSize: RFValue(9), marginLeft: wp('1%'), fontWeight: '600' }}>Add Language</Text>
        </TouchableOpacity>
      </View>

      {(editData.languages || []).map((lang: any, index: number) => (
        <View key={index} style={{ backgroundColor: '#F9FAFB', padding: wp('3%'), borderRadius: 12, marginBottom: hp('1.5%'), borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: RFValue(10.5), fontWeight: '700', color: Colors.textPrimary }}>{lang.language_name || lang.language}</Text>
            <Text style={{ fontSize: RFValue(8.5), color: Colors.textSecondary, marginTop: hp('0.3%') }}>
              {lang.proficiency} • {Array.isArray(lang.comfortable_in) ? lang.comfortable_in.join(', ') : lang.comfortable_in}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: wp('3%') }}>
            <TouchableOpacity onPress={() => { setEditingLangIndex(index); setIsLangModalVisible(true); }}>
              <Text style={{ color: Colors.info, fontSize: RFValue(9), fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeLanguage(index)}>
              <Text style={{ color: Colors.danger, fontSize: RFValue(9), fontWeight: '600' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <LanguageProficiencyModal
        visible={isLangModalVisible}
        onClose={() => { setIsLangModalVisible(false); setEditingLangIndex(null); }}
        existingLanguages={(editData.languages || []).map((l: any) => l.language_name || l.language)}
        initialData={editingLangIndex !== null ? {
          language: editData.languages[editingLangIndex].language_name || editData.languages[editingLangIndex].language,
          proficiency: editData.languages[editingLangIndex].proficiency,
          comfortableIn: (Array.isArray(editData.languages[editingLangIndex].comfortable_in)
            ? editData.languages[editingLangIndex].comfortable_in
            : (typeof editData.languages[editingLangIndex].comfortable_in === 'string'
              ? editData.languages[editingLangIndex].comfortable_in.split(', ')
              : [])).map((s: string) => {
                  const st = s.trim();
                  if (st === 'Read') return 'Reading';
                  if (st === 'Write') return 'Writing';
                  if (st === 'Speak') return 'Speaking';
                  return st;
              })
        } : null}
        onSave={(data: any) => {
          const mappedLang = {
            language_name: data.language,
            proficiency: data.proficiency,
            comfortable_in: data.comfortableIn.join(', '),
          };
          if (editingLangIndex !== null) {
            const updated = [...editData.languages];
            updated[editingLangIndex] = mappedLang;
            setEditData({ ...editData, languages: updated });
          } else {
            setEditData({ ...editData, languages: [...(editData.languages || []), mappedLang] });
          }
          setIsLangModalVisible(false);
          setEditingLangIndex(null);
        }}
      />
    </>
  );
};

// DocumentsForm
export const DocumentsForm = ({ editData, setEditData }: any) => (
  <>
    <UploadCard
      label="Profile Image"
      type="image"
      value={editData.profileImage}
      onChange={(file: any) => setEditData({ ...editData, profileImage: file })}
      placeholder="Upload your professional photo"
    />
    <UploadCard
      label="Resume (PDF/DOC)"
      type="document"
      value={editData.resume}
      onChange={(file: any) => setEditData({ ...editData, resume: file })}
      placeholder="Upload your resume"
    />
    <CustomInput
      label="Portfolio Link (Optional)"
      value={editData.portfolio}
      onChangeText={(text: string) => setEditData({ ...editData, portfolio: text })}
      placeholder="https://yourportfolio.com"
      autoCapitalize="none"
    />
  </>
);
