import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, ScrollView, TextInput,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { X, RotateCcw, ChevronDown, ChevronUp, Check } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface FilterOption {
  key: string;
  label: string;
}

export interface FilterSection {
  title: string;
  options: FilterOption[];
  multi?: boolean;
  type?: 'range' | 'choice' | 'searchable-multi' | 'minmax';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  sections: FilterSection[];
  selected: Record<string, string[]>;
  onSelect: (section: string, key: string) => void;
  onApply: () => void;
  onReset: () => void;
}

interface AnimatedArrowProps {
  isExpanded: boolean;
}

const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ isExpanded }) => {
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    rotateValue.value = withTiming(isExpanded ? 180 : 0, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isExpanded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <ChevronDown color={Colors.textSecondary} size={RFValue(12)} />
    </Animated.View>
  );
};

interface AnimatedDropdownProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({ isExpanded, children }) => {
  const animatedHeight = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [shouldRender, setShouldRender] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      setShouldRender(true);
      animatedHeight.value = withTiming(hp('25%'), {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(1, {
        duration: 200,
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 150,
      });
      animatedHeight.value = withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [isExpanded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: animatedHeight.value,
      opacity: opacity.value,
      overflow: 'hidden',
    };
  });

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.dropdownContent, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const FilterModal: React.FC<FilterModalProps> = ({
  visible, onClose, sections, selected, onSelect, onApply, onReset,
}) => {
  const translateX = useSharedValue(-wp('85%'));
  const backdropOpacity = useSharedValue(0);
  const [localRanges, setLocalRanges] = useState<Record<string, [number, number]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad)
      });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(-wp('85%'), {
        duration: 250,
        easing: Easing.in(Easing.quad)
      });
      backdropOpacity.value = withTiming(0, { duration: 250 }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [visible]);

  useEffect(() => {
    const ranges: Record<string, [number, number]> = {};
    sections.forEach(sec => {
      if (sec.type === 'range') {
        const vals = selected[sec.title];
        const defaultMax = sec.title === 'Experience' ? 15 : 50;
        if (vals && vals.length === 2) {
          ranges[sec.title] = [parseInt(vals[0]), parseInt(vals[1])];
        } else {
          ranges[sec.title] = [0, defaultMax];
        }
      }
    });
    setLocalRanges(ranges);
  }, [selected, sections]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!shouldRender) return null;

  return (
    <Modal visible={shouldRender} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, sheetStyle]}>

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Filter Options</Text>
              <Text style={styles.sheetSubtitle}>Find exactly what you're looking for</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color={Colors.textPrimary} size={RFValue(16)} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content} keyboardShouldPersistTaps="handled">
            {sections.map((section, index) => (
              <View key={section.title} style={[styles.section, index === 0 && { marginTop: hp('1%') }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.type === 'range' && (
                    <Text style={styles.rangeValueText}>
                      {localRanges[section.title]?.[0] ?? '0'} - {localRanges[section.title]?.[1] ?? (section.title === 'Experience' ? 15 : 50)}+
                      {section.title === 'Experience' ? ' Yrs' : ' LPA'}
                    </Text>
                  )}
                </View>

                {section.type === 'range' ? (
                  <View style={styles.sliderContainer}>
                    <MultiSlider
                      values={localRanges[section.title] || [
                        0,
                        section.title === 'Experience' ? 15 : 50
                      ]}
                      sliderLength={wp('73%')}
                      onValuesChange={(values) => {
                        setLocalRanges(prev => ({
                          ...prev,
                          [section.title]: [values[0], values[1]],
                        }));
                      }}
                      onValuesChangeFinish={(values) => {
                        onSelect(section.title, `range:${values[0]}-${values[1]}`);
                      }}
                      min={0}
                      max={section.title === 'Experience' ? 15 : 50}
                      step={1}
                      allowOverlap={false}
                      snapped
                      selectedStyle={{ backgroundColor: Colors.primary }}
                      unselectedStyle={{ backgroundColor: Colors.border }}
                      trackStyle={{ height: 4, borderRadius: 2 }}
                      markerStyle={styles.sliderMarker}
                      pressedMarkerStyle={styles.sliderMarkerPressed}
                    />
                  </View>
                ) : section.type === 'minmax' ? (
                  <View style={styles.minmaxRow}>
                    <View style={styles.minmaxInputWrapper}>
                      <Text style={styles.minmaxLabel}>Min (Days)</Text>
                      <TextInput
                        style={styles.minmaxInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={Colors.textTertiary}
                        value={selected[section.title]?.[0] || ''}
                        onChangeText={(t) => onSelect(section.title, `min:${t}`)}
                      />
                    </View>
                    <Text style={styles.minmaxDash}>-</Text>
                    <View style={styles.minmaxInputWrapper}>
                      <Text style={styles.minmaxLabel}>Max (Days)</Text>
                      <TextInput
                        style={styles.minmaxInput}
                        keyboardType="numeric"
                        placeholder="90"
                        placeholderTextColor={Colors.textTertiary}
                        value={selected[section.title]?.[1] || ''}
                        onChangeText={(t) => onSelect(section.title, `max:${t}`)}
                      />
                    </View>
                  </View>
                ) : section.type === 'searchable-multi' ? (
                  <View style={styles.searchableContainer}>
                    {selected[section.title]?.length > 0 && (
                      <View style={styles.selectedOptionsRow}>
                        {selected[section.title].map(key => {
                          const opt = section.options.find(o => o.key === key);
                          if (!opt) return null;
                          return (
                            <TouchableOpacity
                              key={key}
                              style={[styles.chip, styles.chipActive, { paddingRight: wp('2%'), flexDirection: 'row', alignItems: 'center' }]}
                              onPress={() => onSelect(section.title, key)}
                            >
                              <Text style={[styles.chipText, styles.chipTextActive]}>{opt.label}</Text>
                              <X color={Colors.primary} size={RFValue(10)} style={{ marginLeft: wp('1%') }} />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    <View style={[styles.searchBoxModal, expandedSections[section.title] && styles.searchBoxModalFocused]}>
                      <TextInput
                        style={styles.searchBoxInput}
                        placeholder={`Select ${section.title}`}
                        placeholderTextColor={Colors.textTertiary}
                        value={searchQueries[section.title] || ''}
                        onChangeText={(t) => setSearchQueries(prev => ({ ...prev, [section.title]: t }))}
                        onFocus={() => setExpandedSections(prev => ({ ...prev, [section.title]: true }))}
                        onBlur={() => {
                          setTimeout(() => {
                            setExpandedSections(prev => ({ ...prev, [section.title]: false }));
                          }, 250);
                        }}
                      />
                      <Pressable
                        onPress={() => {
                          setExpandedSections(prev => ({
                            ...prev,
                            [section.title]: !prev[section.title]
                          }));
                        }}
                        style={{ padding: wp('1.5%'), marginRight: -wp('1.5%') }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <AnimatedArrow isExpanded={!!expandedSections[section.title]} />
                      </Pressable>
                    </View>

                    <AnimatedDropdown isExpanded={!!expandedSections[section.title]}>
                      <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        style={{ width: '100%' }}
                      >
                        {section.options
                          .filter(opt => opt.label.toLowerCase().includes((searchQueries[section.title] || '').toLowerCase()))
                          .slice(0, 15)
                          .map(opt => {
                            const isSelected = selected[section.title]?.includes(opt.key);
                            return (
                              <TouchableOpacity
                                key={opt.key}
                                style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                                onPress={() => {
                                  onSelect(section.title, opt.key);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextActive]}>
                                  {opt.label}
                                </Text>
                                {isSelected && <Check color={Colors.primary} size={RFValue(12)} />}
                              </TouchableOpacity>
                            );
                          })}
                      </ScrollView>
                    </AnimatedDropdown>
                  </View>
                ) : (
                  <View style={styles.optionsRow}>
                    {section.options.map(opt => {
                      const isSelected = selected[section.title]?.includes(opt.key);
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => onSelect(section.title, opt.key)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
            <View style={{ height: hp('5%') }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
              <RotateCcw size={RFValue(12)} color={Colors.textSecondary} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
              <Text style={styles.applyText}>Apply Selection</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopRightRadius: wp('6%'),
    borderBottomRightRadius: wp('6%'),
    width: wp('85%'),
    height: '100%',
    paddingTop: hp('2%'),
  },
  handle: {
    width: wp('10%'),
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: hp('0.5%'),
    marginBottom: hp('0.5%'),
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  sheetTitle: { fontSize: RFValue(12), fontWeight: '700', color: Colors.textPrimary },
  sheetSubtitle: { fontSize: RFValue(9), color: Colors.textSecondary, marginTop: 1 },
  closeBtn: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { paddingHorizontal: wp('4%') },
  section: { marginBottom: hp('1.3%') },
  sectionTitle: { fontSize: RFValue(10), fontWeight: '600', color: Colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: wp('2%') },
  chip: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary + '08',
    borderColor: Colors.primary,
  },
  chipText: { fontSize: RFValue(10), color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.primary, fontWeight: '600' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  rangeValueText: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.primary,
  },
  sliderContainer: {
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    marginVertical: hp('1%'),
  },
  sliderMarker: {
    height: wp('5%'),
    width: wp('5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderMarkerPressed: {
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.primary,
  },
  minmaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('1%'),
  },
  minmaxInputWrapper: {
    flex: 1,
  },
  minmaxLabel: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    marginBottom: hp('0.5%'),
  },
  minmaxInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  minmaxDash: {
    fontSize: RFValue(12),
    color: Colors.textSecondary,
    marginTop: hp('2%'),
  },
  searchableContainer: {
    gap: hp('1%'),
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.2%'),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
  },
  dropdownHeaderText: {
    fontSize: RFValue(10),
    color: Colors.textTertiary,
  },
  dropdownHeaderTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  dropdownContent: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: wp('2%'),
    marginTop: hp('0.5%'),
    maxHeight: hp('25%'),
  },
  dropdownItem: {
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '15',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primary + '05',
  },
  dropdownItemText: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
  },
  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  searchBoxModal: {
    backgroundColor: Colors.background,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    height: hp('4.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBoxModalFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  searchBoxInput: {
    flex: 1,
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    padding: 0,
  },
  selectedOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp('6%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('4%'),
    gap: wp('3%'),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border + '30',
  },
  resetBtn: {
    flex: 0.8,
    height: hp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1.5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetText: { fontSize: RFValue(11), color: Colors.textSecondary, fontWeight: '600' },
  applyBtn: {
    flex: 1.2,
    height: hp('4%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: { fontSize: RFValue(11), color: Colors.white, fontWeight: '700' },
});

export default FilterModal;
