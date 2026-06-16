import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { ArrowLeft, Search, Star, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import JobCard from '../../components/Candidate_component/JobCard';
import { Sliders } from 'lucide-react-native';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { jobs } from '../../data/jobonnStaticData';

const RECENT_SEARCHES = [
  've,jaipur',
  'Laravel Developer,jaipur',
  'react native developer,jaipur'
];

const TOP_COMPANIES = [
  { id: 1, name: 'Google', logo: require('../../../assets/images/google.png') },
  { id: 2, name: 'Microsoft', logo: require('../../../assets/images/microsoft.png') },
  { id: 3, name: 'Amazon', logo: require('../../../assets/images/social.png') },
  { id: 4, name: 'Apple', logo: require('../../../assets/images/apple.png') },
];

const DUMMY_JOBS = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'Microsoft',
    logo: require('../../../assets/images/microsoft.png'),
    location: 'Bangalore (Hybrid)',
    salary: '₹18L - ₹25L',
    type: '3-5 Yrs',
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Google',
    logo: require('../../../assets/images/google.png'),
    location: 'Remote',
    salary: '₹10L - ₹16L',
    type: '2-4 Yrs',
  },
  {
    id: '3',
    title: 'Laravel Backend Developer',
    company: 'Amazon',
    logo: require('../../../assets/images/social.png'),
    location: 'Jaipur, India',
    salary: '₹8L - ₹12L',
    type: '1-3 Yrs',
  }
];

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'Sort By',
    options: [
      { key: 'experience_desc', label: 'Experience: High to Low' },
      { key: 'experience_asc', label: 'Experience: Low to High' },
    ],
  },
  {
    title: 'Location',
    options: [
      { key: 'jaipur', label: 'Jaipur' },
      { key: 'remote', label: 'Remote' },
      { key: 'bangalore', label: 'Bangalore' },
    ]
  }
];

const CandidateSearchScreen = ({ navigation }: any) => {
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [showJobs, setShowJobs] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    'Sort By': [],
    'Location': [],
  });

  const handleSearch = () => {
    setShowJobs(true);
  };

  const handleSelectFilter = (section: string, key: string) => {
    setSelectedFilters(prev => {
      const current = prev[section] || [];
      const updated = current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key];
      return { ...prev, [section]: updated };
    });
  };

  const handleApplyFilter = () => {
    setFilterVisible(false);
  };

  const handleResetFilter = () => {
    setSelectedFilters({
      'Sort By': [],
      'Location': [],
    });
    setFilterVisible(false);
  };

  let filteredJobs = [...jobs].filter(job => {
    const query = skills.toLowerCase().trim();
    const loc = location.toLowerCase().trim();
    const matchesQuery = !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.skills.some(skill => skill.toLowerCase().includes(query));
    const matchesLocation = !loc || job.location.toLowerCase().includes(loc);
    return matchesQuery && matchesLocation;
  });

  // Filter by Location
  const selectedLocs = selectedFilters.Location || [];
  if (selectedLocs.length > 0) {
    filteredJobs = filteredJobs.filter(j =>
      selectedLocs.some(loc => j.location.toLowerCase().includes(loc.toLowerCase()))
    );
  }

  // Sort jobs
  const sortBy = selectedFilters['Sort By']?.[0];
  if (sortBy === 'experience_desc') {
    filteredJobs.sort((a, b) => parseInt(b.type) - parseInt(a.type));
  } else if (sortBy === 'experience_asc') {
    filteredJobs.sort((a, b) => parseInt(a.type) - parseInt(b.type));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top Header */}
      <CommanManagerHeader title={"Search jobs and internships"} navigation={navigation} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>


        {/* Form Fields */}
        <View style={styles.searchForm}>
          {/* Skills Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.labelBlue}>Skills, designations, companies</Text>
            <TextInput
              style={styles.textInput}
              value={skills}
              onChangeText={setSkills}
              placeholder="Skills, designations, companies"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          {/* Location Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.labelBlue}>Location</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Type here to search"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          {/* Search Button aligned to right */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search jobs</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showJobs ? (
          <View >
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Related Jobs ({filteredJobs.length})</Text>
                <Text style={styles.sectionSubtitle}>Found matching jobs</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2%') }}>
                <TouchableOpacity
                  onPress={() => setFilterVisible(true)}
                  style={{
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.border,
                    borderRadius: wp('2%'),
                    padding: wp('1.5%'),
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Sliders size={RFValue(12)} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowJobs(false)}>
                  <Text style={styles.viewAllText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{}}>
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  {...job}
                  onPress={() => navigation.navigate('JobDetails', { job })}
                />
              ))}
            </View>
          </View>
        ) : (
          <>
            {/* Recent Searches */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your most recent searches</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentSearchesScroll}>
              {RECENT_SEARCHES.map((search, idx) => (
                <TouchableOpacity key={idx} style={styles.recentSearchChip} onPress={() => { setSkills(search.split(',')[0]); setLocation(search.split(',')[1] || ''); }}>
                  <Search size={RFValue(12)} color={Colors.textSecondary} style={styles.searchIcon} />
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Top Companies */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Top companies</Text>
                <Text style={styles.sectionSubtitle}>Hiring for Software Development</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCompaniesRow}>
                {TOP_COMPANIES.map(comp => (
                  <TouchableOpacity key={comp.id} style={styles.companyCard}>
                    <View style={styles.companyLogoWrap}>
                      <Image source={comp.logo} style={styles.companyLogo} />
                    </View>
                    <Text style={styles.companyName} numberOfLines={1}>{comp.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ScrollView>
          </>
        )}

        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          sections={FILTER_SECTIONS}
          selected={selectedFilters}
          onSelect={handleSelectFilter}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />

        {/* Bottom Padding */}
        <View style={{ height: hp('6%') }} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: wp('2%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1%'),
  },
  backButton: {
    padding: wp('1%'),
    alignSelf: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('4%'),
    paddingTop: hp('1%'),
  },
  title: {
    fontSize: RFValue(17),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: hp('1%'),
    marginBottom: hp('3%'),
  },
  searchForm: {
    marginBottom: hp('1.5%'),
  },
  inputGroup: {
    marginBottom: hp('2.5%'),
  },

  labelBlue: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: hp('0.5%'),
  },
  textInput: {
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: 0,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
    // marginTop: hp('0%'),
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp('5%'),
    paddingVertical: hp('1.1%'),
    paddingHorizontal: wp('6%'),
  },
  searchButtonText: {
    color: Colors.white,
    fontSize: RFValue(10),
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: hp('1%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginTop: hp('3.5%'),
    marginBottom: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: RFValue(11.5),
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  sectionSubtitle: {
    fontSize: RFValue(9.5),
    color: Colors.textSecondary,
    marginTop: hp('0.3%'),
  },
  viewAllText: {
    fontSize: RFValue(10.5),
    fontWeight: '700',
    color: Colors.primary,
  },
  // Recent searches
  recentSearchesScroll: {
    paddingVertical: hp('0.5%'),
    gap: wp('2.5%'),
  },
  recentSearchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.9%'),
    marginRight: wp('1.5%'),
  },
  searchIcon: {
    marginRight: wp('1.5%'),
  },
  recentSearchText: {
    fontSize: RFValue(10),
    color: Colors.textPrimary,
  },
  // Cards layout
  cardsScroll: {
    paddingVertical: hp('0.5%'),
    gap: wp('3.5%'),
  },
  // Top company card
// Top Companies
  topCompaniesRow: {
    paddingBottom: hp('1%'),
    gap: wp('3%'),
  },
  companyCard: {
    width: wp('25%'),
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  companyLogoWrap: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  companyLogo: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  companyName: {
    fontSize: RFValue(9),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
 
});

export default CandidateSearchScreen;
