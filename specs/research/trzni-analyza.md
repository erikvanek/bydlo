# Tržní analýza — Bydlo

> Cíl: podložit (nebo vyvrátit) základní otázku — je tohle business, který nás uživí, nebo zajímavý side projekt?

---

## 1. Nabídková strana (Supply) — architekti a interiéroví designéři

### Co víme

| Kategorie | Odhad | Zdroj |
|-----------|-------|-------|
| Členové ČKA (Česká komora architektů) | ~4 000 | cka.cz |
| Z toho aktivně praktikující | ~2 500 | odhad, ~60 % aktivita |
| Interiéroví designéři (bez licence ČKA) | ~3 000–5 000 | odhad, neregulovaná profese |
| Z toho freelanceři / OSVČ | ~40–50 % | odhad |
| Geografická koncentrace (Praha + Brno) | >60 % | odhad |

**Klíčový poznatek:** Interiérový design není regulovaná profese — může ho vykonávat kdokoli. ČKA sdružuje pouze architekty s akademickým titulem. To je pro nás důležité: máme volnost sami definovat, koho považujeme za „kvalitního dodavatele".

### Co ještě zjistit (úkoly)

- [ ] Přesné číslo aktivních OSVČ architektů z dat ČSÚ nebo ČKA
- [ ] Kolik z nich aktuálně dělá residential projekty (vs. komerční)?
- [ ] Průměrný výdělek architekta/designéra z residential konzultací za rok
- [ ] Jak velká část z nich by uvítala nový přísun klientů vs. je přetíženích?

---

## 2. Poptávková strana (Demand) — potenciální klienti

### Objem transakcí v ČR (roční)

| Typ události | Odhadovaný počet/rok | Poznámka |
|---|---|---|
| Prodeje rezidenčních nemovitostí | 70 000–90 000 | ČSÚ, katastr, pre-2022 peak byl vyšší |
| Z toho byty | ~50 000–60 000 | — |
| Nové nájemní smlouvy (přestěhování) | 200 000–300 000 | hrubý odhad, data obtížná |
| Rekonstrukce s investicí >200K Kč | 80 000–120 000 | odhad dle průzkumů stavebního trhu |

**Relevantní podmnožina pro Bydlo:**

Naším zákazníkem není každý, kdo si bere byt. Cílíme na lidi, kteří:
- řeší netriviální rozhodnutí o dispozici, stylu nebo funkčnosti
- mají zájem o kvalitu, ne jen nejnižší cenu
- jsou v klíčovém životním přechodu (nastěhování s partnerem, první vlastní byt, rekonstrukce)

Konzervativní odhad cílové skupiny: **10–15 % transakcí** = 7 000–13 000 koupí + přiměřená část přestěhování a rekonstrukcí.

### Odhad TAM (Total Addressable Market) v ČR

Výpočet vychází z pricing modelu — mid tier (spokojení zákazníci):

**Koupě:**
- Průměrná cena bytu ČR: ~4 500 000 Kč (Praha výrazně výše, ~7 000 000 Kč)
- Mid tier fee: 0,5 % z ceny = ~22 500 Kč na transakci (ČR průměr)
- Cílová skupina (konzervativní): 7 000 transakcí/rok
- **TAM koupě: ~160 M Kč/rok**

**Pronájem:**
- Průměrný měsíční nájem ČR: ~15 000 Kč → roční: 180 000 Kč
- Mid tier fee: 1 % z ročního nájmu = ~1 800 Kč na transakci
- Nízká hodnota na transakci → pronájem je spíše akvizičním kanálem než hlavním zdrojem příjmů

**TAM (konzervativní, pouze koupě):** ~100–200 M Kč/rok v ČR

### SAM (Serviceable Addressable Market)

Ne každý v cílové skupině bude hledat pomoc přes platformu — část najde architekta přes osobní doporučení, přes firmu atd.

Realistická SAM: **20–30 % TAM = 20–60 M Kč/rok v ČR**

### SOM (Serviceable Obtainable Market) — co reálně zasáhneme

| Scénář | Klienti/rok | Průměrná transakce | Příjem/rok |
|--------|-------------|-------------------|------------|
| Rok 1 (spuštění, Praha) | 50–100 | 20 000 Kč | 1–2 M Kč |
| Rok 2 (Praha + Brno) | 200–400 | 22 000 Kč | 4–9 M Kč |
| Rok 3 (celá ČR) | 500–1 000 | 23 000 Kč | 11–23 M Kč |

**Závěr pro ČR:** Lifestyle business pro malý tým je dosažitelný od roku 2–3. Samostatný „velký business" z ČR sám nestačí.

### Střední Evropa — škálování

| Trh | Populace | Multiplikátor vs. ČR | Odhadovaný TAM |
|-----|----------|----------------------|----------------|
| Česká republika | 10,8 M | 1× | 100–200 M Kč |
| Slovensko | 5,5 M | 0,5× | 50–100 M Kč |
| Polsko | 38 M | 3–4× | 300–800 M Kč |
| Maďarsko | 10 M | 0,8× | 80–160 M Kč |
| Rakousko | 9 M | 1–1,5× (vyšší ceny) | 150–300 M Kč |
| **CE celkem** | **~73 M** | **~7–8×** | **700 M – 1,5 B Kč** |

Středoevropský trh = potenciálně VC-relevantní velikost, pokud se podaří model přenést.

---

## 3. PESTEL analýza

### Politické faktory (P)
- **+ pozitivní:** ČR podporuje vlastnické bydlení (hypoteční odpočty, NE regulace pronájmů jako v DE/NL)
- **- negativní:** Regulace architektů přes ČKA — nesmíme tvrdit, že nabízíme „architektonické poradenství" bez licence
- **Sledovat:** Novela stavebního zákona 2024 — zjednodušuje stavební řízení, může zvýšit poptávku po rychlých konzultacích
- **Riziko:** Nová pravidla pro online platformy (EU Digital Services Act) — zatím nás přímo nezasahují

### Ekonomické faktory (E)
- **+ pozitivní:** Česká střední třída roste; kulturní posun k kvalitě bydlení po COVIDu
- **- negativní:** Vysoké úrokové sazby 2022–2024 zpomalily trh s nemovitostmi; poptávka se teprve zotavuje
- **Klíčová čísla:**
  - Průměrná mzda ČR (2024): ~45 000 Kč/měs hrubého
  - Průměrná cena bytu v Praze: 120 000–180 000 Kč/m²
  - Hypoteční sazby 2024: klesají z peak ~7 % zpět k 4–5 %
- **Implikace pro Bydlo:** Oživení hypotečního trhu = lepší timing pro launch

### Sociální faktory (S)
- **+ pozitivní:**
  - Mileniálové (primární cílová skupina) odkládají bydlení, pak investují víc do kvality
  - Po Instagramu/Pinterestu: vizuální gramotnost roste, lidé vědí, co chtějí
  - Trend „zážitek > majetek" se překlápí do „bydlím lépe, i když menší"
  - Stěhování párů je emocionálně nabitá situace — ochota platit za expertní asistenci
- **- negativní:**
  - Česká kultura: „na to nepotřebuji odborníka" (DIY mentalita)
  - Architekti stále vnímáni jako „pro velké projekty" nebo „pro bohaté"
- **Hypotéza H2 z výzkumného plánu se přímo váže na toto:** bariéra přístupu je mentální, ne vždy finanční

### Technologické faktory (T)
- **+ pozitivní:**
  - AI matching je smysluplný diferenciátor; technologie pro to existuje
  - Videokonsultace normalizovány po COVIDu — architekti jsou zvyklí poradit na dálku
  - Rostoucí adopce AR/3D vizualizací — příležitost pro cross-sell
- **- negativní:**
  - AI hype může snížit vnímanou hodnotu (lidé si myslí, že AI jim poradí sama)
  - Velké platformy (Google, Meta) mohou snadno vstoupit do kategorie „najdi odborníka"
- **Sledovat:** Generative AI pro interiérový design (Midjourney, Adobe Firefly) — mění li to, co klienti od architekta čekají?

### Ekologické faktory (E)
- **+ příležitost:** Udržitelné materiály, nízkoenergetické rekonstrukce = rostoucí poptávka; architekti se specializací na sustainability jsou vzácnější
- **Minimální přímý dopad** na business model v krátkodobém horizontu

### Právní faktory (L)
- **Klíčové:**
  - Vyhradit označení „architekt" je zákonem chráněno — musíme být přesní v komunikaci (interior designer vs. architekt)
  - GDPR: zpracování osobních dat klientů i architektů; nutno ošetřit při ostrém spuštění
  - Spotřebitelská ochrana: outcome-based pricing = nestandardní; je třeba jasná smluvní dokumentace
  - Smlouva o zprostředkování: právně čistit kontrakt s klientem i architektem
- **Úkol:** konzultovat s právníkem modelovou smlouvu (outcome-based fee + debrief podmínka)

---

## 4. SWOT analýza

### Silné stránky (S)
| # | Strength |
|---|----------|
| 1 | **Outcome-based pricing** — unikátní v českém trhu; snižuje bariéru vstupu pro klienta |
| 2 | **AI matching** — rychlost a relevance vs. ruční procházení profilů |
| 3 | **Kurátorský přístup** — kvalitní supply side jako diferenciátor vs. žluté stránky |
| 4 | **Discovery-first** — prototyp testovaný s reálnými uživateli před vývojem |
| 5 | **Debrief proces** — zpětná vazba jako systémový mechanismus pro zlepšování kvality |

### Slabé stránky (W)
| # | Weakness |
|---|----------|
| 1 | **Chicken-and-egg problém** — bez klientů žádní architekti, bez architektů žádní klienti |
| 2 | **Malý tým** — kapacita pro ruční onboarding architektů a kuraci je omezená |
| 3 | **Žádná brand awareness** — v ČR neznámý nový hráč |
| 4 | **Delayed revenue** — outcome-based pricing = cash flow problém v začátcích |
| 5 | **Obtížné měření spokojenosti** — jak objektivně určit „tier"? Potenciální spory |

### Příležitosti (O)
| # | Opportunity |
|---|-------------|
| 1 | **Oživení hypotečního trhu** — 2024–2025 se trh s nemovitostmi otvírá |
| 2 | **Niche positioning** — „premium matchmaking" nikdo v ČR nedělá |
| 3 | **Cross-sell ekosystém** — dodavatelské sítě (nábytek, materiály, řemeslníci) |
| 4 | **B2B kanál** — realitní kanceláře, developeři jako zdroj leadů |
| 5 | **Střední Evropa** — Polsko a Rakousko jsou logické další kroky |
| 6 | **Sociální dopad** — 20% fond jako PR a reputační aktivum |

### Hrozby (T)
| # | Threat |
|---|--------|
| 1 | **Přímé doporučení** — „kamarád architekt" je nejsilnější konkurent |
| 2 | **Vstup velkého hráče** — Houzz, Meta Marketplace, LinkedIn |
| 3 | **Ekonomická recese** — byty se nekupují, klienti šetří |
| 4 | **Neochota architektů** — outcome-based odměna může být pro ně nepřijatelná |
| 5 | **Regulace** — zpřísnění pravidel pro platformy nebo architektonické poradenství |

---

## 5. Konkurenční prostředí

### Přímá konkurence (matchmaking platforma pro architekty/designéry)

| Hráč | Trh | Model | Slabina vs. Bydlo |
|------|-----|-------|-------------------|
| **Houzz / Houzz Pro** | Globální (USA-centric) | Listing fee pro profesionály | Bez AI matchingu; anglicky; pro velké projekty |
| **Bark.com** | UK + expanze | Lead gen (architekt platí za lead) | Žádný outcome model; spam energie |
| **Thumbtack** | USA | Podobný Bark.com | Není v ČR |
| **earch.cz** | ČR | Archiv/portál ČKA | Pasivní adresář, žádný matching |
| **Archiweb.cz** | ČR | Média + portál | Zaměřen na profesionály, ne klienty |

### Nepřímá konkurence

| Hráč | Co nabízí | Proč nás ohrožuje |
|------|-----------|-------------------|
| **Osobní doporučení** | Referral od přítele | Nejsilnější trust; 0 nákladů pro klienta |
| **IKEA Planning Service** | Zdarma konzultace | Low-end substitut; normalizuje konzultaci zdarma |
| **Facebook skupiny** (Rekonstrukce bytu, Interiér ČR) | Komunita + tipy | Crowdsourced rady, žádná odpovědnost |
| **Realitní makléři** | Zdarma poradenství o dispozici | Conflict of interest, ale klient to nevidí |
| **Pinterest / Instagram** | Vizuální inspirace | DIY alternativa k designérovi |

### Poziční mapa

```
                    PREMIUM KVALITA
                          |
          Bydlo (cíl) ●   |
                          |
PASIVNÍ ──────────────────+────────────────── AKTIVNÍ MATCHING
adresář                   |                   / doporučení
  earch.cz ●              |    Bark.com ●
                          |
                    MASS MARKET
```

**Klíčový positioning:** Jediný hráč v kvadrantu „premium + aktivní matching" v ČR.

---

## 6. Zákaznické chování — vzorce z discovery

### Identifikované spouštěče (trigger events)

Seřazeno dle intenzity rozhodnutí:
1. **Stěhování s partnerem** — vysoké emocionální sázky, kompromis dvou vkusů
2. **Koupě první nemovitosti** — nejasné, co je možné a za kolik
3. **Rekonstrukce** — existující prostor, konkrétní problém
4. **Sdílený byt** — studentský segment, nižší platební kapacita

### Chování při hledání

Typická cesta klienta bez Bydlo:
1. Pinterest / Instagram → vizuální inspirace
2. IKEA planner → layout experimenty
3. Facebook skupina → crowdsourced tipy
4. Přítel nebo přítel přítele → pokud existuje architekt v síti
5. Google → obecné vyhledávání architektů (zde je obrovská tření)

**Kde jsme my:** Bydlo vstupuje mezi kroky 3 a 4 — jako „chytrý přítel s kontakty".

### Cenová citlivost

Z dosavadního výzkumu:
- Upfront fee 1 500–2 500 Kč za konzultaci: přijatelné pro majority cílové skupiny
- Outcome-based fee (0,5–2 % z nemovitosti): *nebylo ještě testováno* — klíčová hypotéza k validaci

---

## 7. Upsell a cross-sell potenciál

### Vrstvy hodnotového řetězce

```
[1] Matchmaking (aktuální) 
        ↓
[2] Konzultace + projekt management
        ↓
[3] Dodavatelská síť (nábytek, materiály, řemeslníci)
        ↓
[4] Dlouhodobý vztah (druhý projekt, přátelé)
        ↓
[5] B2B (developeři, realitní kanceláře)
```

### Konkrétní upsell příležitosti

| Příležitost | Popis | Odhad přidané hodnoty |
|-------------|-------|-----------------------|
| **Full project management** | Architekt řídí celou rekonstrukci přes Bydlo | 3–10× vyšší fee |
| **Dodavatelský marketplace** | Doporučení + affiliate od partnerů (nábytek, obklady, osvětlení) | 5–15 % z obj. nákupu |
| **3D vizualizace / AR** | Partnerství s vizualizačním studiem | flat fee nebo podíl |
| **Právní / finanční poradenství** | Propojení s hypotečním poradcem nebo realitním právníkem | referral fee |
| **B2B white-label** | Realitní kanceláře nabízejí „Bydlo konzultaci" jako benefit | SaaS nebo fee per use |
| **Subscription pro architekty** | Prémiové umístění, analytics, CRM pro architekty | 500–2 000 Kč/měs |

**Implikace:** Matchmaking je door opener, ne end game. Životní hodnota zákazníka (LTV) může být 5–10× vyšší než první transakce, pokud si udržíme vztah.

---

## 8. Validační plán — co a jak ověřit

### Klíčové hypotézy k otestování

| # | Hypotéza | Jak testovat | Signál úspěchu |
|---|----------|-------------|----------------|
| H-A | Klienti jsou ochotni platit outcome-based fee (vs. upfront) | Rozhovory + cenový experiment v prototypu | ≥60 % respondentů preferuje outcome model |
| H-B | Architekti jsou ochotni pracovat bez zaručené odměny | 20 rozhovorů s architekty | ≥30 % by to zkusilo |
| H-C | AI matching šetří čas a zvyšuje relevanci vs. adresář | A/B test v prototypu | Vyšší click-through na profil, kratší čas k výběru |
| H-D | Debrief podmínka (bez fee → 45 min hovor) je přijatelná | Zmínit v rozhovorech | <20 % respondentů by odmítlo |
| H-E | Cross-sell (dodavatelská síť) je zajímavý | Zmínit konceptuálně v rozhovorech | Spontánní zájem bez přílišného vysvětlování |

### Fáze validace

#### Fáze 0 — Desk research (2 týdny, bez nákladů)
- [ ] ČSÚ data: počet rezidenčních transakcí, průměrné ceny
- [ ] ČKA: přesný počet registrovaných architektů, geografické rozložení
- [ ] Průzkum konkurence: Houzz, Bark, earch — pricing a model
- [ ] Analýza Facebook skupin o bydlení: jaké otázky lidé kladou, co hledají

#### Fáze 1 — Demand-side validace (1 měsíc, 20–30 rozhovorů)
- Cílová skupina: lidé, kteří v posledních 2 letech kupovali nebo rekonstruovali
- Témata: discovery cesta, outcome-based pricing reakce, willingness to pay
- Metrika: ≥30 % by platilo outcome-based fee nad 10 000 Kč

#### Fáze 2 — Supply-side validace (souběžně, 15–20 rozhovorů s architekty)
- Cílová skupina: freelance architekti a interiéroví designéři s residential projekty
- Témata: aktuální příjem z residential, zájem o nové klienty, ochota k outcome modelu
- Metrika: ≥5 architektů ochotných k pilotní spolupráci

#### Fáze 3 — Pilotní transakce (2–3 měsíce)
- Manuální matchmaking pro 5–10 reálných klientů
- Cíl: ověřit celý tok end-to-end, ne škálovat
- Metrika: ≥3 dokončené konzultace, ≥1 outcome-based platba

#### Fáze 4 — Unit economics (po pilotu)
- CAC (náklady na získání klienta)
- LTV (celoživotní hodnota zákazníka)
- Gross margin (po odečtení podílu architekta)
- Breakeven pro 2-členný tým

---

## 9. Závěr a doporučení

### Je to byznys?

| Scénář | Podmínky | Potenciál |
|--------|----------|-----------|
| **Lifestyle business (ČR)** | Zaměření na Praha + Brno, 200–500 klientů/rok | 4–10 M Kč/rok; udrží malý tým |
| **Regionální hráč (ČR + SK + PL)** | Škálovatelný model, local-first expanze | 30–80 M Kč/rok v 3–5 letech |
| **CE lídra** | Velký tým, investor, replikace modelu | 300 M+ Kč/rok; VC relevantní |

### Prioritní next steps

1. **Desk research** — ČSÚ data + ČKA počty (1 týden)
2. **10 demand-side rozhovorů** zaměřených na outcome-based pricing reakci
3. **10 supply-side rozhovorů** s architekty/designéry
4. **Právní konzultace** — modelová smlouva pro outcome-based fee
5. **Pilotní matchmaking** — 5 klientů ručně, bez tech

Bez výsledků fáze 1–2 nedoporučujeme investovat do tech škálování.
