import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  Search,
  Plus, Filter
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import ActiveJobCard from '../../components/Manager_component/ActiveJobCard';
import FilterModal from '../../components/Manager_component/FilterModal';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import { jobs } from '../../data/jobonnStaticData';

const TABS = ['All', 'Active', 'Closed'];

const ALL_JOBS = jobs;

const FILTER_SECTIONS = [
  {
    title: 'Department',
    options: [
      { key: 'Engineering', label: 'Engineering' },
      { key: 'Design', label: 'Design' },
      { key: 'Product', label: 'Product' },
      { key: 'Quality', label: 'Quality' },
      { key: 'Sales', label: 'Sales' },
    ],
  },
  {
    title: 'Status',
    options: [
      { key: 'Active', label: 'Active' },
      { key: 'Closed', label: 'Closed' },
    ],
  },
];

const ManagerAllJobsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const filtered = ALL_JOBS.filter(j => {
    const matchTab = activeTab === 'All' || j.status === activeTab;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());

    // Check filters
    const matchDept = !selected.Department || selected.Department.length === 0 || selected.Department.includes(j.department);
    const matchStatus = !selected.Status || selected.Status.length === 0 || selected.Status.includes(j.status);

    return matchTab && matchSearch && matchDept && matchStatus;
  });

  const handleFilterSelect = (section: string, key: string) => {
    setSelected(prev => {
      const current = prev[section] ?? [];
      return {
        ...prev,
        [section]: current.includes(key) ? current.filter(k => k !== key) : [...current, key],
      };
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />


      <MainManagerHeader
        title="All Job Postings"
        subtitle={`${ALL_JOBS.length} total jobs created`}
        rightComponent={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('PostJob')}
          >
            <Plus color={Colors.white} size={wp('5%')} />
          </TouchableOpacity>
        }
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search color={Colors.textSecondary} size={wp('4.2%')} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by job title..."
              placeholderTextColor={Colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, Object.values(selected).some(v => v.length > 0) && styles.filterBtnActive]}
            onPress={() => setFilterVisible(true)}
          >
            <Filter color={Object.values(selected).some(v => v.length > 0) ? Colors.white : Colors.textPrimary} size={wp('4.5%')} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map((job, index) => (
            <Animated.View
              key={job.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <ActiveJobCard
                {...job}
                onPress={() => navigation.navigate('ManagerJobDetails', { job })}
              />
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No jobs found matching your criteria</Text>
          </View>
        )}
        <View style={{ height: hp('10%') }} />
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
  searchContainer: { paddingHorizontal: wp('2%'), marginTop: hp('1%') },
  searchRow: { flexDirection: 'row', gap: wp('3%') },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, ...Typography.bodySmall, marginLeft: wp('2%') },
  filterBtn: {
    width: hp('4%'),
    height: hp('4%'),
    borderRadius: wp('2%'),
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
  tabsRow: { marginBottom: hp('1.5%'), borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabsContent: { paddingHorizontal: wp('4%'), gap: wp('6%') },
  tab: { paddingVertical: hp('1%'), position: 'relative' },
  tabActive: {},
  tabText: { ...Typography.bodySmall, fontWeight: '600' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  list: { paddingHorizontal: wp('4%') },
  emptyState: { alignItems: 'center', marginTop: hp('10%') },
  emptyText: { ...Typography.bodySmall },
});

export default ManagerAllJobsScreen;
