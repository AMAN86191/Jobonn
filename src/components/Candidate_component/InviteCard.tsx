import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Building2, MapPin, Check, X } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface InviteCardProps {
  company: string;
  role: string;
  logo?: string;
  location: string;
  message: string;
  status: 'pending' | 'accepted' | 'shortlisted' | 'rejected';
  onAccept?: () => void;
  onReject?: () => void;
}

const InviteCard: React.FC<InviteCardProps> = ({ 
  company, role, logo, location, status, onAccept, onReject 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <Building2 color={Colors.primary} size={wp('6%')} />
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.company} numberOfLines={1}>{company}</Text>
          <Text style={styles.role} numberOfLines={1}>invited you for <Text style={styles.roleHighlight}>{role}</Text></Text>
        </View>
        <View style={[styles.statusBadge,
          status === 'accepted' ? styles.statusAccepted :
          status === 'shortlisted' ? styles.statusShortlisted :
          status === 'rejected' ? styles.statusRejected : styles.statusPending
        ]}>
          <Text style={[styles.statusText,
            status === 'accepted' ? styles.statusTextAccepted :
            status === 'shortlisted' ? styles.statusTextShortlisted :
            status === 'rejected' ? styles.statusTextRejected : styles.statusTextPending
          ]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <MapPin color={Colors.textSecondary} size={wp('3.5%')} />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      {/* <View style={styles.messageContainer}>
        <Text style={styles.messageText} numberOfLines={3}>"{message}"</Text>
      </View> */}

      {status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={onReject} activeOpacity={0.7}>
            <X color={Colors.danger} size={wp('4%')} />
            <Text style={styles.rejectText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={onAccept} activeOpacity={0.7}>
            <Check color={Colors.white} size={wp('4%')} />
            <Text style={styles.acceptText}>Accept Invite</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  logoContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: wp('3%'),
  },
  headerInfo: {
    flex: 1,
  },
  company: {
    ...Typography.body,
    // fontWeight: '700',
    color: Colors.textPrimary,
  },
  role: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: hp('0.2%'),
  },
  roleHighlight: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    marginLeft: wp('2%'),
  },
  statusPending: { backgroundColor: Colors.warning + '15' },
  statusAccepted: { backgroundColor: Colors.success + '15' },
  statusShortlisted: { backgroundColor: Colors.primary + '15' },
  statusRejected: { backgroundColor: Colors.danger + '15' },
  statusText: { ...Typography.caption,  },
  statusTextPending: { color: Colors.warning },
  statusTextAccepted: { color: Colors.success },
  statusTextShortlisted: { color: Colors.primary },
  statusTextRejected: { color: Colors.danger },
  
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: wp('1%'),
  },
  messageContainer: {
    backgroundColor: Colors.background,
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  messageText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: hp('2.2%'),
  },
  actionRow: {
    flexDirection: 'row',
    gap: wp('3%'),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    gap: wp('1.5%'),
  },
  rejectBtn: {
    backgroundColor: Colors.danger + '10',
    borderWidth: 1,
    borderColor: Colors.danger + '30',
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rejectText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    fontWeight: '600',
  },
  acceptText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default InviteCard;
