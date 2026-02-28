import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeCtx } from '../../src/theme';
import { useStorage } from '../../src/hooks/useStorage';
import { Header, Badge, PlaceDetail, LoadingScreen } from '../../src/components/Shared';
import {
  places, categoryConfig, getDistanceKm, HOTEL_LAT, HOTEL_LNG,
  type Place, type Category,
} from '../../src/data/appData';

interface PlaceState { visited: boolean; notes: string; }

const categories: { key: 'all' | Category; label: string }[] = [
  { key: 'all', label: '🗽 All' },
  { key: 'food', label: '🍕 Food' },
  { key: 'sightseeing', label: '👁️ Sights' },
  { key: 'entertainment', label: '🎭 Shows' },
  { key: 'nightlife', label: '🌃 Night' },
  { key: 'shopping', label: '🛍️ Shop' },
  { key: 'sports', label: '🏟️ Sport' },
  { key: 'photo', label: '📸 Photo' },
];

export default function PlacesScreen() {
  const { C } = useThemeCtx();
  const [placeStates, setPlaceStates, loaded] = useStorage<Record<string, PlaceState>>('nyc-place-states', {});
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | Category>('all');
  const [expandedPlace, setExpandedPlace] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.neighborhood.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, catFilter]);

  const toggleVisited = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlaceStates((prev) => {
      const cur = prev[id] || { visited: false, notes: '' };
      return { ...prev, [id]: { ...cur, visited: !cur.visited } };
    });
  }, [setPlaceStates]);

  const renderItem = useCallback(({ item: place }: { item: Place }) => {
    const state = placeStates[place.id] || { visited: false, notes: '' };
    const cat = categoryConfig[place.category];
    const dist = getDistanceKm(HOTEL_LAT, HOTEL_LNG, place.lat, place.lng);
    const isExp = expandedPlace === place.id;

    return (
      <TouchableOpacity
        style={[
          styles.placeCard,
          { backgroundColor: C.bgCard, borderColor: state.visited ? C.green : C.border },
          state.visited && { opacity: 0.6 },
        ]}
        onPress={() => setExpandedPlace(isExp ? null : place.id)}
        activeOpacity={0.7}
      >
        <View style={styles.placeMain}>
          <View style={styles.placeBody}>
            <View style={styles.nameRow}>
              <Text style={styles.placeEmoji}>{cat.icon}</Text>
              <Text style={[styles.placeName, { color: C.text }, state.visited && styles.lineThrough]}>{place.name}</Text>
            </View>
            <View style={styles.metaRow}>
              <Badge label={cat.label} color={cat.color} />
              <Text style={[styles.metaText, { color: C.textTertiary }]}>{place.price === 'free' ? 'Free' : place.price}</Text>
              <Text style={[styles.metaText, { color: C.textTertiary }]}>{dist.toFixed(1)} km</Text>
              <Text style={[styles.metaText, { color: C.textTertiary }]}>{place.neighborhood}</Text>
            </View>
            {place.notes && <Text style={[styles.placeNotes, { color: C.textSecondary }]}>{place.notes}</Text>}
          </View>
          <TouchableOpacity
            style={[
              styles.visitedBtn,
              { borderColor: state.visited ? C.green : C.border },
              state.visited && { backgroundColor: C.green },
            ]}
            onPress={() => toggleVisited(place.id)}
          >
            <Check size={16} color={state.visited ? '#fff' : C.textTertiary} />
          </TouchableOpacity>
        </View>
        {isExp && <PlaceDetail place={place} C={C} />}
      </TouchableOpacity>
    );
  }, [placeStates, expandedPlace, C, toggleVisited]);

  if (!loaded) return <LoadingScreen />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]} edges={['top']}>
      <View style={styles.headerPad}>
        <Header title="Places" subtitle={`${places.length} curated spots`} />
      </View>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: C.bgCard, borderColor: C.border }]}>
        <Search size={16} color={C.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder="Search places..."
          placeholderTextColor={C.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(c) => c.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
        renderItem={({ item: c }) => (
          <TouchableOpacity
            style={[
              styles.catChip,
              { borderColor: catFilter === c.key ? C.accent : C.border, backgroundColor: catFilter === c.key ? C.accentLight : C.bgCard },
            ]}
            onPress={() => { Haptics.selectionAsync(); setCatFilter(c.key); }}
          >
            <Text style={[styles.catText, { color: catFilter === c.key ? C.accent : C.textSecondary }]}>{c.label}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Places List */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: C.textSecondary }]}>No places match your search</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerPad: { paddingHorizontal: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, height: 40, marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  catRow: { paddingHorizontal: 16, gap: 6, paddingBottom: 10 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  catText: { fontSize: 12, fontWeight: '500' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  placeCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8 },
  placeMain: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  placeBody: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  placeEmoji: { fontSize: 16 },
  placeName: { fontSize: 15, fontWeight: '600', flex: 1 },
  lineThrough: { textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6, alignItems: 'center' },
  metaText: { fontSize: 10 },
  placeNotes: { fontSize: 12, marginTop: 6, lineHeight: 17, fontStyle: 'italic' },
  visitedBtn: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyContainer: { paddingTop: 40, alignItems: 'center' },
  emptyText: { fontSize: 14 },
});
