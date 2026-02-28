import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform, BackHandler, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Send, Trash2, WifiOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../src/components/Shared';
import { useStorage } from '../src/hooks/useStorage';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

const SYSTEM_PROMPT = `You are NYC Buddy, a friendly and concise AI travel assistant for Ters & Suzanne's first trip to New York City (March 13-18, 2026).

KEY TRIP DETAILS:
- Hotel: Madison LES Hotel, Lower East Side, Manhattan
- Travelers: Ters & Suzanne, couple from Den Bosch, Netherlands. First time in NYC.
- Suzanne arrives EWR Fri Mar 13 at 13:30 (solo afternoon until ~20:30)
- Ters arrives EWR Fri Mar 13 at 19:21 (via Denver connection)
- Return together: Wed Mar 18, UA 994 EWR→BRU departs 19:55. Must leave Manhattan by 16:30.
- March 17 = St. Patrick's Day (parade on 5th Ave 11AM-5PM) AND Taco Tuesday

ITINERARY OVERVIEW:
- Day 0 (Fri 3/13): Arrival. Tompkins Square Bagels, late dinner at Rubirosa (tie dye pizza)
- Day 1 (Sat 3/14): High Line → Chelsea Market → Little Island → Brooklyn Bridge → DUMBO → King Dumplings → Fiaschetteria Pistoia → La Caverna
- Day 2 (Sun 3/15): Central Park → The Met → Grand Central → Summit One Vanderbilt (sunset) → Angelina Bakery → Times Square → Comedy Cellar
- Day 3 (Mon 3/16): Faicco's Italian Specialties → Ground Zero → Wall St → Staten Island Ferry → Chinatown → Roosevelt Island Tramway (sunset) → Mao Mao
- Day 4 (Tue 3/17): St. Patrick's Day! Ess-a-Bagel → Urban Jungle → Parade → McSorley's → Joe's Pizza → Limosneros (Taco Tuesday!) → Elsewhere
- Day 5 (Wed 3/18): Final bagel run → Wo Hop → Pack up → Newark by 16:30

KEY PLACES & TIPS:
- Faicco's (260 Bleecker St): Legendary Italian deli since 1900. CLOSED MONDAYS. Takeout only.
- King Dumplings: $3.50 for 8 dumplings. Cash only.
- Comedy Cellar: Book tickets in advance!
- Summit One Vanderbilt: Go at sunset (~19:05 mid-March)
- McSorley's: NYC's oldest bar (1854). Only light or dark ale, served two at a time.
- Tipping: Restaurants 18-20%, bars $1-2/drink, coffee $1, taxi 15-20%, hotel $3-5/night
- Tax: 8.875% added at register
- Subway: Use OMNY tap-to-pay. $2.90/ride.
- Newark transfer: NJ Transit + PATH ~$15, 60-75 min. Uber $60-90.

Be friendly, concise, and practical. Short responses for mobile reading.`;

export default function ChatScreen() {
  const C = useTheme();
  const router = useRouter();
  const [messages, setMessages] = useStorage<ChatMessage[]>('nyc-chat-history', []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  // Network monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  // Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, [router]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    if (!isOnline) {
      Alert.alert('No Connection', 'You need internet to chat with NYC Buddy. Try again when connected.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: ChatMessage = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages.slice(-20).map(m => ({ role: m.role, content: m.content }));
      const finalMessages = apiMessages.length === 1
        ? [{ role: 'user' as const, content: SYSTEM_PROMPT + '\n\n---\n\nThe user says: ' + apiMessages[0].content }]
        : [
            { role: 'user' as const, content: '[System context] ' + SYSTEM_PROMPT },
            { role: 'assistant' as const, content: 'Got it! I\'m NYC Buddy, ready to help with your trip. What would you like to know?' },
            ...apiMessages,
          ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: finalMessages,
        }),
      });
      const data = await response.json();
      const textBlocks = (data.content || [])
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text);
      const reply = textBlocks.join('\n') || 'Sorry, couldn\'t get a response. Try again!';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([...newMessages, { role: 'assistant', content: 'Couldn\'t connect. Check your internet and try again! 📶' }]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    Alert.alert('Clear Chat', 'Remove all messages?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setMessages([]) },
    ]);
  };

  const chips = ['What\'s nearby?', 'Tonight\'s plan', 'Tipping help', 'Subway tips'];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>🗽 NYC Buddy</Text>
        <View style={styles.headerActions}>
          {!isOnline && (
            <View style={[styles.offlineBadge, { backgroundColor: C.redLight }]}>
              <WifiOff size={12} color={C.red} />
              <Text style={[styles.offlineText, { color: C.red }]}>Offline</Text>
            </View>
          )}
          {messages.length > 0 && (
            <TouchableOpacity onPress={clearChat} style={[styles.clearBtn, { borderColor: C.border }]}>
              <Trash2 size={14} color={C.textTertiary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: C.borderLight }]}>
            <X size={20} color={C.text} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🗽</Text>
              <Text style={[styles.emptyTitle, { color: C.text }]}>NYC Buddy</Text>
              <Text style={[styles.emptyDesc, { color: C.textSecondary }]}>
                Your AI travel assistant. I know your entire itinerary, all saved places, and everything about NYC!
              </Text>
              <View style={styles.chipRow}>
                {chips.map(chip => (
                  <TouchableOpacity
                    key={chip}
                    style={[styles.chip, { borderColor: C.border, backgroundColor: C.bgCard }]}
                    onPress={() => sendMessage(chip)}
                  >
                    <Text style={[styles.chipText, { color: C.accent }]}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.bubble,
                msg.role === 'user'
                  ? [styles.userBubble, { backgroundColor: C.accent }]
                  : [styles.assistantBubble, { backgroundColor: C.bgCard, borderColor: C.border }],
              ]}
            >
              <Text style={[
                styles.bubbleText,
                { color: msg.role === 'user' ? '#fff' : C.text },
              ]}>
                {msg.content}
              </Text>
            </View>
          ))}

          {loading && (
            <View style={[styles.bubble, styles.assistantBubble, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <Text style={[styles.bubbleText, { color: C.textTertiary }]}>Thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputBar, { borderTopColor: C.border, backgroundColor: C.bg }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: C.bgCard, borderColor: C.border, color: C.text }]}
            placeholder={isOnline ? "Ask about NYC..." : "No internet connection"}
            placeholderTextColor={C.textTertiary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            multiline
            maxLength={500}
            editable={isOnline}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: input.trim() && isOnline ? C.accent : C.border }]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading || !isOnline}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  offlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  offlineText: { fontSize: 11, fontWeight: '600' },
  clearBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  messageList: { flex: 1 },
  messageContent: { padding: 16 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20, marginBottom: 24 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1,
  },
  textInput: {
    flex: 1, borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
});
