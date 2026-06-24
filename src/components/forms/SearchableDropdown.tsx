import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Search, ChevronDown, Plus, Check, X } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SearchableDropdownProps {
  data: string[];
  placeholder?: string;
  value?: string;
  onSelect?: (value: string) => void;
  label?: string;
  isMulti?: boolean;
  selectedValues?: string[];
  onSelectMulti?: (values: string[]) => void;
  onSearchTextChange?: (text: string) => void;
}

const SearchableDropdown = ({
  data,
  placeholder,
  value: initialValue = '',
  onSelect,
  label,
  isMulti = false,
  selectedValues = [],
  onSelectMulti,
  onSearchTextChange,
}: SearchableDropdownProps) => {
  const [query, setQuery] = useState(isMulti ? '' : initialValue);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(data);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!isMulti) {
      setQuery(initialValue);
    }
  }, [initialValue, isMulti]);

  React.useEffect(() => {
    setItems(data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter(item =>
      item.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, items]);

  const toggleDropdown = (isOpen: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(isOpen);
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  };

  const toggleSelection = (item: string) => {
    let updated: string[];
    if (selectedValues.includes(item)) {
      updated = selectedValues.filter(x => x !== item);
    } else {
      updated = [...selectedValues, item];
    }
    onSelectMulti?.(updated);
  };

  const handleSelect = (item: string) => {
    if (isMulti) {
      toggleSelection(item);
      setQuery('');
      toggleDropdown(false);
    } else {
      setQuery(item);
      toggleDropdown(false);
      onSelect?.(item);
    }
  };

  const handleAddNew = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const alreadyExists = items.some(
      item => item.toLowerCase() === trimmed.toLowerCase(),
    );

    if (!alreadyExists) {
      const updated = [trimmed, ...items];
      setItems(updated);
    }

    if (isMulti) {
      toggleSelection(trimmed);
      setQuery('');
      toggleDropdown(false);
    } else {
      handleSelect(trimmed);
    }
  };

  const isItemSelected = (item: string) => {
    if (isMulti) {
      return selectedValues.includes(item);
    }
    return query === item || initialValue === item;
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputContainer, open && styles.inputContainerActive]}>
        <Search size={wp('4.5%')} color={open ? Colors.primary : Colors.textSecondary} style={styles.icon} />
        <TextInput
          value={query}
          placeholder={placeholder || 'Search...'}
          placeholderTextColor={Colors.textSecondary}
          onFocus={() => toggleDropdown(true)}
          onChangeText={text => {
            setQuery(text);
            if (!open) toggleDropdown(true);
            onSearchTextChange?.(text);
          }}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => toggleDropdown(!open)} style={styles.chevron}>
          <ChevronDown
            size={wp('5%')}
            color={Colors.textSecondary}
            style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {open && (
        <Animated.View style={[styles.dropdown, { opacity: fadeAnim }]}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const selected = isItemSelected(item);
                return (
                  <TouchableOpacity
                    key={item + index}
                    style={[styles.item, selected && styles.itemSelected]}
                    onPress={() => handleSelect(item)}>
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{item}</Text>
                    {selected && <Check size={wp('4%')} color={Colors.primary} strokeWidth={3} />}
                  </TouchableOpacity>
                );
              })
            ) : (
              <TouchableOpacity
                style={styles.addItem}
                onPress={handleAddNew}>
                <Plus size={wp('4%')} color={Colors.primary} style={{ marginRight: wp('2%') }} />
                <Text style={styles.addText}>
                  Add "{query}"
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {isMulti && selectedValues.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedValues.map(val => (
            <View key={val} style={styles.multiChip}>
              <Text style={styles.multiChipText}>{val}</Text>
              <TouchableOpacity onPress={() => toggleSelection(val)} style={styles.multiChipClose}>
                <X size={wp('3.5%')} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchableDropdown;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 100,
    // marginBottom: hp('1%'),
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('3.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: wp('4%'),
    height: hp('5%'),
  },
  inputContainerActive: {
    borderColor: Colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  icon: {
    marginRight: wp('2%'),
  },
  input: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    height: '100%',
  },
  chevron: {
    padding: wp('1%'),
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: wp('3.5%'),
    borderBottomRightRadius: wp('3.5%'),
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.primary,
    maxHeight: hp('25%'),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scrollView: {
    maxHeight: hp('25%'),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '50',
  },
  itemSelected: {
    backgroundColor: Colors.primary + '10',
  },
  itemText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  itemTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  addItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  addText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('1.5%'),
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  multiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    borderRadius: wp('1%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.4%'),
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  multiChipText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontSize: wp('2.8%'),
    fontWeight: '600',
    marginRight: wp('1%'),
  },
  multiChipClose: {
    padding: wp('0.5%'),
  },
});