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
      Alert.alert('Image error', (error as Error).message);
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
      Alert.alert('Image error', (error as Error).message);
    }
  };

  const processImage = async (imageUri: string) => {
    setLoading(true);
    try {
      const response = await uploadImage(imageUri);

      if (!response.ok) {
        Alert.alert('Recognition failed', response.error || 'Unknown error');
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
      Alert.alert('Server error', 'Please try again later.');
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
      texts: selectedText.split(',').map((t) => t.trim()).filter(Boolean),
      colors: [selectedColor1, selectedColor2].filter(Boolean),
      shape: selectedShape,
    };

    setLoading(true);
    try {
      const response = await matchPill(payload);

      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      setMatchResults(response);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Pill Identification System</Text>
            <Text style={styles.subtitle}>
              Snap a pill photo — OCR imprint reading + HSV color & shape recognition
            </Text>
          </View>

          {/* Camera buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={takePicture}
              style={styles.cameraButton}
              textColor="#0f766e"
              loading={loading}
              disabled={loading}
              labelStyle={styles.buttonLabel}
            >
              📷 Take Photo
            </Button>

            <Button
              mode="outlined"
              onPress={selectImage}
              style={styles.cameraButton}
              textColor="#0f766e"
              loading={loading}
              disabled={loading}
              labelStyle={styles.buttonLabel}
            >
              🖼️ Choose Image
            </Button>
          </View>

          {/* Photo container */}
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
          <Text style={styles.sectionTitle}>Detected — edit if needed</Text>

          {/* Text input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Imprint</Text>
            <TextInput
              value={recognizedText}
              onChangeText={setRecognizedText}
              multiline
              placeholder="e.g. P 500"
              style={styles.textInput}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#0d9488"
            />
          </View>

          {/* Color picker dropdowns */}
          <ColorPicker label="Color 1" selectedColor={color1} onColorSelect={setColor1} />

          <ColorPicker
            label="Color 2"
            selectedColor={color2}
            onColorSelect={setColor2}
            allowEmpty
          />

          {/* Shape picker */}
          <ShapePicker selectedShape={shape} onShapeSelect={setShape} />

          {/* Confirm button */}
          <Button
            mode="contained"
            onPress={confirmMatch}
            style={styles.confirmButton}
            buttonColor="#0d9488"
            textColor="#ffffff"
            loading={loading}
            disabled={loading}
            labelStyle={styles.confirmLabel}
          >
            🔍 Match Medication
          </Button>

          {/* Result modal */}
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
    backgroundColor: '#eef2f6',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 22,
    width: width * 0.92,
    maxWidth: '100%',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    width: '100%',
    marginBottom: 22,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f766e',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 18,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0d9488',
    marginVertical: 5,
    width: '100%',
  },
  buttonLabel: {
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  croppedImage: {
    width: '70%',
    height: 240,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 14,
    alignSelf: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#6b7280',
  },
  textInput: {
    backgroundColor: '#ffffff',
  },
  confirmButton: {
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignSelf: 'center',
  },
  confirmLabel: {
    fontWeight: '700',
    fontSize: 16,
    paddingVertical: 4,
  },
});
