import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');

interface ResultModalProps {
  visible: boolean;
  onDismiss: () => void;
  results: any;
}

const ResultModal: React.FC<ResultModalProps> = ({ visible, onDismiss, results }) => {
  if (!results) return null;

  // Exact same logic as website JavaScript
  const renderCandidates = (candidates: any[]) => (
    <ScrollView style={styles.candidatesContainer}>
      {candidates.map((drug, index) => (
        <View key={index} style={styles.candidateWrapper}>
          {/* 圖片 */}
          <Image
            source={{ uri: drug.drug_image || '' }}
            style={styles.candidateImage}
            resizeMode="contain"
          />
          
          {/* 文字 */}
          <View style={styles.candidateTextArea}>
            <Text style={styles.drugName}>{drug.name}</Text>
            <Text style={styles.drugInfo}>
              <Text style={styles.boldText}>適應症：</Text>
              {drug.symptoms || '無'}
            </Text>
            <Text style={styles.drugInfo}>
              <Text style={styles.boldText}>注意事項：</Text>
              {drug.precautions || '無'}
            </Text>
            <Text style={styles.drugInfo}>
              <Text style={styles.boldText}>副作用：</Text>
              {drug.side_effects || '無'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderSingleResult = (result: any) => (
    <View style={styles.singleResultWrapper}>
      <Image
        source={{ uri: result.drug_image || '' }}
        style={styles.singleResultImage}
        resizeMode="contain"
      />
      
      <View style={styles.singleResultTextArea}>
        <Text style={styles.drugName}>{result.name}</Text>
        <Text style={styles.drugInfo}>
          <Text style={styles.boldText}>適應症：</Text>
          {result.symptoms || '無'}
        </Text>
        <Text style={styles.drugInfo}>
          <Text style={styles.boldText}>注意事項：</Text>
          {result.precautions || '無'}
        </Text>
        <Text style={styles.drugInfo}>
          <Text style={styles.boldText}>副作用：</Text>
          {result.side_effects || '無'}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onDismiss}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>比對結果</Text>
        
        <ScrollView style={styles.scrollContainer}>
          {/* Exact same logic as website */}
          {results.candidates ? (
            renderCandidates(results.candidates)
          ) : results.name ? (
            renderSingleResult(results)
          ) : (
            <Text style={styles.noResults}>無匹配結果</Text>
          )}
        </ScrollView>
        
        <Button
          mode="contained"
          onPress={onDismiss}
          style={styles.closeButton}
          buttonColor="#472601"
        >
          關閉
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: height * 0.8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#472601',
  },
  scrollContainer: {
    maxHeight: height * 0.6,
  },
  candidatesContainer: {
    flex: 1,
  },
  candidateWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 15,
  },
  candidateImage: {
    width: '100%',
    maxHeight: height * 0.25, // 50vh equivalent
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  candidateTextArea: {
    width: '100%',
    marginTop: 10,
  },
  singleResultWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  singleResultImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  singleResultTextArea: {
    width: '100%',
  },
  drugName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#472601',
  },
  drugInfo: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 20,
  },
});

export default ResultModal;
