import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Phase2Screen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* هيدر علوي */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Courses Dashboard</Text>
        </View>

        {/* محتوى الشاشة الأوسط (مفهوم flex: 1) */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>بطاقة تجربة Flexbox</Text>
          
          {/* حاوية أفقية لعرض كارتين جنباً إلى جنب */}
          <View style={styles.row}>
            <View style={[styles.card, styles.primaryCard]}>
              <Text style={styles.cardTextLight}>الكورسات المسجلة</Text>
              <Text style={styles.cardNumberLight}>12</Text>
            </View>

            <View style={[styles.card, styles.secondaryCard]}>
              <Text style={styles.cardTextDark}>الساعات المكتملة</Text>
              <Text style={styles.cardNumberDark}>48h</Text>
            </View>
          </View>
        </View>

        {/* فوتر أصفل الشاشة */}
        <View style={styles.footer}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>متابعة الدراسة</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1, // يأخذ كامل ارتفاع الشاشة
    paddingHorizontal: 16,
    justifyContent: 'space-between', // توزيع المحتوى بين الأعلى والمنتصف والأسفل
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  content: {
    flex: 1, // يملأ كامل المساحة المتبقية بين الهيدر والفوتر
    justifyContent: 'center', // محاذاة في منتصف الشاشة عمودياً
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row', // تغيير الترتيب ليكون أفقياً لصف الكروت
    gap: 12, // مسافة بين الكروت
  },
  card: {
    flex: 1, // كل كارت يأخذ نصف المساحة المتاحة أفقياً
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  primaryCard: {
    backgroundColor: '#4F46E5',
  },
  secondaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTextLight: { color: '#E0E7FF', fontSize: 13 },
  cardNumberLight: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  cardTextDark: { color: '#64748B', fontSize: 13 },
  cardNumberDark: { color: '#0F172A', fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  footer: {
    paddingVertical: 16,
  },
  button: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});