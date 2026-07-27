// Překlady aplikace. Klíčem je ČESKÁ věta – v češtině se tedy vrací rovnou
// klíč a chybějící překlad nikdy nerozbije UI (spadne zpátky do češtiny).
//
// Jazyk se nedetekuje přes nativní balíček (ten by vyžadoval nový build),
// ale z Intl/navigatoru – díky tomu jde lokalizace vydat i přes `eas update`.
//
// POZOR: hlášky maskota (quips.ts) mají vlastní anglickou sadu – česká
// politická satira přeložit nejde, tak má EN verze vlastní vtipy.

export type Lang = 'cs' | 'en';

// ---------------------------------------------------------------- detekce
function detectLang(): Lang {
  try {
    // web
    if (typeof navigator !== 'undefined' && (navigator as any).language) {
      return String((navigator as any).language).toLowerCase().startsWith('cs') ? 'cs' : 'en';
    }
    // nativní (Hermes s ICU)
    const loc = Intl.DateTimeFormat().resolvedOptions().locale || '';
    return loc.toLowerCase().startsWith('cs') ? 'cs' : 'en';
  } catch (e) {
    return 'cs';
  }
}

let current: Lang = detectLang();

export function getLang(): Lang { return current; }
export function setLangGlobal(l: Lang) { current = l; }
export function detectedLang(): Lang { return detectLang(); }

// Překlad. `vars` nahradí {placeholdery}: t('Zaplatit {kdo}', { kdo: 'Ota' }).
export function t(cs: string, vars?: Record<string, string | number>): string {
  let out = current === 'cs' ? cs : (EN[cs] ?? cs);
  if (vars) {
    Object.keys(vars).forEach((k) => {
      out = out.split('{' + k + '}').join(String(vars[k]));
    });
  }
  return out;
}

// ---------------------------------------------------------------- slovník
const EN: Record<string, string> = {
  // —— obecné / navigace ——
  'Já': 'Me',
  '‹ Zpět': '‹ Back',
  '‹ Skupiny': '‹ Groups',
  '‹ Skupina': '‹ Group',
  '‹ Rozpočet': '‹ Balance',
  'Přehled': 'Overview',
  'Rozpočet': 'Balance',
  'Profil': 'Profile',
  'Zrušit': 'Cancel',
  'Uložit': 'Save',
  'Hotovo': 'Done',
  'Vyrovnáno': 'Settled',
  'Dlužíš': 'You owe',
  'Dostaneš': 'You get',
  'Dlužíš ': 'You owe ',
  'Dostaneš ': 'You get ',
  'Skupiny': 'Groups',

  // —— onboarding / přihlášení ——
  'Čau lidi!': 'Hey folks!',
  'Kdo komu dluží? Spočítám to za vás. Sorry jako.': 'Who owes whom? I\'ll do the math. Sorry not sorry.',
  'Pokračovat s Googlem': 'Continue with Google',
  'Registrovat přes e-mail': 'Sign up with email',
  'nebo': 'or',
  'Přihlásit se': 'Log in',
  'Přihlášením souhlasíte, že to stejně nikdo nečet.': 'By signing in you agree that nobody read this anyway.',
  'Vytvořit účet': 'Create account',
  'Registrace je zdarma. Sorry jako.': 'Signing up is free. Sorry not sorry.',
  'E-mail': 'Email',
  'Heslo': 'Password',
  'min. 6 znaků': 'min. 6 characters',
  'vas@email.cz': 'you@email.com',
  'Zaregistrovat se': 'Sign up',
  'Již mám účet → Přihlásit se': 'I have an account → Log in',
  'Vítej zpátky, motýle!': 'Welcome back, champ!',
  'Zapomenuté heslo? Pošleme ti odkaz': 'Forgot your password? We\'ll send a link',
  'Vstoupit': 'Enter',
  'Nemám účet → Zaregistrovat se': 'No account → Sign up',
  'Nové heslo': 'New password',
  'Zadej nové heslo ke svému účtu. To staré klidně zapomeň.': 'Set a new password for your account. Feel free to forget the old one.',
  'Uložit nové heslo': 'Save new password',
  'Teď ne → Přejít do appky': 'Not now → Go to the app',
  'E-mail potvrzen!': 'Email confirmed!',
  'Tvůj účet je hotový. Teď se stačí přihlásit e-mailem a heslem, které jsi zadal(a) při registraci.':
    'Your account is ready. Just log in with the email and password you used to sign up.',
  'Maskot Dotačníčku': 'Dotacnicek mascot',

  // —— přehled ——
  'Tvoje skupiny': 'Your groups',
  'Připojit': 'Join',
  '+ Nová': '+ New',
  'Zatím nejsi součástí koncernu': 'You\'re not part of the conglomerate yet',

  // —— skupina ——
  'Kdo komu dluží': 'Who owes whom',
  '📸 Sdílet': '📸 Share',
  '📤 Pozvat': '📤 Invite',
  'Výdaje': 'Expenses',
  'Zatím žádný výdaj – přidej první níže.': 'No expenses yet – add the first one below.',
  '🔍 Hledat výdaj…': '🔍 Search expenses…',
  'Nic nenalezeno. Zkus to jinak.': 'Nothing found. Try something else.',
  'Vyrovnáno – nikdo nikomu nedluží.': 'All settled – nobody owes anything.',
  '+ Výdaj': '+ Expense',
  '📋 Audit NKÚ': '📋 Audit report',
  '🕓 Historie': '🕓 History',
  'Smazat skupinu': 'Delete group',
  'Smazat skupinu?': 'Delete group?',
  'Smazat': 'Delete',
  'Připojený člen': 'Member has joined',
  '⏳ čeká': '⏳ pending',
  'Sdílet přehled dluhů jako obrázek': 'Share the debt summary as an image',
  'Sdílení se nepovedlo': 'Sharing failed',
  '🦤 Dotačníček — kdo komu dluží, spočítám to za vás': '🦤 Dotacnicek — who owes whom, I\'ll do the math',
  ' · nerovně': ' · uneven',

  // —— nová skupina ——
  'Nová skupina': 'New group',
  'Název skupiny': 'Group name',
  'Chata, výlet, pivo…': 'Cabin, trip, beers…',
  'Členové skupiny': 'Group members',
  'Jméno člena…': 'Member name…',
  'Přidat člena': 'Add member',
  'Vytvořit skupinu →': 'Create group →',
  'Odebrat člena ': 'Remove member ',

  // —— sdílení / připojení ——
  'Skupina vytvořena!': 'Group created!',
  'Sdílej odkaz — kamarádi se přidají jedním klepnutím': 'Share the link — friends join with one tap',
  'Odkaz ke sdílení': 'Share link',
  'Sdílet pozvánku': 'Share invite',
  'Kopírovat odkaz': 'Copy link',
  'Odkaz zkopírován!': 'Link copied!',
  'Připojit se do skupiny': 'Join a group',
  'Zadej kód z pozvánky, kterou ti poslal kamarád.': 'Enter the invite code a friend sent you.',
  'Kód pozvánky': 'Invite code',
  'např. 8KRGF1': 'e.g. 8KRGF1',
  'Připojit se': 'Join',
  'Kdo jsi?': 'Who are you?',
  'Vyber svoje jméno': 'Pick your name',
  'To jsem já ›': 'That\'s me ›',
  'Už obsazeno': 'Already taken',
  'Nejsi na seznamu?': 'Not on the list?',
  'Napiš svoje jméno': 'Type your name',
  'Připojit s novým jménem': 'Join with a new name',
  'Připojit jako ': 'Join as ',
  'Tohle jméno už ve skupině je – vyber ho nahoře.': 'That name is already in the group – pick it above.',
  'Pozvánka vypršela – zkus odkaz znovu.': 'The invite expired – try the link again.',

  // —— výdaj ——
  'Nový výdaj': 'New expense',
  'Upravit výdaj': 'Edit expense',
  '✏️ Upravit výdaj': '✏️ Edit expense',
  'Za co?': 'What for?',
  'Buřty, benzín, pivo…': 'Snacks, gas, beers…',
  'Kategorie': 'Category',
  'Kolik?': 'How much?',
  'Kdo platil?': 'Who paid?',
  'Jak rozdělit?': 'How to split?',
  'Rovným dílem': 'Equally',
  'Poměrově': 'By shares',
  'Podle cen': 'Exact amounts',
  'Rozdělit mezi': 'Split between',
  'Vyber, koho se to týká.': 'Pick who it applies to.',
  'Kolik dílů kdo platí': 'How many shares each pays',
  'Zadej, kolik dílů kdo platí (např. 2 a 1).': 'Enter how many shares each pays (e.g. 2 and 1).',
  'Útrata jednotlivců': 'Individual amounts',
  'Účtenka (foto)': 'Receipt (photo)',
  'Přidat výdaj': 'Add expense',
  'Uložit změny': 'Save changes',
  'Smazat výdaj': 'Delete expense',
  'Výdaj nenalezen.': 'Expense not found.',
  'Platil ': 'Paid by ',
  'Rozděleno mezi': 'Split between',
  'Každý dá ': 'Everyone pays ',
  'Zbývá rozpočítat ': 'Left to split ',
  'Přebývá ': 'Over by ',
  '✓ Sedí přesně': '✓ Exact match',
  ' dílů': ' shares',
  'díl': 'share',
  'poměrově': 'by shares',
  'Foťák': 'Camera',
  'Galerie': 'Gallery',
  'Povol prosím přístup k fotoaparátu.': 'Please allow camera access.',
  'Povol prosím přístup k fotkám.': 'Please allow photo access.',
  'Vyfotit': 'Take photo',
  'Vybrat': 'Choose',
  'Odebrat': 'Remove',
  '/os': '/person',

  // —— kategorie ——
  'Jídlo a pití': 'Food & drinks',
  'Nákupy': 'Shopping',
  'Doprava': 'Transport',
  'Bydlení': 'Housing',
  'Zábava': 'Fun',
  'Ubytování': 'Accommodation',
  'Ostatní': 'Other',

  // —— rozpočet / vyrovnání ——
  'Hotovo! Jsi vyrovnaný.': 'Done! You\'re all settled.',
  'Dlužíš celkem ': 'You owe in total ',
  'Rozpočet je skvělý, my tam ty peníze máme.': 'The budget is great, the money is there. Trust me.',
  'Zaplatit ': 'Pay ',
  'Zacvakat': 'Settle up',
  '📜 Vystavit smlouvu': '📜 Issue a contract',

  // —— smlouva ——
  '📜 Dotační smlouva': '📜 Subsidy contract',
  'DOTAČNÍ SMLOUVA': 'SUBSIDY CONTRACT',
  'NEVRATNÁ': 'NON-REFUNDABLE',
  'Poskytovatel': 'Provider',
  'Dlužník': 'Debtor',
  'Výše nevratné dotace': 'Non-refundable subsidy amount',
  'Předmět': 'Subject',
  'Splatnost': 'Due date',
  'Sankce': 'Penalties',
  'Závěrečné ustanovení': 'Final provisions',
  'Neprodleně. Žádné výmluvy se nepřijímají. Makáme.': 'Immediately. No excuses accepted. We\'re working hard.',
  'Při nesplnění bude příjemce úředně veden jako Černý pasažér a vystaven posměchu skupiny.':
    'On default, the recipient shall be officially listed as a Freeloader and mocked by the group.',
  'Smluvní strany prohlašují, že smlouvu nečetly, ale souhlasí. Sorry jako.':
    'The parties declare they did not read this contract but agree anyway. Sorry not sorry.',
  '📤 Poslat smlouvu dlužníkovi': '📤 Send the contract to the debtor',
  'Žádný dluh k vystavení smlouvy.': 'No debt to issue a contract for.',
  'já, níže podepsaný': 'I, the undersigned',
  'skupina': 'group',
  'Čl. ': 'Art. ',

  // —— audit ——
  'NEJVYŠŠÍ KONTROLNÍ ÚŘAD': 'SUPREME AUDIT OFFICE',
  'PROVĚŘENO': 'AUDITED',
  'Kontrolovaný subjekt': 'Audited entity',
  'Kontrolní závěr č. j. NKÚ/': 'Audit report no. SAO/',
  'Žádné prostředky k prověření. Kontrola pozastavena. Makáme.':
    'No funds to audit. Inspection suspended. We\'re working hard.',
  'Celkový objem prostředků': 'Total funds',
  'Počet proplacených transakcí': 'Number of transactions',
  'Průměr na hlavu': 'Average per head',
  'Největší jednorázová položka': 'Largest single item',
  '📊 Struktura výdajů': '📊 Expense breakdown',
  '🏆 Žebříček sponzorů': '🏆 Sponsor leaderboard',
  'Sponzor večera': 'Sponsor of the night',
  'Dotační náměstek': 'Deputy for subsidies',
  'Pokladník': 'Treasurer',
  'Řadový občan': 'Ordinary citizen',
  'Černý pasažér': 'Freeloader',
  ' · spotřeboval ': ' · spent ',
  'Kontrolu provedl revizní orgán. Pochybení nebylo shledáno.': 'Audit performed by the review body. No wrongdoing found.',
  'My tam ty peníze máme. Sorry jako.': 'The money is there. Sorry not sorry.',

  // —— historie ——
  'Zatím se nic nestalo': 'Nothing has happened yet',
  'Přidej výdaj a začne se psát historie.': 'Add an expense and history starts writing itself.',
  ' vyrovnal': ' settled a debt with ',
  ' přidal výdaj „': ' added an expense "',
  'právě teď': 'just now',
  'před ': '',
  ' min': ' min ago',
  ' h': ' h ago',
  ' d': ' d ago',

  // —— profil ——
  'Tvoje jméno': 'Your name',
  '✏️ Upravit': '✏️ Edit',
  'Vzhled': 'Appearance',
  'Žlutá': 'Yellow',
  'Modrá': 'Blue',
  'Tmavá': 'Dark',
  'Velikost obsahu': 'Content size',
  'Malý': 'Small',
  'Střední': 'Medium',
  'Velký': 'Large',
  'Jazyk': 'Language',
  'Čeština': 'Czech',
  'Angličtina': 'English',
  'Chceš dostávat novinky z MF DNES': 'Get the latest news from the tabloids',
  'Odhlásit se': 'Log out',
  'Smazat účet': 'Delete account',
  'Smazat účet a všechna data': 'Delete account and all data',
  'Smazat účet?': 'Delete account?',
  'Trvale se smažou tvoje skupiny, výdaje i přihlašovací údaje. Tuto akci nelze vrátit.':
    'Your groups, expenses and login details will be permanently deleted. This cannot be undone.',
  'Zásady ochrany osobních údajů': 'Privacy policy',

  // —— chyby / hlášky ——
  'Sorry jako, něco se pokazilo.': 'Sorry, something went wrong.',
  'Appka narazila na neočekávanou chybu. Zkus to znovu – data jsou v bezpečí v cloudu.':
    'The app hit an unexpected error. Try again – your data is safe in the cloud.',
  'Zkusit znovu': 'Try again',
  'Vítej, motýle!': 'Welcome aboard!',
  'Vítej zpátky!': 'Welcome back!',
  'Přihlášení úspěšné': 'Signed in',
  'Špatný e-mail nebo heslo': 'Wrong email or password',
  'Nejdřív potvrď e-mail – mrkni do schránky 📨': 'Confirm your email first – check your inbox 📨',
  'Zkontroluj e-mail pro potvrzení': 'Check your email to confirm',
  'Účet už existuje': 'Account already exists',
  'Registrace selhala': 'Sign up failed',
  'Přihlášení Googlem selhalo': 'Google sign-in failed',
  'Přihlášení přes Apple selhalo': 'Apple sign-in failed',
  'Odkaz na obnovu hesla je na cestě 📨': 'Password reset link is on its way 📨',
  'E-mail se nepodařilo odeslat, zkus to za chvíli': 'Couldn\'t send the email, try again in a moment',
  'Nejdřív nahoře vyplň svůj e-mail': 'Fill in your email above first',
  'V lokálním režimu se heslo nepoužívá': 'Passwords aren\'t used in local mode',
  'Heslo musí mít aspoň 6 znaků': 'Password must be at least 6 characters',
  'Nové heslo nastaveno ✅': 'New password set ✅',
  'Nové heslo musí být jiné než to staré': 'The new password must differ from the old one',
  'Nastavení hesla selhalo, zkus to znovu': 'Setting the password failed, try again',
  'Odkaz na obnovu hesla už neplatí – požádej o nový': 'The password reset link is no longer valid – request a new one',
  'Odkaz na obnovu hesla vypršel – požádej o nový': 'The password reset link expired – request a new one',
  'Odkaz na potvrzení e-mailu už neplatí': 'The email confirmation link is no longer valid',
  'Odkaz z e-mailu už neplatí – požádej o nový': 'The link from the email is no longer valid – request a new one',
  'Účet smazán': 'Account deleted',
  'Smazání účtu selhalo': 'Deleting the account failed',
  'Skupina smazána': 'Group deleted',
  'Smazání skupiny selhalo': 'Deleting the group failed',
  'Skupinu se nepodařilo vytvořit': 'Couldn\'t create the group',
  'Výdaj přidán': 'Expense added',
  'Výdaj upraven': 'Expense updated',
  'Výdaj smazán': 'Expense deleted',
  'Výdaj se nepodařilo uložit': 'Couldn\'t save the expense',
  'Smazání selhalo': 'Deleting failed',
  'Sorry jako, zapsáno!': 'Sorry not sorry, recorded!',
  'Přidáno. Jsme premianti.': 'Added. We\'re the best in class.',
  'Já jsem to nečet, ale zapsal jsem to.': 'I didn\'t read it, but I wrote it down.',
  'Upraveno. Chyba lávky.': 'Updated. My bad.',
  'Hotovo, přepsáno.': 'Done, rewritten.',
  'Bude líp, o korunu míň.': 'It\'ll get better, one coin at a time.',
  'Vyrovnání dluhu': 'Debt settled',
  'Připojeno do skupiny!': 'Joined the group!',
  'Připojení selhalo': 'Joining failed',
  'Skupina s tímto kódem nenalezena': 'No group found with that code',
  'Přihlas se a hned tě připojím': 'Log in and I\'ll add you right away',
  'Sdílení funguje jen s přihlášením': 'Sharing works only when logged in',
  'To jméno už někdo zabral': 'That name is already taken',
  'Tohle jméno už někdo zabral': 'That name is already taken',
  'Jméno změněno na ': 'Name changed to ',
  'Jméno se nastaví až po přihlášení': 'The name will be set after you log in',
  'Nový výdaj v ': 'New expense in ',
  'skupině': 'group',
  '✅ Všichni jsou už součástí populistického hnutí.': '✅ Everyone has already joined the movement.',

  // —— věty s doplňovanými hodnotami ——
  ' přidal': ' added',
  ' přidal „': ' added "',
  ' výdaj „': ' the expense "',
  'Přidej se do skupiny „{n}" v appce Dotačníček! 🦤': 'Join the group "{n}" in the Dotacnicek app! 🦤',
  'Připojuješ se do „{g}". Klepni na svoje jméno v seznamu.': 'You\'re joining "{g}". Tap your name in the list.',
  'Skupina „{n}" i všechny její výdaje zmizí všem členům. Tuto akci nelze vrátit.':
    'The group "{n}" and all its expenses will disappear for every member. This cannot be undone.',
  'Rozepsáno {a} z {b}': '{a} of {b} assigned',
  'Příjemce ({a}) se zavazuje uhradit poskytovateli ({b}) výše uvedenou částku za útraty ve skupině {g}.':
    'The recipient ({a}) undertakes to pay the provider ({b}) the amount stated above for expenses in the group {g}.',
  '⏳ = zatím není v appce. Pošli pozvánku tlačítkem 📤 Pozvat': '⏳ = not in the app yet. Send an invite with the 📤 Invite button',
  ' (kód {k})': ' (code {k})',
  ', dluhy se jim počítají i tak.': ' – their debts are counted anyway.',
  'Celkem ': 'Total ',
  'Kód': 'Code',
  'Odkaz': 'Link',
  'Přidej se do mojí skupiny v appce Dotačníček! 🦤': 'Join my group in the Dotacnicek app! 🦤',

  // —— zásady ochrany osobních údajů ——
  'Poslední aktualizace: 22. 6. 2026': 'Last updated: 22 June 2026',
  'Správce údajů: Vojtěch Balata, kontakt:': 'Data controller: Vojtěch Balata, contact:',
  '1. Jaké údaje zpracováváme': '1. What data we process',
  '• Registrační údaje: e-mailová adresa, případně jméno a profilová fotka z Google účtu (pokud se přihlásíš přes Google).':
    '• Sign-up data: email address, optionally name and profile picture from your Google account (if you sign in with Google).',
  '• Obsah, který zadáš: názvy skupin, jména členů, výdaje, částky, platby a fotky účtenek.':
    '• Content you enter: group names, member names, expenses, amounts, payments and receipt photos.',
  '• Technické údaje: identifikátor účtu, čas přihlášení.': '• Technical data: account identifier, sign-in time.',
  '2. Proč to zpracováváme': '2. Why we process it',
  '• Poskytování služby (vedení skupin a výpočet dluhů) – plnění smlouvy (čl. 6 odst. 1 písm. b GDPR).':
    '• Providing the service (managing groups and calculating debts) – performance of a contract (Art. 6(1)(b) GDPR).',
  '• Přihlášení a zabezpečení – oprávněný zájem (čl. 6 odst. 1 písm. f).':
    '• Sign-in and security – legitimate interest (Art. 6(1)(f) GDPR).',
  '• Údaje neprodáváme a nepoužíváme k reklamě.': '• We do not sell your data and do not use it for advertising.',
  '3. Komu se údaje předávají': '3. Who we share data with',
  '• Supabase (databáze, přihlášení, úložiště fotek) – server v EU (Frankfurt).':
    '• Supabase (database, authentication, photo storage) – servers in the EU (Frankfurt).',
  '• Google (pokud zvolíš přihlášení přes Google) – ověření identity.':
    '• Google (if you choose to sign in with Google) – identity verification.',
  'Tito poskytovatelé zpracovávají data naším jménem na základě smlouvy o zpracování (DPA).':
    'These providers process data on our behalf under a data processing agreement (DPA).',
  '4. Jak dlouho data uchováváme': '4. How long we keep data',
  'Po dobu, kdy máš účet. Po smazání účtu se data odstraní (viz bod 6).':
    'For as long as you have an account. After you delete your account, the data is removed (see section 6).',
  '5. Sdílení ve skupině': '5. Sharing within a group',
  'Údaje o výdajích a fotky účtenek, které vložíš do skupiny, vidí ostatní členové dané skupiny. To je podstata fungování aplikace.':
    'Expense data and receipt photos you add to a group are visible to the other members of that group. That is how the app works.',
  '6. Tvoje práva (GDPR)': '6. Your rights (GDPR)',
  'Máš právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost a vznést námitku.':
    'You have the right to access, rectification, erasure, restriction of processing, portability and to object.',
  '• Smazání účtu a všech dat: přímo v aplikaci → Profil → „Smazat účet a všechna data".':
    '• Deleting your account and all data: directly in the app → Profile → "Delete account and all data".',
  '• Případně nás kontaktuj na {e}. Můžeš podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).':
    '• Or contact us at {e}. You may lodge a complaint with the Czech Data Protection Authority (uoou.gov.cz).',
  '7. Děti': '7. Children',
  'Aplikace není určena dětem mladším 15 let.': 'The app is not intended for children under 15.',
  '8. Změny': '8. Changes',
  'Tyto zásady můžeme aktualizovat; o podstatných změnách budeme informovat v aplikaci.':
    'We may update this policy; we will announce significant changes in the app.',
  '9. Kontakt': '9. Contact',
};
