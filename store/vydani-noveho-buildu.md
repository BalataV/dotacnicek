# 🚀 Vydání nového buildu — krok za krokem

Návod pro Vojtu. Claude ho drží aktuální; když se něco změní, upraví tenhle
soubor, ne jen zprávu v chatu.

---

## ⚠️ Než pustíš build: zkontroluj číslo verze

**Apple nepustí druhý build pod verzí, která už je schválená a vydaná.** Skončí
to e-mailem `ITMS-90186 (train is closed)` + `ITMS-90062
(CFBundleShortVersionString must be higher)`. Stalo se 29. 7. 2026 s verzí 1.1.

Postup:
1. App Store Connect → iOS History → jaká verze je **Ready for Distribution**?
2. V `app.json` musí být `"version"` **vyšší** než ta.
3. Stejné číslo pak založ i v App Store Connect (**+ Verze nebo platforma**).

Android je benevolentnější — tam stačí rostoucí `versionCode`, který EAS
inkrementuje sám. Ale **verzi drž na obou platformách stejnou**, viz níže.

### A hned s tím: runtime verze

`runtimeVersion.policy` je `appVersion`, takže **runtime = číslo verze**.
Změnou verze na 1.2 tedy vzniká nová runtime — a buildy se starou runtime už
OTA z této větve nedostanou.

Proto: **když bumpneš verzi, vydej build pro OBĚ platformy.** Jinak zůstane
jedna platforma na staré runtime a přestane dostávat OTA opravy, aniž by to
bylo na první pohled vidět. Přesně tohle způsobilo, že testeři neviděli
angličtinu.

---

## Nejdřív: potřebuju vůbec nový build?

| Co jsem změnil | Stačí OTA | Nutný build |
|---|---|---|
| Texty, obrazovky, logika, opravy chyb, překlady | ✅ | |
| `app.json` (oprávnění, capabilities, intent filtry, plugin) | | ✅ |
| Přidaný nativní balíček (`expo install …`) | | ✅ |
| Změna verze aplikace | | ✅ |

**OTA** = `npx eas-cli update --branch production --message "…"`. Uživatel ji
dostane při druhém spuštění appky, nic nenahrává.

⚠️ OTA se posílá zvlášť pro každou **runtime verzi** (`runtimeVersion.policy =
"appVersion"`, takže runtime = číslo verze). Kdo má v telefonu build s jinou
verzí, aktualizaci nedostane. Tohle už jednou způsobilo, že testeři neviděli
angličtinu — měli build s runtime 1.0.0, zatímco update šel na 1.1.

---

## 1. Android

```bash
npx eas-cli build --platform android --profile production --non-interactive --no-wait
```

Vypíše ID buildu. Stažení hotového artefaktu:

```bash
bash scripts/fetch-builds.sh <android-build-id> <ios-build-id>
```

Výsledek: **`builds/dotacnicek-android.aab`** (složka je v `.gitignore`).

### Nahrání do Play Console
1. Play Console → **Testování a vydání** → *Uzavřené testování – Alpha*
   (nebo Produkce) → **Vytvořit nové vydání**
2. Nahraj `.aab`
3. **Název vydání**: popisný, např. `1.1 (6) – angličtina a přímé pozvánky`.
   Vidíš ho jen ty, uživatelům se nezobrazuje.
4. **Poznámky k vydání**: text ve značkách jazyka, max 500 znaků na jazyk:
   ```
   <cs-CZ>
   …
   </cs-CZ>
   ```
   Jiný jazyk než `cs-CZ` přidávej, až budeš mít pro něj i překlad popisu obchodu.

Nebo jedním příkazem (vyžaduje `google-play-service-account.json`, viz níže):
```bash
npx eas-cli submit --platform android --latest
```

### Cesta do produkce

Nejde jen nahrát AAB do Produkce — Google chce nejdřív **žádost o produkční
přístup** (Play Console → Testování a vydání → Produkce). Vyplňuje se dotazník
o uzavřeném testu, aplikaci a připravenosti; schválení nějakou dobu trvá.
Podané odpovědi jsou v `store/produkcni-pristup.md`.

Až je přístup schválený, jsou dvě možnosti:

1. **Povýšit existující vydání** (Uzavřené testování → Povýšit vydání →
   Produkce). Do produkce jde **přesně ten balíček, který testeři měli
   otestovaný** — nejbezpečnější varianta a normální postup.
2. **Nahrát nový build.** Dává smysl, když od posledního buildu odešly OTA
   opravy: nové instalace je totiž při prvním spuštění ještě nemají (stáhnou
   se až potom). Nový build je má rovnou v sobě.

⚠️ **Procento pro vydávání**: u prvního produkčního vydání začni na 20 %.
Když se objeví pády nebo špatné hodnocení, zastavíš to dřív, než to uvidí
všichni. Postupně navyšuj na 100 %.

---

## 2. iOS

```bash
npx eas-cli build --platform ios --profile production
```

**Bez `--non-interactive`**, pokud se měnily nativní schopnosti (Associated
Domains, Push, …) — EAS se musí přihlásit k Apple účtu, aby capability zapnul
a přegeneroval provisioning profil. Jinak build spadne na
`doesn't support the … capability`.

Odeslání do App Store Connect:
```bash
npx eas-cli submit --platform ios --latest
```
Nahrání trvá klidně **20–40 minut** — většinu času appka čeká ve frontě
(`waiting for an available submitter`). To je normální, nech to běžet.

Potom ještě Apple sám **zpracovává** build (dalších 5–30 min). Než doběhne,
neobjeví se v App Store Connect v nabídce buildů.

### V App Store Connect
1. Moje aplikace → Dotačníček → **+ Verze nebo platforma** (u nové verze)
2. **Build** → vyber zpracovaný build
3. **What's New in This Version** — povinné u každé aktualizace
4. Export compliance: šifrování **ne** (`usesNonExemptEncryption: false` už je
   v `app.json`, takže se většinou ani nezeptá)
5. **Add for Review** → **Submit**

---

## 3. Po vydání

- **App Links ověřuje Android při instalaci.** Kdo má starou verzi, tomu odkaz
  `dotacnicek.cz/join/?g=KÓD` dál otevře prohlížeč. Musí dostat nový build.
- Kontrola propojení domény:
  ```bash
  curl "https://digitalassetlinks.googleapis.com/v1/assetlinks:check?source.web.site=https://dotacnicek.cz&relation=delegate_permission/common.handle_all_urls&target.android_app.package_name=com.balata.dotacnik&target.android_app.certificate.sha256_fingerprint=<OTISK>"
  ```
  Očekávaná odpověď: `"linked": true`.
- Apple: `curl https://app-site-association.cdn-apple.com/a/v1/dotacnicek.cz`
- Obě služby **cachují ~10 min až hodinu** — po změně souboru chvíli vracejí
  staré hodnoty. Není to chyba.

---

## Jednorázová příprava (jen když chceš `eas submit` pro Android)

1. Play Console → Nastavení → **Přístup k API** → Vytvořit nový účet služby
2. V Google Cloud vytvoř service account a u něj **klíč typu JSON**
3. Play Console → tomu účtu dej roli **Správce vydání** (Release Manager)
4. Stažený JSON ulož jako `google-play-service-account.json` v kořeni projektu

Soubor je citlivý (kdo ho má, může vydávat do obchodu) a je v `.gitignore` —
repozitář `BalataV/dotacnicek` je veřejný kvůli GitHub Pages.

Pro iOS je v EAS už uložený App Store Connect API klíč, takže `eas submit`
funguje bez dalšího nastavování.
