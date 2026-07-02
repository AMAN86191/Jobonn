import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch, onFilterPress, value }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search size={RFValue(11)} color={Colors.textTertiary} strokeWidth={2} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          onChangeText={onSearch}
          value={value}
        />
      </View>
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} activeOpacity={0.7}>
        <SlidersHorizontal size={RFValue(11)} color={Colors.white} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginBottom: hp('0.5%'),
    gap: wp('2.5%'),
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: hp('4%'),
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('2%'),
  },
  input: {
    flex: 1,
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    height: '100%',
  },
  filterBtn: {
    height: hp('4%'),
    width: hp('4%'),
    backgroundColor: Colors.primary,
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
