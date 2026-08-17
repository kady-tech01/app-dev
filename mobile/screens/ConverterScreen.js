import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function ConverterScreen() {
  const [amount, setAmount] = useState('100');
  const [isParallel, setIsParallel] = useState(true);

  // أسعار افتراضية للتحويل اللحظي (يمكن ربطها مع API الأسعار)
  const rateBuy = isParallel ? 240 : 145; 
  const result = (parseFloat(amount || 0) * rateBuy).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>محول العملات السريع 🧮</Text>

      {/* تبديل نوع السوق */}
      <View style={styles.marketToggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, isParallel && styles.activeBtn]}
          onPress={() => setIsParallel(true)}
        >
          <Text style={[styles.toggleText, isParallel && styles.activeText]}>السوق الموازي (السكوار)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, !isParallel && styles.activeBtn]}
          onPress={() => setIsParallel(false)}
        >
          <Text style={[styles.toggleText, !isParallel && styles.activeText]}>السوق الرسمي</Text>
        </TouchableOpacity>
      </View>

      {/* مدخل المبلغ */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>المبلغ باليورو (EUR):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="أدخل المبلغ"
        />
      </View>

      {/* النتيجة */}
      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>المبلغ المعادل بالدينار الجزائري:</Text>
        <Text style={styles.resultValue}>{result} DZD</Text>
        <Text style={styles.rateInfo}>سعر الصرف المعتمد: 1 EUR = {rateBuy} DZD</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#111827' },
  marketToggle: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 10, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeBtn: { backgroundColor: '#10B981' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  activeText: { color: '#FFFFFF' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#374151', textAlign: 'right' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, fontSize: 18, textAlign: 'center' },
  resultCard: { backgroundColor: '#ECFDF5', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#A7F3D0' },
  resultLabel: { fontSize: 15, color: '#065F46', marginBottom: 8 },
  resultValue: { fontSize: 32, fontWeight: 'bold', color: '#047857' },
  rateInfo: { fontSize: 13, color: '#059669', marginTop: 8 },
});