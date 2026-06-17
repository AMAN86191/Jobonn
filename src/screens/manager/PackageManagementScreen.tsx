import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyPackagesSlice } from '../../redux/CompanyHomeSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Briefcase, Building2, Check, CreditCard, ShieldCheck, Users, Crown } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';


const getTierTheme = (packageName: string) => {
  const name = packageName.toLowerCase();
  if (name.includes('starter') || name.includes('bronze')) {
    return {
      primaryColor: '#1D4ED8',
      bgColor: '#EFF6FF',
      icon: Briefcase,
    };
  } else if (name.includes('silver') || name.includes('growth')) {
    return {
      primaryColor: '#4B5563', // Slate/Gray tone for Silver
      bgColor: '#F3F4F6',
      icon: Building2,
    };
  } else if (name.includes('gold') || name.includes('premium')) {
    return {
      primaryColor: '#D97706', // Gold/Amber tone
      bgColor: '#FEF3C7',
      icon: Crown,
    };
  } else if (name.includes('platinum') || name.includes('diamond')) {
    return {
      primaryColor: '#7C3AED', // Violet tone
      bgColor: '#F5F3FF',
      icon: Crown,
    };
  } else {
    return {
      primaryColor: '#9B5DE0', // Default purple brand theme
      bgColor: '#EEF1FF',
      icon: Crown,
    };
  }
};

const PackageManagementScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getCompanyPackagesSlice() as any).unwrap();
      console.log('response', response);
      const data = response?.data || response || [];
      setPackages(data);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (item: any) => {
    console.log('Purchase requested for package:', item);
    Toast.show({
      type: 'success',
      text1: 'Purchase Initiated',
      text2: `Starting purchase process for ${item.package_name || 'Package'}`,
    });
  };

  useEffect(() => {
    fetchPackages();
  }, [dispatch]);

  useEffect(() => {
    if (packages.length > 0 && selectedPackageId === null) {
      setSelectedPackageId(packages[0].id);
    }
  }, [packages, selectedPackageId]);



  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <CommanManagerHeader title="Package Management" navigation={navigation} onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* <View style={styles.creditCard}>
          <View style={styles.creditHeader}>
            <View style={styles.creditTitleRow}>
              <CreditCard size={RFValue(14)} color={Colors.primary} />
              <Text style={styles.creditTitle}>Contact Unlock Credits</Text>
            </View>
            <Text style={styles.creditPill}>{contactCredits.remaining} remaining</Text>
          </View>
          <View style={styles.creditProgressTrack}>
            <View style={[styles.creditProgressFill, { width: `${(contactCredits.used / contactCredits.total) * 100}%` }]} />
          </View>
          <Text style={styles.creditSub}>{contactCredits.used} used from {contactCredits.total}. Credits deduct only when contact details are unlocked.</Text>
        </View> */}


        {loading && packages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: hp('30%') }}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          packages.map((item: any) => {

            const theme = getTierTheme(item.package_name || '');
            const Icon = theme.icon;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.packageCard}
                activeOpacity={0.85}
              >
                <View style={styles.packageHeader}>
                  <View style={styles.packageHeaderLeft}>
                    <View style={[styles.tierIconContainer, { backgroundColor: theme.bgColor }]}>
                      <Icon size={RFValue(16)} color={theme.primaryColor} />
                    </View>
                    <View style={styles.packageTitleContainer}>
                      <Text style={styles.packageName}>{item.package_name}</Text>
                      <Text style={styles.packageAudience}>{item.duration_in_months} Month{item.duration_in_months > 1 ? 's' : ''} Plan</Text>
                    </View>
                  </View>
                  {/* {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedText}>Selected</Text>
                    </View>
                  )} */}
                </View>

                <Text style={[styles.packagePrice, { color: theme.primaryColor }]}>₹{item.price}</Text>

                <View style={styles.limitGrid}>
                  <View style={styles.limitCol}>
                    <Briefcase size={RFValue(12)} color={theme.primaryColor} />
                    <Text style={styles.limitValue}>{item.no_of_job_post || 0}</Text>
                    <Text style={styles.limitLabel}>Jobs</Text>
                  </View>
                  <View style={styles.limitColDivider} />
                  <View style={styles.limitCol}>
                    <Building2 size={RFValue(12)} color={theme.primaryColor} />
                    <Text style={styles.limitValue}>{item.no_of_location || 0}</Text>
                    <Text style={styles.limitLabel}>Locations</Text>
                  </View>
                  <View style={styles.limitColDivider} />
                  <View style={styles.limitCol}>
                    <Users size={RFValue(12)} color={theme.primaryColor} />
                    <Text style={styles.limitValue}>{item.no_of_users || 0}</Text>
                    <Text style={styles.limitLabel}>Users</Text>
                  </View>
                  <View style={styles.limitColDivider} />
                  <View style={styles.limitCol}>
                    <CreditCard size={RFValue(12)} color={theme.primaryColor} />
                    <Text style={styles.limitValue}>{item.no_of_profile || 0}</Text>
                    <Text style={styles.limitLabel}>Profiles</Text>
                  </View>
                </View>

                {item.package_desc ? (
                  <View style={styles.assignedFooter}>
                    <Text style={[styles.assignedLabel, { fontSize: RFValue(8), color: Colors.textSecondary, lineHeight: RFValue(11) }]} numberOfLines={3}>
                      {item.package_desc}
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.purchaseBtn, { backgroundColor: Colors.primary }]}
                  onPress={() => handlePurchase(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.purchaseBtnText}>Purchase Now</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
        {/* 
        <Text style={styles.sectionTitle}>Company Verification</Text>
        <View style={styles.verificationCard}>
          {managedCompanies.map(company => (
            <View key={company.id} style={styles.companyRow}>
              <View style={styles.companyLeft}>
                <View style={styles.companyIcon}>
                  <ShieldCheck size={RFValue(10)} color={company.verification === 'Active Company' ? Colors.success : Colors.warning} />
                </View>
                <View>
                  <Text style={styles.companyName}>{company.name}</Text>
                  <Text style={styles.companyMeta}>{company.role}</Text>
                </View>
              </View>
              <Text style={[styles.companyStatus, company.verification === 'Active Company' ? styles.companyStatusActive : styles.companyStatusPending]}>
                {company.verification}
              </Text>
            </View>
          ))}
        </View> */}

        {/* <Text style={styles.sectionTitle}>Revenue Model</Text>
        <View style={styles.revenueCard}>
          {revenueStreams.map(stream => (
            <View key={stream.id} style={styles.revenueRow}>
              <View>
                <Text style={styles.revenueTitle}>{stream.title}</Text>
                <Text style={styles.revenueSub}>{stream.subtitle}</Text>
              </View>
              <Text style={styles.revenueValue}>{stream.value}</Text>
            </View>
          ))}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: wp('2%'), paddingBottom: hp('4%') },
  creditCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
  },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  creditTitleRow: { flexDirection: 'row', alignItems: 'center', gap: wp('2%') },
  creditTitle: { fontSize: RFValue(10.5), color: Colors.textPrimary, fontWeight: '800' },
  creditPill: {
    fontSize: RFValue(8),
    color: Colors.primary,
    fontWeight: '800',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('2%'),
  },
  creditProgressTrack: {
    height: hp('0.8%'),
    backgroundColor: Colors.borderLight,
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginBottom: hp('0.8%'),
  },
  creditProgressFill: { height: '100%', backgroundColor: Colors.primary },
  creditSub: { fontSize: RFValue(8), color: Colors.textSecondary, fontWeight: '600' },
  sectionTitle: {
    fontSize: RFValue(10.5),
    color: Colors.textPrimary,
    fontWeight: '800',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  packageCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight || '#ECECEC',
    borderRadius: wp('4.5%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  packageCardActive: {
    borderColor: Colors.borderLight || '#ECECEC',
    borderWidth: 1,
  },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  packageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  tierIconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageTitleContainer: {
    justifyContent: 'center',
  },
  packageName: { fontSize: RFValue(12), color: Colors.textPrimary, fontWeight: '700' },
  packageAudience: { fontSize: RFValue(9), color: Colors.textSecondary, fontWeight: '500', marginTop: hp('0.2%') },
  selectedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('5%'),
  },
  selectedText: { fontSize: RFValue(8), color: Colors.white, fontWeight: '700' },
  packagePrice: { fontSize: RFValue(11.5), fontWeight: '700', marginTop: hp('1.5%'), marginBottom: hp('1.5%') },
  limitGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: hp('1.5%'),
    marginTop: hp('1%'),
  },
  limitCol: {
    flex: 1,
    alignItems: 'center',
    gap: hp('0.5%'),
  },
  limitColDivider: {
    width: 1,
    height: hp('4.5%'),
    backgroundColor: '#E5E7EB',
  },
  limitValue: { fontSize: RFValue(11.5), color: Colors.textPrimary, fontWeight: '700' },
  limitLabel: { fontSize: RFValue(8), color: Colors.textSecondary, fontWeight: '500' },
  assignedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  assignedLabel: { fontSize: RFValue(7.5), color: Colors.textSecondary, fontWeight: '500' },
  assignedValue: { fontSize: RFValue(9), color: Colors.textPrimary, fontWeight: '600' },
  purchaseBtn: {
    borderRadius: 8,
    paddingVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1.5%'),
  },
  purchaseBtnText: {
    color: Colors.white,
    fontSize: RFValue(9.5),
    fontWeight: '800',
  },

  verificationCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('3%'),
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  companyLeft: { flexDirection: 'row', alignItems: 'center', gap: wp('2%'), flex: 1 },
  companyIcon: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: { fontSize: RFValue(8.8), color: Colors.textPrimary, fontWeight: '800' },
  companyMeta: { fontSize: RFValue(7.5), color: Colors.textSecondary, fontWeight: '600' },
  companyStatus: { fontSize: RFValue(7.5), fontWeight: '800' },
  companyStatusActive: { color: Colors.success },
  companyStatusPending: { color: Colors.warning },
  revenueCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    marginBottom: hp('3%'),
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.1%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  revenueTitle: { fontSize: RFValue(8.8), color: Colors.textPrimary, fontWeight: '800' },
  revenueSub: { fontSize: RFValue(7.4), color: Colors.textSecondary, fontWeight: '600', marginTop: hp('0.2%') },
  revenueValue: { fontSize: RFValue(8.8), color: Colors.primary, fontWeight: '800' },
});

export default PackageManagementScreen;
