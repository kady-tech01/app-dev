import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { fetchExchangeRates } from '../services/api';

export default function HomeScreen() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRates = async () => {
    try {
      const data = await fetchExchangeRates();
      setRates(data);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRates();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>أسعار الصرف في الجزائر</Text>
      <FlatList
        data={rates}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={={ ({ item }) => (
          <View style={styles.card}>
            <Text style={styles.pair}>
              {item.base_currency_code} / {item.target_currency_code}
            </Text>
            <Text style={styles.market}>
              {item.market_type === 'parallel' ? 'سوق السكوار (الموازي)' : 'السوق الرسمي'}
            </Text>
            <View style={styles.rateRow}>
              <Text style={styles.rateText}>شراء: {item.rate_buy} DZD</Text>
              <Text style={styles.rateText}>بيع: {item.rate_sell} DZD</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  pair: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  market: { fontSize: 14, color: '#6B7280', marginVertical: 4 },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rateText: { fontSize: 16, fontWeight: '600', color: '#059669' },
});