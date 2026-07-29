// Hlavní obal aplikace: hlavička s maskotem, přepínání obrazovek, spodní navigace
import React, { useEffect } from 'react';
import { View, Text, Pressable, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from './theme';
import { t } from './i18n';
import { useApp } from './store';
import { useColors } from './components/ui';
import Mascot from './components/Mascot';
import { Coins, Toast } from './components/Overlays';
import { isAltQuip } from './quips';

import { Onboarding, RegisterEmail, Login, ResetPassword, EmailConfirmed } from './screens/AuthScreens';
import Overview from './screens/Overview';
import CreateGroup from './screens/CreateGroup';
import ShareGroup from './screens/ShareGroup';
import JoinGroup from './screens/JoinGroup';
import ChooseIdentity from './screens/ChooseIdentity';
import GroupDetail from './screens/GroupDetail';
import AddExpense from './screens/AddExpense';
import ExpenseDetail from './screens/ExpenseDetail';
import Settle from './screens/Settle';
import Profile from './screens/Profile';
import Privacy from './screens/Privacy';
import Audit from './screens/Audit';
import Smlouva from './screens/Smlouva';
import Activity from './screens/Activity';

// Maximální šířka obsahu – na telefonu se neuplatní, na tabletu drží appku
// vycentrovanou a čitelnou místo roztažení přes celou plochu.
const MAX_W = 600;

// Je daná barva tmavá? (kvůli volbě světlého/tmavého status baru)
function isDarkColor(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
}

function SpeechBubble({ text }: { text: string }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, backgroundColor: c.ink, borderRadius: 14 }} />
      <View style={{ backgroundColor: c.card, borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 9, paddingHorizontal: 13 }}>
        <Text style={{ fontFamily: FONTS.body800, fontSize: 14, color: c.ink, lineHeight: 18 }}>{text}</Text>
      </View>
      {/* ocásek bubliny */}
      <View style={{ position: 'absolute', left: -7, bottom: 13, width: 12, height: 12, backgroundColor: c.card, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: c.ink, transform: [{ rotate: '45deg' }] }} />
    </View>
  );
}

function NavItem({ active, color, label, icon, onPress }: { active?: boolean; color: string; label: string; icon: (color: string) => React.ReactNode; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
      style={{ flex: 1, alignItems: 'center', gap: 4 }}
    >
      {icon(color)}
      <Text style={{ fontFamily: FONTS.body800, fontSize: 11, color }}>{label}</Text>
    </Pressable>
  );
}

function GridIcon(color: string) {
  return (
    <View style={{ width: 18, height: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={{ width: 8, height: 8, backgroundColor: color, borderRadius: 2 }} />
      ))}
    </View>
  );
}

function PersonIcon(color: string) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 13, height: 13, borderRadius: 6.5, backgroundColor: color }} />
      <View style={{ width: 20, height: 9, borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: color, marginTop: 2 }} />
    </View>
  );
}

export default function Root() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state, actions } = useApp();
  const sc = state.screen;
  const showChrome = sc !== 'onboarding' && sc !== 'register_email' && sc !== 'login' && sc !== 'email_confirmed';

  // Start appky: dokud nevíme, jestli je uživatel přihlášený, držíme splash.
  // Bez toho by přihlášenému na okamžik probliklo onboarding (přihlásit/registrovat).
  if (state.booting) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', paddingTop: insets.top }}>
        <Mascot size={130} />
        <Text style={{ fontFamily: FONTS.display700, fontSize: 34, color: c.onbg, letterSpacing: -1, marginTop: 14 }}>Dotačníček</Text>
        <ActivityIndicator size="small" color={c.onbg} style={{ marginTop: 18 }} />
        <StatusBar barStyle={isDarkColor(c.bg) ? 'light-content' : 'dark-content'} />
      </View>
    );
  }

  let Screen = null;
  if (sc === 'onboarding') Screen = <Onboarding />;
  else if (sc === 'register_email') Screen = <RegisterEmail />;
  else if (sc === 'login') Screen = <Login />;
  else if (sc === 'reset_password') Screen = <ResetPassword />;
  else if (sc === 'email_confirmed') Screen = <EmailConfirmed />;
  else if (sc === 'overview') Screen = <Overview />;
  else if (sc === 'create_group') Screen = <CreateGroup />;
  else if (sc === 'share_group') Screen = <ShareGroup />;
  else if (sc === 'join') Screen = <JoinGroup />;
  else if (sc === 'choose_identity') Screen = <ChooseIdentity />;
  else if (sc === 'group') Screen = <GroupDetail />;
  else if (sc === 'add') Screen = <AddExpense />;
  else if (sc === 'expense') Screen = <ExpenseDetail />;
  else if (sc === 'settle') Screen = <Settle />;
  else if (sc === 'profile') Screen = <Profile />;
  else if (sc === 'privacy') Screen = <Privacy />;
  else if (sc === 'audit') Screen = <Audit />;
  else if (sc === 'smlouva') Screen = <Smlouva />;
  else if (sc === 'activity') Screen = <Activity />;

  // Spodní lišta: plný `insets.bottom` dělal na iPhonu nápadně vysoký bílý pruh
  // (34 px home indicator + 11 px vlastního odsazení). Na iOS proto z insetu
  // ubereme – 22 px pořád s rezervou přesahuje ~21px home indicator. Na Androidu
  // inset naopak necháme celý (gesture pill potřebuje svých ~24 dp) a zkrátíme
  // jen vlastní odsazení, ať se tlačítka nedostanou pod systémový pruh.
  const navBarBottom = Platform.OS === 'ios'
    ? Math.max(6, insets.bottom - 12)
    : insets.bottom + 6;

  // Edge-to-edge (Android 15+): obsah kreslíme pod systémové lišty, takže si
  // odsazení řešíme sami. Dole ho přidáváme jen na obrazovkách bez spodní lišty
  // (onboarding, přihlášení…) – jinak by se odsazení sečetlo dvakrát, spodní
  // lišta má insets.bottom už ve svém paddingBottom.
  return (
    <View style={{ flex: 1, backgroundColor: showChrome ? c.card : c.bg, paddingTop: insets.top, paddingBottom: showChrome ? 0 : insets.bottom }}>
      {/* Zavírání klávesnice řeší samy ScrollView přes keyboardShouldPersistTaps
          (ťuknutí mimo pole) a keyboardDismissMode="on-drag" (scroll). Žádný
          celoplošný Pressable – ten na Androidu bral doteky a rozbíjel scroll. */}
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        {showChrome && (
          <View style={{ backgroundColor: c.card, borderBottomWidth: 3, borderBottomColor: c.ink, zIndex: 6 }}>
            <View style={{ width: '100%', maxWidth: MAX_W, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 9, paddingBottom: 10 }}>
              <Text style={{ fontFamily: FONTS.display700, fontSize: 23, color: c.ink, letterSpacing: -0.6 }}>Dotačníček</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 8 }}>
                <Pressable onPress={actions.pokeMascot} accessibilityRole="image" accessibilityLabel={t('Maskot Dotačníčku')}>
                  <Mascot size={56} alt={isAltQuip(state.bubble)} mood={state.mascotMood} />
                </Pressable>
                <SpeechBubble key={state.bubbleKey} text={state.bubble} />
              </View>
            </View>
          </View>
        )}

        <View style={{ flex: 1, width: '100%', maxWidth: MAX_W, alignSelf: 'center' }}>{Screen}</View>

        {showChrome && (
          <View style={{ backgroundColor: c.card, borderTopWidth: 3, borderTopColor: c.ink, paddingTop: 7, paddingBottom: navBarBottom }}>
            <View style={{ width: '100%', maxWidth: MAX_W, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 6 }}>
              {/* Rozpočet ze spodní lišty odebrán (2026-07-26) – obrazovka zůstává,
                  vede na ni tlačítko „Rozpočet" v detailu skupiny. */}
              <NavItem label={t('Přehled')} active={sc === 'overview'} color={sc === 'overview' ? c.accent : c.muted} icon={GridIcon} onPress={() => actions.navigate('overview')} />
              <NavItem label={t('Profil')} active={sc === 'profile'} color={sc === 'profile' ? c.accent : c.muted} icon={PersonIcon} onPress={() => actions.navigate('profile')} />
            </View>
          </View>
        )}

        <Coins show={state.coins} />
        <Toast text={state.toast} ink={c.ink} />

        {/* Globální indikátor načítání – blokuje doteky, ať se neklikne dvakrát */}
        {state.busy && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <View style={{ backgroundColor: c.card, borderWidth: 3, borderColor: c.ink, borderRadius: 16, paddingVertical: 22, paddingHorizontal: 26 }}>
              <ActivityIndicator size="large" color={c.accent} />
            </View>
          </View>
        )}
      </View>
      <StatusBar barStyle={isDarkColor(showChrome ? c.card : c.bg) ? 'light-content' : 'dark-content'} />
    </View>
  );
}
