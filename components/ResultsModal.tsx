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

const { height } = Dimensions.get('window');

interface ResultModalProps {
  visible: boolean;
  onDismiss: () => void;
  results: any;
}

const DrugCard: React.FC<{ drug: any }> = ({ drug }) => (
  <View style={styles.candidateWrapper}>
    {!!drug.drug_image && (
      <Image
        source={{ uri: drug.drug_image }}
        style={styles.candidateImage}
        resizeMode="contain"
      />
    )}
    <View style={styles.candidateTextArea}>
      <Text style={styles.drugName}>{drug.name}</Text>
      <Text style={styles.drugInfo}>
        <Text style={styles.boldText}>Indications: </Text>
        {drug.symptoms || 'N/A'}
      </Text>
      <Text style={styles.drugInfo}>
        <Text style={styles.boldText}>Precautions: </Text>
        {drug.precautions || 'N/A'}
      </Text>
      <Text style={styles.drugInfo}>
        <Text style={styles.boldText}>Side effects: </Text>
        {drug.side_effects || 'N/A'}
      </Text>
    </View>
  </View>
);

const ResultModal: React.FC<ResultModalProps> = ({ visible, onDismiss, results }) => {
  if (!results) return null;

  return (
    <Modal isVisible={visible} onBackdropPress={onDismiss} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Match Results</Text>

        <ScrollView style={styles.scrollContainer}>
          {results.candidates ? (
            results.candidates.map((drug: any, index: number) => (
              <DrugCard key={index} drug={drug} />
            ))
          ) : results.name ? (
            <DrugCard drug={results} />
          ) : (
            <Text style={styles.noResults}>No matching results</Text>
          )}
        </ScrollView>

        <Button
          mode="contained"
          onPress={onDismiss}
          style={styles.closeButton}
          buttonColor="#0d9488"
          textColor="#ffffff"
        >
          Close
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    maxHeight: height * 0.82,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 18,
    color: '#0f766e',
  },
  scrollContainer: {
    maxHeight: height * 0.62,
  },
  candidateWrapper: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  candidateImage: {
    width: '100%',
    height: height * 0.25,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  candidateTextArea: {
    width: '100%',
  },
  drugName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0f766e',
    textAlign: 'center',
  },
  drugInfo: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 6,
    color: '#1f2937',
  },
  boldText: {
    fontWeight: '700',
    color: '#6b7280',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 18,
    borderRadius: 12,
  },
});

export default ResultModal;
