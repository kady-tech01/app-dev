import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileScreen() {
  // جلب البيانات والدوال من خزانة Zustand مباشرة!
  const { isAuthenticated, isLoading, login, logout, checkAuth } = useAuthStore();

  // فحص الجلسة فور فتح الصفحة
  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* الهيدر وشارة حالة التسجيل */}
        <View style={styles.header}>
          <View style={[styles.statusBadge, isAuthenticated ? styles.bgSuccess : styles.bgDanger]}>
            <Text style={styles.statusText}>
              {isAuthenticated ? 'مسجل الدخول 🟢' : 'غير مسجل 🔴'}
            </Text>
          </View>
          <Text style={styles.userName}>خديجة</Text>
          <Text style={styles.userRole}>elvolearn Student</Text>
        </View>

        {/* كارت التجارب التفاعلية */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>تجربة حالة الحساب (Zustand + SecureStore)</Text>
          <Text style={styles.cardDesc}>
            {isAuthenticated 
              ? 'التوكين محفوظ حالياً بنجاح داخل SecureStore المشفر!' 
              : 'لم يتم العثور على توكين محفوظ. يرجى تسجيل الدخول.'}
          </Text>

          {isAuthenticated ? (
            <Pressable style={[styles.btn, styles.btnDanger]} onPress={logout}>
              <Text style={styles.btnText}>تسجيل الخروج (حذف التوكين)</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={[styles.btn, styles.btnPrimary]} 
              onPress={() => login('fake_jwt_token_demo_12345')}
            >
              <Text style={styles.btnText}>محاكاة تسجيل الدخول (حفظ التوكين)</Text>
            </Pressable>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginVertical: 20 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  bgSuccess: { backgroundColor: '#DCFCE7' },
  bgDanger: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  userRole: { fontSize: 14, color: '#64748B' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#1E293B' },
  cardDesc: { fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 20 },
  btn: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#4F46E5' },
  btnDanger: { backgroundColor: '#EF4444' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});