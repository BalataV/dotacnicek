# Žádost o produkční přístup — Google Play

Odpovědi podané v Play Console (29. 7. 2026). Uloženo pro případ, že by Google
chtěl doplnění nebo by se žádost opakovala.

---

## 1. O uzavřeném testu

**Jak jste nabírali testery?**
> Primárně přátelé a rodina, pár uživatelů se přidalo přes fóra.

**Jak snadné bylo získat testery?** → Snadné

**Jak testeři s aplikací interagovali?**
> Přibližně 10 z 12 testerů používali aplikaci v plném rozsahu a komunikovali
> to se mnou napřímo. 2 testeři mi napsali osobně připomínku ohledně jazyka.

**Souhrn zpětné vazby**
> Velice pozitivní. V průběhu testování jsem do aplikace doplnil, co uživatelé
> očekávali. Nejčastější témata: detekce češtiny na telefonu, otevírání
> pozvánek přímo v appce a chování odhlašování. Vše vyřešeno.

---

## 2. O aplikaci

**Cílové publikum**
> Česká a slovenská komunita — lidé, kteří sdílejí výdaje ve skupině (přátelé,
> spolubydlící, dovolená, chata). Bez věkového omezení, primárně dospělí.
> Není určena pro firemní ani profesionální účetnictví.

**Jak aplikace poskytuje hodnotu**
> Řeší přehlednost společných útrat. Excel nebo papír jsou pomalé a chybové.
> Aplikace zapíše výdaj za vteřiny (i s fotkou účtenky), rozdělí ho spravedlivě
> (rovným dílem, poměrově, podle přesných cen), zminimalizuje počet převodů a
> sdílí se jedním odkazem.

**Očekávaný počet instalací v prvním roce** → 0–10 000

---

## 3. Připravenost na ostrou verzi

**Jaké změny jste provedli na základě uzavřeného testu?**
> Opravili jsme detekci jazyka telefonu (čeština se chybně zobrazovala
> anglicky), otevírání pozvánek přímo v aplikaci místo přes prohlížeč, výšku
> navigačních lišt na iOS a zamrzávání při odhlašování. Přidali jsme anglickou
> lokalizaci pro zahraniční testery.

**Podle čeho jste usoudili, že je aplikace připravena?**
> Všechny nahlášené chyby jsou opravené a ověřené. Kód prochází TypeScript
> kontrolou a automatizovanými testy (52/52). Aplikace běží stabilně na obou
> platformách, backend je v produkčním provozu bez výpadků.

---

## Texty pro první produkční vydání

**Název vydání** (32/50)
```
1.2 (8) – první produkční vydání
```

**Poznámky k vydání** (411/500)
```
<cs-CZ>
Vítej v Dotačníčku! 🦤

Rozděl společné útraty s partou, spolubydlícími, na chatě i na dovolené.

• Zapiš výdaj za pár vteřin, klidně i s fotkou účtenky
• Děl rovným dílem, poměrově nebo podle přesných cen
• Appka spočítá, kdo komu dluží, a zvládne to na co nejmíň převodů
• Pozvi partu odkazem, vše se synchronizuje v reálném čase
• Světlý i tmavý režim, čeština i angličtina

Sorry jako. My tam ty peníze máme.
</cs-CZ>
```

Tohle jsou poznámky pro **první** produkční vydání, kde je appka pro všechny
nová — proto uvítání a přehled funkcí, ne seznam oprav. U dalších aktualizací
se vrať k běžnému „co je nového".
