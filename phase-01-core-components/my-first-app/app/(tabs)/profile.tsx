import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* صورة المعاينة والاسم */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>خ</Text>
          </View>
          <Text style={styles.userName}>خديجة</Text>
          <Text style={styles.userRole}>طالبة - إدارة مالية ومطورة تطبيقات</Text>
        </View>

        {/* بطاقة التفاصيل */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>بيانات الحساب</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الحالة:</Text>
            <Text style={styles.infoValue}>نشط 🟢</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الكورسات المسجلة:</Text>
            <Text style={styles.infoValue}>3 كورسات</Text>
          </View>
        </View>

        {/* زر التفاعل */}
        <Pressable 
          style={styles.button}
          onPress={() => alert('تم الضغط على تعديل الملف الشخصي')}
        >
          <Text style={styles.buttonText}>تعديل البيانات</Text>
        </Pressable>

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
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 14,
  },
  infoValue: {
    color: '#0F172A',
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    width: '100%',
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