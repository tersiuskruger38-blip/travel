import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useThemeCtx } from '../src/theme';
import { events } from '../src/data/appData';

export default function EventsScreen() {
  const { C } = useThemeCtx();
  const router = useRouter();

  const grouped = events.reduce<Record<string, typeof events>>((acc, e) => {
    const day = e.date;
    if (!acc[day]) acc[day] = [];
    acc[day].push(e);
    return acc;
  }, {});

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>🎪 Events</Text>
        <Text style={[styles.headerSub, { color: C.textSecondary }]}>March 13–18, 2026</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: C.borderLight }]}>
          <X size={20} color={C.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <View key={date} style={styles.daySection}>
            <Text style={[styles.dateLabel, { color: C.accent }]}>{date}</Text>
            {dayEvents.map((ev) => (
              <View key={ev.id} style={[styles.eventCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                <Text style={styles.eventEmoji}>{ev.icon}</Text>
                <View style={styles.eventBody}>
                  <Text style={[styles.eventName, { color: C.text }]}>{ev.name}</Text>
                  <Text style={[styles.eventMeta, { color: C.textSecondary }]}>
                    {ev.time && `${ev.time} · `}{ev.venue}
                  </Text>
                  {ev.price && <Text style={[styles.eventPrice, { color: C.textTertiary }]}>{ev.price}</Text>}
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerSub: { fontSize: 13, flex: 1 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: 16 },
  daySection: { marginBottom: 20 },
  dateLabel: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  eventCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8,
  },
  eventEmoji: { fontSize: 22 },
  eventBody: { flex: 1 },
  eventName: { fontSize: 14, fontWeight: '600' },
  eventMeta: { fontSize: 12, marginTop: 2 },
  eventPrice: { fontSize: 11, marginTop: 2 },
});
