// Centrální konfigurace veřejných adres (landing page + zásady ochrany údajů).
//
// Vlastní doména — hostováno na GitHub Pages (repo balatav/dotacnicek, složka
// /docs) s CNAME záznamem. Stará adresa balatav.github.io/dotacnicek přesměruje.
export const LANDING_BASE = 'https://dotacnicek.cz';

// Odkaz, který se sdílí kamarádům. Landing page z parametru ?g=KÓD
// pozná pozvánku a nabídne "Otevřít v appce" (deep link dotacnicek://join/KÓD).
export function landingJoinUrl(code: string): string {
  return LANDING_BASE + '/?g=' + code;
}

// Veřejně hostované zásady ochrany osobních údajů (potřeba pro obchody).
export const PRIVACY_URL = LANDING_BASE + '/privacy.html';
