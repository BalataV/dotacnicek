// Centrální konfigurace veřejných adres (landing page + zásady ochrany údajů).
//
// Vlastní doména — hostováno na GitHub Pages (repo balatav/dotacnicek, složka
// /docs) s CNAME záznamem. Stará adresa balatav.github.io/dotacnicek přesměruje.
export const LANDING_BASE = 'https://dotacnicek.cz';

// Odkaz, který se sdílí kamarádům.
//
// POZOR na tvar adresy: musí být na VLASTNÍ cestě `/join/`, ne na kořeni.
// Android App Links umí filtrovat jen podle cesty, ne podle query — kdyby
// pozvánka byla `/?g=KÓD`, musel by filtr chytat celou doménu a appka by
// spolkla i `/app/?token_hash=…`, tedy odkazy na potvrzení e-mailu a obnovu
// hesla. Ty musí zůstat v prohlížeči. Díky `/join/` si každý bere svoje.
//
// Kdo appku nainstalovanou má, tomu se odkaz otevře rovnou v ní (App Links /
// Universal Links). Kdo ne, uvidí `docs/join/index.html` → landing s pozvánkou.
export function landingJoinUrl(code: string): string {
  return LANDING_BASE + '/join/?g=' + code;
}

// Veřejně hostované zásady ochrany osobních údajů (potřeba pro obchody).
export const PRIVACY_URL = LANDING_BASE + '/privacy.html';
