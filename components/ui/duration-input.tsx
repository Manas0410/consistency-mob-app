import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native'; // Or your icon import
import { Input } from './input';

const durationOptions = [
  { label: 'min', value: 'min' },
  { label: 'hr', value: 'hr' }
];

const DurationInput = () => {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('min');
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Duration"
        placeholder="Enter task name"
        icon={Clock}
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        // style={styles.input}
      />
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.unitText}>{unit}</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={durationOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => onSelectUnit(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    height: 48,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 0,
  },
  dropdown: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    height: '100%',
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
  modalBackdrop: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 140,
    borderRadius: 8,
    elevation: 5,
  },
  option: {
    padding: 14,
  },
  optionText: {
    fontSize: 16,
  }
});

export default DurationInput;
