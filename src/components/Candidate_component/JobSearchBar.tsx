import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Search, Filter } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface JobSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({ value, onChangeText }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchBox}>
      <Search color={Colors.textSecondary} size={wp('5%')} />
      <TextInput
        placeholder="Search for jobs, companies..."
        placeholderTextColor={Colors.textSecondary}
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
    <TouchableOpacity style={styles.filterBtn}>
      <Filter color={Colors.white} size={wp('5%')} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('3%'),
    gap: wp('3%'),
  },
  searchBox: {
    flex: 1, height: hp('6%'), borderRadius: wp('3%'),
    backgroundColor: Colors.white, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: wp('4%'),
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, marginLeft: wp('2%'), ...Typography.bodySmall, color: Colors.textPrimary },
  filterBtn: {
    width: hp('6%'), height: hp('6%'), borderRadius: wp('3%'),
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
});

export default JobSearchBar;
