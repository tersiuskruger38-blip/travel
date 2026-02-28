import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { Clock, MapPin, Navigation, Star, Check, X } from 'lucide-react-native';
import { useThemeCtx, type Theme } from '../theme';
import { categoryConfig, getMapsUrl, type Place, type Status } from '../data/appData';

export function useTheme(): Theme {
  return useThemeCtx().C;
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { C } = useThemeCtx();
  return (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: C.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.headerSub, { color: C.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

export function LoadingScreen() {
  const { C } = useThemeCtx();
  return (
    <View style={[styles.loadingContainer, { backgroundColor: C.bg }]}>
      <ActivityIndicator size="large" color={C.accent} />
    </View>
  );
}

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function PlaceDetail({ place, C }: { place: Place; C: Theme }) {
  return (
    <View style={[styles.expandedSection, { borderTopColor: C.borderLight }]}>
      <Text style={[styles.expandedDesc, { color: C.textSecondary }]}>{place.description}</Text>
      {place.hours && (
        <View style={styles.infoRow}>
          <Clock size={13} color={C.textSecondary} />
          <Text style={[styles.infoText, { color: C.textSecondary }]}>{place.hours}</Text>
        </View>
      )}
      <View style={styles.infoRow}>
        <MapPin size={13} color={C.textSecondary} />
        <Text style={[styles.infoText, { color: C.textSecondary }]}>{place.address}</Text>
      </View>
      {place.recommendedBy && (
        <View style={styles.infoRow}>
          <Star size={13} color={C.textSecondary} />
          <Text style={[styles.infoText, { color: C.textSecondary }]}>Recommended by {place.recommendedBy}</Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.mapsBtn, { backgroundColor: C.accentLight }]}
        onPress={() => Linking.openURL(getMapsUrl(place))}
      >
        <Navigation size={14} color={C.accent} />
        <Text style={[styles.mapsBtnText, { color: C.accent }]}>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

export function StatusButtons({
  status,
  onDone,
  onSkip,
  C,
}: {
  status: Status;
  onDone: () => void;
  onSkip: () => void;
  C: Theme;
}) {
  return (
    <View style={styles.statusBtns}>
      <TouchableOpacity
        style={[
          styles.statusBtn,
          { borderColor: status === 'done' ? C.green : C.border },
          status === 'done' && { backgroundColor: C.green },
        ]}
        onPress={onDone}
      >
        <Check size={16} color={status === 'done' ? '#fff' : C.textTertiary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.statusBtn,
          { borderColor: status === 'skipped' ? C.red : C.border },
          status === 'skipped' && { backgroundColor: C.red },
        ]}
        onPress={onSkip}
      >
        <X size={16} color={status === 'skipped' ? '#fff' : C.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, marginTop: 2 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '600' },
  expandedSection: { marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  expandedDesc: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 12, lineHeight: 18, flex: 1 },
  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8,
    marginTop: 8, alignSelf: 'flex-start',
  },
  mapsBtnText: { fontSize: 13, fontWeight: '600' },
  statusBtns: { gap: 4 },
  statusBtn: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
});
