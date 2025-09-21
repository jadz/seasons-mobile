import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SimpleSelectionButtonProps {
  title: string;
  isSelected?: boolean;
  onPress?: () => void;
  isDisabled?: boolean;
}

export const SimpleSelectionButton: React.FC<SimpleSelectionButtonProps> = ({
  title,
  isSelected = false,
  onPress,
  isDisabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && styles.selected,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        isSelected && styles.selectedText,
        isDisabled && styles.disabledText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C9D0C3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginRight: 8,
    marginBottom: 8,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#263137',
    borderColor: '#4E7166',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: '#263137',
    textAlign: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledText: {
    color: '#7A9C81',
  },
});

export default SimpleSelectionButton;
