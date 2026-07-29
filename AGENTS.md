# Dotačníček – kontext aplikace

Splitwise-style appka na dělení útrat ve skupinách, s vtipným maskotem (parodie politika-podnikatele).
Dříve „Babišovník", přejmenováno na „Dotačník" kvůli právnímu riziku (viz níže) a pak
na **„Dotačníček"** (2026-07, doména dotacnik.cz byla zabraná).

## Stack & spuštění
- **Expo SDK 54** (React Native 0.81, React 19.1), **TypeScript** (strict). NE SDK 56 – Expo Go ho neumí.
- Typová kontrola: `npx tsc --noEmit` (musí projít čistě). Doménové typy v `src/types.ts` (AppState, Actions, Expense, Group, Payment, Transfer, …). `useApp()` vrací typovaný `{state, actions}`, takže obrazovky jsou kontrolované.
- Při psaní kódu vycházej z docs pro SDK 54: https://docs.expo.dev/versions/v54.0.0/
- Spuštění na telefonu: `npm start` → QR v Expo Go. Web náhled: `npm run web` (port 8088) — **jen lokální nástroj pro vývoj, ověřování a screenshoty, NIKDY se nenasazuje** (viz „Webová verze zrušena").
- Display font **Baloo 2** (NE Fredoka – ta nemá české Č/ř/ě/ů), body font **Nunito**.

## Struktura
- `App.js` – načte fonty, obalí `AppProvider` + `Root`.
- `src/Root.js` – hlavička s maskotem + bublinou, přepínání obrazovek (state machine přes `state.screen`), spodní navigace, overlay (mince, toast).
- `src/store.js` – globální stav (React Context). Dva režimy: **CLOUD_MODE** (Supabase) vs lokální (AsyncStorage). Async akce mají cloud větev i lokální fallback. `stateRef` pro async čtení.
- `src/logic.js` – výpočet bilancí (`netFor`), optimalizace vyrovnání (`transfersFor`, hladový algoritmus), `bubbleFor` (náhodná hláška).
- `src/quips.js` – pool ~50 hlášek maskota (jména zkomolená: Bareš, Pimpula, Agrofarm).
- `src/data.js` – prázdná výchozí data + barvy členů.
- `src/theme.js` – barvy (témata zluta/modra) + názvy fontů.
- `src/components/ui.js` – `Pushable` (tlačítko s tvrdým stínem), `Avatar`, `Label`, `useColors`. **Gotcha:** `Pushable offset={0}` nekreslí stín (jinak prosvítá pod průhledným tlačítkem).
- `src/components/Mascot.js` – maskot (karikatura), `Overlays.js` (mince/toast), `Field.js` (input).
- `src/screens/` – AuthScreens (Onboarding/Login/Register), Overview, CreateGroup, ShareGroup, GroupDetail, AddExpense, ExpenseDetail, Settle, Profile, Privacy (in-app zásady).
- Spodní lišta: **Přehled · Profil** (2 záložky, bez plovoucího +). Záložka „Rozpočet" ODEBRÁNA 2026-07-26 (uživateli přišla zbytečná) — obrazovka Settle zůstává, jde na ni tlačítko „Rozpočet" v GroupDetail a „zpět" z ní vede na skupinu (dřív na Přehled). Settle = souhrn dluhů napříč skupinami (dřív „Deficit"). Výdaj se přidává tlačítkem v GroupDetail.
- Systémové „zpět" (hw tlačítko i gesto) řeší `actions.goBack` přes `BackHandler` ve `store.js` (mapa screen→rodič; na overview/onboarding vrací false = zavře appku).
- `src/supabase.js` – klient (klíče z `app.json` → extra). `src/api/{auth,groups,expenses,storage}.js` – datová vrstva.

## Datový model (Supabase)
- `profiles`, `groups`, `group_members`, `expenses`, `payments` (vyrovnání).
- **Členové přes ID:** výdaje/platby odkazují na člena přes `group_members.id` (`expenses.payer_id`, `part_ids[]`; `payments.from_id`, `to_id`). Sloupce se jmény (`payer`, `parts[]`, `from_name`, `to_name`) zůstávají jen jako záloha. Klient čte podle ID a překládá na AKTUÁLNÍ jméno (`src/members.ts`: `dispMember`/`idForMember`), takže **přejmenování nepřepisuje historii** – `set_my_name` jen změní `group_members.name`. Migrace: `supabase/migration_member_ids.sql`. V rámci skupiny zůstává jméno unikátní (in-memory logika je jménem-orientovaná).
- Schéma: `supabase/schema.sql`. GDPR mazání účtu: `supabase/migration_gdpr.sql` (RPC `delete_my_account`).
- **Identita:** v DB se ukládají reálná jména; v appce se člen s `user_id == moje uid` mapuje na „Já" (denorm/norm ve store). Logika v `logic.js` je „Já"-based.
- Platby snižují dluh ve `netFor` → zaplacený dluh zmizí (Splitwise styl). Foto účtenky: bucket `receipts` (public).
- RLS: přístup jen členům skupiny (funkce `is_group_member`). Připojení přes kód: RPC `join_group_by_code`.

## Klíčové konvence
- Neo-brutalistické UI: silné okraje 3px (`c.ink`), tvrdý posunutý stín, kulaté rohy, font Baloo 2.
- **Klávesnice:** globální `Pressable onPress={Keyboard.dismiss}` v Root (ťuknutí kamkoli mimo pole zavře klávesnici; potomci mají přednost). Každý ScrollView s textovým inputem musí mít `keyboardShouldPersistTaps="handled"` (jinak první ťuk na tlačítko jen zavře klávesnici).
- Texty/komentáře česky. Uživatel je začátečník – vysvětlovat jednoduše, návody krok za krokem.
- Úvodní bublina „Čau lidi!" se NEMĚNÍ. Jinde se hláška losuje podle bilance uživatele (dlužím / mám dostat / vyrovnaný) – sady `QUIPS_OWE/OWED/EVEN` v `quips.ts`, výběr v `bubbleFor`. Klik na spodní navigaci na obrazovku, kde už jsem, hlášku NEMĚNÍ (`navigate` vrací `s` při stejné obrazovce).
- Maskot má dvě karikatury: výchozí (premiér) a `alt` (ministryně financí – blond mikádo, brýle, perly; jméno se v kódu nepoužívá). Hlášky s `alt:true` v `quips.ts` ji zobrazí; `isAltQuip(text)` + `<Mascot alt>` v hlavičce.

## Stav (k 2026-06)
- Hotovo a ověřeno proti živé DB: registrace/login e-mailem, auto-login, skupiny, výdaje, výpočty, platby, mazání účtu, náhodné hlášky, prázdný start.
- Backend Supabase projekt `fbhwsrclexkhpbfiwprw`, klíče v `app.json`.
- **Google OAuth:** kód hotový, ale v Expo Go nespolehlivý (deep-link redirect → padá na localhost). Funguje až v sestavené appce se scheme `dotacnicek`. Supabase Redirect URLs: `dotacnicek://**`, `exp://**`.
- **GDPR:** `PRIVACY.md` (šablona) + hostovaná verze `docs/privacy.html`. V Profilu odkaz (`PRIVACY_URL` z `src/config.js`) + „Smazat účet". Kontaktní e-mail: `podpora@dotacnicek.cz` (schránka u Zoneru).
- **Confirm email ZAPNUTO** (2026-07-15, Supabase). Registrace bez session → toast „Zkontroluj e-mail"; login s nepotvrzeným e-mailem má vlastní hlášku. **Obnova hesla i potvrzení e-mailu** řeší statická stránka `docs/app/index.html` na `https://dotacnicek.cz/app/` (= Supabase `site_url`), ne appka — viz „Webová verze ZRUŠENA". SMTP (Zoner) + CZ šablony e-mailů: `store/supabase-emaily.md`.
- **Landing page:** `docs/` (GitHub Pages) – `index.html` (úvod + pozvánka přes `?g=KÓD` → deep link `dotacnicek://join/KÓD`), `privacy.html`. URL je v `src/config.js` (`LANDING_BASE`). Sdílecí odkaz z appky míří sem. Návod k nasazení + EAS buildu: `NASAZENI.md`.
- **Build:** `eas.json` hotový (profil `preview` = Android APK, `production` = app-bundle). `app.json`: `android.package` = **`com.balata.dotacnik`** (NEMĚNIT — zamčené existující appkou v Play Console, u které je nahraný AAB; package je pro uživatele neviditelný), `ios.bundleIdentifier` = `com.balata.dotacnicek` (POZOR: NENÍ shodný s android package). `eas build:configure` doplní `projectId`.

## Právní (důležité)
- Appka paroduje žijící veřejnou osobu (maskot + hlášky). Přejmenování na „Dotačníček" sneslo příjmení z názvu, ale maskot + poznatelné hlášky stále nesou riziko (ochrana osobnosti §81+ obč. zák., stažení z obchodů za impersonaci). Před veřejným vydáním nechat schválit advokátem.

## Stav vydání (2026-07-26)
- **App Store: SCHVÁLENO A VENKU.** iOS 1.0, Apple ID **6794624597**, bundle `com.balata.dotacnicek`, zdarma, min. iOS 15.1. Odkaz bez země (Apple přesměruje sám): `https://apps.apple.com/app/id6794624597`. Pozor: krátce po vydání je appka jen v části obchodů (US ano, CZ ještě ne) — propagace napříč storefronty trvá až ~24 h. TestFlight NENÍ pro veřejné vydání potřeba (na rozdíl od povinného uzavřeného testování u Googlu).
- **Google Play: zatím NEVYDÁNO** — odkaz `com.balata.dotacnik` vrací 404. Odznak na webu už na něj míří, začne fungovat po schválení.

## Zbývá
Dokončit vydání na Google Play. Analýza: `ANALYZA.md`.
**Před cloud testem spusť v Supabase SQL editoru postupně: `migration_names.sql`, `migration_split_currency.sql`, `migration_realtime.sql`, `migration_member_ids.sql`, `migration_categories.sql`, `migration_push.sql`.**

## Rozšíření (2026-06, „velký balík")
- **Responzivní layout:** obsah + chrome v Root omezeny `MAX_W=600` (tablet vycentrovaný).
- **Velikost obsahu:** `src/textScale.ts` napíchne Text/TextInput a násobí fontSize podle `state.contentSize` (small/medium/large); strop pro systémové velké písmo. Volba v Profilu.
- **Tmavý režim:** téma `tmava` v `theme.ts` (tmavé pozadí/karty, světlé okraje=ink). Karty/text napříč appkou používají `c.card`/`c.ink`, takže se obrátí samy. Status bar přes `isDarkColor` v Root.
- **Kategorie:** `src/categories.ts` (číselník), `expenses.category` (migrace `migration_categories.sql`). Výběr v AddExpense, ikona v seznamu/detailu, rozpad v Auditu.
- **Statistiky / Audit NKÚ / žebříček:** `src/stats.ts` + obrazovka `Audit.tsx` (screen `audit`). Parodický kontrolní závěr, struktura výdajů, žebříček „Sponzor večera".
- **Historie aktivit:** `src/activity.ts` (odvozeno z času výdajů+plateb, BEZ DB) + `Activity.tsx` (screen `activity`).
- **Dotační smlouva:** `Smlouva.tsx` (screen `smlouva`), parodická listina dluhu + sdílení textu. Otevírá se z Deficitu (`openContract`).
- **Reakce maskota:** `Mascot.tsx` má `mood` (neutral/happy/sad); `state.mascotMood` + `flashMood` ve store (happy při platbě, sad při novém dluhu).
- **Živý kurz měn:** `src/fx.ts` (open.er-api.com, cache 12 h), `state.fxRates`, orientační „≈ Kč" v Přehledu a Auditu.
- **Push notifikace:** `src/notifications.ts` (registrace + odeslání přes Expo push API, peer-to-peer), `api/push.ts` + `migration_push.sql` (tabulka `push_tokens` + RPC `group_push_tokens`). Posílá se při novém výdaji a platbě. Plugin `expo-notifications` v `app.json`.
- **Sdílecí kartička:** `react-native-view-shot` + `expo-sharing` v GroupDetail (`captureRef` na kartu „kdo komu dluží" → sdílení obrázku).
- **Error boundary:** `components/ErrorBoundary.tsx` (obal v App.tsx) – pád ukáže maskota + „Zkusit znovu" místo bílé obrazovky. Sem případně napojit Sentry.
- **Easter egg:** 5 rychlých ťuknutí na maskota (hlavička i onboarding) → `pokeMascot` (store) → hláška z `QUIPS_EGG` + mince + happy mood.
- **A11y:** textové odkazy (zpět, smazat, smlouva…) mají `accessibilityRole="button"` + `suppressHighlighting`; Toggle je `switch` s `accessibilityState`; maskot je `image` s popiskem. Pozor: RN `Text` NEpodporuje `hitSlop` (jen Pressable).
- **Store materiály:** složka `store/` (listing CS/EN, data-safety, release notes, feature graphic SVG, ikona `app-icon.svg` + `icon-prompt.md`, návod na publikaci `publishing-guide.md`).

## Přejmenování + druhá vlna (2026-07)
- **Název:** „Dotačníček" (dřív Čapí Dluh/Babišovník/Dotačník). Scheme `dotacnicek`, Android package `com.balata.dotacnik` (zamčený, viz Build výš), iOS bundle `com.balata.dotacnicek`. Web: vlastní doména **dotacnicek.cz** (GitHub Pages + CNAME, e-mail u Zoneru — MX záznamy v DNS nechat). POZOR: slug `BabisovnikApp` a AsyncStorage klíče `@babisovnik/*` zůstávají (EAS projectId / lokální nastavení uživatelů).
- **Biometrický zámek: ODSTRANĚN (2026-07-15).** Uživateli vadilo odemykání při každém přepnutí aplikací. Vyhozen kód (bioLock/locked/LockScreen), plugin z app.json i balíček `expo-local-authentication`. NEVRACET bez výslovného přání.
- **Splash screen:** `expo-splash-screen` plugin s maskotem (`assets/splash-icon.png` = kopie android-icon-foreground) na žluté `#FFD60A`; dřív tam byl výchozí Expo zástupný obrázek. Nativní změna = nový build.
- **Android 15/16 compliance (2026-07-16, na doporučení Play Console):** `orientation: "default"` (Android 16 ignoruje zámek orientace na velkých displejích; layout je responzivní MAX_W=600, landscape OK) + `android.edgeToEdgeEnabled: true` explicitně (bottom nav i header už insets řeší). Nativní změny = nový build.
- **OTA vydávat AUTOMATICKY (přání uživatele, 2026-07-17):** po každé čistě JS/asset změně spustit `eas update --branch production --message "…" --non-interactive` (bez ptaní). Nativní změny (app.json plugins, nové balíčky) = klasický build, OTA nestačí. Runtime `1.0.0` musí sedět s produkčním buildem.
- **Klávesnice & scroll:** zavírání klávesnice řeší SAMY ScrollView (`keyboardShouldPersistTaps="handled"` + `keyboardDismissMode="on-drag"`). NEPŘIDÁVAT celoplošný `Pressable`/`TouchableWithoutFeedback` s `Keyboard.dismiss` v Root — bral doteky na Androidu a scroll fungoval jen při prvním dotyku na tlačítko (opraveno 2026-07-17).
- **Lokalizace cs/en (2026-07-20):** `src/i18n.ts` – **klíčem je česká věta**, `t('Nová skupina')`; v češtině se vrací klíč, chybějící překlad tiše spadne do češtiny. Jazyk se detekuje z `navigator.language`/`Intl` (ŽÁDNÝ nativní balíček → lokalizaci lze vydat i přes OTA), přepíná se v Profilu (`state.lang`, akce `setLang`, persistováno v AsyncStorage). `t()` je modulová funkce (ne hook) – překreslení zajišťuje `state.lang`. **Pozor na stínění:** parametry callbacků se nesmí jmenovat `t` (proto `onChangeText={(v) => …}`, `transfers.map((tr) => …)`). Jména členů se překládají taky (`t(name)`) – vnitřní marker „Já" → „Me", ostatní jména projdou beze změny. Kontrola chybějících překladů: `scratchpad/check_missing.py`.
- **Hlášky:** JEDEN společný pool `QUIPS` v `quips.ts` (+ `QUIPS_EN`/`QUIPS_EGG_EN` – česká politická satira se nepřekládá, EN má vlastní vtipy; `bubbleFor` vybírá pool podle `getLang()`) (2026-07-15, dřív sady podle bilance OWE/OWED/EVEN — zrušeno na přání uživatele). `bubbleFor` losuje ze všech; `alt:true` = druhá karikatura; `QUIPS_EGG` easter egg zůstává.
- **Vyhledávání ve výdajích:** GroupDetail, pole od 4+ výdajů, bez diakritiky (`foldText`), hledá popis/plátce/kategorii.
- **Oprava textScale:** škálování upravuje VSTUPNÍ props (style pole), ne výsledek renderu – jedině tak funguje na nativní platformě i webu. Ověřeno: 38→45px (large), 38→34px (small).
- **Hardening:** maxLength na všech vstupech, autoComplete/textContentType u e-mailu a hesel.
- **Webová verze ZRUŠENA (2026-07-29):** Dotačníček je výhradně mobilní appka (kvůli budoucí monetizaci přes obchody a proto, že mobilní appky web alternativu běžně nemají). Expo web build se **už nenasazuje** — `docs/app/` je teď jednoúčelová statická stránka (`docs/app/index.html`), která obsluhuje **pouze** e-mailové odkazy z Supabase. NEVRACET bez výslovného přání uživatele; `npx expo export --platform web --output-dir docs/app` už nikdy nespouštět (přepsalo by tu stránku).
  - Adresa `/app/` zůstává, protože je to `site_url` v Supabase a šablony posílají `{{ .SiteURL }}?token_hash=…&type=signup|recovery`. Díky tomu nebylo potřeba měnit nic v Supabase ani v e-mailech.
  - Stránka umí jen `type=signup` (ověří token → „E-mail je potvrzený") a `type=recovery` (formulář nové heslo → `PUT /auth/v1/user` → logout). Cokoli jiného → redirect na `https://dotacnicek.cz`.
  - Bez knihoven a CDN — Supabase Auth REST přímo přes `fetch`. Session se nikam neukládá, token žije jen v proměnné. Texty cs/en podle `navigator.language`.
  - `experiments.baseUrl = "/app"` v app.json zůstává schválně: je inertní (platí jen pro web export) a sahat na `app.json` by zbytečně měnilo runtime fingerprint pro EAS Update.
- **E-mailové odkazy (recovery/signup) přes `token_hash`, NE `ConfirmationURL` (2026-07-20).** Supabase ze `redirect_to` zahazuje query string a výchozí PKCE odkaz vrací jen `?code=` bez `type` – appka pak nepoznala kontext a tiše přihlásila uživatele. Šablony e-mailů (Supabase Auth → Templates) proto obsahují `{{ .SiteURL }}?token_hash={{ .TokenHash }}&type=recovery` resp. `&type=signup`. `src/supabase.ts` čte `initialAuthType/TokenHash/Error` HNED při načtení modulu (klient hash z adresy po zpracování smaže). Obnova hesla: `verifyRecoveryToken` → obrazovka `reset_password`. Potvrzení e-mailu: `verifyEmailConfirmation` → appka se HNED odhlásí (`signOut`) a ukáže `email_confirmed` (bez chrome) s tlačítkem na Login – uživatel se má vědomě přihlásit, ne být tiše vhozený do appky. Ověřeno end-to-end přes Supabase Management API (generate_link) proti živému projektu.
- **App Store (iOS nativně):** návod `store/app-store-guide.md`, screenshoty `store/screenshots-ios/` (1290×2796). V app.json: `supportsTablet:false`, `usesNonExemptEncryption:false`. **Přihlášení podle platformy (2026-07-17):** iOS = **Sign in with Apple** (`expo-apple-authentication`, oficiální `AppleAuthenticationButton` — vlastní design Apple v recenzi neuznává; nativní flow `signInWithIdToken`, jméno z Apple přijde JEN poprvé → hned se ukládá do `user_metadata.full_name`), Android + web = Google. E-mail všude. V app.json `ios.usesAppleSignIn: true` + plugin; **Supabase Apple provider zapnutý, client ID = bundle `com.balata.dotacnicek`** (nativní flow secret nepotřebuje). Store screenshoty (Android i iOS) se generují ze `shots.html` (scratchpad, headless Chrome; parametry `?s=1..5&w=&h=`).

## Výkon / UX / testy (2026-06)
- **Jest** (`jest-expo`, `babel.config.js`): `npm test`. Testy `__tests__/logic.test.js` + `money.test.js`. `babel-preset-expo` PŘIPNUTÝ na ~54 (vyšší verze rozbije build SDK 54!).
- **Realtime:** subscription na `expenses`/`payments` ve `store.js` (debounce 350 ms → reloadGroup/refreshAll). Vyžaduje `migration_realtime.sql`.
- **N+1 pryč:** `fetchExpensesForGroups`/`fetchPaymentsForGroups` (1 dotaz/tabulka). `refreshAll(force)` má throttle 4 s (Přehled). Pull-to-refresh volá `force`.
- **Offline cache:** per-uid v AsyncStorage (`@babisovnik/cache-<uid>`), hydratuje se při startu (instant data), maže se při odhlášení.
- **Haptika:** `src/haptics.js` (`tapSuccess` u uložení výdaje/platby). **Bezpečné okraje:** `react-native-safe-area-context` (App.js provider, Root `useSafeAreaInsets`). **expo-image** pro účtenky (cache). **KeyboardAvoidingView** v AddExpense/Auth/CreateGroup. **a11y** role/label na `Pushable` + spodní navigaci. Odebrán přepínač zvuku.

## Měny a dělení (2026-06)
- `src/money.js` – `CURRENCIES` (CZK/EUR/USD), `fmtMoney(amt,cur)`, `fmtMoneyMap(map)` (mezera jako oddělovač tisíců, bez Intl).
- Výdaj má `currency`, `shares` (částka na osobu, paralelně k `parts`; null = rovným dílem) a `splitType` (`equal|ratio|exact`).
- `logic.js`: bilance **po měnách** – `netFor(...,currency)`, `transfersFor` vrací převody s `currency`, `shareOf(e,name)`, `myNet`, `currenciesIn`. `totalOwe/totalOwed` vrací mapu `{CUR:částka}` (+ `hasAny`).
- AddExpense: výběr měny + režimu dělení; „podle cen" hlídá zbytek do součtu, „poměrově" počítá z vah. Schema: `migration_split_currency.sql`.

## Hotovo nově (2026-06)
Úprava výdaje (`startEdit` → AddExpense edit režim, `expensesApi.updateExpense`). Smazání skupiny (`deleteGroup` = archivace přes `archiveGroup`, tlačítko v GroupDetail s potvrzením). In-app zásady (Privacy screen místo prohlížeče). Back gesto (`goBack`/BackHandler). Landing page + EAS APK build (z mobilu ověřeno). Odebrán mikrofon permission (`microphonePermission:false` u image-pickeru).
**Jména členů:** Profil → „Tvoje jméno" (`setMyName` → RPC `set_my_name` přepíše i historii výdajů/plateb + auth metadata `full_name`). Připojení do skupiny přes výběr identity: `joinByCode` → RPC `group_preview` → obrazovka `ChooseIdentity` (vyber svoje jméno / přidej nové) → `finishJoin` → RPC `join_group_choose`. Vše ve `supabase/migration_names.sql`.
