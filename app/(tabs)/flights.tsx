import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plane, Clock, AlertTriangle } from 'lucide-react-native';
import { Header } from '../../src/components/Shared';
import { useThemeCtx } from '../../src/theme';
import { flights } from '../../src/data/appData';

export default function FlightsScreen() {
  const { C } = useThemeCtx();

  const countdown = useMemo(() => {
    const now = new Date();
    const tripStart = new Date('2026-03-13T00:00:00');
    const tripEnd = new Date('2026-03-18T23:59:59');

    if (now < tripStart) {
      const diff = tripStart.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return { label: `Trip starts in ${days} day${days !== 1 ? 's' : ''}!`, emoji: '⏳', active: false };
    } else if (now <= tripEnd) {
      const dayIdx = Math.floor((now.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24));
      return { label: `Day ${dayIdx + 1} of 6 — enjoy NYC!`, emoji: '🗽', active: true };
    } else {
      return { label: 'Trip complete — what a ride!', emoji: '✅', active: false };
    }
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Flights" subtitle="All flight details" />

        {/* Countdown */}
        <View style={[styles.countdownCard, { backgroundColor: C.accentLight, borderColor: C.accent + '30' }]}>
          <Text style={styles.countdownEmoji}>{countdown.emoji}</Text>
          <Text style={[styles.countdownText, { color: C.accent }]}>{countdown.label}</Text>
        </View>

        {flights.map((section, si) => {
          const label = `${section.passenger} — ${section.direction === 'outbound' ? 'Outbound' : 'Return'}`;
          const note = section.direction === 'outbound' && section.passenger === 'Suzanne'
            ? 'Suzanne arrives ~6 hours before Ters. Solo afternoon from ~14:30 until Ters arrives ~20:30.'
            : section.direction === 'return'
            ? '⚠️ Leave Manhattan by 16:30–17:00 to reach Newark on time!'
            : section.passenger === 'Ters' && section.direction === 'outbound'
            ? '2h 05m connection at Denver. Arrives EWR 19:21 — hotel by ~20:30–21:00.'
            : undefined;

          return (
          <View key={si} style={styles.section}>
            <View style={[styles.sectionHeader, { backgroundColor: C.accentLight }]}>
              <Plane size={16} color={C.accent} />
              <Text style={[styles.sectionTitle, { color: C.accent }]}>{label}</Text>
            </View>

            {section.legs.map((leg, i) => (
              <View key={i} style={[styles.legCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                <View style={styles.legRoute}>
                  <View style={styles.legEndpoint}>
                    <Text style={[styles.legCode, { color: C.text }]}>{leg.from}</Text>
                    <Text style={[styles.legTime, { color: C.accent }]}>{leg.depart}</Text>
                  </View>
                  <View style={styles.legLine}>
                    <View style={[styles.dot, { backgroundColor: C.accent }]} />
                    <View style={[styles.line, { backgroundColor: C.border }]} />
                    <Plane size={14} color={C.accent} />
                    <View style={[styles.line, { backgroundColor: C.border }]} />
                    <View style={[styles.dot, { backgroundColor: C.accent }]} />
                  </View>
                  <View style={[styles.legEndpoint, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.legCode, { color: C.text }]}>{leg.to}</Text>
                    <Text style={[styles.legTime, { color: C.accent }]}>{leg.arrive}</Text>
                  </View>
                </View>

                <View style={[styles.legDetails, { borderTopColor: C.borderLight }]}>
                  <Text style={[styles.legDetail, { color: C.textSecondary }]}>{leg.flight} · {leg.aircraft}</Text>
                  <Text style={[styles.legDetail, { color: C.textSecondary }]}>Seat {leg.seat}</Text>
                  <Text style={[styles.legDetail, { color: C.textTertiary }]}>{leg.date}</Text>
                </View>
              </View>
            ))}

            {note && (
              <View style={[styles.noteBox, { backgroundColor: C.accentLight, borderColor: C.accent + '30' }]}>
                <AlertTriangle size={14} color={C.accent} />
                <Text style={[styles.noteText, { color: C.accent }]}>{note}</Text>
              </View>
            )}
          </View>
          );
        })}

        {/* Key Times */}
        <View style={[styles.keyTimesCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <Text style={[styles.keyTimesTitle, { color: C.text }]}>⏰ Key Timing</Text>
          <View style={styles.keyTimeRow}>
            <Clock size={13} color={C.textSecondary} />
            <Text style={[styles.keyTimeText, { color: C.textSecondary }]}>Suzanne arrives EWR: 13:30 (solo afternoon until ~20:30)</Text>
          </View>
          <View style={styles.keyTimeRow}>
            <Clock size={13} color={C.textSecondary} />
            <Text style={[styles.keyTimeText, { color: C.textSecondary }]}>Ters arrives EWR: 19:21 (hotel by ~20:30-21:00)</Text>
          </View>
          <View style={styles.keyTimeRow}>
            <Clock size={13} color={C.accent} />
            <Text style={[styles.keyTimeText, { color: C.accent, fontWeight: '600' }]}>Wed Mar 18: Leave Manhattan by 16:30 for EWR!</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },
  countdownCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 20,
  },
  countdownEmoji: { fontSize: 22 },
  countdownText: { fontSize: 15, fontWeight: '600', flex: 1 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600' },
  legCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 8 },
  legRoute: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  legEndpoint: {},
  legCode: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  legTime: { fontSize: 14, fontWeight: '500', marginTop: 2 },
  legLine: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, marginHorizontal: 12 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  line: { flex: 1, height: 1.5 },
  legDetails: { borderTopWidth: 1, marginTop: 14, paddingTop: 10, gap: 2 },
  legDetail: { fontSize: 12 },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, borderRadius: 10, borderWidth: 1, marginTop: 4,
  },
  noteText: { fontSize: 12.5, lineHeight: 18, flex: 1 },
  keyTimesCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginTop: 8 },
  keyTimesTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  keyTimeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  keyTimeText: { fontSize: 13, lineHeight: 18, flex: 1 },
});
