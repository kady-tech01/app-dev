import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';

// 1. مصفوفة بيانات وهمية تشبه البيانات القادمة مستقبلاً من Django REST API
interface Course {
  id: string;
  title: string;
  instructor: string;
  lessonsCount: number;
  imageUri: string;
}

const COURSES_DATA: Course[] = [
  {
    id: '1',
    title: 'إدارة المالية للشركات الناشئة',
    instructor: 'د. خديجة',
    lessonsCount: 12,
    imageUri: 'https://picsum.photos/200/300?random=1',
  },
  {
    id: '2',
    title: 'بناء تطبيقات الموبايل بـ Expo',
    instructor: 'م. أحمد',
    lessonsCount: 18,
    imageUri: 'https://picsum.photos/200/300?random=2',
  },
  {
    id: '3',
    title: 'أساسيات Django REST Framework',
    instructor: 'م. يوسف',
    lessonsCount: 15,
    imageUri: 'https://picsum.photos/200/300?random=3',
  },
];

export default function HomeScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // دالة التعامل مع ضغط الكورس
  const handleSelectCourse = (course: Course) => {
    setSelectedId(course.id);
    Alert.alert('تم اختيار الكورس', `لقد اخترتِ: ${course.title}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* الهيدر باستخدام View و Text و Image */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          style={styles.logo}
        />
        <View>
          <Text style={styles.welcomeText}>مرحباً بكِ مجدداً 👋</Text>
          <Text style={styles.appTitle}>منصة elvolearn التعليمية</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>الكورسات المتاحة حالياً:</Text>

      {/* عرض القائمة باستخدام FlatList بدلاً من ScrollView للأداء العالي */}
      <FlatList
        data={COURSES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;

          return (
            <Pressable
              onPress={() => handleSelectCourse(item)}
              style={({ pressed }) => [
                styles.courseCard,
                isSelected && styles.selectedCard,
                pressed && styles.pressedCard, // تأثير بصري عند الضغط
              ]}
            >
              {/* صورة الكورس - يلزم تحديد width و height */}
              <Image
                source={{ uri: item.imageUri }}
                style={styles.courseImage}
              />

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.instructorText}>المحاضر: {item.instructor}</Text>
                <Text style={styles.lessonsText}>{item.lessonsCount} درس تعليمي</Text>
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
}

// التنسيقات عبر StyleSheet API
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 13,
    color: '#64748B',
  },
  appTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  listPadding: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  pressedCard: {
    opacity: 0.8,
  },
  courseImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  instructorText: {
    fontSize: 13,
    color: '#475569',
  },
  lessonsText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});