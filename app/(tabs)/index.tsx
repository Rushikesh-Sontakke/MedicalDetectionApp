import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import ColorPicker from '../../components/ColorPicker';
import ShapePicker from '../../components/ShapePicker';
import ResultModal from '../../components/ResultsModal';
import { uploadImage, matchPill } from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [recognizedText, setRecognizedText] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [shape, setShape] = useState('');
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Use the new camera permissions hook
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request camera permission
    if (!cameraPermission?.granted) {
      const cameraResult = await requestCameraPermission();
      if (!cameraResult.granted) {
        Alert.alert('Permission required', 'Camera access is needed for this app to work.');
        return;
      }
    }

    // Request media library permission
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaStatus !== 'granted') {
      Alert.alert('Permission required', 'Photo library access is needed for this app to work.');
    }
  };

  const takePicture = async () => {
    try {
      // Check camera permission before taking picture
      if (!cameraPermission?.granted) {
        const result = await requestCameraPermission();
        if (!result.granted) {
          Alert.alert('Camera Permission', 'Camera access is required to take photos.');
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'], 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('🚨 圖片辨識錯誤', (error as Error).message);
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('🚨 圖片辨識錯誤', (error as Error).message);
    }
  };

  const processImage = async (imageUri: string) => {
    setLoading(true);
    try {
      const response = await uploadImage(imageUri);
      
      if (!response.ok) {
        Alert.alert('辨識失敗', response.error || '未知錯誤');
        return;
      }

      const result = response.result || {};
      
      const colors = result['顏色'] || [];
      setRecognizedText((result['文字辨識'] || []).join(', '));
      setColor1(colors[0] || '');
      setColor2(colors[1] || '');
      setShape(result['外型'] || '');
      setCroppedImage(result.cropped_image);
      
    } catch (error) {
      Alert.alert('🚨 伺服器錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const confirmMatch = async () => {
    const selectedText = recognizedText.trim();
    const selectedColor1 = color1.trim();
    const selectedColor2 = color2.trim();
    const selectedShape = shape.trim();

    const payload = {
      texts: selectedText.split(',').map(t => t.trim()).filter(Boolean),
      colors: [selectedColor1, selectedColor2].filter(Boolean),
      shape: selectedShape
    };

    setLoading(true);
    try {
      const response = await matchPill(payload);
      
      if (response.error) {
        Alert.alert('❌ 錯誤訊息', response.error);
        return;
      }

      setMatchResults(response);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('⚠️ JSON 解析錯誤', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* Title*/}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>醫療藥物辨識系統</Text>
          </View>
          
          {/* Camera buttons*/}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={takePicture}
              style={styles.cameraButton}
              buttonColor="#fff"
              textColor="#000"
              loading={loading}
              disabled={loading}
              labelStyle={styles.buttonLabel}
            >
              點擊拍照
            </Button>
            
            <Button
              mode="contained"
              onPress={selectImage}
              style={styles.cameraButton}
              buttonColor="#fff"
              textColor="#000"
              loading={loading}
              disabled={loading}
              labelStyle={styles.buttonLabel}
            >
              選擇檔案
            </Button>
          </View>

          {/* Photo container*/}
          {croppedImage && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: croppedImage }}
                style={styles.croppedImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Recognition results section */}
          <Text style={styles.sectionTitle}>辨識結果</Text>
          
          {/* Text input*/}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>文字：</Text>
            <TextInput
              value={recognizedText}
              onChangeText={setRecognizedText}
              multiline
              style={styles.textInput}
              mode="outlined"
              outlineColor="#000"
              activeOutlineColor="#000"
            />
          </View>

          {/* Color pickers dropdowns */}
          <ColorPicker
            label="顏色一"
            selectedColor={color1}
            onColorSelect={setColor1}
          />

          <ColorPicker
            label="顏色二"
            selectedColor={color2}
            onColorSelect={setColor2}
            allowEmpty
          />

          {/* Shape picker*/}
          <ShapePicker
            selectedShape={shape}
            onShapeSelect={setShape}
          />

          {/* Confirm button*/}
          <Button
            mode="contained"
            onPress={confirmMatch}
            style={styles.confirmButton}
            buttonColor="#fff"
            textColor="#000"
            loading={loading}
            disabled={loading}
            labelStyle={styles.buttonLabel}
          >
            確認藥物比對
          </Button>

          {/* Result modal functionality */}
          <ResultModal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            results={matchResults}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cebba0',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: '#c9b281',
    borderRadius: width * 0.008,
    padding: width * 0.02,
    width: width * 0.9,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: width * 0.004 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.008,
    elevation: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#472601',
    textAlign: 'center',
    backgroundColor: 'rgb(255, 243, 212)',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#fff',
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#000',
    marginVertical: 5,
    width: '80%',
  },
  buttonLabel: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  croppedImage: {
    width: '70%', // make changes here try 60 -> 80 ?
    height: 240, // we can make it height much better
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#472601',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    backgroundColor: 'white',
  },
  confirmButton: {
    backgroundColor: '#fff',
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#000',
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
});
