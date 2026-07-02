import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, RefreshControl, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import {
  Building2, Calendar, Briefcase, MapPin, Users, FileText, CreditCard, CheckCircle2, Clock, ShieldCheck
} from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { getCompanyPackagesSlice, packagePurchaseSlice } from '../../redux/CompanyHomeSlice';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const PackageDetailsScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(route.params?.currentPlan || null);
  const [purchasedPackages, setPurchasedPackages] = useState<any[]>(route.params?.purchasedPackages || []);

  const packageItem = route.params?.packageItem || null;

  const fetchPackages = async (isPullToRefresh = false) => {
    if (!isPullToRefresh) setLoading(true);
    try {
      const response = await dispatch(getCompanyPackagesSlice() as any).unwrap();
      console.log('fetchPackages response in details:', response);
      if (response?.purchased_packages) {
        setPurchasedPackages(response.purchased_packages);
        // Find active plan or default to first
        const active = response.purchased_packages.find((p: any) => p.status === 'active') || response.purchased_packages[0];
        setCurrentPlan(active);
      }
    } catch (error) {
      console.log('error fetching packages in details:', error);
    } finally {
      if (!isPullToRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    if (!route.params?.currentPlan) {
      fetchPackages();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPackages(true);
    setRefreshing(false);
  };

  const handlePurchase = async (item: any) => {
    console.log('Purchase requested in details screen:', item);
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
      transaction_id: "TXN_" + Date.now()
    };

    console.log('Purchase payload details screen:', payload);

    try {
      setPurchasing(true);
      const response = await dispatch(packagePurchaseSlice(payload) as any).unwrap();
      console.log('purchase response:', response);
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
      // Pop screen to go back
      navigation.goBack();
    } catch (error: any) {
      console.log('purchase error:', error);
      let errorMessage = 'Something went wrong';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if (error.errors && typeof error.errors === 'object') {
          const firstKey = Object.keys(error.errors)[0];
          const errorsVal = error.errors[firstKey];
          if (Array.isArray(errorsVal) && errorsVal.length > 0) {
            errorMessage = errorsVal[0];
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
    } finally {
      setPurchasing(false);
    }
  };

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
    if (packageName?.toLowerCase().includes('platinum')) {
      return 'Unlimited';
    }
    if (val === null || val === undefined || val === -1 || val === 9999 || val === 0) {
      if (val === 0) return '0';
      return 'Unlimited';
    }
    return String(val);
  };

  const getProgressPercentage = (used: number, total: any) => {
    if (total === null || total === undefined || total === -1 || total === 9999 || total <= 0) {
      return 0;
    }
    return Math.min(100, (used / total) * 100);
  };

  const formatGridValue = (used: number, total: any) => {
    if (total === null || total === undefined || total === -1 || total === 9999) {
      return `${used} / Unlimited`;
    }
    return `${used} / ${total}`;
  };

  const parseSummernoteHTML = (htmlStr: string, isDark = false) => {
    if (!htmlStr) return null;

    const tokens = htmlStr.match(/(<[^>]+>|[^<]+)/g) || [];
    const elements: any[] = [];
    const styleStack: any[] = [];
    let keyIndex = 0;

    const parseInlineStyle = (styleStr: string) => {
      const styles: any = {};
      if (!styleStr) return styles;
      
      const parts = styleStr.split(';');
      parts.forEach(part => {
        const [prop, val] = part.split(':').map(s => s.trim());
        if (prop && val) {
          const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          if (camelProp === 'fontWeight' && (val === '600' || val === '700' || val === '800' || val === 'bold')) {
            styles.fontWeight = 'bold';
          } else if (camelProp === 'color') {
            styles.color = val;
          } else if (camelProp === 'fontSize') {
            const numericVal = parseFloat(val);
            if (!isNaN(numericVal)) {
              styles.fontSize = RFValue(numericVal * 0.75);
            }
          }
        }
      });
      return styles;
    };

    tokens.forEach(token => {
      if (token.startsWith('<')) {
        const tagName = token.replace(/[<>]/g, '').trim().toLowerCase();
        
        if (tagName.startsWith('span')) {
          const styleMatch = token.match(/style\s*=\s*["']([^"']+)["']/i);
          const inlineStyles = styleMatch ? parseInlineStyle(styleMatch[1]) : {};
          styleStack.push({ type: 'span', styles: inlineStyles });
        } else if (tagName === 'strong' || tagName === 'b') {
          styleStack.push({ type: 'strong', styles: { fontWeight: 'bold' } });
        } else if (tagName === 'p') {
          if (elements.length > 0) {
            elements.push(<Text key={`br-${keyIndex++}`}>{'\n'}</Text>);
          }
        } else if (tagName.startsWith('br')) {
          elements.push(<Text key={`br-${keyIndex++}`}>{'\n'}</Text>);
        } else if (tagName === 'li') {
          elements.push(<Text key={`bullet-${keyIndex++}`} style={{ fontWeight: 'bold', color: isDark ? '#FFF' : Colors.primary }}>{'\n• '}</Text>);
        } else if (tagName.startsWith('/')) {
          const closingTagName = tagName.replace('/', '').trim();
          const findIndex = styleStack.slice().reverse().findIndex(s => s.type === closingTagName);
          if (findIndex !== -1) {
            const actualIndex = styleStack.length - 1 - findIndex;
            styleStack.splice(actualIndex, 1);
          }
        }
      } else {
        let text = token
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/\n/g, ' ');

        const combinedStyle = styleStack.reduce((acc, curr) => ({ ...acc, ...curr.styles }), {});

        elements.push(
          <Text
            key={`text-${keyIndex++}`}
            style={[
              {
                fontSize: RFValue(9),
                color: isDark ? 'rgba(255,255,255,0.9)' : Colors.textSecondary,
                lineHeight: hp('2.2%'),
              },
              combinedStyle,
            ]}
          >
            {text}
          </Text>
        );
      }
    });

    return (
      <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {elements}
      </Text>
    );
  };

  // If viewing prospective package details
  if (packageItem) {
    const isMostPopular = packageItem.package_name.toLowerCase().includes('silver');
    const displayPrice = packageItem.price;
    const displayPriceSub = packageItem.duration_in_months === 12 ? '/year' : '/month';
    const displayDuration = packageItem.duration_in_months === 12 ? '12 Month Plan' : `${packageItem.duration_in_months} Month Plan`;

    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <CommanManagerHeader title={packageItem.package_name} navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.planGradientCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.currentBadge}>
                <Clock size={RFValue(9)} color={Colors.primary} />
                <Text style={styles.currentBadgeText}>AVAILABLE PLAN</Text>
              </View>
              <Text style={styles.planPriceText}>₹{displayPrice}</Text>
            </View>

            <Text style={styles.planTitleName}>{packageItem.package_name}</Text>
            <Text style={styles.planDurationText}>{displayDuration}</Text>
            
           
          </LinearGradient>

          {/* Limits Info Card */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeader}>Plan Resource Allowances</Text>

            <View style={styles.detailItem}>
              <View style={styles.limitLabelContainer}>
                <Briefcase size={RFValue(12)} color={Colors.primary} />
                <Text style={styles.detailLabel}>Job Posts</Text>
              </View>
              <Text style={styles.detailValue}>
                {formatLimitValue(packageItem.no_of_job_post, packageItem.package_name)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.limitLabelContainer}>
                <FileText size={RFValue(12)} color={Colors.primary} />
                <Text style={styles.detailLabel}>Profile Views</Text>
              </View>
              <Text style={styles.detailValue}>
                {formatLimitValue(packageItem.no_of_profile, packageItem.package_name)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.limitLabelContainer}>
                <Users size={RFValue(12)} color={Colors.primary} />
                <Text style={styles.detailLabel}>Users Allowed</Text>
              </View>
              <Text style={styles.detailValue}>
                {formatLimitValue(packageItem.no_of_users, packageItem.package_name)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.limitLabelContainer}>
                <MapPin size={RFValue(12)} color={Colors.primary} />
                <Text style={styles.detailLabel}>Job Locations</Text>
              </View>
              <Text style={styles.detailValue}>
                {formatLimitValue(packageItem.no_of_location, packageItem.package_name)}
              </Text>
            </View>
          </View>

          {/* Package Details Section */}
          {packageItem.package_desc ? (
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>Package Details</Text>
              {parseSummernoteHTML(packageItem.package_desc, false)}
            </View>
          ) : null}

          {/* Secure Trust Bar */}
          <View style={[styles.cardSection, { gap: hp('1.5%') }]}>
            <View style={styles.trustBarRow}>
              <ShieldCheck size={RFValue(14)} color={Colors.success} />
              <View style={styles.trustBarTextCol}>
                <Text style={styles.trustBarTitle}>100% Secure Checkout</Text>
                <Text style={styles.trustBarSub}>Encrypted payment processing & priority activation</Text>
              </View>
            </View>
          </View>

          {/* Buy/Upgrade button */}
          <TouchableOpacity
            style={[styles.buyBtn, purchasing && { opacity: 0.8 }]}
            onPress={() => handlePurchase(packageItem)}
            disabled={purchasing}
            activeOpacity={0.85}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.buyBtnText}>
                {currentPlan && currentPlan.status === 'active' ? 'Upgrade Plan Now' : 'Purchase Plan Now'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Active Plan Details Layout
  const activePackage = currentPlan?.package || null;
  const renewalDate = formatRenewalDate(currentPlan?.expiry_date || currentPlan?.expires_at);
  const startDate = formatRenewalDate(currentPlan?.start_date);

  const jobsTotal = activePackage?.no_of_job_post || 0;
  const jobsUsed = currentPlan?.used_job_posts || 0;

  const usersTotal = activePackage?.no_of_users || 0;
  const usersUsed = currentPlan?.used_users || 0;

  const profilesTotal = activePackage?.no_of_profile || 0;
  const profilesUsed = currentPlan?.used_profile_views || 0;

  const locationsTotal = activePackage?.no_of_location || 0;
  const locationsUsed = currentPlan?.used_locations || 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <CommanManagerHeader title="Plan Details" navigation={navigation} />

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {/* Active Plan Card */}
            {!currentPlan || currentPlan?.status !== 'active' ? (
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.planGradientCard}
              >
                <View style={styles.cardHeader}>
                  <Building2 size={RFValue(20)} color={Colors.white} />
                  <Text style={styles.cardHeaderTitle}>No Active Subscription</Text>
                </View>
                <Text style={styles.cardDesc}>
                  You do not have any active packages subscribed. Choose one of our options from the Packages tab to begin recruiting candidates.
                </Text>
              </LinearGradient>
            ) : (
              <>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.planGradientCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.currentBadge}>
                      <CheckCircle2 size={RFValue(9)} color={Colors.primary} />
                      <Text style={styles.currentBadgeText}>ACTIVE PLAN</Text>
                    </View>
                    <Text style={styles.planPriceText}>
                      ₹{parseFloat(currentPlan?.price_paid || activePackage?.price || '0')}
                    </Text>
                  </View>

                  <Text style={styles.planTitleName}>{activePackage?.package_name || 'Silver Package'}</Text>
                  <Text style={styles.planDurationText}>{activePackage?.duration_in_months || 1} Month Subscription</Text>

                  <View style={styles.metaDivider} />

                  <View style={styles.datesGrid}>
                    <View style={styles.dateCell}>
                      <Calendar size={RFValue(9)} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.dateLabel}>Start Date</Text>
                      <Text style={styles.dateVal}>{startDate || 'N/A'}</Text>
                    </View>
                    <View style={styles.dateCell}>
                      <Calendar size={RFValue(9)} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.dateLabel}>Expiry Date</Text>
                      <Text style={styles.dateVal}>{renewalDate || 'N/A'}</Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* Usage Limits */}
                <View style={styles.cardSection}>
                  <Text style={styles.sectionHeader}>Usage & Resource Limits</Text>

                  {/* Job Posts Limit */}
                  <View style={styles.limitRow}>
                    <View style={styles.limitRowHeader}>
                      <View style={styles.limitLabelContainer}>
                        <Briefcase size={RFValue(12)} color={Colors.primary} />
                        <Text style={styles.limitTitle}>Job Posts</Text>
                      </View>
                      <Text style={styles.limitValue}>
                        {formatGridValue(jobsUsed, jobsTotal)}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${getProgressPercentage(jobsUsed, jobsTotal)}%` }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Profile Views Limit */}
                  <View style={styles.limitRow}>
                    <View style={styles.limitRowHeader}>
                      <View style={styles.limitLabelContainer}>
                        <FileText size={RFValue(12)} color={Colors.primary} />
                        <Text style={styles.limitTitle}>Profile Views</Text>
                      </View>
                      <Text style={styles.limitValue}>
                        {formatGridValue(profilesUsed, profilesTotal)}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${getProgressPercentage(profilesUsed, profilesTotal)}%` }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Users Limit */}
                  <View style={styles.limitRow}>
                    <View style={styles.limitRowHeader}>
                      <View style={styles.limitLabelContainer}>
                        <Users size={RFValue(12)} color={Colors.primary} />
                        <Text style={styles.limitTitle}>Users Limit</Text>
                      </View>
                      <Text style={styles.limitValue}>
                        {formatGridValue(usersUsed, usersTotal)}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${getProgressPercentage(usersUsed, usersTotal)}%` }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Locations Limit */}
                  <View style={styles.limitRow}>
                    <View style={styles.limitRowHeader}>
                      <View style={styles.limitLabelContainer}>
                        <MapPin size={RFValue(12)} color={Colors.primary} />
                        <Text style={styles.limitTitle}>Locations Limit</Text>
                      </View>
                      <Text style={styles.limitValue}>
                        {formatGridValue(locationsUsed, locationsTotal)}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${getProgressPercentage(locationsUsed, locationsTotal)}%` }
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Active Plan Description */}
                {activePackage?.package_desc ? (
                  <View style={styles.cardSection}>
                    <Text style={styles.sectionHeader}>Plan Description</Text>
                    {parseSummernoteHTML(activePackage.package_desc, false)}
                  </View>
                ) : null}

                {/* Additional Details */}
                <View style={styles.cardSection}>
                  <Text style={styles.sectionHeader}>Payment & Transactions</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Payment Status</Text>
                    <View style={[styles.statusBadge, currentPlan?.payment_status === 'paid' ? styles.statusPaid : styles.statusUnpaid]}>
                      <Text style={styles.statusText}>{currentPlan?.payment_status?.toUpperCase() || 'PAID'}</Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Transaction ID</Text>
                    <Text style={styles.detailValue}>{currentPlan?.transaction_id || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Subscription Status</Text>
                    <View style={[styles.statusBadge, currentPlan?.status === 'active' ? styles.statusActive : styles.statusExpired]}>
                      <Text style={styles.statusText}>{currentPlan?.status?.toUpperCase() || 'ACTIVE'}</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            {/* Purchase History */}
            <View style={[styles.cardSection, { marginBottom: hp('5%') }]}>
              <Text style={styles.sectionHeader}>Subscription History</Text>
              {purchasedPackages.length === 0 ? (
                <Text style={styles.noHistory}>No transaction history found</Text>
              ) : (
                purchasedPackages.map((item: any, idx: number) => {
                  const pkg = item.package || {};
                  return (
                    <View key={item.id || idx} style={styles.historyCard}>
                      <View style={styles.historyHeader}>
                        <View style={styles.historyNameRow}>
                          <Building2 size={RFValue(12)} color={Colors.primary} />
                          <Text style={styles.historyName}>{pkg.package_name || 'Silver Package'}</Text>
                        </View>
                        <Text style={styles.historyPrice}>₹{parseFloat(item.price_paid || '0')}</Text>
                      </View>
                      <View style={styles.historyBody}>
                        <View style={styles.historyDetail}>
                          <Clock size={RFValue(8)} color={Colors.textTertiary} />
                          <Text style={styles.historyDetailText}>
                            {formatRenewalDate(item.start_date)} - {formatRenewalDate(item.expiry_date)}
                          </Text>
                        </View>
                        <View style={styles.historyDetail}>
                          <CreditCard size={RFValue(8)} color={Colors.textTertiary} />
                          <Text style={styles.historyDetailText}>TXN: {item.transaction_id || 'N/A'}</Text>
                        </View>
                      </View>
                      <View style={styles.historyFooter}>
                        <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusExpired]}>
                          <Text style={styles.statusText}>{item.status?.toUpperCase() || 'EXPIRED'}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: wp('4%') },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: hp('50%') },
  planGradientCard: {
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  cardHeaderTitle: { fontSize: RFValue(14), fontWeight: '700', color: Colors.white, marginLeft: wp('2%') },
  cardDesc: { fontSize: RFValue(9.5), color: 'rgba(255,255,255,0.85)', lineHeight: hp('2%'), marginTop: hp('1.5%') },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1%'),
    gap: wp('1%'),
  },
  currentBadgeText: {
    fontSize: RFValue(7.5),
    fontWeight: '800',
    color: Colors.primary,
  },
  planPriceText: { fontSize: RFValue(16), fontWeight: '800', color: Colors.white },
  planTitleName: { fontSize: RFValue(15), fontWeight: '800', color: Colors.white, marginTop: hp('1%') },
  planDurationText: { fontSize: RFValue(9.5), color: 'rgba(255,255,255,0.75)', marginTop: hp('0.3%') },
  metaDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: hp('2%') },
  datesGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  dateCell: { flex: 1, gap: hp('0.3%') },
  dateLabel: { fontSize: RFValue(8), color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase' },
  dateVal: { fontSize: RFValue(9.5), color: Colors.white, fontWeight: '700' },
  cardSection: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    fontSize: RFValue(11),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: hp('1.8%'),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  limitRow: { marginBottom: hp('1.5%') },
  limitRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('0.6%') },
  limitLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: wp('2%') },
  limitTitle: { fontSize: RFValue(9.5), color: Colors.textSecondary, fontWeight: '600' },
  limitValue: { fontSize: RFValue(9.5), color: Colors.textPrimary, fontWeight: '700' },
  progressBar: { height: hp('0.6%'), backgroundColor: Colors.border, borderRadius: hp('0.3%'), overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: hp('0.3%') },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  detailLabel: { fontSize: RFValue(9.5), color: Colors.textSecondary, fontWeight: '600' },
  detailValue: { fontSize: RFValue(9.5), color: Colors.textPrimary, fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('1%'),
  },
  statusPaid: { backgroundColor: Colors.success + '12' },
  statusUnpaid: { backgroundColor: Colors.danger + '12' },
  statusActive: { backgroundColor: Colors.success + '12' },
  statusExpired: { backgroundColor: Colors.textTertiary + '12' },
  statusText: { fontSize: RFValue(8), fontWeight: '800', color: Colors.textPrimary },
  noHistory: {
    fontSize: RFValue(10),
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: hp('2%'),
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border + '50',
    marginBottom: hp('1%'),
  },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('0.8%') },
  historyNameRow: { flexDirection: 'row', alignItems: 'center', gap: wp('1.5%') },
  historyName: { fontSize: RFValue(10), fontWeight: '700', color: Colors.textPrimary },
  historyPrice: { fontSize: RFValue(10.5), fontWeight: '800', color: Colors.textPrimary },
  historyBody: { gap: hp('0.4%'), marginBottom: hp('0.8%') },
  historyDetail: { flexDirection: 'row', alignItems: 'center', gap: wp('1.5%') },
  historyDetailText: { fontSize: RFValue(8.5), color: Colors.textSecondary },
  historyFooter: { flexDirection: 'row', justifyContent: 'flex-start' },
  buyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('2%'),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buyBtnText: {
    color: Colors.white,
    fontSize: RFValue(11),
    fontWeight: '800',
  },
  trustBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  trustBarTextCol: {
    flex: 1,
  },
  trustBarTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  trustBarSub: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    marginTop: hp('0.2%'),
  },
});

export default PackageDetailsScreen;
