import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerForPushNotificationsAsync } from '../services/notifications';
import { createPriceAlert } from '../services/api';

export default function AlertScreen() {
  const [pushToken, setPushToken] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setPushToken(token));
  }, []);

  const handleSetAlert = async () => {
    if (!pushToken) {
      Alert.alert('خطأ', 'تعذر الحصول على رمز الإشعارات لجهازك');
      return;
    }
    if (!targetPrice) {
      Alert.alert('تنبه', 'الرجاء إدخال السعر المستهدف');
      return;
    }

    try {
      await createPriceAlert({
        device_push_token: pushToken,
        base_currency: 1, // EUR ID from DB
        target_currency: 2, // DZD ID from DB
        market_type: 'parallel',
        target_price: parseFloat(targetPrice),
        condition: 'ABOVE',
      });
      Alert.alert('تم بنجاح! 🔔', 'سيتم إشعارك فور وصول سعر السكوار إلى هذا المستوى.');
      setTargetPrice('');
    } catch (error) {
      console.error('Error setting alert:', error);
      Alert.alert('خطأ', 'تعذر حفظ التنبيه، حاول لاحقاً');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إضافة تنبيه سعر جديد 📈</Text>
      <TextInput
        style={styles.input}
        placeholder="أدخل السعر المستهدف (مثلاً: 245)"
        keyboardType="numeric"
        value={targetPrice}
        onChangeText={setTargetPrice}
      />
      <Button title="تفعيل التنبيه" color="#10B981" onPress={handleSetAlert} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 16, textAlign: 'center' },
});