/**
 * Mortgage calculator FAQ — single source of truth for UI and FAQPage JSON-LD.
 * Informational, SEO- and AI-friendly; bilingual (EN / HY).
 */

export const MORTGAGE_FAQ_DATA = [
  {
    id: "what-is-this",
    questionEn: "What is this mortgage calculator?",
    answerEn:
      "This is a free mortgage calculator on Saving.am. It estimates your monthly payment, full cost of ownership (principal and interest, property tax, insurance, PMI, HOA), amortization schedule, and the impact of extra payments. You can compare two loan scenarios side by side. Results are estimates for informational purposes only and do not constitute financial advice.",
    questionHy: "Ինչ է այս հիպոթեկային հաշվիչը?",
    answerHy:
      "Սա Saving.am-ի անվճար հիպոթեկային հաշվիչ է: Այն գնահատում է ամսական վճարը, սեփականության ամբողջ արժեքը (հիմնական և տոկոս, գույքահարկ, ապահովագրություն, PMI, HOA), ամորտիզացիայի աղյուսակը և լրացուցիչ մուծումների ազդեցությունը: Կարող եք համեմատել երկու վարկի սցենար: Արդյունքները գնահատականներ են միայն տեղեկատվական նպատակով և ֆինանսական խորհուրդ չեն:",
  },
  {
    id: "annuity-vs-classical",
    questionEn: "What is the difference between Annuity and Classical calculation?",
    answerEn:
      "Annuity (fixed-rate) means a fixed monthly payment over the loan term: the share going to principal increases over time and the share going to interest decreases. Classical (linear) means a fixed principal amount is paid each month; the interest portion shrinks as the balance falls, so your total monthly payment decreases over time. The first payment is highest in the classical method.",
    questionHy: "Ինչ տարբերություն կա Անուիտետ և Դասական հաշվարկի միջև?",
    answerHy:
      "Անուիտետ (ֆիքսված) նշանակում է ամսական ֆիքսված վճար ամբողջ ժամկետում. հիմնական մասն աճում է ժամանակի ընթացքում, տոկոսային մասը նվազում է: Դասական (գծային) նշանակում է ամեն ամիս վճարվում է հիմնական գումարի ֆիքսված մաս. տոկոսային մասը նվազում է մնացորդի հետ, ուստի ամսական ընդհանուր վճարը ժամանակի ընթացքում նվազում է: Առաջին վճարը ամենաբարձրն է դասական մեթոդով:",
  },
  {
    id: "pmi",
    questionEn: "What is PMI and when does it end?",
    answerEn:
      "PMI (Private Mortgage Insurance) is insurance that protects the lender if you default. Lenders typically require it when your down payment is below about 20%. PMI is usually removed when your loan-to-value (LTV) ratio falls at or below a threshold, often 78%. You can set the threshold in the calculator; it will show the month when PMI drops off your schedule.",
    questionHy: "Ինչ է PMI-ն և երբ է այն դադարում?",
    answerHy:
      "PMI (մասնավոր հիպոթեկային ապահովագրություն) ապահովագրություն է, որը պաշտպանում է վարկատուին: Վարկատուները սովորաբար պահանջում են այն, երբ նախնական վճարը մոտ 20%-ից ցածր է: PMI-ն սովորաբար հանվում է, երբ վարկ-դեպի-արժեք (LTV) հարաբերակցությունը հասնում կամ ցածր է սահմանից (հաճախ 78%): Հաշվիչում կարող եք սահմանել այդ սահմանը. այն ցույց կտա ամիսը, երբ PMI-ն դադարում է:",
  },
  {
    id: "ltv",
    questionEn: "What is loan-to-value (LTV)?",
    answerEn:
      "Loan-to-value (LTV) is the ratio of your loan balance to the home value, expressed as a percentage. LTV is used to determine when PMI can be removed: when LTV falls at or below the threshold you set (e.g. 78%), the calculator stops adding PMI. Enter your home value (or purchase price) in the calculator so it can compute LTV over the life of the loan.",
    questionHy: "Ինչ է վարկ-դեպի-արժեք (LTV)?",
    answerHy:
      "Վարկ-դեպի-արժեք (LTV) վարկի մնացորդի և գույքի արժեքի հարաբերակցությունն է՝ տոկոսով: LTV-ն օգտագործվում է PMI-ի դադարեցման համար. երբ LTV-ն հասնում կամ ցածր է ձեր սահմանած սահմանից (օր. 78%), հաշվիչը դադարում է ավելացնել PMI: Մուտքագրեք գույքի արժեքը (կամ գնման գինը) հաշվիչում, որպեսզի այն կարողանա հաշվարկել LTV-ն վարկի ամբողջ ժամկետում:",
  },
  {
    id: "hoa",
    questionEn: "What is HOA in the calculator?",
    answerEn:
      "HOA (Homeowners Association) is a monthly fee for shared amenities, maintenance, or common areas, such as in condos or gated communities. The calculator adds this to your total monthly payment. If your loan does not include HOA fees, enter 0.",
    questionHy: "Ինչ է HOA-ն հաշվիչում?",
    answerHy:
      "HOA (գույքի սեփականատերերի ասոցիացիա) ամսական մուծում է համատեղ ծառայությունների, պահպանման կամ ընդհանուր տարածքների համար, օրինակ բազմաբնակարան կամ փակ համայնքներում: Հաշվիչը այն ավելացնում է ամսական ընդհանուր վճարին: Եթե ձեր վարկը HOA մուծում չի ներառում, մուտքագրեք 0:",
  },
  {
    id: "extra-payments",
    questionEn: "How do extra payments work?",
    answerEn:
      "You can add recurring extra payments (e.g. a fixed amount every month) and/or a one-time lump sum at a chosen month. Extra payments are applied to principal, which reduces the balance faster and shortens the loan term. The calculator shows how much interest you save and how many months you save compared to the base schedule with no extras.",
    questionHy: "Ինչպես են աշխատում լրացուցիչ մուծումները?",
    answerHy:
      "Կարող եք ավելացնել պարբերական լրացուցիչ մուծումներ (օր. ամեն ամիս ֆիքսված գումար) և/կամ միանվագ գումար ընտրված ամսում: Լրացուցիչ մուծումները կիրառվում են հիմնական գումարի նկատմամբ, ինչը արագացնում է մնացորդի նվազումը և կրճատում վարկի ժամկետը: Հաշվիչը ցույց է տալիս, թե որքան տոկոս եք խնայում և քանի ամիս եք խնայում՝ համեմատած լրացուցիչ մուծումներ չունեցող հիմնական աղյուսակի:",
  },
  {
    id: "compare-tab",
    questionEn: "Can I compare two loan scenarios?",
    answerEn:
      "Yes. The Compare tab lets you set Scenario A (e.g. your base loan) and Scenario B with a different term or extra monthly payment. You see side-by-side total interest, payoff date, and monthly P&I, plus a chart comparing how the balance decreases over time for each scenario.",
    questionHy: "Կարո՞ղ եմ համեմատել երկու վարկի սցենար:",
    answerHy:
      "Այո: Համեմատության ներդիրը թույլ է տալիս սահմանել Սցենար A (օր. ձեր հիմնական վարկը) և Սցենար B այլ ժամկետով կամ ամսական լրացուցիչ մուծումով: Կողք-կողքի տեսնում եք ընդամենը տոկոսը, մարման ամսաթիվը և ամսական P&I-ն, ինչպես նաև աղյուսակ, որը համեմատում է մնացորդի նվազումը ժամանակի ընթացքում յուրաքանչյուր սցենարի համար:",
  },
  {
    id: "overpayment-pct",
    questionEn: "What does \"Overpayment (%)\" mean?",
    answerEn:
      "Overpayment in percentage terms is (total interest paid + total PMI paid) divided by the loan amount, times 100. It shows how much extra you pay on top of the principal over the life of the loan. For example, 50% means you pay half again the loan amount in interest and PMI combined.",
    questionHy: "Ինչ է նշանակում \"Գերավճար (%)\"?",
    answerHy:
      "Գերավճարը տոկոսով (ընդամենը վճարված տոկոս + ընդամենը վճարված PMI) բաժանված վարկի գումարի, բազմապատկած 100-ով: Այն ցույց է տալիս, թե որքան լրացուցիչ եք վճարում հիմնական գումարի վրա վարկի ամբողջ ժամկետում: Օրինակ, 50%-ը նշանակում է, որ տոկոս և PMI միասին վճարում եք վարկի գումարի կեսի չափ:",
  },
  {
    id: "total-amount",
    questionEn: "What is \"Total amount\" in the summary?",
    answerEn:
      "\"Total amount\" is the sum of the loan principal plus all interest and all PMI you will pay over the life of the loan. It is the total cost of the loan itself, before property tax, insurance, or HOA, which are shown separately in your monthly payment.",
    questionHy: "Ինչ է \"Ընդամենը գումար\" ամփոփում?",
    answerHy:
      "\"Ընդամենը գումար\" վարկի հիմնական գումարի և ամբողջ տոկոսի ու PMI-ի գումարն է, որ կվճարեք վարկի ամբողջ ժամկետում: Սա հենց վարկի ընդհանուր արժեքն է՝ առանց գույքահարկի, ապահովագրության կամ HOA-ի, որոնք ցուցադրվում են առանձին ամսական վճարում:",
  },
  {
    id: "term-months-years",
    questionEn: "Can I enter the loan term in months or years?",
    answerEn:
      "Yes. Use the term selector to choose \"Years\" or \"Months\" and enter the value. The calculator converts everything to a single amortization schedule. For example, 20 years or 240 months both produce a 240-payment schedule.",
    questionHy: "Կարո՞ղ եմ մուտքագրել վարկի ժամկետը ամիսներով կամ տարիներով:",
    answerHy:
      "Այո: Օգտագործեք ժամկետի ընտրիչը \"Տարի\" կամ \"Ամիս\" ընտրելու և արժեք մուտքագրելու համար: Հաշվիչը ամեն ինչ վերածում է մեկ ամորտիզացիայի աղյուսակի: Օրինակ, 20 տարին կամ 240 ամիսը երկուսն էլ տալիս են 240 վճարի աղյուսակ:",
  },
  {
    id: "amortization-table",
    questionEn: "What does the amortization table show?",
    answerEn:
      "The amortization table shows month by month: payment number, year and month, principal paid, interest paid, PMI (if any), total monthly payment, and remaining balance. You can expand to see the full schedule and export it to Excel for your records.",
    questionHy: "Ինչ է ցույց տալիս ամորտիզացիայի աղյուսակը?",
    answerHy:
      "Ամորտիզացիայի աղյուսակը ամիս-ամիս ցույց է տալիս. վճարի համարը, տարին և ամիսը, վճարված հիմնական գումարը, վճարված տոկոսը, PMI-ն (եթե կա), ամսական ընդհանուր վճարը և մնացորդ: Կարող եք ընդլայնել ամբողջ աղյուսակը դիտելու և Excel արտահանելու համար:",
  },
  {
    id: "currencies",
    questionEn: "Which currencies are supported?",
    answerEn:
      "The calculator supports three currencies: Armenian dram (AMD), US dollar (USD), and euro (EUR). All loan amounts, payments, and results are shown in the selected currency. You can switch currency in the bar above the calculator.",
    questionHy: "Ինչ արժույթներ է աջակցում հաշվիչը?",
    answerHy:
      "Հաշվիչը աջակցում է երեք արժույթի. Հայկական դրամ (AMD), ԱՄՆ դոլար (USD) և եվրո (EUR): Բոլոր վարկի գումարները, վճարները և արդյունքները ցուցադրվում են ընտրված արժույթով: Արժույթը կարող եք փոխել հաշվիչի վերևի գծում:",
  },
  {
    id: "disclaimer",
    questionEn: "Is this calculator financial advice?",
    answerEn:
      "No. This calculator provides estimates for informational and educational purposes only. Results depend on the data you enter and do not reflect actual loan offers. For real terms, decisions, or advice, consult a qualified lender or financial advisor.",
    questionHy: "Այս հաշվիչը ֆինանսական խորհուրդ է?",
    answerHy:
      "Ոչ: Այս հաշվիչը տալիս է միայն գնահատականներ տեղեկատվական և կրթական նպատակներով: Արդյունքները կախված են ձեր մուտքագրած տվյալներից և իրական վարկային առաջարկներ չեն արտացոլում: Իրական պայմանների, որոշումների կամ խորհրդատվության համար դիմեք վարկատու կամ ֆինանսական խորհրդատու:",
  },
];
