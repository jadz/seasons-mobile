import React from 'react';
import { View, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { Text } from '../primitives';
import { useAppTheme } from '../foundation';

interface UnitInputProps {
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
  placeholder?: string;
  disabled?: boolean;
  keyboardType?: 'numeric' | 'default';
  style?: any;
  width?: number;
  inputAccessoryViewID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const UnitInput: React.FC<UnitInputProps> = ({
  value,
  onChangeText,
  unit = 'kg',
  placeholder,
  disabled = false,
  keyboardType = 'numeric',
  style,
  width,
  inputAccessoryViewID,
  onFocus,
  onBlur,
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[
      styles.wrapper,
      {
        backgroundColor: disabled ? theme.colors['bg/raised'] : theme.colors['bg/surface'],
        borderColor: theme.colors['border/subtle'],
      },
      disabled && styles.disabledWrapper,
      width && { width },
      style
    ]}>
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={!disabled}
        inputAccessoryViewID={inputAccessoryViewID}
        onFocus={onFocus}
        onBlur={onBlur}
        style={[
          styles.input,
          {
            color: disabled ? theme.colors.textMuted : theme.colors.text,
          },
          disabled && styles.disabledInput
        ]}
        placeholderTextColor={theme.colors.textMuted}
      />
      <Text
        variant="caption"
        color="textMuted"
        style={[
          styles.unit,
          disabled && { color: theme.colors.textMuted }
        ]}
        pointerEvents="none"
      >
        {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingRight: 20,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  unit: {
    position: 'absolute',
    right: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  disabledWrapper: {
    opacity: 0.6,
  },
  disabledInput: {
    opacity: 0.7,
  },
});

export default UnitInput;
