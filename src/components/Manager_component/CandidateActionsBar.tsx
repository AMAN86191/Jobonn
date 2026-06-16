import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Mail, Phone, FileText } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';

interface CandidateActionsBarProps {
  emailAddress?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  resumeUrl?: string;
}

const CandidateActionsBar: React.FC<CandidateActionsBarProps> = ({
  emailAddress = 'demo@example.com',
  phoneNumber = '1234567890',
  whatsappNumber = '911234567890',
  resumeUrl = 'https://example.com/resume.pdf',
}) => {
  return (
    <View style={styles.actionsBar}>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => Linking.openURL(`mailto:${emailAddress}`)}
      >
        <Mail size={RFValue(11)} color={Colors.textPrimary} />
        <Text style={styles.actionBtnText}>Email</Text>
      </TouchableOpacity>
      <View style={styles.actionsDivider} />

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
      >
        <Phone size={RFValue(11)} color={Colors.textPrimary} />
        <Text style={styles.actionBtnText}>Call</Text>
      </TouchableOpacity>
      <View style={styles.actionsDivider} />

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => Linking.openURL(`https://wa.me/${whatsappNumber}`)}
      >
        <Image
          source={require('../../../assets/images/whatsapp_bold.png')}
          style={styles.whatsappIcon}
        />
        <Text style={styles.actionBtnText}>WhatsApp</Text>
      </TouchableOpacity>
      <View style={styles.actionsDivider} />

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => Linking.openURL(resumeUrl)}
      >
        <FileText size={RFValue(11)} color={Colors.textPrimary} />
        <Text style={styles.actionBtnText}>Resume</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: hp('1.1%'),
    marginBottom: hp('1.2%'),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1.5%'),
  },
  actionBtnText: {
    fontSize: RFValue(8.2),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  actionsDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    height: hp('2%'),
    alignSelf: 'center',
  },
  whatsappIcon: {
    width: RFValue(11),
    height: RFValue(11),
    tintColor: Colors.textPrimary,
  },
});

export default CandidateActionsBar;
