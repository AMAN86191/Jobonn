import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyPackagesSlice, packagePurchaseSlice } from '../../redux/CompanyHomeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Briefcase, Building2, Check, CreditCard, ShieldCheck, Users, Crown, ArrowLeft, Calendar, Headphones, MapPin, FileText, Gift, Lock, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import LinearGradient from 'react-native-linear-gradient';
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [purchasedPackages, setPurchasedPackages] = useState<any[]>([]);

  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const fetchPackages = async (isPullToRefresh = false) => {
    if (!isPullToRefresh) setLoading(true);
    try {
      const response = await dispatch(getCompanyPackagesSlice() as any).unwrap();
      console.log('fetchPackages response:', response);
      const data = response?.packages?.data || response?.data || response || [];
      setPackages(data);

      if (response?.purchased_packages) {
        setCurrentPlan(response.purchased_packages[0]);
        setPurchasedPackages(response.purchased_packages);
      } else {
        setCurrentPlan(null);
        setPurchasedPackages([]);
      }
    } catch (error) {
      console.log('error fetching packages:', error);
    } finally {
      if (!isPullToRefresh) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPackages(true);
    setRefreshing(false);
  };


  const handlePurchase = async (item: any) => {
    console.log('Purchase requested for package:', item);
    let companyId = null;
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        companyId = parsed.company_id || parsed.company?.id || parsed.id || 3;
      }
    } catch (err) {
      console.log('Error reading company_id from AsyncStorage', err);
    }

    const payload = {
      company_id: Number(companyId),
      package_id: Number(item.id),
      price_paid: Number(item.price || 0),
      duration_in_months: Number(item.duration_in_months || 0),
      transaction_id: "TXN_20260610123456"
    };

    console.log('Purchase payload:', payload);

    try {
      const response = await dispatch(packagePurchaseSlice(payload) as any).unwrap();
      console.log('response', response);
      if (response && (response.status === false || (response.status_code && response.status_code !== 200 && response.status_code !== 201 && response.status_code !== '200' && response.status_code !== '201'))) {
        const message = response.message || 'Failed to purchase package';
        Toast.show({
          type: 'error',
          text1: 'Purchase Failed',
          text2: message,
        });
        return;
      }
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Package purchased successfully!',
      });
      fetchPackages();
    } catch (error: any) {
      console.log('error', error);
      let errorMessage = 'Something went wrong';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if (error.errors && typeof error.errors === 'object') {
          const firstKey = Object.keys(error.errors)[0];
          const errorsVal = error.errors[firstKey];
          if (Array.isArray(errorsVal) && errorsVal.length > 0) {
            errorMessage = errorsVal[0];
          } else if (typeof errorsVal === 'string') {
            errorMessage = errorsVal;
          } else {
            errorMessage = error.message || 'Validation error';
          }
        } else {
          errorMessage = error.message || error.error || 'Something went wrong';
        }
      }

      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchPackages();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPackages();
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  useEffect(() => {
    if (packages.length > 0 && selectedPackageId === null) {
      setSelectedPackageId(packages[0].id);
    }
  }, [packages, selectedPackageId]);

  const formatRenewalDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options);
    } catch (e) {
      return '';
    }
  };

  const formatLimitValue = (val: any, packageName: string) => {
    if (packageName.toLowerCase().includes('platinum')) {
      return 'Unlimited';
    }
    if (val === null || val === undefined || val === -1 || val === 9999 || val === 0) {
      if (val === 0) return '0';
      return 'Unlimited';
    }
    return String(val);
  };



  // Helper function for rendering package limit values

  const formatGridValue = (used: number, total: any) => {
    if (total === null || total === undefined || total === -1 || total === 9999) {
      return `${used} / Unlimited`;
    }
    return `${used} / ${total}`;
  };

  const getProgressPercentage = (used: number, total: any) => {
    if (total === null || total === undefined || total === -1 || total === 9999 || total <= 0) {
      return 0;
    }
    return Math.min(100, (used / total) * 100);
  };

  // Get unique active plans by package_id
  const activePlans = purchasedPackages.filter(
    (plan: any, index: number, self: any[]) =>
      plan.status === 'active' &&
      self.findIndex((p: any) => p.package_id === plan.package_id) === index
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <CommanManagerHeader title='Package Management' navigation={navigation} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Dynamic Current Plan Cards (Gradient Background) */}
        {activePlans.length === 0 ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PackageDetails', { currentPlan: null, purchasedPackages })}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.currentPlanCard}
            >
              <View style={styles.currentPlanMain}>
                <View style={styles.currentPlanLeft}>
                  <View style={styles.currentPlanIconContainer}>
                    <Building2 size={RFValue(18)} color={Colors.white} />
                  </View>
                  <View style={styles.currentPlanDetails}>
                    <Text style={styles.currentPlanName}>No Active Plan</Text>
                    <Text style={[styles.currentPlanDuration, { color: 'rgba(255,255,255,0.85)' }]}>
                      Subscribe to a plan below to start hiring talent.
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          activePlans.map((planItem: any) => {
            const activePkg = planItem?.package || null;
            const renDate = formatRenewalDate(planItem?.expiry_date || planItem?.expires_at);
            const jTotal = activePkg?.no_of_job_post || 0;
            const jUsed = planItem?.used_job_posts || 0;
            const uTotal = activePkg?.no_of_users || 0;
            const uUsed = planItem?.used_users || 0;
            const pTotal = activePkg?.no_of_profile || 0;
            const pUsed = planItem?.used_profile_views || 0;

            return (
              <TouchableOpacity
                key={planItem.id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('PackageDetails', { currentPlan: planItem, purchasedPackages })}
                style={{ marginBottom: hp('1.5%') }}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.currentPlanCard}
                >
                  <View style={styles.currentPlanHeader}>
                    <View style={styles.currentBadge}>
                      <Check size={RFValue(8)} color={Colors.primary} strokeWidth={3} />
                      <Text style={styles.currentBadgeText}>CURRENT PLAN</Text>
                    </View>
                  </View>

                  <View style={styles.currentPlanMain}>
                    <View style={styles.currentPlanLeft}>
                      <View style={styles.currentPlanIconContainer}>
                        <Building2 size={RFValue(18)} color={Colors.white} />
                      </View>
                      <View style={styles.currentPlanDetails}>
                        <Text style={styles.currentPlanName}>{activePkg?.package_name || 'Silver Package'}</Text>
                        <Text style={styles.currentPlanDuration}>{activePkg?.duration_in_months || 1} Month Plan</Text>
                        {renDate ? (
                          <View style={styles.currentPlanRenewalRow}>
                            <Calendar size={RFValue(8)} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.currentPlanRenewalText}>Expires on {renDate}</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.currentPlanRight}>
                      <Text style={styles.currentPlanPrice}>₹{parseFloat(planItem?.price_paid || activePkg?.price || '299')}</Text>
                      <Text style={styles.currentPlanPriceSub}>/{activePkg?.duration_in_months === 12 ? 'year' : 'month'}</Text>
                    </View>
                  </View>

                  <View style={styles.currentPlanGrid}>
                    {/* Job Posts */}
                    <View style={styles.currentPlanGridCol}>
                      <View style={styles.currentPlanGridIconCircle}>
                        <Briefcase size={RFValue(10)} color={Colors.white} />
                      </View>
                      <Text style={styles.currentPlanGridValue}>{formatGridValue(jUsed, jTotal)}</Text>
                      <Text style={styles.currentPlanGridLabel}>Job Posts</Text>
                      <View style={styles.currentProgressTrack}>
                        <View style={[styles.currentProgressFill, { width: `${getProgressPercentage(jUsed, jTotal)}%` }]} />
                      </View>
                    </View>

                    {/* Users */}
                    <View style={styles.currentPlanGridCol}>
                      <View style={styles.currentPlanGridIconCircle}>
                        <Users size={RFValue(10)} color={Colors.white} />
                      </View>
                      <Text style={styles.currentPlanGridValue}>{formatGridValue(uUsed, uTotal)}</Text>
                      <Text style={styles.currentPlanGridLabel}>Users</Text>
                      <View style={styles.currentProgressTrack}>
                        <View style={[styles.currentProgressFill, { width: `${getProgressPercentage(uUsed, uTotal)}%` }]} />
                      </View>
                    </View>

                    {/* Profiles */}
                    <View style={styles.currentPlanGridCol}>
                      <View style={styles.currentPlanGridIconCircle}>
                        <FileText size={RFValue(10)} color={Colors.white} />
                      </View>
                      <Text style={styles.currentPlanGridValue}>{formatGridValue(pUsed, pTotal)}</Text>
                      <Text style={styles.currentPlanGridLabel}>Profiles</Text>
                      <View style={styles.currentProgressTrack}>
                        <View style={[styles.currentProgressFill, { width: `${getProgressPercentage(pUsed, pTotal)}%` }]} />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        )}

        {/* Secure Trust Bar */}
        <View style={styles.trustBar}>
          <View style={styles.trustItem}>
            <ShieldCheck size={RFValue(11)} color={Colors.primary} />
            <Text style={styles.trustText}>Secure Payments</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Check size={RFValue(11)} color={Colors.primary} />
            <Text style={styles.trustText}>Instant Activation</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Headphones size={RFValue(11)} color={Colors.primary} />
            <Text style={styles.trustText}>Priority Support</Text>
          </View>
        </View>



        {/* Plan Cards List */}
        {loading && packages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: hp('30%') }}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <View style={{ gap: hp('2%') }}>
            {/* Active Plan Details Cards */}
            {activePlans.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.planSectionTitle}>Active Plan Details</Text>
                {activePlans.map((planItem: any) => {
                  const activeItem = packages.find((item: any) => planItem.package_id === item.id);
                  if (!activeItem) return null;

                  const theme = getTierTheme(activeItem.package_name || '');
                  const Icon = theme.icon;
                  const displayPrice = activeItem.price;
                  const displayPriceSub = activeItem.duration_in_months === 12 ? '/year' : '/month';
                  const displayDuration = activeItem.duration_in_months === 12 ? '12 Month Plan' : `${activeItem.duration_in_months} Month Plan`;

                  return (
                    <View key={activeItem.id} style={[styles.planCard, styles.planCardActiveBorder, { marginBottom: hp('1.5%') }]}>
                      <View style={styles.activeLabelRibbon}>
                        <Text style={styles.activeLabelText}>CURRENT ACTIVE</Text>
                      </View>
                      <View style={styles.planCardHeader}>
                        <View style={styles.planCardHeaderLeft}>
                          <View style={[styles.planIconContainer, { backgroundColor: theme.bgColor }]}>
                            <Icon size={RFValue(16)} color={theme.primaryColor} />
                          </View>
                          <View style={styles.planTitleContainer}>
                            <Text style={styles.planName}>{activeItem.package_name}</Text>
                            <Text style={styles.planDuration}>{displayDuration}</Text>
                          </View>
                        </View>
                        <View style={styles.planCardHeaderRight}>
                          <View style={styles.planPriceContainer}>
                            <Text style={styles.planPrice}>₹{displayPrice}</Text>
                            <Text style={styles.planPriceSub}>{displayPriceSub}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.planFeaturesGrid}>
                        {/* Job Posts */}
                        <View style={styles.planFeatureCol}>
                          <Briefcase size={RFValue(12)} color={theme.primaryColor} />
                          <Text style={styles.planFeatureValue}>{formatLimitValue(activeItem.no_of_job_post, activeItem.package_name)}</Text>
                          <Text style={styles.planFeatureLabel}>Job Posts</Text>
                        </View>
                        <View style={styles.planFeatureDivider} />

                        {/* Locations */}
                        <View style={styles.planFeatureCol}>
                          <MapPin size={RFValue(12)} color={theme.primaryColor} />
                          <Text style={styles.planFeatureValue}>{formatLimitValue(activeItem.no_of_location, activeItem.package_name)}</Text>
                          <Text style={styles.planFeatureLabel}>Locations</Text>
                        </View>
                        <View style={styles.planFeatureDivider} />

                        {/* Users */}
                        <View style={styles.planFeatureCol}>
                          <Users size={RFValue(12)} color={theme.primaryColor} />
                          <Text style={styles.planFeatureValue}>{formatLimitValue(activeItem.no_of_users, activeItem.package_name)}</Text>
                          <Text style={styles.planFeatureLabel}>Users</Text>
                        </View>
                        <View style={styles.planFeatureDivider} />

                        {/* Profiles */}
                        <View style={styles.planFeatureCol}>
                          <FileText size={RFValue(12)} color={theme.primaryColor} />
                          <Text style={styles.planFeatureValue}>{formatLimitValue(activeItem.no_of_profile, activeItem.package_name)}</Text>
                          <Text style={styles.planFeatureLabel}>Profiles</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
                        onPress={() => navigation.navigate('PackageDetails', { currentPlan: planItem, purchasedPackages })}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionBtnText}>Manage & View Usage</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Available Upgrade Plans Card */}
            <View style={styles.sectionContainer}>
              <Text style={styles.planSectionTitle}>Available Upgrade Plans</Text>
              {packages
                .filter((item: any) => !activePlans.some((p: any) => p.package_id === item.id))
                .map((item: any) => {
                  const isMostPopular = item.package_name.toLowerCase().includes('silver');
                  const theme = getTierTheme(item.package_name || '');
                  const Icon = theme.icon;

                  const displayPrice = item.price;
                  const displayPriceSub = item.duration_in_months === 12 ? '/year' : '/month';
                  const displayDuration = item.duration_in_months === 12 ? '12 Month Plan' : `${item.duration_in_months} Month Plan`;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.9}
                      onPress={() => navigation.navigate('PackageDetails', {
                        currentPlan,
                        purchasedPackages,
                        packageItem: item
                      })}
                    >
                      <View
                        style={[
                          styles.planCard,
                          isMostPopular && styles.planCardHighlighted
                        ]}
                      >
                        {isMostPopular && (
                          // <View style={styles.ribbonBadge}>
                          //   <Text style={styles.ribbonText}>MOST POPULAR</Text>
                          // </View>
                          <></>
                        )}

                        <View style={styles.planCardHeader}>
                          <View style={styles.planCardHeaderLeft}>
                            <View style={[styles.planIconContainer, { backgroundColor: theme.bgColor }]}>
                              <Icon size={RFValue(16)} color={theme.primaryColor} />
                            </View>
                            <View style={styles.planTitleContainer}>
                              <Text style={styles.planName}>{item.package_name}</Text>
                              <Text style={styles.planDuration}>{displayDuration}</Text>
                            </View>
                          </View>
                          <View style={styles.planCardHeaderRight}>
                            <View style={styles.planPriceContainer}>
                              <Text style={styles.planPrice}>₹{displayPrice}</Text>
                              <Text style={styles.planPriceSub}>{displayPriceSub}</Text>
                            </View>
                            <ChevronRight size={RFValue(12)} color={Colors.textTertiary} />
                          </View>
                        </View>

                        <View style={styles.planFeaturesGrid}>
                          {/* Job Posts */}
                          <View style={styles.planFeatureCol}>
                            <Briefcase size={RFValue(12)} color={theme.primaryColor} />
                            <Text style={styles.planFeatureValue}>{formatLimitValue(item.no_of_job_post, item.package_name)}</Text>
                            <Text style={styles.planFeatureLabel}>Job Posts</Text>
                          </View>
                          <View style={styles.planFeatureDivider} />

                          {/* Locations */}
                          <View style={styles.planFeatureCol}>
                            <MapPin size={RFValue(12)} color={theme.primaryColor} />
                            <Text style={styles.planFeatureValue}>{formatLimitValue(item.no_of_location, item.package_name)}</Text>
                            <Text style={styles.planFeatureLabel}>Locations</Text>
                          </View>
                          <View style={styles.planFeatureDivider} />

                          {/* Users */}
                          <View style={styles.planFeatureCol}>
                            <Users size={RFValue(12)} color={theme.primaryColor} />
                            <Text style={styles.planFeatureValue}>{formatLimitValue(item.no_of_users, item.package_name)}</Text>
                            <Text style={styles.planFeatureLabel}>Users</Text>
                          </View>
                          <View style={styles.planFeatureDivider} />

                          {/* Profiles */}
                          <View style={styles.planFeatureCol}>
                            <FileText size={RFValue(12)} color={theme.primaryColor} />
                            <Text style={styles.planFeatureValue}>{formatLimitValue(item.no_of_profile, item.package_name)}</Text>
                            <Text style={styles.planFeatureLabel}>Profiles</Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.actionBtnOutlined,
                            { borderColor: theme.primaryColor }
                          ]}
                          onPress={() => {
                            const purchaseItem = {
                              ...item,
                              price: displayPrice,
                              duration_in_months: item.duration_in_months
                            };
                            handlePurchase(purchaseItem);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.actionBtnOutlinedText, { color: theme.primaryColor }]}>
                            {currentPlan && currentPlan.status === 'active' ? 'Upgrade Now' : 'Purchase Now'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        )}


        {/* Footer Security */}
        <View style={styles.securityFooter}>
          <Lock size={RFValue(10)} color={Colors.textSecondary} />
          <Text style={styles.securityFooterText}>All payments are secure and encrypted</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: wp('3%'), paddingBottom: hp('4%') },

  // Gradient Current Plan Card
  currentPlanCard: {
    borderRadius: wp('4%'),
    padding: wp('3%'),
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('3%'),
    gap: wp('1%'),
  },
  currentBadgeText: {
    fontSize: RFValue(7),
    color: Colors.primary,
    fontWeight: '800',
  },
  currentPlanMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  currentPlanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  currentPlanIconContainer: {
    width: wp('10.5%'),
    height: wp('10.5%'),
    borderRadius: wp('5.25%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPlanDetails: {
    justifyContent: 'center',
  },
  currentPlanName: {
    fontSize: RFValue(11.5),
    color: Colors.white,
    fontWeight: '700',
  },
  currentPlanDuration: {
    fontSize: RFValue(7.5),
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: hp('0.1%'),
  },
  currentPlanRenewalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    marginTop: hp('0.4%'),
  },
  currentPlanRenewalText: {
    fontSize: RFValue(7.5),
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  currentPlanRight: {
    alignItems: 'flex-end',
  },
  currentPlanPrice: {
    fontSize: RFValue(15),
    color: Colors.white,
    fontWeight: '700',
  },
  currentPlanPriceSub: {
    fontSize: RFValue(8.5),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  currentPlanGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: hp('1.5%'),
  },
  currentPlanGridCol: {
    flex: 1,
    alignItems: 'center',
  },
  currentPlanGridIconCircle: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    borderRadius: wp('2.75%'),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.4%'),
  },
  currentPlanGridValue: {
    fontSize: RFValue(8.5),
    color: Colors.white,
    fontWeight: '800',
  },
  currentPlanGridLabel: {
    fontSize: RFValue(7.5),
    color: 'rgba(255, 255, 255, 0.7)',
  },
  currentProgressTrack: {
    height: hp('0.4%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp('1%'),
    overflow: 'hidden',
    marginTop: hp('0.5%'),
    width: wp('12%'),
  },
  currentProgressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: wp('1%'),
  },

  // Trust Bar
  trustBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#ECEEF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  trustText: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  trustDivider: {
    width: 1,
    height: hp('2%'),
    backgroundColor: '#ECEEF2',
  },

  // Available plans header / filter
  planFilterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
  },
  availableTitle: {
    fontSize: RFValue(12.5),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: wp('0.8%'),
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: '#ECEEF2',
  },
  filterTab: {
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('3%'),
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: RFValue(8.8),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  savePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('2%'),
    marginLeft: wp('1.5%'),
  },
  savePillText: {
    fontSize: RFValue(7.5),
    color: '#10B981',
    fontWeight: '800',
  },

  // Plan Cards
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('4.5%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#ECEEF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardHighlighted: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  ribbonBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.4%'),
    borderBottomRightRadius: wp('3%'),
  },
  ribbonText: {
    fontSize: RFValue(7.5),
    color: Colors.white,
    fontWeight: '800',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('0.8%'),
  },
  planCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  planIconContainer: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  planTitleContainer: {
    justifyContent: 'center',
  },
  planName: {
    fontSize: RFValue(10.5),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  planDuration: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.1%'),
  },
  planCardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: RFValue(13),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  planPriceSub: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  planFeaturesGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: hp('1.2%'),
    marginTop: hp('1.8%'),
    marginBottom: hp('1.8%'),
  },
  planFeatureCol: {
    flex: 1,
    alignItems: 'center',
    gap: hp('0.3%'),
  },
  planFeatureDivider: {
    width: 1,
    height: hp('3.5%'),
    backgroundColor: '#E5E7EB',
  },
  planFeatureValue: {
    fontSize: RFValue(10.5),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  planFeatureLabel: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: wp('2.5%'),
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: RFValue(9.5),
    fontWeight: '800',
  },
  actionBtnOutlined: {
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionBtnOutlinedText: {
    fontSize: RFValue(9.5),
    fontWeight: '800',
  },
  // Security Footer
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1%'),
  },
  securityFooterText: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sectionContainer: {
    marginVertical: hp('0.2%'),
  },
  planSectionTitle: {
    fontSize: RFValue(10),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planCardActiveBorder: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
  },
  activeLabelRibbon: {
    position: 'absolute',
    top: hp('0.5%'),
    right: wp('3%'),
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('1%'),
  },
  activeLabelText: {
    fontSize: RFValue(7.5),
    fontWeight: '800',
    color: Colors.white,
  },
});

export default PackageManagementScreen;
