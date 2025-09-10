import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';

interface ShapePickerProps {
  selectedShape: string;
  onShapeSelect: (shape: string) => void;
}

const ShapePicker: React.FC<ShapePickerProps> = ({ selectedShape, onShapeSelect }) => {
  const [visible, setVisible] = React.useState(false);

  // Exact same shapes as website
  const shapes = ['圓形', '橢圓形', '其他'];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>外型：</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            style={styles.selectButton}
            buttonColor="white"
            textColor="#333333"
            labelStyle={styles.selectLabel}
          >
            {selectedShape || '請選擇外型'}
          </Button>
        }
      >
        {shapes.map((shape) => (
          <Menu.Item
            key={shape}
            onPress={() => {
              onShapeSelect(shape);
              setVisible(false);
            }}
            title={shape}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  selectButton: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    justifyContent: 'flex-start',
  },
  selectLabel: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default ShapePicker;
