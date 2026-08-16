import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Switch,
  Modal,
} from 'react-native';
import { useCurrencyStore } from './store/useCurrencyStore';
import { ALL_CURRENCIES } from './constants/currencies';
import {
  TRANSLATIONS,
  AVAILABLE_LANGUAGES,
  Language,
} from './constants/translations';

type TabType = 'converter' | 'calculator' | 'analytics' | 'favorites' | 'history';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('converter');
  const [isParallelMarket, setIsParallelMarket] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Calculator State
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('0');

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const currentLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === lang);

  const {
    baseCurrency,
    targetCurrency,
    amount,
    convertedAmount,
    loading,
    error,
    isOffline,
    history,
    favorites,
    setBaseCurrency,
    setTargetCurrency,
    setAmount,
    fetchRates,
    swapCurrencies,
    addHistoryItem,
    clearHistory,
    loadHistory,
    toggleFavorite,
    loadFavorites,
    selectFavoritePair,
  } = useCurrencyStore();

  useEffect(() => {
    fetchRates();
    loadHistory();
    loadFavorites();
  }, []);

  const isFavorite = favorites.some(
    (f) => f.from === baseCurrency && f.to === targetCurrency
  );

  const effectiveConvertedAmount = () => {
    if (convertedAmount === null) return null;
    if (
      isParallelMarket &&
      (baseCurrency === 'EUR' || baseCurrency === 'USD') &&
      targetCurrency === 'DZD'
    ) {
      return convertedAmount * 1.65;
    }
    return convertedAmount;
  };

  const handleCalcPress = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('0');
    } else if (val === '=') {
      try {
        const sanitized = calcInput.replace(/×/g, '*').replace(/÷/g, '/');
        const res = eval(sanitized);
        setCalcResult(String(res));
      } catch (e) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  const useCalcResultInConverter = () => {
    if (calcResult !== '0' && calcResult !== 'Error') {
      setAmount(calcResult);
      setActiveTab('converter');
    }
  };

  // Dynamic Theme Colors
  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F1F5F9',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    inputBg: isDarkMode ? '#334155' : '#E2E8F0',
    listBg: isDarkMode ? '#0F172A' : '#F8FAFC',
    borderColor: isDarkMode ? '#334155' : '#CBD5E1',
    scrollIndicator: isDarkMode ? '#475569' : '#94A3B8',
  };

  const renderCurrencySelector = (
    label: string,
    selectedCode: string,
    onSelect: (code: string) => void
  ) => (
    <View style={styles.currencyBox}>
      <Text style={[styles.label, { color: theme.textSub }]}>{label}</Text>
      <ScrollView
        style={[styles.currencyList, { backgroundColor: theme.listBg, borderColor: theme.borderColor }]}
        indicatorStyle={isDarkMode ? 'white' : 'black'}
        nestedScrollEnabled
      >
        <Text style={styles.subGroupLabel}>{t.popular}</Text>
        {ALL_CURRENCIES.filter((c) => c.isPopular).map((item) => (
          <TouchableOpacity
            key={`${label}-${item.code}`}
            style={[
              styles.currencyItem,
              selectedCode === item.code && styles.activeCurrencyItem,
            ]}
            onPress={() => onSelect(item.code)}
          >
            <Text style={styles.flagText}>{item.flag}</Text>
            <Text
              style={[
                styles.currencyCode,
                { color: selectedCode === item.code ? '#FFFFFF' : theme.textMain },
              ]}
            >
              {item.code}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.subGroupLabel}>{t.allCurrencies}</Text>
        {ALL_CURRENCIES.filter((c) => !c.isPopular).map((item) => (
          <TouchableOpacity
            key={`${label}-${item.code}`}
            style={[
              styles.currencyItem,
              selectedCode === item.code && styles.activeCurrencyItem,
            ]}
            onPress={() => onSelect(item.code)}
          >
            <Text style={styles.flagText}>{item.flag}</Text>
            <Text
              style={[
                styles.currencyCode,
                { color: selectedCode === item.code ? '#FFFFFF' : theme.textMain },
              ]}
            >
              {item.code}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const finalResult = effectiveConvertedAmount();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        {/* Top Header */}
        <View style={styles.topHeaderRow}>
          <View>
            <Text style={[styles.title, { color: theme.textMain }]}>
              {t.title}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSub }]}>
              {isOffline ? t.offline : t.subtitle}
            </Text>
          </View>

          <View style={styles.headerControls}>
            {/* Dark / Light Toggle */}
            <TouchableOpacity
              style={[styles.themeBtn, { backgroundColor: theme.inputBg }]}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={{ fontSize: 13 }}>{isDarkMode ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>

            {/* Language Selection Modal Trigger */}
            <TouchableOpacity
              style={[styles.langSelectBtn, { backgroundColor: theme.inputBg }]}
              onPress={() => setIsLangModalOpen(true)}
            >
              <Text style={styles.langSelectText}>
                {currentLangObj?.flag} {currentLangObj?.code.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab 1: Converter */}
        {activeTab === 'converter' && (
          <ScrollView style={styles.tabContent}>
            <View style={[styles.marketToggleRow, { backgroundColor: theme.listBg }]}>
              <Text style={styles.marketToggleLabel}>
                {isParallelMarket ? t.parallelRate : t.officialRate}
              </Text>
              <Switch
                value={isParallelMarket}
                onValueChange={setIsParallelMarket}
                trackColor={{ false: '#334155', true: '#4F46E5' }}
                thumbColor={isParallelMarket ? '#38BDF8' : '#94A3B8'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSub }]}>
                {t.amount}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, color: theme.textMain },
                ]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.currencyRow}>
              {renderCurrencySelector(t.from, baseCurrency, setBaseCurrency)}

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.swapButton, { backgroundColor: theme.inputBg }]}
                  onPress={swapCurrencies}
                >
                  <Text style={[styles.swapText, { color: theme.textMain }]}>
                    ⇄
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.favToggleButton,
                    { backgroundColor: theme.inputBg },
                    isFavorite && styles.favActive,
                  ]}
                  onPress={() => toggleFavorite(baseCurrency, targetCurrency)}
                >
                  <Text style={styles.favToggleText}>
                    {isFavorite ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              </View>

              {renderCurrencySelector(t.to, targetCurrency, setTargetCurrency)}
            </View>

            <View style={[styles.resultContainer, { backgroundColor: theme.listBg }]}>
              {loading ? (
                <ActivityIndicator size="large" color="#4F46E5" />
              ) : error && !finalResult ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <>
                  <Text style={[styles.resultLabel, { color: theme.textSub }]}>
                    {t.convertedResult}
                  </Text>
                  <Text style={styles.resultValue}>
                    {finalResult !== null
                      ? `${finalResult.toFixed(2)} ${targetCurrency}`
                      : '--'}
                  </Text>
                  <TouchableOpacity
                    style={styles.saveHistoryButton}
                    onPress={addHistoryItem}
                  >
                    <Text style={styles.saveHistoryText}>
                      {t.saveConversion}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {finalResult !== null && (
              <View style={styles.matrixContainer}>
                <Text style={[styles.sectionTitleSmall, { color: theme.textSub }]}>
                  {t.quickMatrix}
                </Text>
                <View style={styles.matrixGrid}>
                  {[1, 10, 50, 100, 500, 1000].map((unit) => {
                    const unitRate = finalResult / (parseFloat(amount) || 1);
                    return (
                      <View
                        key={unit}
                        style={[styles.matrixItem, { backgroundColor: theme.listBg }]}
                      >
                        <Text style={[styles.matrixUnit, { color: theme.textSub }]}>
                          {unit} {baseCurrency}
                        </Text>
                        <Text style={[styles.matrixValue, { color: theme.textMain }]}>
                          {(unitRate * unit).toFixed(0)} {targetCurrency}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Tab 2: Calculator */}
        {activeTab === 'calculator' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
              {t.calcTitle}
            </Text>
            <View style={[styles.calcDisplay, { backgroundColor: theme.listBg }]}>
              <Text style={[styles.calcInputText, { color: theme.textSub }]}>
                {calcInput || '0'}
              </Text>
              <Text style={styles.calcResultText}>{calcResult}</Text>
            </View>

            <TouchableOpacity
              style={styles.useCalcBtn}
              onPress={useCalcResultInConverter}
            >
              <Text style={styles.useCalcBtnText}>{t.calcBtnUse}</Text>
            </TouchableOpacity>

            <View style={styles.calcGrid}>
              {[
                '7', '8', '9', '÷',
                '4', '5', '6', '×',
                '1', '2', '3', '-',
                'C', '0', '=', '+'
              ].map((btn) => (
                <TouchableOpacity
                  key={btn}
                  style={[
                    styles.calcKey,
                    { backgroundColor: theme.inputBg },
                    ['÷', '×', '-', '+', '='].includes(btn) && styles.calcOperatorKey,
                    btn === 'C' && styles.calcClearKey,
                  ]}
                  onPress={() => handleCalcPress(btn)}
                >
                  <Text
                    style={[
                      styles.calcKeyText,
                      { color: ['÷', '×', '-', '+', '=', 'C'].includes(btn) ? '#FFFFFF' : theme.textMain }
                    ]}
                  >
                    {btn}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Tab 3: Charts */}
        {activeTab === 'analytics' && (
          <ScrollView style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
              📈 Rate Analytics ({baseCurrency} / {targetCurrency})
            </Text>
            <View style={[styles.chartPlaceholderCard, { backgroundColor: theme.listBg }]}>
              <Text style={[styles.chartTitle, { color: theme.textSub }]}>
                7-Day Exchange Trend
              </Text>
              <View style={styles.simulatedChart}>
                <View style={[styles.bar, { height: '40%' }]} />
                <View style={[styles.bar, { height: '55%' }]} />
                <View style={[styles.bar, { height: '50%' }]} />
                <View style={[styles.bar, { height: '70%' }]} />
                <View style={[styles.bar, { height: '65%' }]} />
                <View style={[styles.bar, { height: '85%' }]} />
                <View
                  style={[styles.bar, { height: '100%', backgroundColor: '#10B981' }]}
                />
              </View>
            </View>
          </ScrollView>
        )}

        {/* Tab 4: Favorites */}
        {activeTab === 'favorites' && (
          <ScrollView style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
              Favorites
            </Text>
            {favorites.length === 0 ? (
              <Text style={styles.emptyText}>No favorite pairs added yet.</Text>
            ) : (
              favorites.map((pair) => (
                <TouchableOpacity
                  key={pair.id}
                  style={[styles.favCard, { backgroundColor: theme.listBg }]}
                  onPress={() => {
                    selectFavoritePair(pair);
                    setActiveTab('converter');
                  }}
                >
                  <Text style={styles.favCardText}>
                    {pair.from} ➔ {pair.to}
                  </Text>
                  <Text style={styles.tapToUse}>Tap to convert ➔</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {/* Tab 5: History */}
        {activeTab === 'history' && (
          <ScrollView style={styles.tabContent}>
            <View style={styles.historyHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
                Conversion Logs
              </Text>
              {history.length > 0 && (
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {history.length === 0 ? (
              <Text style={styles.emptyText}>No conversion history yet.</Text>
            ) : (
              history.map((item) => (
                <View
                  key={item.id}
                  style={[styles.historyRow, { backgroundColor: theme.listBg }]}
                >
                  <Text style={[styles.historyText, { color: theme.textMain }]}>
                    {item.amount} {item.from} = {item.result.toFixed(2)} {item.to}
                  </Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* Navigation Tab Bar */}
        <View style={[styles.tabBar, { backgroundColor: theme.listBg }]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'converter' && styles.activeTab]}
            onPress={() => setActiveTab('converter')}
          >
            <Text style={styles.tabText}>{t.tabs.convert}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'calculator' && styles.activeTab]}
            onPress={() => setActiveTab('calculator')}
          >
            <Text style={styles.tabText}>{t.tabs.calc}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'analytics' && styles.activeTab]}
            onPress={() => setActiveTab('analytics')}
          >
            <Text style={styles.tabText}>{t.tabs.charts}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={styles.tabText}>{t.tabs.favs}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={styles.tabText}>{t.tabs.history}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Global Languages Modal */}
      <Modal visible={isLangModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.textMain }]}>
              {t.selectLang}
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {AVAILABLE_LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[
                    styles.langModalOption,
                    lang === l.code && styles.activeLangOption,
                  ]}
                  onPress={() => {
                    setLang(l.code);
                    setIsLangModalOpen(false);
                  }}
                >
                  <Text style={styles.langModalFlag}>{l.flag}</Text>
                  <Text
                    style={[
                      styles.langModalName,
                      { color: lang === l.code ? '#FFFFFF' : theme.textMain },
                    ]}
                  >
                    {l.name} ({l.code.toUpperCase()})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setIsLangModalOpen(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    height: '96%',
    borderRadius: 20,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  langSelectBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  langSelectText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 11,
  },
  tabContent: {
    flex: 1,
  },
  marketToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  marketToggleLabel: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  subGroupLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
    marginVertical: 4,
    textTransform: 'uppercase',
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  currencyBox: {
    flex: 1,
  },
  currencyList: {
    height: 120,
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    gap: 6,
  },
  activeCurrencyItem: {
    backgroundColor: '#4F46E5',
  },
  flagText: {
    fontSize: 13,
  },
  currencyCode: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionRow: {
    alignItems: 'center',
    gap: 6,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapText: {
    fontSize: 16,
  },
  favToggleButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  favActive: {
    backgroundColor: '#EAB308',
  },
  favToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 10,
  },
  resultValue: {
    color: '#10B981',
    fontSize: 22,
    fontWeight: 'bold',
  },
  saveHistoryButton: {
    marginTop: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveHistoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  matrixContainer: {
    marginTop: 10,
  },
  sectionTitleSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  matrixItem: {
    width: '48%',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  matrixUnit: {
    fontSize: 10,
  },
  matrixValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calcDisplay: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  calcInputText: {
    fontSize: 16,
  },
  calcResultText: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: 'bold',
  },
  useCalcBtn: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  useCalcBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  calcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  calcKey: {
    width: '22%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcOperatorKey: {
    backgroundColor: '#4F46E5',
  },
  calcClearKey: {
    backgroundColor: '#EF4444',
  },
  calcKeyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartPlaceholderCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 12,
    marginBottom: 16,
  },
  simulatedChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    width: '100%',
    paddingHorizontal: 12,
  },
  bar: {
    width: 18,
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  favCard: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favCardText: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 13,
  },
  tapToUse: {
    color: '#64748B',
    fontSize: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: {
    color: '#EF4444',
    fontSize: 11,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  historyText: {
    fontSize: 12,
  },
  historyDate: {
    color: '#64748B',
    fontSize: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  langModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    gap: 10,
  },
  activeLangOption: {
    backgroundColor: '#4F46E5',
  },
  langModalFlag: {
    fontSize: 18,
  },
  langModalName: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeModalBtn: {
    marginTop: 10,
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});