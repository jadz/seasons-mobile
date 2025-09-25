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
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[
      styles.wrapper,
      {
        backgroundColor: disabled ? '#F2F2F7' : 'white',
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
    borderWidth: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingRight: 50,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
    color: '#1D1D1F',
  },
  unit: {
    position: 'absolute',
    right: 20,
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  disabledWrapper: {
    opacity: 0.6,
  },
  disabledInput: {
    opacity: 0.7,
  },
});

export default UnitInput;
