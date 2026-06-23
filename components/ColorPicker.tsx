import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';

interface ColorPickerProps {
  label: string;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  allowEmpty?: boolean;
}

// English labels for display, Chinese values sent to the backend (so matching works).
const COLORS = [
  { value: '白色', label: 'White' },
  { value: '透明', label: 'Transparent' },
  { value: '黑色', label: 'Black' },
  { value: '棕色', label: 'Brown' },
  { value: '紅色', label: 'Red' },
  { value: '橘色', label: 'Orange' },
  { value: '皮膚色', label: 'Beige' },
  { value: '黃色', label: 'Yellow' },
  { value: '綠色', label: 'Green' },
  { value: '藍色', label: 'Blue' },
  { value: '紫色', label: 'Purple' },
  { value: '粉紅色', label: 'Pink' },
  { value: '灰色', label: 'Gray' },
];

const labelFor = (value: string) =>
  COLORS.find((c) => c.value === value)?.label ?? value;

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  selectedColor,
  onColorSelect,
  allowEmpty = false,
}) => {
  const [visible, setVisible] = React.useState(false);

  const options = allowEmpty
    ? [{ value: '', label: '(none)' }, ...COLORS]
    : COLORS;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            style={styles.selectButton}
            buttonColor="#ffffff"
            textColor="#1f2937"
            labelStyle={styles.selectLabel}
          >
            {selectedColor ? labelFor(selectedColor) : `Select ${label.toLowerCase()}`}
          </Button>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.label}
            onPress={() => {
              onColorSelect(option.value);
              setVisible(false);
            }}
            title={option.label}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#6b7280',
  },
  selectButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
  selectLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default ColorPicker;
