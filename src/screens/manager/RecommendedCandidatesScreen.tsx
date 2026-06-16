import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TextInput, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'Department',
    type: 'searchable-multi',
    options: [
      { key: 'Engineering', label: 'Engineering' },
      { key: 'Design', label: 'Design' },
      { key: 'Product', label: 'Product' },
      { key: 'Marketing', label: 'Marketing' },
      { key: 'Sales', label: 'Sales' },
    ],
  },
  {
    title: 'Location',
    type: 'searchable-multi',
    options: [
      { key: 'Bangalore', label: 'Bangalore' },
      { key: 'Mumbai', label: 'Mumbai' },
      { key: 'Hyderabad', label: 'Hyderabad' },
      { key: 'Remote', label: 'Remote' },
    ],
  },
];

const RECOMMENDED_CANDIDATES = [
  { id: 'rec_1', name: 'Neha Sharma', role: 'React Native Developer', experience: '3 yrs', location: 'Bangalore', skills: ['React Native', 'TypeScript', 'JavaScript'], matchScore: 95, currentCTC: '12 LPA', expectedCTC: '15 LPA', time: '95% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_2', name: 'Rohan Mehta', role: 'UI/UX Designer', experience: '4 yrs', location: 'Remote', skills: ['Figma', 'Framer', 'UI Design'], matchScore: 89, currentCTC: '15 LPA', expectedCTC: '18 LPA', time: '89% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_3', name: 'Aman Verma', role: 'Full Stack Engineer', experience: '5 yrs', location: 'Hyderabad', skills: ['React', 'Node.js', 'Express', 'MongoDB'], matchScore: 92, currentCTC: '18 LPA', expectedCTC: '22 LPA', time: '92% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_4', name: 'Kirti Singh', role: 'Product Manager', experience: '6 yrs', location: 'Mumbai', skills: ['Agile', 'Scrum', 'Roadmapping'], matchScore: 86, currentCTC: '22 LPA', expectedCTC: '26 LPA', time: '86% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_5', name: 'Devendra Patil', role: 'Backend Developer', experience: '4 yrs', location: 'Pune', skills: ['Python', 'Django', 'PostgreSQL'], matchScore: 91, currentCTC: '14 LPA', expectedCTC: '17 LPA', time: '91% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_6', name: 'Shreya Ghoshal', role: 'iOS Developer', experience: '3 yrs', location: 'Remote', skills: ['Swift', 'SwiftUI', 'CocoaPods'], matchScore: 88, currentCTC: '13 LPA', expectedCTC: '16 LPA', time: '88% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_7', name: 'Vijay Iyer', role: 'DevOps Engineer', experience: '5 yrs', location: 'Bangalore', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], matchScore: 94, currentCTC: '20 LPA', expectedCTC: '25 LPA', time: '94% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_8', name: 'Sneha Reddy', role: 'Frontend Engineer', experience: '2 yrs', location: 'Hyderabad', skills: ['React', 'HTML', 'CSS', 'Redux'], matchScore: 85, currentCTC: '8 LPA', expectedCTC: '10 LPA', time: '85% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_9', name: 'Aditya Birla', role: 'Data Scientist', experience: '4 yrs', location: 'Mumbai', skills: ['Machine Learning', 'Python', 'R', 'Pandas'], matchScore: 90, currentCTC: '16 LPA', expectedCTC: '20 LPA', time: '90% Match', image: require('../../../assets/images/boy.png') },
  { id: 'rec_10', name: 'Pooja Hegde', role: 'QA Engineer', experience: '3 yrs', location: 'Noida', skills: ['Selenium', 'Jira', 'Manual Testing'], matchScore: 87, currentCTC: '10 LPA', expectedCTC: '12 LPA', time: '87% Match', image: require('../../../assets/images/boy.png') },
];

const RecommendedCandidatesScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const handleFilterSelect = (section: string, key: string) => {
    setSelected(prev => {
      const current = prev[section] || [];
      if (key.startsWith('range:')) {
        const [min, max] = key.replace('range:', '').split('-');
        return { ...prev, [section]: [min, max] };
      }
      if (key.startsWith('min:')) return { ...prev, [section]: [key.replace('min:', ''), current[1] || ''] };
      if (key.startsWith('max:')) return { ...prev, [section]: [current[0] || '', key.replace('max:', '')] };
      const updated = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
      return { ...prev, [section]: updated };
    });
  };

  const filtered = RECOMMENDED_CANDIDATES.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const getCandidateDept = (role: string) => {
      const r = role.toLowerCase();
      if (r.includes('developer') || r.includes('engineer') || r.includes('science') || r.includes('qa')) return 'Engineering';
      if (r.includes('design')) return 'Design';
      if (r.includes('product')) return 'Product';
      if (r.includes('sales') || r.includes('marketing')) return 'Sales';
      return 'HR';
    };

    const dept = getCandidateDept(c.role);
    const matchDept = !selected.Department?.length || selected.Department.includes(dept);
    const matchLocation = !selected.Location?.length || selected.Location.includes(c.location);

    return matchSearch && matchDept && matchLocation;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <CommanManagerHeader
        navigation={navigation}
        title="Recommended Candidates"
      />

      {/* Search Bar & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search color={Colors.textSecondary} size={RFValue(11)} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, role, or skills..."
              placeholderTextColor={Colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, Object.values(selected).some(v => v.length > 0) && styles.filterBtnActive]}
            onPress={() => setFilterVisible(true)}
          >
            <SlidersHorizontal
              color={Object.values(selected).some(v => v.length > 0) ? Colors.white : Colors.textPrimary}
              size={RFValue(11)}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map((candidate, index) => (
            <Animated.View
              key={candidate.id}
              entering={FadeInDown.delay(index * 50).duration(400)}
            >
              <CandidateCard
                {...candidate}
                avatarColor={getAvatarColor(candidate.name)}
                onPress={() => navigation.navigate('CandidateApplicationFullView', { applicant: candidate, isRecommended: true })}
              />
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No candidates found</Text>
          </View>
        )}
        <View style={{ height: hp('8%') }} />
      </ScrollView>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        sections={FILTER_SECTIONS}
        selected={selected}
        onSelect={handleFilterSelect}
        onApply={() => setFilterVisible(false)}
        onReset={() => setSelected({})}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { paddingHorizontal: wp('4%'), marginVertical: hp('1%') },
  searchRow: { flexDirection: 'row', gap: wp('2.5%'), alignItems: 'center' },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3.5%'),
    height: hp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('2%'),
  },
  searchInput: { flex: 1, fontSize: RFValue(10), color: Colors.textPrimary, padding: 0 },
  filterBtn: {
    width: hp('4%'),
    height: hp('4%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  list: { paddingHorizontal: wp('4%') },
  emptyState: { alignItems: 'center', marginTop: hp('10%') },
  emptyText: { fontSize: RFValue(11), color: Colors.textSecondary, fontWeight: '600' },
});

export default RecommendedCandidatesScreen;
