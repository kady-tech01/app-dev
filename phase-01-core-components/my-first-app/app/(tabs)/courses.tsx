import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MY_COURSES = [
  { id: '1', title: 'إدارة المالية للشركات الناشئة', progress: '80%' },
  { id: '2', title: 'أساسيات Django REST Framework', progress: '45%' },
  { id: '3', title: 'تطوير التطبيقات بـ React Native', progress: '20%' },
];

export default function CoursesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>دوراتي التعليمية 📚</Text>

        <FlatList
          data={MY_COURSES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.courseCard}>
              <View style={styles.cardInfo}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.progressText}>نسبة الإنجاز: {item.progress}</Text>
              </View>
              <Pressable style={styles.continueButton}>
                <Text style={styles.buttonText}>متابعة</Text>
              </Pressable>
            </View>
          )}
        />
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});