import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';

interface ShapePickerProps {
  selectedShape: string;
  onShapeSelect: (shape: string) => void;
}

// English labels for display, Chinese values sent to the backend.
const SHAPES = [
  { value: '圓形', label: 'Round' },
  { value: '橢圓形', label: 'Oval' },
  { value: '其他', label: 'Other' },
];

const labelFor = (value: string) =>
  SHAPES.find((s) => s.value === value)?.label ?? value;

const ShapePicker: React.FC<ShapePickerProps> = ({ selectedShape, onShapeSelect }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Shape</Text>
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
            {selectedShape ? labelFor(selectedShape) : 'Select shape'}
          </Button>
        }
      >
        {SHAPES.map((option) => (
          <Menu.Item
            key={option.label}
            onPress={() => {
              onShapeSelect(option.value);
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

export default ShapePicker;
