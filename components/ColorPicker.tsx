import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';

interface ColorPickerProps {
  label: string;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  allowEmpty?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  selectedColor, 
  onColorSelect, 
  allowEmpty = false 
}) => {
  const [visible, setVisible] = React.useState(false);

  // Exact same colors as website
  const colors = [
    '白色', '透明', '黑色', '棕色', '紅色', '橘色',
    '皮膚色', '黃色', '綠色', '藍色', '紫色', '粉紅色', '灰色'
  ];

  const allColors = allowEmpty ? ['（無）', ...colors] : colors;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}：</Text>
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
            {selectedColor || `請選擇${label}`}
          </Button>
        }
      >
        {allColors.map((color) => (
          <Menu.Item
            key={color}
            onPress={() => {
              onColorSelect(color === '（無）' ? '' : color);
              setVisible(false);
            }}
            title={color}
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

export default ColorPicker;
