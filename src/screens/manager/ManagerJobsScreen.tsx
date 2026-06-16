import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Pressable,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Search, SlidersHorizontal, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import ActiveJobCard from '../../components/Manager_component/ActiveJobCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { jobs } from '../../data/jobonnStaticData';

const TABS = ['Active', 'Closed'];

const ALL_JOBS = jobs;

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'Department',
    options: [
      { key: 'Engineering', label: 'Engineering' },
      { key: 'Design', label: 'Design' },
      { key: 'Product', label: 'Product' },
      { key: 'Quality', label: 'Quality' },
    ],
  },
  { title: 'Experience', type: 'range', options: [] },
  { title: 'CTC Range', type: 'range', options: [] },
  {
    title: 'Location',
    options: [
      { key: 'Bangalore', label: 'Bangalore' },
      { key: 'Mumbai', label: 'Mumbai' },
      { key: 'Hyderabad', label: 'Hyderabad' },
      { key: 'Remote', label: 'Remote' },
    ],
  },
];

const ManagerJobsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Active');
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const filtered = ALL_JOBS.filter(j => {
    const matchTab = j.status === activeTab;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());
    const matchDept = !selected.Department?.length || selected.Department.includes(j.department);
    const matchLocation = !selected.Location?.length || selected.Location.includes(j.location);
    return matchTab && matchSearch && matchDept && matchLocation;
  });

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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <MainManagerHeader 
        title="Job Listings" 
        subtitle={`${filtered.length} jobs found`} 
        rightComponent={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('PostJob')}
          >
            <Plus color={Colors.white} size={RFValue(12)} strokeWidth={2.5} />
          </TouchableOpacity>
        } 
      />

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color={Colors.textTertiary} size={RFValue(11)} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Pressable style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <SlidersHorizontal color={Colors.white} size={RFValue(11)} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow} contentContainerStyle={styles.tabsContent}>
        {TABS.map((tab: string) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map((job: any) => (
            <ActiveJobCard
              key={job.id}
              {...job}
              onPress={() => navigation.navigate('ManagerJobDetails', { job })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No jobs found</Text>
            <Text style={styles.emptyStateSubText}>Try adjusting your search or filters</Text>
          </View>
        )}
        <View style={{ height: hp('12%') }} />
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
  addBtn: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: { flexDirection: 'row', paddingHorizontal: wp('2%'), gap: wp('2.5%'), marginBottom: hp('1.2%'), marginTop: hp('1.2%') },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3%'),
    height: hp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('2%'),
  },
  searchInput: { flex: 1, fontSize: RFValue(10), color: Colors.textPrimary },
  filterBtn: {
    width: hp('4%'),
    height: hp('4%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    paddingLeft: wp('4%'),
    // marginBottom: hp('1.2%'),
    // height: hp('5.5%'),
    maxHeight: hp('5%'),
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    paddingRight: wp('4%'),
  },
  tab: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('4%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: RFValue(9), color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.white },
  list: { paddingHorizontal: wp('2%') },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('8%'),
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: hp('2%'),
    marginHorizontal: wp('2%'),
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: RFValue(11),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  emptyStateSubText: {
    fontSize: RFValue(8.5),
    color: Colors.textTertiary,
    marginTop: hp('0.5%'),
  },
});

export default ManagerJobsScreen;
