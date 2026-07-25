// Klient pro Supabase (cloudová databáze, přihlášení, úložiště fotek)
//
// Klíče se NEpíšou sem do kódu – vyplň je v `app.json` → "extra":
//   "supabaseUrl": "https://xxxx.supabase.co",
//   "supabaseAnonKey": "eyJ..."
// (anon klíč je veřejný a bezpečný do appky – data chrání pravidla RLS v databázi.)
//
// Dokud klíče nevyplníš, appka běží v LOKÁLNÍM režimu (data jen v telefonu).

import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Typ odkazu, kterým uživatel do webové appky přišel (recovery / invite / …).
// MUSÍ se přečíst hned při načtení modulu – supabase klient hash z adresy
// po zpracování smaže. Supabase navíc z `redirect_to` zahazuje query string,
// takže vlastní parametr (?reset=1) se sem nikdy nedostane a tohle je jediný
// spolehlivý způsob, jak poznat příchod z odkazu na obnovu hesla.
export const initialAuthType: string | null = (() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
    const query = new URLSearchParams(window.location.search || '');
    return hash.get('type') || query.get('type') || (query.get('reset') === '1' ? 'recovery' : null);
  } catch (e) {
    return null;
  }
})();

// Jednorázový token z e-mailového odkazu (`?token_hash=…&type=recovery`).
// Používáme ho místo výchozího Supabase přesměrování: to při PKCE vrací jen
// `?code=`, které jde vyměnit POUZE v prohlížeči, kde žádost vznikla (klikne-li
// uživatel na odkaz jinde, přihlášení selže) – a navíc v něm chybí `type`,
// takže by appka nepoznala, že má nabídnout nastavení nového hesla.
export const initialAuthTokenHash: string | null = (() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search || '').get('token_hash');
  } catch (e) {
    return null;
  }
})();

// Chyba z odkazu (vypršel / už použitý) – Supabase ji vrací v hashi.
export const initialAuthError: string | null = (() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
    return hash.get('error_description') || hash.get('error') || null;
  } catch (e) {
    return null;
  }
})();

const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
const SUPABASE_URL = extra.supabaseUrl || '';
const SUPABASE_ANON_KEY = extra.supabaseAnonKey || '';

export { SUPABASE_URL, SUPABASE_ANON_KEY };
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// V cloudovém režimu je klient k dispozici; v lokálním režimu se API vrstva nevolá.
// Typujeme jako SupabaseClient (ne null), aby API soubory nemusely všude řešit null.
export const supabase = (isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // Na webu necháme klienta zpracovat návrat z OAuthu z URL (?code=…);
        // v nativní appce řešíme redirect ručně přes WebBrowser.
        detectSessionInUrl: Platform.OS === 'web',
        flowType: 'pkce', // bezpečný OAuth flow
      },
    })
  : null) as SupabaseClient;
