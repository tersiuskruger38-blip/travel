import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Navigation, Ticket } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useThemeCtx } from '../../src/theme';
import { useStorage } from '../../src/hooks/useStorage';
import { Header, Badge, PlaceDetail, StatusButtons, LoadingScreen } from '../../src/components/Shared';
import {
  defaultItinerary, getPlaceById, categoryConfig,
  getDistanceKm, getWalkingTime, type Status,
} from '../../src/data/appData';

interface ItemState { status: Status; notes: string; }

export default function ItineraryScreen() {
  const { C } = useThemeCtx();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0);
  const [itinerary] = useStorage('nyc-itinerary', defaultItinerary);
  const [itemStates, setItemStates, loaded] = useStorage<Record<string, ItemState>>('nyc-item-states', {});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const day = itinerary[selectedDay];
  const getKey = (di: number, ii: number) => `${di}-${ii}`;
  const dayDates = ['Mar 13', 'Mar 14', 'Mar 15', 'Mar 16', 'Mar 17', 'Mar 18'];
  const dayEmojis = ['✈️', '🌉', '🏙️', '🗽', '🍀', '✈️'];

  // Auto-select today's day during the trip
  const autoDay = useMemo(() => {
    const now = new Date();
    const tripDates = ['2026-03-13','2026-03-14','2026-03-15','2026-03-16','2026-03-17','2026-03-18'];
    const today = now.toISOString().slice(0, 10);
    const idx = tripDates.indexOf(today);
    return idx >= 0 ? idx : null;
  }, []);

  // Set auto-day on first load
  React.useEffect(() => {
    if (autoDay !== null) setSelectedDay(autoDay);
  }, [autoDay]);

  const toggleStatus = (di: number, ii: number, s: Status) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const k = getKey(di, ii);
    setItemStates((prev) => {
      const cur = prev[k] || { status: 'upcoming' as Status, notes: '' };
      return { ...prev, [k]: { ...cur, status: cur.status === s ? 'upcoming' : s } };
    });
  };

  const updateNotes = (di: number, ii: number, notes: string) => {
    const k = getKey(di, ii);
    setItemStates((prev) => {
      const cur = prev[k] || { status: 'upcoming' as Status, notes: '' };
      return { ...prev, [k]: { ...cur, notes } };
    });
  };

  if (!loaded) return <LoadingScreen />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Header title="NYC Trip" subtitle="Ters & Suzanne · March 13–18, 2026" />
          </View>
          <TouchableOpacity
            style={[styles.eventsBtn, { backgroundColor: C.accentLight, borderColor: C.accent + '30' }]}
            onPress={() => router.push('/events')}
          >
            <Ticket size={16} color={C.accent} />
            <Text style={[styles.eventsBtnText, { color: C.accent }]}>Events</Text>
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector} contentContainerStyle={styles.daySelectorContent}>
          {itinerary.map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayChip,
                { borderColor: selectedDay === i ? C.accent : C.border, backgroundColor: selectedDay === i ? C.accentLight : C.bgCard },
              ]}
              onPress={() => { Haptics.selectionAsync(); setSelectedDay(i); }}
            >
              <Text style={styles.dayChipEmoji}>{dayEmojis[i]}</Text>
              <Text style={[styles.dayChipDate, { color: selectedDay === i ? C.accent : C.textSecondary }]}>{dayDates[i]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Day Header */}
        <View style={styles.dayHeader}>
          <Text style={[styles.dayTitle, { color: C.text }]}>{day.title}</Text>
          {day.subtitle && <Text style={[styles.daySub, { color: C.textSecondary }]}>{day.subtitle}</Text>}
        </View>

        {/* Activity Cards */}
        {day.items.map((item, idx) => {
          const place = getPlaceById(item.placeId);
          if (!place) return null;
          const k = getKey(selectedDay, idx);
          const state = itemStates[k] || { status: 'upcoming' as Status, notes: '' };
          const isExp = expandedItem === k;
          const cat = categoryConfig[place.category];

          let distStr = '';
          if (idx > 0) {
            const prev = getPlaceById(day.items[idx - 1].placeId);
            if (prev) distStr = getWalkingTime(getDistanceKm(prev.lat, prev.lng, place.lat, place.lng));
          }

          const cardBg = state.status === 'done' ? C.greenLight : state.status === 'skipped' ? C.redLight : C.bgCard;
          const cardBorder = state.status === 'done' ? C.green : state.status === 'skipped' ? C.red : C.border;

          return (
            <TouchableOpacity
              key={k}
              style={[styles.activityCard, { backgroundColor: cardBg, borderColor: cardBorder, opacity: state.status !== 'upcoming' ? 0.6 : 1 }]}
              onPress={() => setExpandedItem(isExp ? null : k)}
              activeOpacity={0.7}
            >
              {distStr ? (
                <View style={[styles.distBadge, { backgroundColor: C.borderLight }]}>
                  <Navigation size={10} color={C.textTertiary} />
                  <Text style={[styles.distText, { color: C.textTertiary }]}>{distStr}</Text>
                </View>
              ) : null}

              <View style={styles.activityMain}>
                <Text style={[styles.activityTime, { color: C.accent }]}>{item.time || '—'}</Text>
                <View style={styles.activityBody}>
                  <View style={styles.nameRow}>
                    <Text style={styles.activityEmoji}>{cat.icon}</Text>
                    <Text style={[styles.activityName, { color: C.text }, state.status === 'done' && styles.lineThrough]}>{place.name}</Text>
                  </View>
                  {item.notes ? <Text style={[styles.activityNotes, { color: C.textSecondary }]}>{item.notes}</Text> : null}
                  <View style={styles.metaRow}>
                    <Badge label={cat.label} color={cat.color} />
                    <Text style={[styles.priceText, { color: C.textTertiary }]}>{place.price === 'free' ? 'Free' : place.price}</Text>
                    {place.duration && (
                      <View style={styles.durationRow}>
                        <Clock size={10} color={C.textTertiary} />
                        <Text style={[styles.durationText, { color: C.textTertiary }]}>{place.duration}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <StatusButtons
                  status={state.status}
                  onDone={() => toggleStatus(selectedDay, idx, 'done')}
                  onSkip={() => toggleStatus(selectedDay, idx, 'skipped')}
                  C={C}
                />
              </View>

              {isExp && (
                <View>
                  <PlaceDetail place={place} C={C} />
                  <TextInput
                    style={[styles.noteInput, { borderColor: C.border, backgroundColor: C.bg, color: C.text }]}
                    placeholder="Add your notes..."
                    placeholderTextColor={C.textTertiary}
                    value={state.notes}
                    onChangeText={(t) => updateNotes(selectedDay, idx, t)}
                    multiline
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  eventsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1, marginTop: 20,
  },
  eventsBtnText: { fontSize: 12, fontWeight: '600' },
  daySelector: { marginBottom: 4 },
  daySelectorContent: { gap: 8, paddingVertical: 8 },
  dayChip: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1.5,
  },
  dayChipEmoji: { fontSize: 18 },
  dayChipDate: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  dayHeader: { paddingVertical: 12 },
  dayTitle: { fontSize: 22, fontWeight: '600' },
  daySub: { fontSize: 13, marginTop: 4 },
  activityCard: {
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 6,
  },
  distBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  distText: { fontSize: 10 },
  activityMain: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  activityTime: { fontSize: 13, fontWeight: '600', minWidth: 42, paddingTop: 2 },
  activityBody: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activityEmoji: { fontSize: 16 },
  activityName: { fontSize: 15, fontWeight: '600', flex: 1 },
  lineThrough: { textDecorationLine: 'line-through' },
  activityNotes: { fontSize: 12.5, marginTop: 4, lineHeight: 17 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' },
  priceText: { fontSize: 10, fontWeight: '600' },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  durationText: { fontSize: 10 },
  noteInput: {
    borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 10,
    fontSize: 13, minHeight: 44, textAlignVertical: 'top',
  },
});
