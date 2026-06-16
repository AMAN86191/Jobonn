import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
} from 'react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { Spacing } from '../../theme/Theme';

interface RoleSelectionCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  icon?: any; // You can use Lottie or Image
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  title,
  description,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
    >
      <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
        {/* Placeholder for Icon */}
        <View style={styles.iconPlaceholder} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isSelected && styles.selectedText]}>{title}</Text>
        <Text style={[styles.description, isSelected && styles.selectedText]}>{description}</Text>
      </View>
      {isSelected && <View style={styles.radioActive} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    // Soft Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    // opacity:0.8
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10', // 10% opacity
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  selectedIconContainer: {
    backgroundColor: Colors.primary,
  },
  iconPlaceholder: {
    width: 30,
    height: 30,
    backgroundColor: Colors.border,
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  selectedText: {
    color: Colors.textPrimary,
  },
  radioActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
});

export default RoleSelectionCard;
