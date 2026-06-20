import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  BadgeCheck,
  MapPin,
  Edit3,
  Send,
  Calendar,
  Eye,
  TrendingUp,
  UploadCloud,
  CheckCircle2,
  ChevronLeft,
  Target,
  Globe,
  User,
  Mail,
  Phone,
} from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';

export const EmptyState = ({ message, onAdd, buttonText = "+ Add" }: { message: string, onAdd?: () => void, buttonText?: string }) => (
  <View style={styles.emptyStateWrap}>
    <Text style={styles.emptyStateText}>{message}</Text>
    {onAdd && (
      <TouchableOpacity style={styles.emptyStateBtn} onPress={onAdd}>
        <Text style={styles.emptyStateBtnText}>{buttonText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const CircularProgress = ({ value }: { value: number }) => {
  const size = wp('11%');
  const strokeWidth = wp('1.2%');
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', justifyContent: "flex-end" }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={Colors.border}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          stroke={Colors.primary}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
        <SvgText
          x={size / 2}
          y={size / 2 + RFValue(3.5)}
          textAnchor="middle"
          fill={Colors.textPrimary}
          fontSize={RFValue(9.5)}
          fontWeight="bold"
        >
          {value > 0 ? `${value}%` : "0%"}
        </SvgText>
      </Svg>
      <Text style={{ fontSize: RFValue(7), color: Colors.textSecondary, marginTop: hp('0.5%') }}>Profile Complete</Text>
    </View>
  );
};

export const ProfileHeaderInfo = ({ user, profile, completenessValue, onEdit }: { user: any; profile: any; completenessValue: number; onEdit?: () => void }) => {
  const imageUrl = profile?.profile_image
    ? (profile.profile_image.startsWith('http') ? profile.profile_image : `https://admin.jobonn.in/storage/${profile.profile_image}`)
    : '';
  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarWrap}>
        <TouchableOpacity
          style={styles.avatar}
          onPress={onEdit}
          activeOpacity={onEdit ? 0.7 : 1}
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%', borderRadius: wp('9%') }} />
          ) : (
            <Text style={styles.avatarText}>
              {(user?.name || 'U')[0].toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <BadgeCheck size={RFValue(12)} color={Colors.primary} fill={Colors.primaryLight} style={{ marginLeft: wp('1%') }} />
        </View>

        <Text style={styles.designation}>
          {profile?.jobTitle || profile?.designation || 'Candidate'}
        </Text>

        {/* <View style={styles.locationRow}>
        <MapPin size={RFValue(9)} color={Colors.textSecondary} />
        <Text style={styles.locationText}>{profile?.city || profile?.city || 'Not Specified'}</Text>
      </View> */}

        <View style={styles.locationRow}>
          <Mail size={RFValue(9)} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{user?.email || 'Not Specified'}</Text>
        </View>

        <View style={styles.locationRow}>
          <Phone size={RFValue(9)} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{user?.phone || 'Not Specified'}</Text>
        </View>

        {/* <View style={styles.openToWorkBadge}>
        <View style={styles.openToWorkDot} />
        <Text style={styles.openToWorkText}>Open to Work</Text>
      </View> */}
        {/* <TouchableOpacity style={styles.editProfileBtn} onPress={onEdit}>
        <Edit3 size={RFValue(10)} color={Colors.white} />
        <Text style={styles.editProfileBtnText}>Edit Profile</Text>
      </TouchableOpacity> */}
      </View>

      <View style={styles.progressContainer}>
        <CircularProgress value={completenessValue} />
      </View>
    </View>
  );
};

export const StatsRow = () => (
  <View style={styles.statsRow}>
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: Colors.primaryLight }]}>
        <Send size={RFValue(10)} color={Colors.primary} />
      </View>
      <Text style={styles.statCount}>24</Text>
      <Text style={styles.statLabel}>Applied Jobs</Text>
      <View style={styles.statTrendRow}>
        <Text style={styles.statTrendText}>This week</Text>
        <Text style={styles.statTrendPositive}>+18 <TrendingUp size={RFValue(7)} color={Colors.success} /></Text>
      </View>
    </View>

    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: Colors.warningLight }]}>
        <Calendar size={RFValue(10)} color={Colors.warning} />
      </View>
      <Text style={styles.statCount}>5</Text>
      <Text style={styles.statLabel}>Interviews</Text>
      <View style={styles.statTrendRow}>
        <Text style={styles.statTrendText}>Upcoming</Text>
        <Text style={styles.statTrendWarning}>2</Text>
      </View>
    </View>

    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: Colors.infoLight }]}>
        <Eye size={RFValue(10)} color={Colors.info} />
      </View>
      <Text style={styles.statCount}>136</Text>
      <Text style={styles.statLabel}>Profile Views</Text>
      <View style={styles.statTrendRow}>
        <Text style={styles.statTrendText}>This week</Text>
        <Text style={styles.statTrendPositive}>+18 <TrendingUp size={RFValue(7)} color={Colors.success} /></Text>
      </View>
    </View>
  </View>
);

export const ProfessionalDetailsCard = ({ profile, onEdit }: { profile: any; onEdit?: () => void }) => {
  const fields = [
    { label: 'Current Company', value: profile?.currentCompany },
    { label: 'Total Experience', value: profile?.totalExperience },
    { label: 'Notice Period', value: profile?.noticePeriod },
    { label: 'Current CTC', value: profile?.currentCTC ? (String(profile.currentCTC).toLowerCase().includes('lpa') ? profile.currentCTC : `${profile.currentCTC} LPA`) : null },
    { label: 'Current Location', value: profile?.currentLocation },
    { label: 'Current Role', value: profile?.jobTitle },
  ].filter(f => f.value && String(f.value).trim() !== '' && String(f.value).toLowerCase() !== 'null' && String(f.value).toLowerCase() !== 'undefined');

  const rows = [];
  for (let i = 0; i < fields.length; i += 3) {
    rows.push(fields.slice(i, i + 3));
  }

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeaderCard}>
        <View style={styles.sectionLeft}>
          <View style={[styles.sectionIcon, { backgroundColor: Colors.primaryLight }]}>
            <Briefcase color={Colors.primary} size={RFValue(10)} strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Professional Details</Text>
        </View>
        <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
          <Edit3 color={Colors.primary} size={RFValue(10)} />
        </TouchableOpacity>
      </View>

      {fields.length > 0 ? (
        <View style={styles.profGrid}>
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <View style={styles.profRow}>
                {row.map((item, itemIndex) => (
                  <View key={itemIndex} style={[styles.profCell, itemIndex !== 2 && styles.rightBorder]}>
                    <View style={styles.profLabelRow}>
                      <View style={styles.profDot} />
                      <Text style={styles.profLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.profValue}>{item.value}</Text>
                  </View>
                ))}
                {Array.from({ length: 3 - row.length }).map((_, emptyIndex) => (
                  <View key={`empty-${emptyIndex}`} style={[styles.profCell, (row.length + emptyIndex) !== 2 && styles.rightBorder]} />
                ))}
              </View>
              {rowIndex < rows.length - 1 && <View style={styles.profDivider} />}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <EmptyState message="You haven't added any professional details yet." onAdd={onEdit} buttonText="+ Add Details" />
      )}
    </View>
  );
};

export const ResumeCard = ({ profile, onEdit, user }: { profile: any; onEdit?: () => void; user?: any }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const hasResume = !!profile?.resume;

  // Handle relative vs absolute URL
  const resumeUrl = hasResume
    ? (profile.resume.startsWith('http') ? profile.resume : `https://admin.jobonn.in/storage/${profile.resume}`)
    : '';

  const pdfSource = { uri: resumeUrl, cache: true };
  
  const getDisplayFilename = () => {
    if (!hasResume) return '';
    const displayName = user?.name ? user.name.trim().replace(/\s+/g, ' ') : 'user';
    return `${displayName} Resume.pdf`;
  };

  const filename = getDisplayFilename();

  return (
    <>
      <View style={styles.card}>
        <View style={styles.sectionHeaderCard}>
          <View style={styles.sectionLeft}>
            <View style={[styles.sectionIcon, { backgroundColor: Colors.primaryLight }]}>
              <FileText color={Colors.primary} size={RFValue(10)} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Resume</Text>
          </View>
        </View>

        {hasResume ? (
          <View style={styles.resumeBox}>
            <View style={styles.resumeIconWrap}>
              <View style={styles.pdfIcon}>
                <Text style={styles.pdfIconText}>PDF</Text>
              </View>
            </View>
            <View style={styles.resumeDetailsWrap}>
              <Text style={styles.resumeName} numberOfLines={1}>{filename}</Text>
              <Text style={styles.resumeDate}>Uploaded Resume</Text>
            </View>
            <TouchableOpacity style={styles.resumePreviewBtn} onPress={() => setModalVisible(true)}>
              <Eye size={RFValue(9)} color={Colors.textSecondary} />
              <Text style={styles.resumePreviewText}>Preview</Text>
            </TouchableOpacity>
            {onEdit && (
              <TouchableOpacity style={styles.resumeUpdateBtn} onPress={onEdit}>
                <UploadCloud size={RFValue(9)} color={Colors.white} />
                <Text style={styles.resumeUpdateText}>Update</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <EmptyState
            message="You haven't uploaded a resume yet."
            onAdd={onEdit}
            buttonText="+ Upload Resume"
          />
        )}
      </View>

      {hasResume && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: wp('4%'), borderBottomWidth: 1, borderBottomColor: Colors.border }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ChevronLeft size={RFValue(15)} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(12), fontWeight: '700', marginLeft: wp('2%'), color: Colors.textPrimary }}>Resume Preview</Text>
            </View>
            <Pdf
              source={pdfSource}
              style={{ flex: 1, width: wp('100%'), height: hp('100%') }}
              trustAllCerts={false}
            />
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
};

export const SkillsCard = ({ profile, onEdit }: { profile: any; onEdit?: () => void }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeaderCard}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: Colors.successLight }]}>
          <Award color={Colors.success} size={RFValue(10)} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>Skills</Text>
      </View>
      <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
        <Edit3 color={Colors.primary} size={RFValue(10)} />
      </TouchableOpacity>
    </View>

    {profile?.skills && profile.skills.length > 0 ? (
      <View style={styles.skillsContainer}>
        {profile.skills.map((skill: string, i: number) => (
          <View key={i} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    ) : (
      <EmptyState message="You haven't added any skills yet." onAdd={onEdit} buttonText="+ Add Skills" />
    )}
  </View>
);

export const ExperienceCard = ({ profile, onEdit }: { profile: any; onEdit?: () => void }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeaderCard}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: Colors.warningLight }]}>
          <Briefcase color={Colors.warning} size={RFValue(10)} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>Experience</Text>
      </View>
      <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
        <Edit3 color={Colors.primary} size={RFValue(10)} />
      </TouchableOpacity>
    </View>

    {(profile?.work_experience && profile.work_experience.length > 0) ? (
      <View>
        {profile.work_experience.map((exp: any, index: number) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineDotWrap}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.primary }]} />
              {index < profile.work_experience.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, paddingRight: wp('2%') }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: hp('0.4%'), flexWrap: 'wrap' }}>
                    <Text style={styles.expTitle}>{exp.position}</Text>
                    {exp.endDate?.toLowerCase() === 'present' && (
                      <View style={[styles.currentBadge, { marginLeft: wp('1.5%') }]}>
                        <Text style={styles.currentBadgeText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.expDateRow}>
                    <Calendar size={RFValue(7)} color={Colors.textTertiary} />
                    <Text style={styles.expDateText}>{exp.startDate} – {exp.endDate}</Text>

                  </View>
                </View>

                <View style={{ alignItems: 'flex-end', maxWidth: wp('35%') }}>
                  <Text style={styles.expCompany} numberOfLines={1}>{exp.company}</Text>
                  <Text style={styles.expDateText}>{exp.location}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    ) : (
      <EmptyState message="You haven't added any experience yet." onAdd={onEdit} buttonText="+ Add Experience" />
    )}
  </View>
);

export const EducationCard = ({ profile, onEdit }: { profile: any; onEdit?: () => void }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeaderCard}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: Colors.infoLight }]}>
          <GraduationCap color={Colors.info} size={RFValue(10)} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>Education</Text>
      </View>
      <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
        <Edit3 color={Colors.primary} size={RFValue(10)} />
      </TouchableOpacity>
    </View>

    {(profile?.education && profile?.education?.length > 0) ? (
      <View>
        {profile.education.map((edu: any, index: number) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineDotWrap}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.primary }]} />
              {index < profile.education.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, paddingRight: wp('2%') }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: hp('0.4%'), flexWrap: 'wrap' }}>
                    <Text style={styles.expTitle}>{edu.degree}</Text>
                  </View>
                  <View style={styles.expDateRow}>
                    <Calendar size={RFValue(7)} color={Colors.textTertiary} />
                    <Text style={styles.expDateText}>
                      {edu.startDate && edu.endDate && edu.startDate !== edu.endDate
                        ? `${edu.startDate} – ${edu.endDate}`
                        : (edu.endDate || edu.startDate || '')}
                      {edu.gpa ? ` (${edu.gpa.toLowerCase().includes('cgpa') || edu.gpa.includes('%') ? edu.gpa : `CGPA ${edu.gpa}`})` : ''}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end', maxWidth: wp('40%') }}>
                  <Text style={styles.expCompany} numberOfLines={1}>{edu.school}</Text>
                  <Text style={styles.expDateText}>{edu.location}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    ) : (
      <EmptyState message="You haven't added any education yet." onAdd={onEdit} buttonText="+ Add Education" />
    )}
  </View>
);

export const ProfileSummaryCard = ({ profile, onEdit }: { profile: any; onEdit?: () => void }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeaderCard}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: Colors.infoLight }]}>
          <FileText color={Colors.info} size={RFValue(10)} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>Profile Summary</Text>
      </View>
      <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
        <Edit3 color={Colors.primary} size={RFValue(10)} />
      </TouchableOpacity>
    </View>
    {profile?.summary ? (
      <Text style={styles.summaryText}>
        {profile.summary}
      </Text>
    ) : (
      <EmptyState message="You haven't added a profile summary yet." onAdd={onEdit} buttonText="+ Add Summary" />
    )}
  </View>
);

export const CareerPreferenceCard = ({ profile, onEdit }: { profile: any; onEdit?: () => void }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeaderCard}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: Colors.warningLight }]}>
          <Target color={Colors.warning} size={RFValue(10)} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>Career Preference</Text>
      </View>
      <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
        <Edit3 color={Colors.primary} size={RFValue(10)} />
      </TouchableOpacity>
    </View>
    {(profile?.preferredLocation || profile?.jobType || profile?.expectedCTC || profile?.expectedSalary) ? (
      <View>
        <View style={styles.careerGridRow}>
          <View style={styles.careerGridCell}>
            <Text style={styles.detailsGridLabel}>Preferred Location</Text>
            <Text style={styles.detailsGridVal}>{profile.preferredLocation || '-'}</Text>
          </View>
          <View style={styles.careerGridCell}>
            <Text style={styles.detailsGridLabel}>Job Type</Text>
            <Text style={styles.detailsGridVal}>{profile.jobType || '-'}</Text>
          </View>
          <View style={styles.careerGridCell}>
            <Text style={styles.detailsGridLabel}>Preferred Shift</Text>
            <Text style={styles.detailsGridVal}>{profile.preferredShift || '-'}</Text>
          </View>
        </View>
        <View style={[styles.careerGridRow, { marginTop: hp('1.5%') }]}>
          <View style={styles.careerGridCell}>
            <Text style={styles.detailsGridLabel}>Expected CTC</Text>
            <Text style={styles.detailsGridVal}>{profile.expectedCTC || profile.expectedSalary || '-'}</Text>
          </View>
          <View style={styles.careerGridCell}>
            <Text style={styles.detailsGridLabel}>Availability</Text>
            <Text style={styles.detailsGridVal}>{profile.noticePeriod || '-'}</Text>
          </View>
          <View style={styles.careerGridCell}>
            <Text style={styles.detailsGridLabel}>Preferred Role</Text>
            <Text style={styles.detailsGridVal}>{profile.jobTitle || '-'}</Text>
          </View>
        </View>
      </View>
    ) : (
      <EmptyState message="You haven't added your career preferences yet." onAdd={onEdit} buttonText="+ Add Preferences" />
    )}
  </View>
);

export const LanguagesCard = ({ profile, onEdit }: { profile: any; onEdit?: () => void }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeaderCard}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: Colors.successLight }]}>
          <Globe color={Colors.success} size={RFValue(10)} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>Languages</Text>
      </View>
      <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
        <Edit3 color={Colors.primary} size={RFValue(10)} />
      </TouchableOpacity>
    </View>
    {profile?.languages && profile.languages.length > 0 ? (
      <View style={styles.languageContainer}>
        {profile.languages.map((lang: any, i: number) => (
          <View key={i} style={styles.skillBadge}>
            <Text style={styles.skillText}>
              {typeof lang === 'string' ? lang : `${lang.name} (${lang.level})`}
            </Text>
          </View>
        ))}
      </View>
    ) : (
      <EmptyState message="You haven't added any languages yet." onAdd={onEdit} buttonText="+ Add Languages" />
    )}
  </View>
);

export const PersonalDetailsCard = ({ personalDetails, onEdit }: { personalDetails: any; onEdit?: () => void }) => (
  <View style={[styles.card, { marginBottom: 0 }]}>
    <View style={styles.sectionHeaderCard}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: Colors.primaryLight }]}>
          <User color={Colors.primary} size={RFValue(10)} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>Personal Details</Text>
      </View>
      <TouchableOpacity style={styles.cardEditBtn} onPress={onEdit}>
        <Edit3 color={Colors.primary} size={RFValue(10)} />
      </TouchableOpacity>
    </View>
    {(personalDetails?.gender || personalDetails?.date_of_birth || personalDetails?.current_address || personalDetails?.status) ? (
      <View>
        <View style={styles.detailsGridRow}>
          <View style={styles.detailsGridCell}>
            <View style={styles.iconLabelRow}>
              <User size={RFValue(8.5)} color={Colors.textSecondary} />
              <Text style={styles.detailsGridLabelIcon}>Gender</Text>
              <Text style={styles.detailsGridVal}>{personalDetails.gender || '-'}</Text>
            </View>
          </View>
          <View style={styles.detailsGridCell}>
            <View style={styles.iconLabelRow}>
              <Calendar size={RFValue(8.5)} color={Colors.textSecondary} />
              <Text style={styles.detailsGridLabelIcon}>Date of Birth</Text>
              <Text style={styles.detailsGridVal}>{personalDetails.date_of_birth || '-'}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.detailsGridRow, { marginTop: hp('1.5%') }]}>
          <View style={styles.detailsGridCell}>
            <View style={styles.iconLabelRow}>
              <MapPin size={RFValue(8.5)} color={Colors.textSecondary} />
              <Text style={styles.detailsGridLabelIcon}>Hometown</Text>
              <Text style={styles.detailsGridVal}>{personalDetails.current_address || '-'}</Text>
            </View>
          </View>
          <View style={styles.detailsGridCell}>
            <View style={styles.iconLabelRow}>
              <User size={RFValue(8.5)} color={Colors.textSecondary} />
              <Text style={styles.detailsGridLabelIcon}>Marital Status</Text>
              <Text style={styles.detailsGridVal}>{personalDetails.status || '-'}</Text>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <EmptyState message="You haven't added your personal details yet." onAdd={onEdit} buttonText="+ Add Details" />
    )}
  </View>
);

export const RecentActivitySection = () => (
  <>
    <View style={[styles.sectionHeader, { marginTop: hp('1.5%') }]}>
      <Text style={styles.sectionTitleMain}>Recent Activity</Text>
      <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsRow}>
      <View style={styles.activityCard}>
        <View style={[styles.activityIconBox, { backgroundColor: Colors.successLight }]}>
          <CheckCircle2 size={RFValue(10)} color={Colors.success} />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>Applied at Google</Text>
          <Text style={styles.activityTime}>2 days ago</Text>
        </View>
      </View>

      <View style={styles.activityCard}>
        <View style={[styles.activityIconBox, { backgroundColor: Colors.primaryLight }]}>
          <Calendar size={RFValue(10)} color={Colors.primary} />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>Interview scheduled</Text>
          <Text style={styles.activityTime}>5 days ago</Text>
        </View>
      </View>
    </ScrollView>
  </>
);

const styles = StyleSheet.create({
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginVertical: hp('1%') },
  avatarWrap: { position: 'relative', marginRight: wp('3%') },
  avatar: { width: wp('13%'), height: wp('13%'), borderRadius: wp('9%'), backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: RFValue(19), fontWeight: '800', color: Colors.white },

  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.2%') },
  name: { fontSize: RFValue(12), fontWeight: '700', color: Colors.textPrimary },
  designation: { fontSize: RFValue(9.5), color: Colors.primary, fontWeight: '600', marginBottom: hp('0.3%') },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.6%') },
  locationText: { fontSize: RFValue(8), color: Colors.textSecondary, marginLeft: wp('1%') },
  openToWorkBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.successLight, alignSelf: 'flex-start', paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.2%'), borderRadius: wp('1%') },
  openToWorkDot: { width: wp('1.2%'), height: wp('1.2%'), borderRadius: wp('0.6%'), backgroundColor: Colors.success, marginRight: wp('1%') },
  openToWorkText: { fontSize: RFValue(7.5), color: Colors.success, fontWeight: '600' },
  progressContainer: { alignItems: 'center' },

  editProfileBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: hp('1%'), borderRadius: wp('2.5%'), marginTop: hp('1%'), gap: wp('1.5%'), maxWidth: wp('40%') },
  editProfileBtnText: { fontSize: RFValue(10), fontWeight: '700', color: Colors.white },

  statsRow: { flexDirection: 'row', gap: wp('2%'), marginBottom: hp('2%') },
  statCard: { flex: 1, backgroundColor: Colors.white, padding: wp('2%'), borderRadius: wp('2.5%'), borderWidth: 1, borderColor: Colors.border },
  statIconBox: { width: wp('6.5%'), height: wp('6.5%'), borderRadius: wp('1.5%'), justifyContent: 'center', alignItems: 'center', marginBottom: hp('0.8%') },
  statCount: { fontSize: RFValue(14), fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: RFValue(8), color: Colors.textSecondary, marginBottom: hp('0.8%') },
  statTrendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: hp('0.4%') },
  statTrendText: { fontSize: RFValue(7), color: Colors.textTertiary },
  statTrendPositive: { fontSize: RFValue(7), color: Colors.success, fontWeight: '600', flexDirection: 'row', alignItems: 'center' },
  statTrendWarning: { fontSize: RFValue(7), color: Colors.warning, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('0.8%') },
  sectionTitleMain: { fontSize: RFValue(11), fontWeight: '800', color: Colors.textPrimary },
  viewAllText: { fontSize: RFValue(9), color: Colors.primary, fontWeight: '700' },

  quickActionsRow: { flexDirection: "row", justifyContent: 'space-between', marginBottom: hp('2%'), gap: wp('2%') },

  card: { backgroundColor: Colors.white, borderRadius: wp('2.5%'), padding: wp('3%'), borderWidth: 1, borderColor: Colors.border, marginBottom: hp('1.5%') },
  sectionHeaderCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('1.5%') },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: wp('1.5%') },
  sectionIcon: { width: wp('6%'), height: wp('6%'), borderRadius: wp('1.5%'), justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary },
  cardEditBtn: { padding: wp('1%'), backgroundColor: Colors.primaryLight, borderRadius: wp('1%') },
  atsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.successLight, paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.2%'), borderRadius: wp('0.8%'), gap: wp('0.8%') },
  atsText: { fontSize: RFValue(7), color: Colors.success },
  atsScoreText: { fontSize: RFValue(8), color: Colors.success, fontWeight: '700' },

  profGrid: { marginTop: hp('0.5%') },
  profRow: { flexDirection: 'row' },
  profCell: { flex: 1, paddingVertical: hp('0.8%'), paddingHorizontal: wp('0.5%') },
  rightBorder: { borderRightWidth: 1, borderRightColor: Colors.borderLight },
  profDivider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: hp('0.2%') },
  profLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.3%'), gap: wp('1%') },
  profDot: { width: wp('1.2%'), height: wp('1.2%'), borderRadius: wp('0.6%'), backgroundColor: Colors.primary },
  profLabel: { fontSize: RFValue(7.5), color: Colors.textSecondary, fontWeight: '500' },
  profValue: { fontSize: RFValue(8), color: Colors.textPrimary, fontWeight: '700', marginLeft: wp('2.2%') },

  resumeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: wp('1.5%'), padding: wp('1.5%') },
  resumeIconWrap: { width: wp('8%'), height: wp('10%'), backgroundColor: Colors.borderLight, borderRadius: wp('1%'), justifyContent: 'center', alignItems: 'center', marginRight: wp('2%') },
  pdfIcon: { backgroundColor: Colors.primary, paddingHorizontal: wp('0.8%'), paddingVertical: hp('0.2%'), borderRadius: wp('0.5%') },
  pdfIconText: { fontSize: RFValue(5), color: Colors.white, fontWeight: '800' },
  resumeDetailsWrap: { flex: 1 },
  resumeName: { fontSize: RFValue(9), fontWeight: '700', color: Colors.textPrimary, marginBottom: hp('0.2%') },
  resumeDate: { fontSize: RFValue(7), color: Colors.textSecondary },
  resumePreviewBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.5%'), borderRadius: wp('1%'), marginRight: wp('1.5%'), gap: wp('0.8%') },
  resumePreviewText: { fontSize: RFValue(8), color: Colors.textPrimary, fontWeight: '600' },
  resumeUpdateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.5%'), borderRadius: wp('1%'), gap: wp('0.8%') },
  resumeUpdateText: { fontSize: RFValue(8), color: Colors.white, fontWeight: '600' },

  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: wp('1.5%') },
  skillBadge: { paddingHorizontal: wp('1%'), paddingVertical: hp('0.5%'), borderRadius: wp('1%') },
  skillText: { fontSize: RFValue(8), color: Colors.black, fontWeight: '700', marginBottom: hp('0.1%') },

  timelineItem: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineDotWrap: { width: wp('5%'), alignItems: 'center' },
  timelineDot: { width: wp('1.5%'), height: wp('1.5%'), borderRadius: wp('0.75%'), marginTop: hp('0.4%') },
  timelineLine: { width: 1, flex: 1, backgroundColor: Colors.border, marginVertical: hp('0.4%'), minHeight: hp('3%') },
  timelineContent: { flex: 1, marginLeft: wp('1.5%'), paddingBottom: hp('1.5%') },
  expTitle: { fontSize: RFValue(10), fontWeight: '700', color: Colors.textPrimary, marginBottom: hp('0.1%') },
  currentBadge: { backgroundColor: Colors.successLight, paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.15%'), borderRadius: wp('0.8%') },
  currentBadgeText: { fontSize: RFValue(7), color: Colors.success, fontWeight: '600' },
  expCompany: { fontSize: RFValue(9), color: Colors.secondary, fontWeight: '600', marginBottom: hp('0.4%') },
  expDateRow: { flexDirection: 'row', alignItems: 'center', gap: wp('0.8%') },
  expDateText: { fontSize: RFValue(8), color: Colors.textTertiary },

  activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: wp('2.5%'), borderRadius: wp('1.5%'), borderWidth: 1, borderColor: Colors.border, width: wp('50%') },
  activityIconBox: { width: wp('6%'), height: wp('6%'), borderRadius: wp('3%'), justifyContent: 'center', alignItems: 'center', marginRight: wp('1.5%') },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: RFValue(9), fontWeight: '700', color: Colors.textPrimary, marginBottom: hp('0.1%') },
  activityTime: { fontSize: RFValue(7), color: Colors.textSecondary },

  summaryText: { fontSize: RFValue(8.5), color: Colors.textSecondary, lineHeight: RFValue(12), fontWeight: '500' },
  careerGridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  careerGridCell: { flex: 1 },
  detailsGridLabel: { fontSize: RFValue(7.5), color: Colors.textSecondary, fontWeight: '500', marginBottom: hp('0.2%') },
  detailsGridVal: { fontSize: RFValue(8), color: Colors.textPrimary, fontWeight: '700', maxWidth: wp('30%'), marginRight: wp('2%'), textAlign: 'justify' },
  languageContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  detailsGridRow: { flexDirection: 'row' },
  detailsGridCell: { flex: 1 },
  iconLabelRow: { flexDirection: 'row', alignItems: 'center', gap: wp('1.5%'), marginBottom: hp('0.2%') },
  detailsGridLabelIcon: { fontSize: RFValue(7.5), color: Colors.textSecondary, fontWeight: '500' },

  emptyStateWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: hp('3%') },
  emptyStateText: { fontSize: RFValue(9), color: Colors.textSecondary, marginBottom: hp('1.5%'), textAlign: 'center', fontWeight: '500' },
  emptyStateBtn: { backgroundColor: Colors.primaryLight, paddingHorizontal: wp('3%'), paddingVertical: hp('0.8%'), borderRadius: wp('1.5%'), borderWidth: 1, borderColor: Colors.primary + '30' },
  emptyStateBtnText: { fontSize: RFValue(8.5), color: Colors.primary, fontWeight: '700' },
});
