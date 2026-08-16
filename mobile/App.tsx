import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useCurrencyStore } from './store/useCurrencyStore';

const POPULAR_CURRENCIES = ['USD', 'EUR', 'DZD', 'GBP', 'CAD', 'SAR'];

export default function App() {
  const {
    baseCurrency,
    targetCurrency,
    amount,
    convertedAmount,
    loading,
    error,
    setBaseCurrency,
    setTargetCurrency,
    setAmount,
    fetchRates,
    swapCurrencies,
  } = useCurrencyStore();

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Currency Converter</Text>
        <Text style={styles.subtitle}>Real-time Exchange Rates</Text>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#888"
          />
        </View>

        {/* Currency Selectors */}
        <View style={styles.currencyRow}>
          {/* Base Currency */}
          <View style={styles.currencyBox}>
            <Text style={styles.label}>From</Text>

            <View style={styles.chipGrid}>
              {POPULAR_CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={`from-${curr}`}
                  style={[
                    styles.chip,
                    baseCurrency === curr && styles.activeChip,
                  ]}
                  onPress={() => setBaseCurrency(curr)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      baseCurrency === curr && styles.activeChipText,
                    ]}
                  >
                    {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Text style={styles.swapText}>⇄</Text>
          </TouchableOpacity>

          {/* Target Currency */}
          <View style={styles.currencyBox}>
            <Text style={styles.label}>To</Text>

            <View style={styles.chipGrid}>
              {POPULAR_CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={`to-${curr}`}
                  style={[
                    styles.chip,
                    targetCurrency === curr && styles.activeChip,
                  ]}
                  onPress={() => setTargetCurrency(curr)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      targetCurrency === curr && styles.activeChipText,
                    ]}
                  >
                    {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Conversion Result Display */}
        <View style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <Text style={styles.resultLabel}>Converted Value</Text>

              <Text style={styles.resultValue}>
                {convertedAmount !== null
                  ? `${convertedAmount.toFixed(2)} ${targetCurrency}`
                  : '--'}
              </Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#334155',
    color: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  currencyRow: {
    flexDirection: 'column',
    gap: 12,
  },
  currencyBox: {
    flex: 1,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  activeChip: {
    backgroundColor: '#4F46E5',
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#334155',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  swapText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  resultLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  resultValue: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
});