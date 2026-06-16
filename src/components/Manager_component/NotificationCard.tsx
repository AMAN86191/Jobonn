import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bell, UserCheck, Briefcase, Calendar, Star, Trash2 } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

export type NotifType = 'application' | 'interview' | 'shortlist' | 'job' | 'general';

interface NotificationCardProps {
  type: NotifType;
  title: string;
  body?: string;
  message?: string;
  time: string;
  unread?: boolean;
  read?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
}

const NOTIF_ICONS: Record<NotifType, { icon: typeof Bell; color: string }> = {
  application: { icon: UserCheck,  color: Colors.primary },
  interview:   { icon: Calendar,   color: Colors.accent },
  shortlist:   { icon: Star,       color: Colors.warning },
  job:         { icon: Briefcase,  color: Colors.info },
  general:     { icon: Bell,       color: Colors.textSecondary },
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  type, title, body, message, time, unread, read, onPress, onDelete,
}) => {
  const { icon: Icon, color } = NOTIF_ICONS[type];
  const isUnread = unread ?? (read === false);
  const text = body ?? message ?? '';

  return (
    <TouchableOpacity
      style={[styles.card, isUnread && styles.cardUnread]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon color={color} size={wp('5%')} />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {isUnread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.body} numberOfLines={2}>{text}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Trash2 color={Colors.textSecondary} size={wp('4%')} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  cardUnread: {
    backgroundColor: Colors.primary + '05',
    borderColor: Colors.primary + '30',
  },
  iconBox: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  content: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('0.5%') , },
  title: { ...Typography.bodySmall, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  unreadDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.primary,
    marginLeft: wp('2%'),
  },
  body: { ...Typography.caption, color: Colors.textSecondary, lineHeight: hp('2.2%'), marginBottom: hp('0.5%') },
  time: { ...Typography.caption, color: Colors.textSecondary },
  deleteBtn: { paddingLeft: wp('2%'), paddingTop: wp('1%') },
});

export default NotificationCard;
