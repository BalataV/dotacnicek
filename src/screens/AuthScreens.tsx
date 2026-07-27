// Úvodní obrazovka, registrace e-mailem a přihlášení
import React, { useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as AppleAuth from 'expo-apple-authentication';
import { FONTS } from '../theme';
import { t } from '../i18n';
import { useApp, CLOUD_MODE } from '../store';
import { useColors, Pushable, Label } from '../components/ui';
import Mascot from '../components/Mascot';
import Field from '../components/Field';

function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12.255v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.08 3.56-5.17 3.56-8.82z" fill="#4285F4" />
      <Path d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" fill="#34A853" />
      <Path d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" fill="#FBBC05" />
      <Path d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
    </Svg>
  );
}

export function Onboarding() {
  const c = useColors();
  const { state, actions } = useApp();
  // Přihlášení podle platformy, jak to mají běžné appky:
  //  - iOS (App Store)  → Sign in with Apple (oficiální tlačítko, guideline 4.8)
  //  - Android (Play) a web → Pokračovat s Googlem
  // E-mail + heslo funguje všude jako záloha.
  const showApple = Platform.OS === 'ios' && state.appleAvailable;
  const showGoogle = (!CLOUD_MODE || state.googleEnabled) && Platform.OS !== 'ios';
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 28, paddingVertical: 40 }}>
      <View style={{ position: 'relative', marginBottom: 14 }}>
        <View style={{ position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: c.ink, borderRadius: 18 }} />
        <View style={{ backgroundColor: c.card, borderWidth: 3, borderColor: c.ink, borderRadius: 18, paddingVertical: 10, paddingHorizontal: 20 }}>
          <Text style={{ fontFamily: FONTS.display600, fontSize: 22, color: c.ink }}>{t('Čau lidi!')}</Text>
        </View>
      </View>
      <Pressable onPress={actions.pokeMascot} accessibilityRole="image" accessibilityLabel={t('Maskot Dotačníčku')}>
        <Mascot size={130} float />
      </Pressable>
      <Text style={{ fontFamily: FONTS.display700, fontSize: 38, color: c.onbg, marginTop: 14, marginBottom: 6, letterSpacing: -1 }}>Dotačníček</Text>
      <Text style={{ color: c.onbg, opacity: 0.85, fontFamily: FONTS.body700, fontSize: 14, maxWidth: 240, textAlign: 'center', marginBottom: 28, lineHeight: 20 }}>
        {t('Kdo komu dluží? Spočítám to za vás. Sorry jako.')}
      </Text>

      {/* iOS: oficiální tlačítko Applu (vlastní design Apple v recenzi neuznává) */}
      {showApple && (
        <View style={{ width: '100%', maxWidth: 280, marginBottom: 10, position: 'relative' }}>
          <View style={{ position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: c.ink, borderRadius: 14 }} />
          <AppleAuth.AppleAuthenticationButton
            buttonType={AppleAuth.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuth.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={14}
            style={{ width: '100%', height: 50 }}
            onPress={actions.enterApple}
          />
        </View>
      )}

      {showGoogle && (
        <Pushable onPress={actions.enterGoogle} radius={14} style={{ width: '100%', maxWidth: 280, marginBottom: 10 }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <GoogleIcon />
            <Text style={{ fontFamily: FONTS.display600, fontSize: 16, color: '#15233B' }}>{t('Pokračovat s Googlem')}</Text>
          </View>
        </Pushable>
      )}

      <Pushable onPress={() => actions.navigate('register_email')} radius={14} style={{ width: '100%', maxWidth: 280, marginBottom: 20 }}>
        <View style={{ backgroundColor: c.accent, borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.display600, fontSize: 16, color: '#fff' }}>{t('Registrovat přes e-mail')}</Text>
        </View>
      </Pushable>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', maxWidth: 280, marginBottom: 18 }}>
        <View style={{ flex: 1, height: 2, backgroundColor: c.onbg, opacity: 0.15, borderRadius: 2 }} />
        <Text style={{ fontFamily: FONTS.body800, fontSize: 12, color: c.onbg, opacity: 0.45 }}>{t('nebo')}</Text>
        <View style={{ flex: 1, height: 2, backgroundColor: c.onbg, opacity: 0.15, borderRadius: 2 }} />
      </View>

      <Pushable onPress={() => actions.navigate('login')} offset={0} radius={14} style={{ width: '100%', maxWidth: 280 }}>
        <View style={{ borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.display600, fontSize: 16, color: c.onbg }}>{t('Přihlásit se')}</Text>
        </View>
      </Pushable>

      <Text style={{ color: c.onbg, opacity: 0.5, fontFamily: FONTS.body600, marginTop: 18, maxWidth: 240, textAlign: 'center', lineHeight: 20, fontSize: 12 }}>
        {t('Přihlášením souhlasíte, že to stejně nikdo nečet.')}
      </Text>
    </ScrollView>
  );
}

function BackButton({ onPress, label = t('‹ Zpět') }: { onPress: () => void; label?: string }) {
  const c = useColors();
  return (
    <Text onPress={onPress} accessibilityRole="button" suppressHighlighting style={{ color: c.onbg, fontFamily: FONTS.body800, fontSize: 15, marginBottom: 22 }}>{label}</Text>
  );
}

export function RegisterEmail() {
  const c = useColors();
  const { state, actions } = useApp();
  const passRef = useRef<TextInput>(null);
  const valid = !!(state.regEmail && state.regPassword.length >= 6);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <BackButton onPress={() => actions.navigate('onboarding')} />
      <Text style={{ fontFamily: FONTS.display700, fontSize: 28, color: c.onbg, marginBottom: 4 }}>{t('Vytvořit účet')}</Text>
      <Text style={{ fontFamily: FONTS.body700, fontSize: 14, color: c.onbg, opacity: 0.6, marginBottom: 26 }}>{t('Registrace je zdarma. Sorry jako.')}</Text>
      <Label>{t('E-mail')}</Label>
      <Field value={state.regEmail} onChangeText={(v) => actions.patch({ regEmail: v })} placeholder={t('vas@email.cz')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" maxLength={254} returnKeyType="next" submitBehavior="submit" onSubmitEditing={() => passRef.current?.focus()} style={{ marginBottom: 14 }} />
      <Label>{t('Heslo')}</Label>
      <Field ref={passRef} value={state.regPassword} onChangeText={(v) => actions.patch({ regPassword: v })} placeholder={t('min. 6 znaků')} secureTextEntry autoComplete="new-password" textContentType="newPassword" maxLength={72} returnKeyType="go" onSubmitEditing={actions.doRegister} style={{ marginBottom: 26 }} />
      <Pushable onPress={actions.doRegister} disabled={!valid} radius={14}>
        <View style={{ backgroundColor: c.good, borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.display600, fontSize: 18, color: '#fff' }}>{t('Zaregistrovat se')}</Text>
        </View>
      </Pushable>
      <Text onPress={() => actions.navigate('login')} accessibilityRole="button" suppressHighlighting style={{ textAlign: 'center', fontFamily: FONTS.body700, fontSize: 14, color: c.accent, marginTop: 20 }}>
        {t('Již mám účet → Přihlásit se')}
      </Text>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function Login() {
  const c = useColors();
  const { state, actions } = useApp();
  const passRef = useRef<TextInput>(null);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <BackButton onPress={() => actions.navigate('onboarding')} />
      <Text style={{ fontFamily: FONTS.display700, fontSize: 28, color: c.onbg, marginBottom: 4 }}>{t('Přihlásit se')}</Text>
      <Text style={{ fontFamily: FONTS.body700, fontSize: 14, color: c.onbg, opacity: 0.6, marginBottom: 26 }}>{t('Vítej zpátky, motýle!')}</Text>
      <Label>{t('E-mail')}</Label>
      <Field value={state.loginEmail} onChangeText={(v) => actions.patch({ loginEmail: v })} placeholder={t('vas@email.cz')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" maxLength={254} returnKeyType="next" submitBehavior="submit" onSubmitEditing={() => passRef.current?.focus()} style={{ marginBottom: 14 }} />
      <Label>{t('Heslo')}</Label>
      <Field ref={passRef} value={state.loginPassword} onChangeText={(v) => actions.patch({ loginPassword: v })} placeholder="••••••••" secureTextEntry autoComplete="current-password" textContentType="password" maxLength={72} returnKeyType="go" onSubmitEditing={actions.doLogin} style={{ marginBottom: 10 }} />
      <Text onPress={actions.sendPasswordReset} accessibilityRole="button" suppressHighlighting style={{ textAlign: 'right', fontFamily: FONTS.body700, fontSize: 13, color: c.onbg, opacity: 0.65, marginBottom: 24 }}>
        {t('Zapomenuté heslo? Pošleme ti odkaz')}
      </Text>
      <Pushable onPress={actions.doLogin} radius={14}>
        <View style={{ backgroundColor: c.accent, borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.display600, fontSize: 18, color: '#fff' }}>{t('Vstoupit')}</Text>
        </View>
      </Pushable>
      <Text onPress={() => actions.navigate('register_email')} accessibilityRole="button" suppressHighlighting style={{ textAlign: 'center', fontFamily: FONTS.body700, fontSize: 14, color: c.accent, marginTop: 20 }}>
        {t('Nemám účet → Zaregistrovat se')}
      </Text>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Nastavení nového hesla – sem uživatel přijde z e-mailového odkazu na obnovu
// (web /app/?reset=1; session z odkazu už zpracoval supabase klient).
export function ResetPassword() {
  const c = useColors();
  const { state, actions } = useApp();
  const valid = state.resetPass.length >= 6;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <Text style={{ fontFamily: FONTS.display700, fontSize: 28, color: c.onbg, marginBottom: 4 }}>{t('Nové heslo')}</Text>
      <Text style={{ fontFamily: FONTS.body700, fontSize: 14, color: c.onbg, opacity: 0.6, marginBottom: 26 }}>{t('Zadej nové heslo ke svému účtu. To staré klidně zapomeň.')}</Text>
      <Label>{t('Nové heslo')}</Label>
      <Field value={state.resetPass} onChangeText={(v) => actions.patch({ resetPass: v })} placeholder={t('min. 6 znaků')} secureTextEntry autoComplete="new-password" textContentType="newPassword" maxLength={72} returnKeyType="done" onSubmitEditing={actions.submitNewPassword} style={{ marginBottom: 26 }} />
      <Pushable onPress={actions.submitNewPassword} disabled={!valid} radius={14}>
        <View style={{ backgroundColor: c.good, borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.display600, fontSize: 18, color: '#fff' }}>{t('Uložit nové heslo')}</Text>
        </View>
      </Pushable>
      <Text onPress={() => actions.navigate('overview')} accessibilityRole="button" suppressHighlighting style={{ textAlign: 'center', fontFamily: FONTS.body700, fontSize: 14, color: c.accent, marginTop: 20 }}>
        {t('Teď ne → Přejít do appky')}
      </Text>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Sem uživatel přijde z e-mailového odkazu po kliknutí na „Potvrdit e-mail".
// Token appka ověří a hned se zase odhlásí (viz store.tsx) – ať je jasné,
// že potvrzení proběhlo, místo tichého vhození do appky bez vysvětlení.
export function EmailConfirmed() {
  const c = useColors();
  const { actions } = useApp();
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
      <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: c.good, borderWidth: 3, borderColor: c.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <Text style={{ color: '#fff', fontFamily: FONTS.body900, fontSize: 36 }}>✓</Text>
      </View>
      <Text style={{ fontFamily: FONTS.display700, fontSize: 26, color: c.onbg, marginBottom: 8, textAlign: 'center' }}>{t('E-mail potvrzen!')}</Text>
      <Text style={{ fontFamily: FONTS.body700, fontSize: 14, color: c.onbg, opacity: 0.7, maxWidth: 260, textAlign: 'center', lineHeight: 20, marginBottom: 28 }}>
        {t('Tvůj účet je hotový. Teď se stačí přihlásit e-mailem a heslem, které jsi zadal(a) při registraci.')}
      </Text>
      <Pushable onPress={() => actions.navigate('login')} radius={14} style={{ width: '100%', maxWidth: 280 }}>
        <View style={{ backgroundColor: c.accent, borderWidth: 3, borderColor: c.ink, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.display600, fontSize: 17, color: '#fff' }}>{t('Přihlásit se')}</Text>
        </View>
      </Pushable>
    </ScrollView>
  );
}
