import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronDown, ChevronRight, Sun, Moon, Smartphone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Header } from '../../src/components/Shared';
import { useThemeCtx, type ThemeMode } from '../../src/theme';
import { guideSections } from '../../src/data/appData';

export default function GuideScreen() {
  const { C, mode, setMode } = useThemeCtx();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return guideSections;
    const q = search.toLowerCase();
    return guideSections.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.content.some((item) =>
        item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)
      )
    );
  }, [search]);

  const autoExpand = search.length > 0;

  const themeModes: { key: ThemeMode; label: string; icon: typeof Sun }[] = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'Auto', icon: Smartphone },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Header title="NYC Guide" subtitle="Everything you need to know" />

        {/* Theme Toggle */}
        <View style={[styles.themeRow, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <Text style={[styles.themeLabel, { color: C.textSecondary }]}>Theme</Text>
          <View style={styles.themeButtons}>
            {themeModes.map((tm) => {
              const Icon = tm.icon;
              const active = mode === tm.key;
              return (
                <TouchableOpacity
                  key={tm.key}
                  style={[
                    styles.themeBtn,
                    { borderColor: active ? C.accent : C.border, backgroundColor: active ? C.accentLight : 'transparent' },
                  ]}
                  onPress={() => { Haptics.selectionAsync(); setMode(tm.key); }}
                >
                  <Icon size={14} color={active ? C.accent : C.textTertiary} />
                  <Text style={[styles.themeBtnText, { color: active ? C.accent : C.textTertiary }]}>{tm.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <Search size={16} color={C.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: C.text }]}
            placeholder="Search guide..."
            placeholderTextColor={C.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Sections */}
        {filtered.map((section) => {
          const isOpen = autoExpand || expanded === section.id;
          return (
            <TouchableOpacity
              key={section.id}
              style={[styles.sectionCard, { backgroundColor: C.bgCard, borderColor: C.border }]}
              onPress={() => setExpanded(isOpen && !autoExpand ? null : section.id)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>{section.icon}</Text>
                <Text style={[styles.sectionTitle, { color: C.text }]}>{section.title}</Text>
                {isOpen ? (
                  <ChevronDown size={18} color={C.textTertiary} />
                ) : (
                  <ChevronRight size={18} color={C.textTertiary} />
                )}
              </View>
              {isOpen && (
                <View style={[styles.sectionBody, { borderTopColor: C.borderLight }]}>
                  {section.content.map((item, i) => (
                    <View key={i} style={styles.guideItem}>
                      <Text style={[styles.guideItemTitle, { color: C.text }]}>{item.title}</Text>
                      <Text style={[styles.guideItemText, { color: C.textSecondary }]}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: C.textSecondary }]}>No sections match "{search}"</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12,
  },
  themeLabel: { fontSize: 13, fontWeight: '500' },
  themeButtons: { flexDirection: 'row', gap: 6 },
  themeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1,
  },
  themeBtnText: { fontSize: 12, fontWeight: '500' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, height: 40, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  sectionCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '600', flex: 1 },
  sectionBody: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, gap: 14 },
  guideItem: {},
  guideItemTitle: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  guideItemText: { fontSize: 13, lineHeight: 20 },
  emptyContainer: { paddingTop: 40, alignItems: 'center' },
  emptyText: { fontSize: 14 },
});
