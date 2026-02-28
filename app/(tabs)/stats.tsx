import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Header, LoadingScreen } from '../../src/components/Shared';
import { useThemeCtx } from '../../src/theme';
import { useStorage } from '../../src/hooks/useStorage';
import {
  defaultItinerary, places, categoryConfig, getPlaceById,
  getDistanceKm, HOTEL_LAT, HOTEL_LNG, type Status, type Category,
} from '../../src/data/appData';

interface ItemState { status: Status; notes: string; }
interface PlaceState { visited: boolean; notes: string; }

export default function StatsScreen() {
  const { C } = useThemeCtx();
  const [itemStates,,loaded1] = useStorage<Record<string, ItemState>>('nyc-item-states', {});
  const [placeStates,,loaded2] = useStorage<Record<string, PlaceState>>('nyc-place-states', {});

  const stats = useMemo(() => {
    let done = 0, skipped = 0, total = 0;
    defaultItinerary.forEach((day, di) => {
      day.items.forEach((_, ii) => {
        total++;
        const s = itemStates[`${di}-${ii}`]?.status;
        if (s === 'done') done++;
        else if (s === 'skipped') skipped++;
      });
    });
    const upcoming = total - done - skipped;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    // Places
    const visitedPlaces = Object.values(placeStates).filter(p => p.visited).length;
    const totalPlaces = places.length;
    const placesPct = totalPlaces > 0 ? Math.round((visitedPlaces / totalPlaces) * 100) : 0;

    // Distance & steps
    let totalDistKm = 0;
    defaultItinerary.forEach((day, di) => {
      let prevLat = HOTEL_LAT, prevLng = HOTEL_LNG;
      day.items.forEach((item, ii) => {
        const st = itemStates[`${di}-${ii}`]?.status;
        if (st === 'done') {
          const p = getPlaceById(item.placeId);
          if (p) {
            totalDistKm += getDistanceKm(prevLat, prevLng, p.lat, p.lng);
            prevLat = p.lat;
            prevLng = p.lng;
          }
        }
      });
      if (prevLat !== HOTEL_LAT || prevLng !== HOTEL_LNG) {
        totalDistKm += getDistanceKm(prevLat, prevLng, HOTEL_LAT, HOTEL_LNG);
      }
    });
    totalDistKm *= 1.3; // Manhattan grid factor
    const steps = Math.round(totalDistKm * 1312);
    const miles = totalDistKm * 0.621371;

    // Categories
    const catCounts: Record<string, number> = {};
    defaultItinerary.forEach((day, di) => {
      day.items.forEach((item, ii) => {
        if (itemStates[`${di}-${ii}`]?.status === 'done') {
          const p = getPlaceById(item.placeId);
          if (p) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
        }
      });
    });
    const maxCat = Math.max(1, ...Object.values(catCounts));

    // Neighborhoods
    const hoodCounts: Record<string, number> = {};
    defaultItinerary.forEach((day, di) => {
      day.items.forEach((item, ii) => {
        if (itemStates[`${di}-${ii}`]?.status === 'done') {
          const p = getPlaceById(item.placeId);
          if (p) hoodCounts[p.neighborhood] = (hoodCounts[p.neighborhood] || 0) + 1;
        }
      });
    });
    const topHoods = Object.entries(hoodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Daily progress
    const dailyProgress = defaultItinerary.map((day, di) => {
      let dayDone = 0, dayTotal = day.items.length;
      day.items.forEach((_, ii) => {
        if (itemStates[`${di}-${ii}`]?.status === 'done') dayDone++;
      });
      return { label: day.dayLabel, pct: dayTotal > 0 ? dayDone / dayTotal : 0, done: dayDone, total: dayTotal };
    });

    // Free activities done
    let freeCount = 0;
    defaultItinerary.forEach((day, di) => {
      day.items.forEach((item, ii) => {
        if (itemStates[`${di}-${ii}`]?.status === 'done') {
          const p = getPlaceById(item.placeId);
          if (p && p.price === 'free') freeCount++;
        }
      });
    });

    // Fun facts
    const facts: string[] = [];
    if (totalDistKm > 0) facts.push(`🌉 Walked ${totalDistKm.toFixed(1)}km — that's ${(totalDistKm / 1.83).toFixed(1)}x across Brooklyn Bridge!`);
    if (done >= 5) facts.push('🏃 More activities than most tourists do in a week!');
    if ((catCounts['food'] || 0) >= 3) facts.push('🍕 Eating your way through NYC like a true local');
    if (visitedPlaces >= 10) facts.push('🗽 You practically live here now');
    if (steps > 10000) facts.push('👟 Your FitBit is very proud of you');
    if (freeCount >= 3) facts.push('💰 Smart travelers — saving $$$ with free activities!');

    return {
      done, skipped, upcoming, total, pct,
      visitedPlaces, totalPlaces, placesPct,
      totalDistKm, miles, steps,
      catCounts, maxCat,
      topHoods, dailyProgress,
      freeCount, facts,
    };
  }, [itemStates, placeStates]);

  if (!loaded1 || !loaded2) return <LoadingScreen />;

  if (stats.done === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Header title="Trip Stats" subtitle="Your NYC adventure in numbers" />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={[styles.emptyTitle, { color: C.text }]}>No stats yet!</Text>
            <Text style={[styles.emptyDesc, { color: C.textSecondary }]}>
              Start checking off activities in the Itinerary tab to see your trip stats come alive.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // SVG ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.pct / 100) * circumference;

  const dayEmojis = ['✈️', '🌉', '🏙️', '🗽', '🍀', '✈️'];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Trip Stats" subtitle="Your NYC adventure in numbers" />

        {/* Hero Ring */}
        <View style={[styles.heroCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <View style={styles.ringContainer}>
            <Svg width={132} height={132}>
              <Circle cx={66} cy={66} r={radius} stroke={C.borderLight} strokeWidth={10} fill="none" />
              <Circle
                cx={66} cy={66} r={radius}
                stroke={C.accent}
                strokeWidth={10}
                fill="none"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation={-90}
                origin="66,66"
              />
            </Svg>
            <View style={styles.ringCenter}>
              <Text style={[styles.ringPct, { color: C.text }]}>{stats.pct}%</Text>
              <Text style={[styles.ringLabel, { color: C.textSecondary }]}>complete</Text>
            </View>
          </View>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: C.green }]} />
              <Text style={[styles.breakdownText, { color: C.textSecondary }]}>{stats.done} done</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: C.red }]} />
              <Text style={[styles.breakdownText, { color: C.textSecondary }]}>{stats.skipped} skipped</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: C.border }]} />
              <Text style={[styles.breakdownText, { color: C.textSecondary }]}>{stats.upcoming} upcoming</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.grid}>
          <View style={[styles.gridCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={styles.gridIcon}>👟</Text>
            <Text style={[styles.gridValue, { color: C.text }]}>{stats.steps.toLocaleString()}</Text>
            <Text style={[styles.gridLabel, { color: C.textSecondary }]}>est. steps</Text>
          </View>
          <View style={[styles.gridCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={styles.gridIcon}>🗺️</Text>
            <Text style={[styles.gridValue, { color: C.text }]}>{stats.totalDistKm.toFixed(1)} km</Text>
            <Text style={[styles.gridLabel, { color: C.textSecondary }]}>{stats.miles.toFixed(1)} mi walked</Text>
          </View>
          <View style={[styles.gridCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={styles.gridIcon}>📍</Text>
            <Text style={[styles.gridValue, { color: C.text }]}>{stats.visitedPlaces}</Text>
            <Text style={[styles.gridLabel, { color: C.textSecondary }]}>of {stats.totalPlaces} places</Text>
          </View>
          <View style={[styles.gridCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={styles.gridIcon}>🆓</Text>
            <Text style={[styles.gridValue, { color: C.text }]}>{stats.freeCount}</Text>
            <Text style={[styles.gridLabel, { color: C.textSecondary }]}>free activities</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={[styles.section, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Category Breakdown</Text>
          {Object.entries(categoryConfig).map(([key, cfg]) => {
            const count = stats.catCounts[key] || 0;
            if (count === 0) return null;
            return (
              <View key={key} style={styles.barRow}>
                <Text style={styles.barIcon}>{cfg.icon}</Text>
                <Text style={[styles.barLabel, { color: C.textSecondary }]}>{cfg.label}</Text>
                <View style={[styles.barTrack, { backgroundColor: C.borderLight }]}>
                  <View style={[styles.barFill, { backgroundColor: cfg.color, width: `${(count / stats.maxCat) * 100}%` }]} />
                </View>
                <Text style={[styles.barCount, { color: C.text }]}>{count}</Text>
              </View>
            );
          })}
        </View>

        {/* Top Neighborhoods */}
        {stats.topHoods.length > 0 && (
          <View style={[styles.section, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Top Neighborhoods</Text>
            {stats.topHoods.map(([hood, count], i) => (
              <View key={hood} style={styles.hoodRow}>
                <Text style={[styles.hoodRank, { color: i === 0 ? C.accent : C.textTertiary }]}>#{i + 1}</Text>
                <Text style={[styles.hoodName, { color: C.text }]}>{hood}</Text>
                <Text style={[styles.hoodCount, { color: C.textSecondary }]}>{count} visits</Text>
              </View>
            ))}
          </View>
        )}

        {/* Daily Progress */}
        <View style={[styles.section, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Daily Progress</Text>
          {stats.dailyProgress.map((d, i) => (
            <View key={i} style={styles.dayRow}>
              <Text style={styles.dayEmoji}>{dayEmojis[i]}</Text>
              <Text style={[styles.dayLabel, { color: C.textSecondary }]}>{d.label}</Text>
              <View style={[styles.dayBarTrack, { backgroundColor: C.borderLight }]}>
                <View style={[styles.dayBarFill, { backgroundColor: C.accent, width: `${d.pct * 100}%` }]} />
              </View>
              <Text style={[styles.dayFraction, { color: C.textTertiary }]}>{d.done}/{d.total}</Text>
            </View>
          ))}
        </View>

        {/* Fun Facts */}
        {stats.facts.length > 0 && (
          <View style={[styles.section, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Fun Facts</Text>
            {stats.facts.map((f, i) => (
              <View key={i} style={[styles.factCard, { backgroundColor: C.accentLight, borderLeftColor: C.accent }]}>
                <Text style={[styles.factText, { color: C.text }]}>{f}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  heroCard: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center', marginBottom: 16 },
  ringContainer: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  ringPct: { fontSize: 28, fontWeight: '700' },
  ringLabel: { fontSize: 12, marginTop: -2 },
  breakdownRow: { flexDirection: 'row', gap: 20, marginTop: 16 },
  breakdownItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  breakdownDot: { width: 8, height: 8, borderRadius: 4 },
  breakdownText: { fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  gridCard: {
    width: '48%', flexGrow: 1, borderRadius: 14, borderWidth: 1,
    padding: 16, alignItems: 'center',
  },
  gridIcon: { fontSize: 24, marginBottom: 6 },
  gridValue: { fontSize: 22, fontWeight: '700' },
  gridLabel: { fontSize: 11, marginTop: 2 },
  section: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 14 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  barIcon: { fontSize: 16, width: 24 },
  barLabel: { fontSize: 12, width: 80 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barCount: { fontSize: 13, fontWeight: '600', width: 22, textAlign: 'right' },
  hoodRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  hoodRank: { fontSize: 13, fontWeight: '700', width: 24 },
  hoodName: { fontSize: 14, flex: 1 },
  hoodCount: { fontSize: 12 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  dayEmoji: { fontSize: 16, width: 24 },
  dayLabel: { fontSize: 12, width: 48 },
  dayBarTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  dayBarFill: { height: '100%', borderRadius: 3 },
  dayFraction: { fontSize: 11, width: 32, textAlign: 'right' },
  factCard: { padding: 12, borderRadius: 10, borderLeftWidth: 3, marginBottom: 8 },
  factText: { fontSize: 13, lineHeight: 19 },
});
