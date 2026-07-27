// Zásady ochrany osobních údajů – zobrazené přímo v aplikaci (ne v prohlížeči).
// Pozor: stejný text je i v docs/privacy.html (pro obchody). Když měníš, uprav obojí.
import React from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { FONTS } from '../theme';
import { t } from '../i18n';
import { useApp } from '../store';
import { useColors } from '../components/ui';

const EMAIL = 'podpora@dotacnicek.cz';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={{ fontFamily: FONTS.display600, fontSize: 17, color: c.ink, marginBottom: 6 }}>{title}</Text>
      {children}
    </View>
  );
}

function P({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text style={{ fontFamily: FONTS.body700, fontSize: 14, color: c.ink, lineHeight: 21, marginBottom: 6 }}>{children}</Text>;
}

export default function Privacy() {
  const c = useColors();
  const { actions } = useApp();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text onPress={() => actions.navigate('profile')} accessibilityRole="button" suppressHighlighting style={{ color: c.onbg, fontFamily: FONTS.body800, fontSize: 15, marginBottom: 12 }}>{t('‹ Zpět')}</Text>

      <View style={{ position: 'relative' }}>
        <View style={{ position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: c.ink, borderRadius: 18 }} />
        <View style={{ backgroundColor: c.card, borderWidth: 3, borderColor: c.ink, borderRadius: 18, padding: 18 }}>
          <Text style={{ fontFamily: FONTS.display700, fontSize: 22, color: c.ink, letterSpacing: -0.4, lineHeight: 26 }}>{t('Zásady ochrany osobních údajů')}</Text>
          <Text style={{ fontFamily: FONTS.body700, fontSize: 13, color: c.muted, marginTop: 6 }}>{t('Poslední aktualizace: 22. 6. 2026')}</Text>
          <Text style={{ fontFamily: FONTS.body700, fontSize: 13, color: c.muted, marginTop: 2 }}>
            {t('Správce údajů: Vojtěch Balata, kontakt:')}{' '}
            <Text onPress={() => Linking.openURL('mailto:' + EMAIL).catch(() => {})} style={{ color: c.accent, textDecorationLine: 'underline' }}>{EMAIL}</Text>
          </Text>

          <Section title={t('1. Jaké údaje zpracováváme')}>
            <P>{t('• Registrační údaje: e-mailová adresa, případně jméno a profilová fotka z Google účtu (pokud se přihlásíš přes Google).')}</P>
            <P>{t('• Obsah, který zadáš: názvy skupin, jména členů, výdaje, částky, platby a fotky účtenek.')}</P>
            <P>{t('• Technické údaje: identifikátor účtu, čas přihlášení.')}</P>
          </Section>

          <Section title={t('2. Proč to zpracováváme')}>
            <P>{t('• Poskytování služby (vedení skupin a výpočet dluhů) – plnění smlouvy (čl. 6 odst. 1 písm. b GDPR).')}</P>
            <P>{t('• Přihlášení a zabezpečení – oprávněný zájem (čl. 6 odst. 1 písm. f).')}</P>
            <P>{t('• Údaje neprodáváme a nepoužíváme k reklamě.')}</P>
          </Section>

          <Section title={t('3. Komu se údaje předávají')}>
            <P>{t('• Supabase (databáze, přihlášení, úložiště fotek) – server v EU (Frankfurt).')}</P>
            <P>{t('• Google (pokud zvolíš přihlášení přes Google) – ověření identity.')}</P>
            <P>{t('Tito poskytovatelé zpracovávají data naším jménem na základě smlouvy o zpracování (DPA).')}</P>
          </Section>

          <Section title={t('4. Jak dlouho data uchováváme')}>
            <P>{t('Po dobu, kdy máš účet. Po smazání účtu se data odstraní (viz bod 6).')}</P>
          </Section>

          <Section title={t('5. Sdílení ve skupině')}>
            <P>{t('Údaje o výdajích a fotky účtenek, které vložíš do skupiny, vidí ostatní členové dané skupiny. To je podstata fungování aplikace.')}</P>
          </Section>

          <Section title={t('6. Tvoje práva (GDPR)')}>
            <P>{t('Máš právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost a vznést námitku.')}</P>
            <P>{t('• Smazání účtu a všech dat: přímo v aplikaci → Profil → „Smazat účet a všechna data".')}</P>
            <P>{t('• Případně nás kontaktuj na {e}. Můžeš podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).', { e: EMAIL })}</P>
          </Section>

          <Section title={t('7. Děti')}>
            <P>{t('Aplikace není určena dětem mladším 15 let.')}</P>
          </Section>

          <Section title={t('8. Změny')}>
            <P>{t('Tyto zásady můžeme aktualizovat; o podstatných změnách budeme informovat v aplikaci.')}</P>
          </Section>

          <Section title={t('9. Kontakt')}>
            <P>Vojtěch Balata, {EMAIL}.</P>
          </Section>
        </View>
      </View>
    </ScrollView>
  );
}
