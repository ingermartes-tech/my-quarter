import { useState, useEffect, useRef } from "react";

const load = (k,d) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):d; } catch { return d; } };
const save = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };

const toKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const todayKey = () => toKey(new Date());
const getQ = d => Math.ceil((d.getMonth()+1)/3);
const qLabel = d => `Q${getQ(d)} ${d.getFullYear()}`;
const qStart = d => new Date(d.getFullYear(),(getQ(d)-1)*3,1);
const qEnd = d => new Date(d.getFullYear(),getQ(d)*3,0);
const MONTHS = ["Januar","Februar","Mars","April","Mai","Juni","Juli","August","September","Oktober","November","Desember"];
const DAYS_S = ["Man","Tir","Ons","Tor","Fre","Lør","Søn"];
const HOURS = ["06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22"];
const DAYS_F = ["Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag","Søndag"];
const dow = d => { const w=d.getDay(); return w===0?6:w-1; };
const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const parseKey = k => new Date(k+"T12:00:00");
const MONTHS_EN=["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_DE=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const MONTHS_ES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const MONTHS_SV=["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];
const MONTHS_DA=["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"];
const getMo=(l)=>({en:MONTHS_EN,de:MONTHS_DE,es:MONTHS_ES,sv:MONTHS_SV,da:MONTHS_DA,no:MONTHS}[l]||MONTHS_EN);
const fmtDate=(d,l="en")=>{const mo=getMo(l);return l==="en"?`${mo[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`:`${d.getDate()}. ${mo[d.getMonth()]} ${d.getFullYear()}`;};
const fmtShort=(d,l="en")=>{const mo=getMo(l);return `${d.getDate()} ${mo[d.getMonth()].slice(0,3)}`;};

const CATS = ["Helse","Jobb","Personlig","Økonomi","Relasjoner","Utvikling","Annet"];
const CATS_TR = {
  no:["Helse","Jobb","Personlig","Økonomi","Relasjoner","Utvikling","Annet"],
  en:["Health","Work","Personal","Finance","Relations","Growth","Other"],
  sv:["Hälsa","Jobb","Personlig","Ekonomi","Relationer","Utveckling","Annat"],
  da:["Sundhed","Job","Personlig","Økonomi","Relationer","Udvikling","Andet"],
  de:["Gesundheit","Arbeit","Persönlich","Finanzen","Beziehungen","Entwicklung","Sonstiges"],
  es:["Salud","Trabajo","Personal","Finanzas","Relaciones","Crecimiento","Otro"],
};
const getCats = (l) => CATS_TR[l]||CATS_TR.en;
const catDisplay = (l,key) => { const i=CATS.indexOf(key); return i>=0?(CATS_TR[l]||CATS_TR.en)[i]:key; };
const CAT_COLOR = {Helse:"#D4EDDA",Jobb:"#D6E8F5",Personlig:"#E8D6F0",Økonomi:"#FAFAD8",Relasjoner:"#F5D6DF",Utvikling:"#D0EAF0",Annet:"#E8E6D8"};
const CAT_TEXT = {Helse:"#4A7A52",Jobb:"#3A5E7A",Personlig:"#6A4A7A",Økonomi:"#8A7A30",Relasjoner:"#7A3A4A",Utvikling:"#3A6A7A",Annet:"#5A5545"};
const ROUTINE_CATS = ["Morgen","Kveld","Mine vaner"];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const TR = {
  no: {
    overview:"Oversikt", myGoals:"Mine mål", daily:"Daglig", weekly:"Ukentlig",
    monthly:"Månedlig", routine:"Min rutine", journal:"Journal", archive:"Arkiv",
    evaluation:"Evaluering",
    todayGoal:"Dagens mål", tasks:"Dagens gjøremål", schedule:"Timeplan",
    morningRoutine:"Morgenrutine", eveningRoutine:"Kveldsrutine",
    nextStep:"Neste steg", goalCompleted:"Mål fullført",
    grateful:"Takknemlighet", intention:"Hva vil du ha mer av i dag?",
    addTask:"+ Legg til", today:"I dag", back:"← Tilbake",
    weeklyGoals:"Ukens mål", quarterPriorities:"⭐ Kvartalsprioriteringer",
    streak:"Streak", daysLeft:"Dager igjen av",
    addGoal:"Legg til mål", starred:"Stjernede", done:"Fullførte",
    subgoal:"+ Delmål", editGoal:"Rediger",
    myRoutine:"Min rutine", morning:"Morgen", evening:"Kveld", myHabits:"Mine vaner",
    addStep:"+ Legg til steg",
    journalTitle:"Velg et spørsmål eller skriv fritt",
    freeText:"✏️ Fri tekst – skriv om hva du vil",
    newPrompts:"✦ Nye", savedAuto:"Lagret automatisk",
    archiveTitle:"Arkiv", searchArchive:"Søk i arkivet…",
    evalWeek:"Uke", evalMonth:"Måned", evalQuarter:"Kvartal",
    score:"Score",
    greetMorning:"morgen", greetDay:"dag", greetEvening:"kveld",
    noStarred:"Ingen stjernede mål. Gå til Mine mål.",
    clickDayHint:"Trykk en dag for å bytte til den i dag-fanen",
   
    hide:"Skjul", show:"Vis", addGoalPlaceholder:"Hva vil du oppnå?",
    journalPlaceholder:"La tankene flyte fritt…",
    titleOptional:"Overskrift (valgfritt)...",
    freeWritePlaceholder:"Skriv om hva du vil…",
    usePromptAsTitle:"Bruk spørsmål som overskrift",
    gratefulPlaceholder:"Tre ting, store eller små...", writeHere:"Skriv her…", searchJournal:"Søk i journalen…", stepPlaceholder:"Steg...", firstNamePlaceholder:"Ditt fornavn", noEntriesYet:"Ingen oppføringer ennå", addMore:"+ Legg til", evalPlaceholder:"Skriv her…", starredHint:`⭐ Stjernede: ${0}/3 – fullfør ett`, planner:"Planlegger", settings:"Innstillinger", profile:"Profil", languageLabel:"Språk", saveSettings:"Lagre", noAppointments:"Ingen avtaler denne dagen", all:"Alle", day:"Dag", week:"Uke", month:"Måned"
  },
  en: {
    overview:"Overview", myGoals:"My Goals", daily:"Daily", weekly:"Weekly",
    monthly:"Monthly", routine:"My Routine", journal:"Journal", archive:"Archive",
    evaluation:"Evaluation",
    todayGoal:"Today's goal", tasks:"Today's tasks", schedule:"Schedule",
    morningRoutine:"Morning routine", eveningRoutine:"Evening routine",
    nextStep:"Next step", goalCompleted:"Goal completed",
    grateful:"Gratitude", intention:"What do you want more of today?",
    addTask:"+ Add", today:"Today", back:"← Back",
    weeklyGoals:"Weekly goals", quarterPriorities:"⭐ Quarter priorities",
    streak:"Streak", daysLeft:"Days left of",
    addGoal:"Add goal", starred:"Starred", done:"Completed",
    subgoal:"+ Sub-goal", editGoal:"Edit",
    myRoutine:"My routine", morning:"Morning", evening:"Evening", myHabits:"My habits",
    addStep:"+ Add step",
    journalTitle:"Choose a prompt or write freely",
    freeText:"✏️ Free write – anything on your mind",
    newPrompts:"✦ New", savedAuto:"Auto-saved",
    archiveTitle:"Archive", searchArchive:"Search archive…",
    evalWeek:"Week", evalMonth:"Month", evalQuarter:"Quarter",
    score:"Score",
    greetMorning:"morning", greetDay:"afternoon", greetEvening:"evening",
    noStarred:"No starred goals. Go to My Goals.",
    clickDayHint:"Tap a day to switch to it in the Day tab",
   
    hide:"Hide", show:"Show", addGoalPlaceholder:"What do you want to achieve?",
    journalPlaceholder:"Let your thoughts flow freely…",
    titleOptional:"Title (optional)...",
    freeWritePlaceholder:"Write about anything…",
    usePromptAsTitle:"Use prompt as title",
    gratefulPlaceholder:"Three things, big or small...", writeHere:"Write here…", searchJournal:"Search journal…", stepPlaceholder:"Step...", firstNamePlaceholder:"Your first name", noEntriesYet:"No entries yet", addMore:"+ Add more", evalPlaceholder:"Write here…", starredHint:`⭐ Starred: ${0}/3 – complete one to star new`, planner:"Planner", settings:"Settings", profile:"Profile", languageLabel:"Language", saveSettings:"Save", noAppointments:"No appointments this day", all:"All", day:"Day", week:"Week", month:"Month"
  },
  sv: {
    overview:"Översikt", myGoals:"Mina mål", daily:"Daglig", weekly:"Veckovis",
    monthly:"Månadsvis", routine:"Min rutin", journal:"Journal", archive:"Arkiv",
    evaluation:"Utvärdering",
    todayGoal:"Dagens mål", tasks:"Dagens uppgifter", schedule:"Tidsplan",
    morningRoutine:"Morgonrutin", eveningRoutine:"Kvällsrutin",
    nextStep:"Nästa steg", goalCompleted:"Mål uppnått",
    grateful:"Tacksamhet", intention:"Vad vill du ha mer av idag?",
    addTask:"+ Lägg till", today:"Idag", back:"← Tillbaka",
    weeklyGoals:"Veckans mål", quarterPriorities:"⭐ Kvartalsprioriteringar",
    streak:"Streak", daysLeft:"Dagar kvar av",
    addGoal:"Lägg till mål", starred:"Stjärnmarkerade", done:"Slutförda",
    subgoal:"+ Delmål", editGoal:"Redigera",
    myRoutine:"Min rutin", morning:"Morgon", evening:"Kväll", myHabits:"Mina vanor",
    addStep:"+ Lägg till steg",
    journalTitle:"Välj en fråga eller skriv fritt",
    freeText:"✏️ Fritext – skriv om vad du vill",
    newPrompts:"✦ Nya", savedAuto:"Sparas automatiskt",
    archiveTitle:"Arkiv", searchArchive:"Sök i arkivet…",
    evalWeek:"Vecka", evalMonth:"Månad", evalQuarter:"Kvartal",
    score:"Poäng",
    greetMorning:"morgon", greetDay:"dag", greetEvening:"kväll",
    noStarred:"Inga stjärnmarkerade mål. Gå till Mina mål.",
    clickDayHint:"Tryck på en dag för att byta till den i Dag-fliken",
   
    hide:"Dölj", show:"Visa", addGoalPlaceholder:"Vad vill du uppnå?",
    journalPlaceholder:"Låt tankarna flöda fritt…",
    titleOptional:"Titel (valfritt)...",
    freeWritePlaceholder:"Skriv om vad du vill…",
    usePromptAsTitle:"Använd fråga som titel",
    gratefulPlaceholder:"Tre saker, stora eller små...", writeHere:"Skriv här…", searchJournal:"Sök i journalen…", stepPlaceholder:"Steg...", firstNamePlaceholder:"Ditt förnamn", noEntriesYet:"Inga uppgifter ännu", addMore:"+ Lägg till", evalPlaceholder:"Skriv här…", all:"Alla", day:"Dag", week:"Vecka", month:"Månad", planner:"Planner", settings:"Inställningar", profile:"Profil", languageLabel:"Språk", saveSettings:"Spara", noAppointments:"Inga möten denna dag"
  },
  da: {
    overview:"Oversigt", myGoals:"Mine mål", daily:"Daglig", weekly:"Ugentlig",
    monthly:"Månedlig", routine:"Min rutine", journal:"Journal", archive:"Arkiv",
    evaluation:"Evaluering",
    todayGoal:"Dagens mål", tasks:"Dagens opgaver", schedule:"Tidsplan",
    morningRoutine:"Morgenrutine", eveningRoutine:"Aftenrutine",
    nextStep:"Næste skridt", goalCompleted:"Mål opnået",
    grateful:"Taknemmelighed", intention:"Hvad vil du have mere af i dag?",
    addTask:"+ Tilføj", today:"I dag", back:"← Tilbage",
    weeklyGoals:"Ugens mål", quarterPriorities:"⭐ Kvartalsprioriteter",
    streak:"Streak", daysLeft:"Dage tilbage af",
    addGoal:"Tilføj mål", starred:"Markerede", done:"Gennemførte",
    subgoal:"+ Delmål", editGoal:"Rediger",
    myRoutine:"Min rutine", morning:"Morgen", evening:"Aften", myHabits:"Mine vaner",
    addStep:"+ Tilføj trin",
    journalTitle:"Vælg et spørgsmål eller skriv frit",
    freeText:"✏️ Fri tekst – skriv om hvad du vil",
    newPrompts:"✦ Nye", savedAuto:"Gemt automatisk",
    archiveTitle:"Arkiv", searchArchive:"Søg i arkivet…",
    evalWeek:"Uge", evalMonth:"Måned", evalQuarter:"Kvartal",
    score:"Score",
    greetMorning:"morgen", greetDay:"dag", greetEvening:"aften",
    noStarred:"Ingen markerede mål. Gå til Mine mål.",
    clickDayHint:"Tryk på en dag for at skifte til den i dag-fanen",
   
    hide:"Skjul", show:"Vis", addGoalPlaceholder:"Hvad vil du opnå?",
    journalPlaceholder:"Lad tankerne flyde frit…",
    titleOptional:"Overskrift (valgfrit)...",
    freeWritePlaceholder:"Skriv om hvad du vil…",
    usePromptAsTitle:"Brug spørgsmål som overskrift",
    gratefulPlaceholder:"Tre ting, store eller små...", writeHere:"Skriv her…", searchJournal:"Søg i journalen…", stepPlaceholder:"Trin...", firstNamePlaceholder:"Dit fornavn", noEntriesYet:"Ingen opslag endnu", addMore:"+ Tilføj", evalPlaceholder:"Skriv her…", starredHint:`⭐ Stjernede: ${0}/3 – fullfør ett`, planner:"Planlegger", settings:"Indstillinger", profile:"Profil", languageLabel:"Sprog", saveSettings:"Gem", noAppointments:"Ingen aftaler denne dag", all:"Alle", day:"Dag", week:"Uge", month:"Måned"
  },
  de: {
    overview:"Übersicht", myGoals:"Meine Ziele", daily:"Täglich", weekly:"Wöchentlich",
    monthly:"Monatlich", routine:"Meine Routine", journal:"Journal", archive:"Archiv",
    evaluation:"Auswertung",
    todayGoal:"Heutiges Ziel", tasks:"Heutige Aufgaben", schedule:"Zeitplan",
    morningRoutine:"Morgenroutine", eveningRoutine:"Abendroutine",
    nextStep:"Nächster Schritt", goalCompleted:"Ziel erreicht",
    grateful:"Dankbarkeit", intention:"Was möchtest du heute mehr von?",
    addTask:"+ Hinzufügen", today:"Heute", back:"← Zurück",
    weeklyGoals:"Wochenziele", quarterPriorities:"⭐ Quartalsprioritäten",
    streak:"Streak", daysLeft:"Tage verbleibend von",
    addGoal:"Ziel hinzufügen", starred:"Priorisierte", done:"Erledigte",
    subgoal:"+ Teilziel", editGoal:"Bearbeiten",
    myRoutine:"Meine Routine", morning:"Morgen", evening:"Abend", myHabits:"Meine Gewohnheiten",
    addStep:"+ Schritt hinzufügen",
    journalTitle:"Wähle eine Frage oder schreibe frei",
    freeText:"✏️ Freier Text – schreib über alles",
    newPrompts:"✦ Neue", savedAuto:"Automatisch gespeichert",
    archiveTitle:"Archiv", searchArchive:"Archiv durchsuchen…",
    evalWeek:"Woche", evalMonth:"Monat", evalQuarter:"Quartal",
    score:"Bewertung",
    greetMorning:"Morgen", greetDay:"Tag", greetEvening:"Abend",
    noStarred:"Keine priorisierten Ziele. Gehe zu Meine Ziele.",
    clickDayHint:"Tippe auf einen Tag, um zur Tagesansicht zu wechseln",
   
    hide:"Ausblenden", show:"Anzeigen", addGoalPlaceholder:"Was möchtest du erreichen?",
    journalPlaceholder:"Lass deine Gedanken fließen…",
    titleOptional:"Titel (optional)...",
    freeWritePlaceholder:"Schreib über alles…",
    usePromptAsTitle:"Frage als Titel verwenden",
    gratefulPlaceholder:"Drei Dinge, groß oder klein...", writeHere:"Hier schreiben…", searchJournal:"Journal durchsuchen…", stepPlaceholder:"Schritt...", firstNamePlaceholder:"Dein Vorname", noEntriesYet:"Noch keine Einträge", addMore:"+ Hinzufügen", evalPlaceholder:"Hier schreiben…", planner:"Planer", settings:"Einstellungen", profile:"Profil", languageLabel:"Sprache", saveSettings:"Speichern", noAppointments:"Keine Termine an diesem Tag", all:"Alle", day:"Tag", week:"Woche", month:"Monat"
  },
  es: {
    overview:"Resumen", myGoals:"Mis objetivos", daily:"Diario", weekly:"Semanal",
    monthly:"Mensual", routine:"Mi rutina", journal:"Diario", archive:"Archivo",
    evaluation:"Evaluación",
    todayGoal:"Objetivo del día", tasks:"Tareas de hoy", schedule:"Horario",
    morningRoutine:"Rutina matutina", eveningRoutine:"Rutina nocturna",
    nextStep:"Siguiente paso", goalCompleted:"Objetivo completado",
    grateful:"Gratitud", intention:"¿Qué quieres tener más hoy?",
    addTask:"+ Añadir", today:"Hoy", back:"← Volver",
    weeklyGoals:"Objetivos semanales", quarterPriorities:"⭐ Prioridades del trimestre",
    streak:"Racha", daysLeft:"Días restantes de",
    addGoal:"Añadir objetivo", starred:"Destacados", done:"Completados",
    subgoal:"+ Subobjetivo", editGoal:"Editar",
    myRoutine:"Mi rutina", morning:"Mañana", evening:"Noche", myHabits:"Mis hábitos",
    addStep:"+ Añadir paso",
    journalTitle:"Elige una pregunta o escribe libremente",
    freeText:"✏️ Texto libre – escribe sobre lo que quieras",
    newPrompts:"✦ Nuevas", savedAuto:"Guardado automáticamente",
    archiveTitle:"Archivo", searchArchive:"Buscar en archivo…",
    evalWeek:"Semana", evalMonth:"Mes", evalQuarter:"Trimestre",
    score:"Puntuación",
    greetMorning:"mañana", greetDay:"día", greetEvening:"noche",
    noStarred:"Sin objetivos destacados. Ve a Mis objetivos.",
    clickDayHint:"Toca un día para cambiarlo en la pestaña Día",
   
    hide:"Ocultar", show:"Mostrar", addGoalPlaceholder:"¿Qué quieres lograr?",
    journalPlaceholder:"Deja fluir tus pensamientos…",
    titleOptional:"Título (opcional)...",
    freeWritePlaceholder:"Escribe sobre lo que quieras…",
    usePromptAsTitle:"Usar pregunta como título",
    gratefulPlaceholder:"Tres cosas, grandes o pequeñas...", writeHere:"Escribe aquí…", searchJournal:"Buscar en diario…", stepPlaceholder:"Paso...", firstNamePlaceholder:"Tu nombre", noEntriesYet:"Sin entradas aún", addMore:"+ Añadir", evalPlaceholder:"Escribe aquí…", planner:"Planificador", settings:"Ajustes", profile:"Perfil", languageLabel:"Idioma", saveSettings:"Guardar", noAppointments:"Sin citas este día", all:"Todo", day:"Día", week:"Semana", month:"Mes"
  },
};
const T = (lang, key) => (TR[lang]||TR.no)[key] || (TR.no)[key] || key;


const requestNotif = async () => {
  if(!("Notification" in window)) return false;
  if(Notification.permission==="granted") return true;
  return (await Notification.requestPermission())==="granted";
};

const STYLE = `
/* Fonts embedded in index.html */
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;}
body{font-family:'DM Sans',sans-serif;background:#F6F3EE;color:#2A2318;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#CCC8BE;border-radius:3px;}

/* ── Design tokens ── */
:root{
  --bg:#F6F3EE;
  --bg2:#FAFAF7;
  --border:#E2DDD3;
  --border2:#D5CFBF;
  --dark:#2A2318;
  --dark2:#3D3426;
  --mid:#8A7E6E;
  --light:#C4BDB0;
  --cream:#F6F3EE;
  --sb:#EAE5DC;
  --accent:#A8C9B0;       /* dusty green */
  --accent-bg:#EAF3EC;
  --accent2:#7BAFC4;      /* dusty blue - secondary */
  --accent2-bg:#EDF4F8;
  --accent3:#C4899A;      /* dusty rose */
  --accent3-bg:#F7EEF1;
  --hero-from:#A8C9B0;
  --hero-to:#C8DFC9;
}
.app{display:flex;height:100vh;overflow:hidden;position:relative;}

/* OVERLAY for mobile menu */
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(42,35,24,.45);z-index:99;}
.sb-overlay.show{display:block;}

/* SIDEBAR */
.sb{width:240px;background:#EAE5DC;display:flex;flex-direction:column;flex-shrink:0;border-right:1px solid #D5CFBF;transition:transform .25s ease;z-index:100;}
@media(max-width:768px){
  .sb{position:fixed;top:0;left:0;height:100%;transform:translateX(-100%);}
  .sb.open{transform:translateX(0);}
}
.sb-top{padding:18px 16px 14px;border-bottom:1px solid #D5CFBF;}
.sb-q{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#8A7E6E;margin-bottom:5px;}
.sb-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;color:#2A2318;line-height:1.2;}
.sb-date{font-size:11px;color:#8A7E6E;margin-top:2px;}
.sb-counter{margin-top:12px;background:rgba(255,255,255,.6);border:1px solid #D5CFBF;border-radius:8px;padding:10px 12px;}
.sb-nums{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;color:#2A2318;}
.sb-clabel{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#8A7E6E;margin-top:1px;}
.sb-bar{height:2px;background:#D5CFBF;border-radius:1px;margin-top:7px;overflow:hidden;}
.sb-fill{height:100%;background:#A8C9B0;border-radius:1px;transition:width .5s ease;}
.sb-nav{flex:1;padding:8px 0;overflow-y:auto;}
.ns{padding:8px 16px 3px;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#8A7E6E;}
.ni{display:flex;align-items:center;gap:8px;padding:9px 16px;cursor:pointer;font-size:13px;color:#5A5040;transition:all .12s;border:none;background:none;width:100%;text-align:left;border-left:2px solid transparent;border-right:2px solid transparent;}
.ni:hover{background:rgba(42,35,24,.06);color:#2A2318;}
.ni.on{background:#EAF3EC;color:#2A2318;border-left-color:#A8C9B0;font-weight:500;}
.sb-bot{padding:10px 16px;border-top:1px solid #D5CFBF;}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.topbar{padding:12px 16px;background:#F6F3EE;border-bottom:1px solid #E2DDD3;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.ham{background:none;border:none;cursor:pointer;color:#2A2318;padding:4px;display:flex;align-items:center;flex-shrink:0;}
.tb-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;flex:1;}
.tb-sub{font-size:11px;color:#8A7E6E;}
.content{flex:1;overflow-y:auto;padding:16px;}
@media(min-width:769px){.topbar{padding:13px 24px;}.content{padding:20px 24px;}.ham{display:none;}}

/* CARDS */
.card{background:#fff;border:1px solid #E2DDD3;border-radius:10px;padding:16px;margin-bottom:12px;}
.card-dark{background:linear-gradient(135deg,var(--hero-from) 0%,var(--hero-to) 100%);color:#2A2318;border:none;}
.ctitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:400;color:#2A2318;margin-bottom:11px;letter-spacing:.02em;}
.card-dark .ctitle{color:#2A2318;}

/* GRID - responsive */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:6px;}.g2-tight{display:grid;grid-template-columns:1fr 1fr;gap:1px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
@media(max-width:600px){.g2{grid-template-columns:1fr;row-gap:4px;}.g3{grid-template-columns:1fr 1fr;}}

/* INPUTS */
input[type=text],input[type=time],input[type=date],textarea,select{width:100%;padding:8px 10px;border:1px solid #E2DDD3;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;color:#2A2318;background:#FAFAF7;resize:none;outline:none;transition:border .15s;}
input:focus,textarea:focus,select:focus{border-color:var(--accent);background:#fff;box-shadow:0 0 0 3px rgba(168,201,176,.15);}
.ig{border:none!important;background:transparent!important;padding:3px 0!important;font-family:'DM Sans',sans-serif;font-size:13px;color:#2A2318;width:100%;outline:none;}
.ig::placeholder{color:#C4BDB0;}

/* CHECKBOX */
.cr{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid #F5F2ED;}
.cr:last-child{border-bottom:none;}
.cb{width:16px;height:16px;border:1.5px solid #C4BDB0;border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:all .12s;background:#fff;}
.cb.on{background:var(--accent);border-color:var(--accent);}

/* BUTTONS */
.btn{padding:8px 16px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .15s;border:1px solid;font-weight:400;display:inline-flex;align-items:center;gap:5px;}
.bd{background:#2A2318;color:#F6F3EE;border-color:#2A2318;}
.bd:hover{background:#1A1510;}
.bd:disabled{opacity:.5;cursor:not-allowed;}
.bo{background:transparent;color:#2A2318;border-color:#C4BDB0;}
.bo:hover{background:#F5F0E8;}
.bs{padding:5px 11px;font-size:12px;}
.bi{background:none;border:none;cursor:pointer;color:#8A7E6E;padding:3px;display:flex;align-items:center;transition:color .12s;flex-shrink:0;}
.bi:hover{color:#2A2318;}

/* STAR GOAL */
.star-goal{border:1px solid #E2DDD3;border-radius:8px;padding:9px 12px;margin-bottom:6px;position:relative;}
.star-goal.starred{border-color:#C4A85A;background:#FDFAF3;}
.star-goal.done-g{opacity:.5;}
.sg-star{position:absolute;top:11px;right:11px;font-size:16px;cursor:pointer;background:none;border:none;color:#D5CFBF;transition:color .15s;line-height:1;}
.sg-star.lit{color:#C4A85A;}
.sg-name{font-size:14px;font-weight:400;color:#2A2318;padding-right:26px;line-height:1.4;}
.sg-name.done-t{text-decoration:line-through;color:#C4BDB0;}
.cat-pill{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;white-space:nowrap;}
.sub-list{margin-top:6px;padding-top:6px;border-top:1px solid #F0EDE6;}
.sub-row{display:flex;align-items:center;gap:7px;padding:4px 0;}
.streak-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:#EAF3EC;border-radius:20px;font-size:11px;color:#4A8A5A;font-weight:500;}

/* EDIT INPUT inline */
.edit-inp{border:1px solid #C4BDB0!important;background:#fff!important;border-radius:4px!important;padding:3px 7px!important;font-size:13px;}

/* CALENDAR */
.cal-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
.cal-dl{font-size:9px;letter-spacing:.07em;text-transform:uppercase;color:#8A7E6E;text-align:center;padding:3px 0;}
.cal-cell{aspect-ratio:1;border:1px solid #EDE8E0;border-radius:4px;padding:3px;cursor:pointer;transition:all .12s;background:#FAFAF7;display:flex;flex-direction:column;position:relative;}
.cal-cell:hover{border-color:#8A7E6E;}
.cal-cell.cal-today{border-color:#A8C9B0;background:#EAF3EC;}
.cal-cell.cal-empty{background:transparent;border-color:transparent;cursor:default;}
.cal-cell.cal-dot::after{content:'';width:5px;height:5px;background:#A8C9B0;border-radius:50%;position:absolute;bottom:2px;right:2px;}
.cal-num{font-size:10px;color:#8A7E6E;line-height:1;}
.cal-today .cal-num{color:#4A8A5A;font-weight:600;}
.cal-ev{font-size:8px;color:#5A5040;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px;}

/* HABIT DOTS */
.h-dots{display:flex;gap:2px;}
.h-dot{width:9px;height:9px;border-radius:2px;}

/* JOURNAL PROMPT */
.jp:hover{border-color:#8A7E6E;}

/* ROUTINE SECTION */
.routine-tab{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap;}
.rtab{padding:5px 12px;border-radius:20px;font-size:12px;cursor:pointer;border:1px solid #E2DDD3;background:#FAFAF7;color:#5A5040;transition:all .15s;}
.rtab.on{background:#A8C9B0;color:#2A2318;border-color:#A8C9B0;}

/* TIME BLOCK */
.tb-row{display:flex;gap:6px;align-items:center;margin-bottom:3px;}
.tb-lbl{font-size:10px;color:#8A7E6E;width:40px;flex-shrink:0;letter-spacing:.02em;}

/* CHAT */
@media(max-width:900px){
}






.dot{width:5px;height:5px;border-radius:50%;background:#8A7E6E;animation:bl 1.2s infinite;}
.dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
@keyframes bl{0%,60%,100%{opacity:.3;transform:scale(.85);}30%{opacity:1;transform:scale(1);}}






/* ONBOARDING */
.ob-overlay{position:fixed;inset:0;background:rgba(42,35,24,.65);z-index:300;display:flex;align-items:flex-end;justify-content:center;padding:0;}
@media(min-width:600px){.ob-overlay{align-items:center;padding:16px;}}
.ob-card{background:#fff;border-radius:20px 20px 0 0;padding:28px 22px 32px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;}
@media(min-width:600px){.ob-card{border-radius:16px;padding:36px;}}
.ob-step{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#8A7E6E;margin-bottom:5px;}
.ob-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;color:#2A2318;margin-bottom:6px;line-height:1.2;}
.ob-sub{font-size:13px;color:#8A7E6E;line-height:1.65;margin-bottom:20px;}
.ob-prog{height:2px;background:#EDE8E0;border-radius:1px;margin-bottom:20px;overflow:hidden;}
.ob-prog-fill{height:100%;background:#2A2318;border-radius:1px;transition:width .4s ease;}
.ob-actions{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap;}
.concept-card{background:#F6F3EE;border-radius:10px;padding:16px;margin-bottom:10px;display:flex;gap:14px;align-items:flex-start;}
.concept-icon{font-size:24px;flex-shrink:0;width:36px;text-align:center;}
.concept-text h4{font-size:14px;font-weight:500;color:#2A2318;margin-bottom:3px;}
.concept-text p{font-size:12px;color:#8A7E6E;line-height:1.6;}

/* STREAK CELEBRATION */
.streak-cel{text-align:center;padding:14px;background:#FDFAF3;border:1px solid #C4A85A;border-radius:10px;margin-bottom:12px;}

/* ARCHIVE TABS */
.arch-tabs{display:flex;gap:6px;margin-bottom:14px;}
.arch-tab{padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;border:1px solid #E2DDD3;background:#FAFAF7;color:#5A5040;transition:all .15s;}
.arch-tab.on{background:#2A2318;color:#F6F3EE;border-color:#2A2318;}

/* BOTTOM NAV mobile */
.bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #E2DDD3;padding:6px 0 10px;z-index:90;}
@media(max-width:768px){.bottom-nav{display:flex;justify-content:space-around;}}
.bn-item{display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding:4px 8px;border:none;background:none;color:#8A7E6E;font-size:9px;letter-spacing:.04em;text-transform:uppercase;transition:color .12s;min-width:40px;}
.bn-item.on{color:var(--accent);}
@media(max-width:768px){.content{padding-bottom:70px;}}

.slide-in{animation:slideIn .18s ease;}
@keyframes slideIn{from{opacity:0;transform:translateX(6px);}to{opacity:1;transform:translateX(0);}}
@keyframes fi{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
@keyframes fadeOut{from{opacity:1;}to{opacity:0;}}
.goal-done-fade{animation:fadeOut .4s ease forwards;}

.fade{animation:fi .2s ease;}

@media(prefers-color-scheme:dark){
  body{background:#161210;color:#E8E3DA;}
  .sb{background:#1E1A14;border-right-color:#2E2820;}
  .sb-counter{background:rgba(255,255,255,.05);border-color:#2E2820;}
  .main,.topbar{background:#161210;}
  .topbar{border-bottom-color:#2E2820;}
  .card{background:#1E1A14;border-color:#2E2820;}.ctitle{color:#E8E3DA;}
  input,textarea,select{background:#2A2318;border-color:#3A3020;color:#E8E3DA;}
  input:focus,textarea:focus{background:#3A3020;}
  .cb{background:#2A2318;border-color:#4A4030;}
  .ig{color:#E8E3DA;}
  .bo{color:#E8E3DA;border-color:#4A4030;}.bo:hover{background:#2A2318;}
  .star-goal{background:#1E1A14;border-color:#2E2820;}.star-goal.starred{background:#2A2010;border-color:#8A6A20;}
  .ni{color:#8A7E6E;}.ni.on,.ni:hover{background:rgba(255,255,255,.07);color:#E8E3DA;}
  .cal-cell{background:#1E1A14;border-color:#2E2820;}
  .jp.liked{background:#2A2010;border-color:#8A6A20;}
  .ob-card{background:#1E1A14;color:#E8E3DA;}
  .concept-card{background:#2A2318;}
  .bottom-nav{background:#1E1A14;border-top-color:#2E2820;}
  .rtab{background:#2A2318;border-color:#3A3020;color:#9A9080;}
}
`;

const Ico = ({d,s=15}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {d.split("|").map((p,i)=><path key={i} d={p}/>)}
  </svg>
);

// ─── PASTEL SVG ICONS ─────────────────────────────────────────────────────────
const SunIco = ({s=16}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4" fill="#F5E6A0" stroke="#C8A840" strokeWidth="1.2"/>
    {["0","45","90","135","180","225","270","315"].map((deg,i)=>(
      <line key={i} x1="12" y1="3.5" x2="12" y2="5.5" stroke="#C8A840" strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${deg} 12 12)`}/>
    ))}
  </svg>
);
const MoonIco = ({s=16}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="#B8C8E0" stroke="#7A9AB8" strokeWidth="1.3">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const LeafIco = ({s=16}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="#B8D8B8" stroke="#6A9A6A" strokeWidth="1.3">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1c.24.29 1.46 1 2.29 1 8 0 14-8 14-14 0-.34-.04-.67-.09-1L17 8z"/>
    <line x1="3.82" y1="19.34" x2="13" y2="14" stroke="#6A9A6A" strokeWidth="1.3"/>
  </svg>
);
const FlameIco = ({s=16}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="#E8C4B0" stroke="#B89080" strokeWidth="1.2">
    <path d="M12 2c0 0-5 5-5 10a5 5 0 0010 0c0-3-2-5-2-5s-1 3-3 3-1-3 0-8z"/>
  </svg>
);
const StarIco = ({s=16, filled=false}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={filled?"#F0E8C0":"none"} stroke={filled?"#C8B870":"#C4BDB0"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const TargetIco = ({s=14}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#A8C9B0" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="#A8C9B0"/>
  </svg>
);
const PencilIco = ({s=14}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#B8C8D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const HeartIco = ({s=14, filled=false}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={filled?"#E8B8C0":"none"} stroke={filled?"#C08090":"#C4BDB0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const SproutIco = ({s=20}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#A8C9B0" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22V12"/><path d="M12 12C12 7 7 4 4 6c0 4 4 6 8 6z"/><path d="M12 12c0-5 5-8 8-6 0 4-4 6-8 6z"/>
  </svg>
);

const Cb = ({on,toggle,style:st}) => (
  <div className={`cb ${on?'on':''}`} onClick={toggle} style={st}>
    {on&&<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="#F6F3EE" strokeWidth="1.5" strokeLinecap="round"/></svg>}
  </div>
);
const CatBadge = ({cat,lang="en"}) => (
  <span className="cat-pill" style={{background:CAT_COLOR[cat]||"#F0F0E8",color:CAT_TEXT[cat]||"#4A4A2A"}}>{catDisplay(lang,cat)}</span>
);


// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const OB_STEPS = [
  "language","welcome","concepts","name","goals","routines","notifications","done"
];

const LANGUAGES = [
  {code:"en",flag:"🇬🇧",label:"English"},
  {code:"no",flag:"🇳🇴",label:"Norsk"},
  {code:"sv",flag:"🇸🇪",label:"Svenska"},
  {code:"da",flag:"🇩🇰",label:"Dansk"},
  {code:"de",flag:"🇩🇪",label:"Deutsch"},
  {code:"es",flag:"🇪🇸",label:"Español"},
];


// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({show, onDone}) {
  const ref = useRef();
  useEffect(()=>{
    if(!show) return;
    const canvas = ref.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Dusty blue, rose, green palette
    const colors = ['#A8C9B0','#C8DFC9','#B5D4BC','#C4899A','#D4A8B4','#E8D5DA','#7BAFC4','#C8DDE8'];
    const particles = Array.from({length:90},()=>({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height*0.3 - canvas.height*0.1,
      r: Math.random()*5+3,
      d: Math.random()*2+1,
      color: colors[Math.floor(Math.random()*colors.length)],
      tilt: Math.random()*10-5,
      tiltAngle: 0,
      tiltInc: Math.random()*0.07+0.05,
      shape: Math.random()>0.5?'circle':'rect',
    }));
    let frame = 0;
    let raf;
    const draw = ()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame/90);
        if(p.shape==='circle'){
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
        } else {
          ctx.translate(p.x,p.y);ctx.rotate(p.tiltAngle);
          ctx.fillRect(-p.r/2,-p.r*1.5,p.r,p.r*2.5);
        }
        ctx.restore();
        p.y += p.d*3; p.tiltAngle += p.tiltInc; p.x += Math.sin(frame*0.02+p.d)*1.5;
      });
      frame++;
      if(frame<100) raf = requestAnimationFrame(draw);
      else { ctx.clearRect(0,0,canvas.width,canvas.height); onDone&&onDone(); }
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[show]);
  if(!show) return null;
  return <canvas ref={ref} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:999}}/>;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg,show}) {
  if(!show) return null;
  return (
    <div style={{position:'fixed',bottom:80,left:'50%',transform:'translateX(-50%)',background:'var(--dark)',color:'#F6F3EE',padding:'9px 18px',borderRadius:20,fontSize:13,zIndex:500,animation:'toastIn .25s ease',pointerEvents:'none',whiteSpace:'nowrap'}}>
      {msg}
    </div>
  );
}
// ─── ROUTINE INPUTS ───────────────────────────────────────────────────────────
function RoutineInputs({label, icon, r, setR, lang}) {
  const t = (en,no,de,es,sv,da) => lang==="en"?en:lang==="no"?no:lang==="de"?de:lang==="es"?es:lang==="sv"?sv:lang==="da"?da:no;
  return (
    <div style={{marginBottom:18}}>
      <p style={{fontSize:12,fontWeight:500,marginBottom:8,color:"#2A2318",display:"flex",alignItems:"center",gap:6}}>{icon}{label}</p>
      {r.map((item,i)=>(
        <div key={i} style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
          <input type="text"
            placeholder={t("E.g. Drink water","F.eks. Drikk vann","Z.B. Wasser trinken","Ej. Beber agua","T.ex. Drick vatten","F.eks. Drik vand")}
            value={item.text}
            onChange={e=>{const u=[...r];u[i]={...u[i],text:e.target.value};setR(u);}}
            style={{flex:1}}/>
          {r.length>1&&(
            <button className="bi" onClick={()=>setR(r.filter((_,j)=>j!==i))}>
              <Ico d="M6 18L18 6M6 6l12 12" s={12}/>
            </button>
          )}
        </div>
      ))}
      <button onClick={()=>setR([...r,{text:"",done:false}])}
        style={{fontSize:12,color:"#A8C9B0",background:"none",border:"none",cursor:"pointer",padding:0,marginTop:2}}>
        + {t("Add step","Legg til","Hinzufügen","Añadir","Lägg till","Tilføj")}
      </button>
    </div>
  );
}


function Onboarding({onDone}) {
  const [step,setStep] = useState(0);
  const [lang,setLang] = useState("en");
  const [name,setName] = useState("");
  const [goals,setGoals] = useState([{text:"",cat:"Personlig",subs:[]}]);
  const [morningR,setMorningR] = useState([{text:"",done:false}]);
  const [eveningR,setEveningR] = useState([{text:"",done:false}]);
  const [egenR,setEgenR] = useState([{text:"",done:false}]);
  const [morningTime,setMorningTime] = useState("07:30");
  const [eveningTime,setEveningTime] = useState("21:00");
  const [notifGranted,setNotifGranted] = useState(false);
  const [termsAccepted,setTermsAccepted] = useState(false);

  const STEPS = ["language","welcome","name","goals","routines","notifications","done"];
  const total = STEPS.length;
  const sid = STEPS[step];
  const pct = Math.round(((step+1)/total)*100);

  const t = (en,no,de,es,sv,da) => lang==="en"?en:lang==="no"?no:lang==="de"?de:lang==="es"?es:lang==="sv"?sv:lang==="da"?da:no;

  const canNext = () => {
    if(sid==="name") return name.trim().length>0;
    if(sid==="goals") return goals.filter(g=>g.text.trim()).length>=1;
    if(sid==="welcome") return termsAccepted;
    return true;
  };

  const finish = () => {
    const cleanGoals = goals.filter(g=>g.text.trim()).map((g,i)=>({
      id:Date.now()+i, text:g.text, cat:g.cat, done:false,
      starred:i<3, subs:[], deadline:""
    }));
    const routines = {
      morningRoutine: morningR.filter(r=>r.text.trim()),
      eveningRoutine: eveningR.filter(r=>r.text.trim()),
      egenRoutine: egenR.filter(r=>r.text.trim()),
    };
    onDone({name, goals:cleanGoals, routines, morningTime, eveningTime, lang});
  };

  const next = () => { if(step>=total-1){finish();return;} setStep(s=>s+1); };
  const back = () => setStep(s=>s-1);



  return (
    <div className="ob-overlay">
      <div className="ob-card fade">

        {/* Progress */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
          <div style={{flex:1,height:3,background:"#EDE8E0",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:"#A8C9B0",borderRadius:2,transition:"width .4s ease"}}/>
          </div>
          <span style={{fontSize:10,color:"#8A7E6E",flexShrink:0}}>{step+1}/{total}</span>
        </div>

        {/* ── LANGUAGE ── */}
        {sid==="language"&&(
          <>
            <h2 className="ob-title">Choose language<br/><span style={{fontSize:18,color:"#8A7E6E"}}>Velg språk</span></h2>
            <p className="ob-sub" style={{marginBottom:16}}>Can be changed in settings · Kan endres i innstillinger</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {LANGUAGES.map(l=>(
                <button key={l.code} onClick={()=>setLang(l.code)}
                  style={{padding:"12px 14px",border:`1.5px solid ${lang===l.code?"#A8C9B0":"#E2DDD3"}`,borderRadius:10,
                    background:lang===l.code?"#EAF3EC":"#FAFAF7",color:"#2A2318",cursor:"pointer",
                    display:"flex",alignItems:"center",gap:10,fontSize:14,transition:"all .15s",fontFamily:"DM Sans,sans-serif"}}>
                  <span style={{fontSize:22}}>{l.flag}</span>{l.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── WELCOME ── */}
        {sid==="welcome"&&(
          <>
            <div style={{textAlign:"center",marginBottom:16}}>
              <SproutIco s={40}/>
            </div>
            <h2 className="ob-title" style={{textAlign:"center"}}>
              {t("Welcome to My Quarter","Velkommen til Mitt Kvartal","Willkommen bei My Quarter","Bienvenido a My Quarter","Välkommen till My Quarter","Velkommen til Mitt Kvartal")}
            </h2>
            <p className="ob-sub" style={{textAlign:"center"}}>
              {t("Your personal 90-day guide to focus, progress and growth. Set goals, build routines and celebrate progress – day by day.",
                "Din personlige guide til 90 dager med fokus, fremgang og selvutvikling. Sett mål, bygg rutiner og feir fremgangen din – dag for dag.",
                "Dein persönlicher 90-Tage-Leitfaden für Fokus und Wachstum.",
                "Tu guía personal de 90 días para enfoque, progreso y crecimiento.",
                "Din personliga 90-dagars guide för fokus och tillväxt.",
                "Din personlige 90-dages guide til fokus og vækst.")}
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
              {[
                {icon:<TargetIco s={16}/>, text:t("Set and track quarterly goals","Sett og følg opp kvartalsmål","Setze und verfolge Quartalsziele","Establece y rastrea objetivos trimestrales","Sätt och följ kvartals mål","Sæt og følg kvartalsmål")},
                {icon:<SunIco s={16}/>, text:t("Build morning & evening routines","Bygg morgen- og kveldsrutiner","Aufbau von Morgen- & Abendroutinen","Construye rutinas de mañana y tarde","Bygg morgon- & kvällsrutiner","Byg morgen- og aftenrutiner")},
                {icon:<LeafIco s={16}/>, text:t("Track habits month by month","Spor vaner måned for måned","Verfolge Gewohnheiten Monat für Monat","Rastrea hábitos mes a mes","Spåra vanor månad för månad","Følg vaner måned for måned")},
                {icon:<PencilIco s={16}/>, text:t("Journal your thoughts daily","Skriv daglig journal","Schreibe täglich im Tagebuch","Escribe tu diario diariamente","Journalför dina tankar dagligen","Journaliser dine tanker dagligt")},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"#F5F2ED",borderRadius:8}}>
                  {row.icon}
                  <span style={{fontSize:13,color:"#2A2318"}}>{row.text}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginTop:16,padding:"10px 12px",background:"#F5F2ED",borderRadius:8}}>
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)}
                style={{width:"auto",marginTop:2,flexShrink:0,accentColor:"#A8C9B0"}}/>
              <label htmlFor="terms" style={{fontSize:11,color:"#5A5040",lineHeight:1.7,cursor:"pointer"}}>
                {t(
                  "I have read and agree to the Terms & Conditions. I understand that My Quarter does not provide medical, psychological or financial advice, and that I use the app at my own discretion.",
                  "Jeg har lest og godtar brukervilkårene og personvernerklæringen. Jeg forstår at Mitt Kvartal ikke gir medisinsk, psykologisk eller finansiell rådgivning, og at jeg bruker appen etter eget skjønn.",
                  "Ich habe die Nutzungsbedingungen und Datenschutzerklärung gelesen und stimme ihnen zu. Ich verstehe, dass My Quarter keine medizinische, psychologische oder finanzielle Beratung bietet.",
                  "He leído y acepto los Términos de servicio y la Política de privacidad. Entiendo que My Quarter no proporciona asesoramiento médico, psicológico ni financiero.",
                  "Jag har läst och godkänner användarvillkoren och integritetspolicyn. Jag förstår att My Quarter inte ger medicinsk, psykologisk eller ekonomisk rådgivning.",
                  "Jeg har læst og accepterer servicevilkårene og privatlivspolitikken. Jeg forstår, at My Quarter ikke yder medicinsk, psykologisk eller finansiel rådgivning."
                )}
              </label>
            </div>
          </>
        )}

        {/* ── NAME ── */}
        {sid==="name"&&(
          <>
            <h2 className="ob-title">{t("What's your name?","Hva heter du?","Wie heißt du?","¿Cómo te llamas?","Vad heter du?","Hvad hedder du?")}</h2>
            <p className="ob-sub">{t("We'll use it to personalise your experience.","Vi bruker det for å gi deg en personlig opplevelse.","Wir verwenden es für eine persönliche Erfahrung.","Lo usaremos para personalizar tu experiencia.","Vi använder det för att anpassa din upplevelse.","Vi bruger det til at personliggøre din oplevelse.")}</p>
            <input autoFocus type="text"
              placeholder={t("Your name","Ditt navn","Dein Name","Tu nombre","Ditt namn","Dit navn")}
              value={name}
              onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&canNext()&&next()}
              style={{fontSize:18,fontFamily:"Cormorant Garamond,serif",fontWeight:300,padding:"10px 12px"}}/>
          </>
        )}

        {/* ── GOALS ── */}
        {sid==="goals"&&(
          <>
            <h2 className="ob-title">{t("What do you want to achieve?","Hva ønsker du å oppnå?","Was möchtest du erreichen?","¿Qué quieres lograr?","Vad vill du uppnå?","Hvad ønsker du at opnå?")}</h2>
            <p className="ob-sub" style={{marginBottom:12}}>
              {t("Write down all the goals you want to achieve this quarter. Try to write as many as possible!",
                "Skriv ned alle målene du vil oppnå dette kvartalet. Prøv å skrive så mange som mulig!",
                "Schreibe alle Ziele auf, die du dieses Quartal erreichen möchtest.",
                "Escribe todos los objetivos que quieres lograr este trimestre.",
                "Skriv ner alla mål du vill uppnå det här kvartalet.",
                "Skriv alle de mål, du vil nå dette kvartal.")}
            </p>

            {/* Priority explanation */}
            <div style={{marginBottom:12,borderRadius:10,overflow:"hidden",border:"1px solid #C8DFC9"}}>
              <div style={{background:"#EAF3EC",padding:"10px 12px",borderBottom:"1px solid #C8DFC9"}}>
                <p style={{fontSize:12,fontWeight:600,color:"#2A2318",display:"flex",alignItems:"center",gap:6}}>
                  <StarIco s={14} filled={true}/>
                  {t("The first 3 goals = your quarterly priorities","De 3 første målene = dine kvartalsprioriteringer","Die ersten 3 Ziele = deine Quartalsprioritäten","Los primeros 3 objetivos = tus prioridades trimestrales","De 3 första målen = dina kvartalsprioriteter","De første 3 mål = dine kvartalsprioriteter")}
                </p>
              </div>
              <div style={{background:"#F5F2ED",padding:"10px 12px"}}>
                <p style={{fontSize:12,color:"#5A5040",lineHeight:1.65}}>
                  {t("These show on your overview every day. You can check them off as you make progress – and set a daily task towards one of them each morning.",
                    "Disse vises på oversiktsiden din hver dag. Du kan huke dem av etter hvert som du gjør fremgang – og sette en daglig oppgave mot ett av dem hver morgen.",
                    "Diese erscheinen täglich in deiner Übersicht. Du kannst sie abhaken, wenn du Fortschritte machst.",
                    "Estos aparecen en tu resumen cada día. Puedes marcarlos a medida que avanzas.",
                    "Dessa visas i din översikt varje dag. Du kan bocka av dem när du gör framsteg.",
                    "Disse vises i din oversigt hver dag. Du kan markere dem, når du gør fremskridt.")}
                </p>
              </div>
            </div>

            {/* Goal inputs */}
            {goals.map((g,i)=>(
              <div key={i} style={{marginBottom:8}}>
                {i===0&&<p style={{fontSize:10,textTransform:"uppercase",letterSpacing:".06em",color:"#A8C9B0",marginBottom:6,display:"flex",alignItems:"center",gap:4}}><StarIco s={10} filled={true}/>{t("Priority goals (1–3)","Prioriterte mål (1–3)","Prioritätsziele (1–3)","Objetivos prioritarios (1–3)","Prioritetsmål (1–3)","Prioriterede mål (1–3)")}</p>}
                {i===3&&<p style={{fontSize:10,textTransform:"uppercase",letterSpacing:".06em",color:"#C4BDB0",marginBottom:6,marginTop:4}}>{t("More goals","Flere mål","Weitere Ziele","Más objetivos","Fler mål","Flere mål")}</p>}
                <div style={{display:"flex",gap:6,alignItems:"center",padding:"8px 10px",background:i<3?"#EAF3EC":"#FAFAF7",borderRadius:8,border:`1px solid ${i<3?"#C8DFC9":"#E2DDD3"}`}}>
                  <span style={{flexShrink:0}}>{i<3?<StarIco s={13} filled={true}/>:<span style={{fontSize:11,color:"#C4BDB0",width:13,display:"inline-block",textAlign:"center"}}>{i+1}</span>}</span>
                  <input type="text"
                    placeholder={i<3
                      ? t(`Priority goal ${i+1}…`,`Prioritert mål ${i+1}…`,`Prioritätsziel ${i+1}…`,`Objetivo prioritario ${i+1}…`,`Prioritetsmål ${i+1}…`,`Prioriteret mål ${i+1}…`)
                      : t(`Goal ${i+1}…`,`Mål ${i+1}…`,`Ziel ${i+1}…`,`Objetivo ${i+1}…`,`Mål ${i+1}…`,`Mål ${i+1}…`)}
                    value={g.text}
                    onChange={e=>{const u=[...goals];u[i]={...u[i],text:e.target.value};setGoals(u);}}
                    style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:13,padding:0}}/>
                  <select value={g.cat} onChange={e=>{const u=[...goals];u[i]={...u[i],cat:e.target.value};setGoals(u);}}
                    style={{width:"auto",fontSize:11,padding:"3px 5px",flexShrink:0,background:"transparent",border:"1px solid #E2DDD3",borderRadius:6}}>
                    {getCats(lang).map((label,ci)=><option key={CATS[ci]} value={CATS[ci]}>{label}</option>)}
                  </select>
                  {goals.length>1&&(
                    <button className="bi" onClick={()=>setGoals(goals.filter((_,j)=>j!==i))}>
                      <Ico d="M6 18L18 6M6 6l12 12" s={11}/>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={()=>setGoals([...goals,{text:"",cat:"Personlig",subs:[]}])}
              style={{fontSize:12,color:"#A8C9B0",background:"none",border:"none",cursor:"pointer",padding:"6px 0",display:"flex",alignItems:"center",gap:4,marginTop:4}}>
              + {t("Add another goal","Legg til et mål til","Weiteres Ziel","Añadir objetivo","Lägg till mål","Tilføj mål")}
            </button>
            <p style={{fontSize:10,color:"#C4BDB0",marginTop:6,lineHeight:1.5}}>
              {t("You can add sub-goals and change categories in My Goals after setup.","Du kan legge til delmål og endre kategorier i Mine mål etter oppsett.","Du kannst Unterziele nach der Einrichtung hinzufügen.","Puedes añadir subobjetivos después de la configuración.","Du kan lägga till delmål efter inställningen.","Du kan tilføje delmål efter opsætning.")}
            </p>
          </>
        )}

        {/* ── ROUTINES ── */}
        {sid==="routines"&&(
          <>
            <h2 className="ob-title">{t("Build your routines","Bygg rutinene dine","Baue deine Routinen auf","Construye tus rutinas","Bygg dina rutiner","Byg dine rutiner")}</h2>
            <p className="ob-sub" style={{marginBottom:8}}>
              {t("Routines are the foundation of lasting habits. A strong morning routine sets the tone for the day – a calm evening routine helps you wind down and prepare for tomorrow.",
                "Rutiner er grunnmuren i varige vaner. En god morgenrutine setter tonen for dagen – en rolig kveldsrutine hjelper deg å roe ned og forberede deg til i morgen.",
                "Routinen sind die Grundlage dauerhafter Gewohnheiten. Eine starke Morgenroutine setzt den Ton für den Tag.",
                "Las rutinas son la base de los hábitos duraderos. Una buena rutina matutina marca el tono del día.",
                "Rutiner är grunden för bestående vanor. En stark morgenrutin sätter tonen för dagen.",
                "Rutiner er grundlaget for varige vaner. En god morgenrutine sætter tonen for dagen.")}
            </p>
            <div style={{display:"flex",gap:6,marginBottom:12,padding:"7px 10px",background:"#F5F2ED",borderRadius:8}}>
              <span style={{fontSize:12,color:"#A8C9B0",flexShrink:0,marginTop:1}}>💡</span>
              <span style={{fontSize:11,color:"#5A5040",lineHeight:1.6}}>
                {t("Start small – 3 to 5 items is ideal. You can always add more later. Consistency beats perfection.","Start enkelt – 3 til 5 punkter er ideelt. Du kan alltid legge til mer. Konsistens slår perfeksjon.","Fange klein an – 3 bis 5 Punkte sind ideal. Du kannst später immer mehr hinzufügen.","Empieza pequeño – 3 a 5 elementos es ideal. Siempre puedes añadir más.","Börja litet – 3 till 5 punkter är idealiskt. Du kan alltid lägga till mer.","Start småt – 3 til 5 punkter er ideelt. Du kan altid tilføje mere.")}
              </span>
            </div>
            <RoutineInputs label={t("Morning routine","Morgenrutine","Morgenroutine","Rutina mañana","Morgenrutin","Morgenrutine")} icon={<SunIco s={14}/>} r={morningR} setR={setMorningR} lang={lang}/>
            <RoutineInputs label={t("Evening routine","Kveldsrutine","Abendroutine","Rutina tarde","Kvällsrutin","Aftenrutine")} icon={<MoonIco s={14}/>} r={eveningR} setR={setEveningR} lang={lang}/>
            <RoutineInputs label={t("My habits","Mine vaner","Meine Gewohnheiten","Mis hábitos","Mina vanor","Mine vaner")} icon={<LeafIco s={14}/>} r={egenR} setR={setEgenR} lang={lang}/>
          </>
        )}

        {/* ── NOTIFICATIONS ── */}
        {sid==="notifications"&&(
          <>
            <h2 className="ob-title">{t("Notifications","Varsler","Benachrichtigungen","Notificaciones","Aviseringar","Notifikationer")}</h2>
            <p className="ob-sub">{t("Get a morning overview and evening reminder at the right time. You can change this in settings.","Få morgenoversikt og kveldspåminnelse til riktig tid. Du kan endre dette i innstillinger.","Erhalte eine Morgenübersicht und Abendeingabe. Du kannst dies in den Einstellungen ändern.","Obtén una vista matutina y un recordatorio nocturno. Puedes cambiarlo en configuración.","Få en morgonutblick och kvällspåminnelse. Du kan ändra detta i inställningar.","Få en morgenoversigt og aftenpåmindelse. Du kan ændre dette i indstillinger.")}</p>
            <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label style={{fontSize:12,color:"#8A7E6E",display:"flex",alignItems:"center",gap:5}}><SunIco s={12}/>{t("Morning","Morgen","Morgen","Mañana","Morgon","Morgen")}</label>
                <input type="time" value={morningTime} onChange={e=>setMorningTime(e.target.value)} style={{width:120}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label style={{fontSize:12,color:"#8A7E6E",display:"flex",alignItems:"center",gap:5}}><MoonIco s={12}/>{t("Evening","Kveld","Abend","Tarde","Kväll","Aften")}</label>
                <input type="time" value={eveningTime} onChange={e=>setEveningTime(e.target.value)} style={{width:120}}/>
              </div>
            </div>
            <button className="btn bd" onClick={async()=>{const ok=await requestNotif();setNotifGranted(ok);}}>
              {notifGranted
                ?(t("✓ Notifications enabled","✓ Varsler aktivert","✓ Benachrichtigungen aktiviert","✓ Notificaciones activadas","✓ Aviseringar aktiverade","✓ Notifikationer aktiveret"))
                :(t("Enable notifications","Aktiver varsler","Benachrichtigungen aktivieren","Activar notificaciones","Aktivera aviseringar","Aktiver notifikationer"))}
            </button>
            <p style={{fontSize:11,color:"#8A7E6E",marginTop:10,lineHeight:1.7}}>
              {t("You can skip this step and enable notifications later in settings.","Du kan hoppe over dette steget og aktivere varsler i innstillinger.",
                "Du kannst diesen Schritt überspringen und später aktivieren.","Puedes omitir este paso y activar más tarde.","Du kan hoppa över detta steg och aktivera senare.","Du kan springe dette trin over og aktivere senere.")}
            </p>
          </>
        )}

        {/* ── DONE ── */}
        {sid==="done"&&(
          <>
            <div style={{textAlign:"center",marginBottom:16}}><SproutIco s={44}/></div>
            <h2 className="ob-title" style={{textAlign:"center"}}>
              {name
                ? t(`You're all set, ${name}!`,`Alt er klart, ${name}!`,`Alles bereit, ${name}!`,`¡Todo listo, ${name}!`,`Allt klart, ${name}!`,`Alt er klar, ${name}!`)
                : t("You're all set!","Alt er klart!","Alles bereit!","¡Todo listo!","Allt klart!","Alt er klar!")}
            </h2>
            {(()=>{
              const now3=new Date();
              const qe3=new Date(now3.getFullYear(),Math.floor(now3.getMonth()/3)*3+3,0);
              const dLeft=Math.max(1,Math.round((qe3-now3)/86400000));
              const goalCount=goals.filter(g=>g.text.trim()).length;
              const qLabel3=`Q${Math.floor(now3.getMonth()/3)+1} ${now3.getFullYear()}`;
              return (
                <p className="ob-sub" style={{textAlign:"center"}}>
                  {t(
                    `You've set up ${goalCount} ${goalCount===1?"goal":"goals"} for ${qLabel3}. You have ${dLeft} ${dLeft===1?"day":"days"} left in this quarter – make them count.`,
                    `Du har satt opp ${goalCount} mål for ${qLabel3}. Du har ${dLeft} ${dLeft===1?"dag":"dager"} igjen av dette kvartalet – gjør dem verdt det.`,
                    `Du hast ${goalCount} Ziele für ${qLabel3} eingerichtet. Noch ${dLeft} Tage im Quartal.`,
                    `Has configurado ${goalCount} objetivos para ${qLabel3}. Te quedan ${dLeft} días en este trimestre.`,
                    `Du har ställt in ${goalCount} mål för ${qLabel3}. Du har ${dLeft} dagar kvar av kvartalet.`,
                    `Du har oprettet ${goalCount} mål for ${qLabel3}. Du har ${dLeft} dage tilbage af kvartalet.`
                  )}
                </p>
              );
            })()}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
              {[
                t("Check the app every morning and evening","Sjekk appen hver morgen og kveld","Überprüfe die App jeden Morgen und Abend","Revisa la app cada mañana y noche","Kolla appen varje morgon och kväll","Tjek appen hver morgen og aften"),
                t("Set one focused daily goal","Sett ett fokusert daglig mål","Setze täglich ein fokussiertes Ziel","Establece un objetivo diario","Sätt ett fokuserat dagligt mål","Sæt et fokuseret dagligt mål"),
                t("Write your next step each evening","Skriv ditt neste steg hver kveld","Schreibe deinen nächsten Schritt jeden Abend","Escribe tu siguiente paso cada noche","Skriv ditt nästa steg varje kväll","Skriv dit næste skridt hver aften"),
                t("Evaluate your week in Journal","Evaluer uken din i Journal","Bewerte deine Woche im Journal","Evalúa tu semana en el diario","Utvärdera din vecka i Journal","Evaluer din uge i Journal"),
              ].map((tip,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 10px",background:"#F5F2ED",borderRadius:8}}>
                  <span style={{color:"#A8C9B0",fontSize:12,marginTop:1,flexShrink:0}}>✓</span>
                  <span style={{fontSize:12,color:"#2A2318",lineHeight:1.5}}>{tip}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="ob-actions">
          {sid!=="done"?(
            <>
              <button className="btn bd" onClick={next} disabled={!canNext()}>
                {step>=total-2
                  ? t("Start →","Start reisen →","Starten →","Comenzar →","Starta →","Start →")
                  : t("Next →","Neste →","Weiter →","Siguiente →","Nästa →","Næste →")}
              </button>
              {step>0&&<button className="btn bo" onClick={back}>{t("Back","Tilbake","Zurück","Atrás","Tillbaka","Tilbage")}</button>}
              {!["name","goals"].includes(sid)&&step>0&&(
                <button className="btn bo" style={{marginLeft:"auto"}} onClick={next}>
                  {t("Skip","Hopp over","Überspringen","Saltar","Hoppa över","Spring over")}
                </button>
              )}
            </>
          ):(
            <button className="btn bd" style={{fontSize:15,padding:"12px 28px",width:"100%"}} onClick={finish}>
              {t("Open My Quarter →","Åpne Mitt Kvartal →","My Quarter öffnen →","Abrir My Quarter →","Öppna My Quarter →","Åbn My Quarter →")}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────
function FeedbackModal({onClose, lang}) {
  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");
  const [sending,setSending] = useState(false);
  const [sent,setSent] = useState(false);
  const [error,setError] = useState("");

  const lbl = (en,no) => lang==="en"?en:no;

  const send = async () => {
    if(!email.trim()||!msg.trim()) return;
    setSending(true);
    setError("");
    try {
      // EmailJS - free, no backend needed, works in browser, no activation required
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          service_id: "service_gmail",
          template_id: "template_contact",
          user_id: "placeholder",
          template_params: {
            from_email: email.trim(),
            message: msg.trim(),
            to_email: "ijonlyfoot@gmail.com",
          }
        })
      });
      // EmailJS requires setup - fallback to mailto which always works
      throw new Error("use mailto");
    } catch {
      // Reliable fallback: open mail client with pre-filled content
      const subject = encodeURIComponent("My Quarter – Kontakt");
      const body = encodeURIComponent("Fra: " + email.trim() + "\n\n" + msg.trim());
      window.open("mailto:ijonlyfoot@gmail.com?subject=" + subject + "&body=" + body);
      setSent(true);
    }
    setSending(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#F6F3EE",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:480,boxShadow:"0 -4px 24px rgba(0,0,0,.15)"}}>
        {/* Handle */}
        <div style={{width:36,height:4,background:"#E2DDD3",borderRadius:2,margin:"0 auto 20px"}}/>

        {sent ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <p style={{fontSize:32,marginBottom:12}}>✓</p>
            <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,marginBottom:8}}>
              {lbl("Thank you!","Takk!")}
            </h3>
            <p style={{fontSize:14,color:"#8A7E6E",lineHeight:1.6,marginBottom:20}}>
              {lbl("Your message has been sent. Thank you!","Meldingen din er sendt. Tusen takk!")}
            </p>
            <button className="btn bd" onClick={onClose} style={{width:"100%",justifyContent:"center"}}>
              {lbl("Close","Lukk")}
            </button>
          </div>
        ) : (
          <>
            <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,marginBottom:6}}>
              {lbl("Contact us","Kontakt oss")}
            </h3>
            <p style={{fontSize:13,color:"#8A7E6E",marginBottom:16,lineHeight:1.6}}>
              {lbl("Have a question or suggestion? We would love to hear from you.","Har du et spørsmål eller forslag? Vi vil gjerne høre fra deg.")}
            </p>

            <label style={{fontSize:11,color:"#8A7E6E",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
              {lbl("Your email","Din e-post")} *
            </label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder={lbl("your@email.com","din@epost.no")}
              style={{marginBottom:12,borderColor:!email.trim()&&error?"#E88":"#E2DDD3"}}/>

            <label style={{fontSize:11,color:"#8A7E6E",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
              {lbl("Message","Melding")} *
            </label>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder={lbl("Write your message here…","Skriv meldingen din her…")}
              rows={4}
              style={{marginBottom:error?6:16,resize:"none",borderColor:!msg.trim()&&error?"#E88":"#E2DDD3"}}/>

            {error&&<p style={{fontSize:12,color:"#C05050",marginBottom:12}}>{error}</p>}

            <button className="btn bd" onClick={()=>{
              if(!email.trim()||!msg.trim()){setError(lbl("Please fill in both fields.","Fyll inn begge feltene."));return;}
              if(!email.includes("@")){setError(lbl("Please enter a valid email.","Skriv inn en gyldig e-postadresse."));return;}
              send();
            }} disabled={sending} style={{width:"100%",justifyContent:"center",opacity:sending?.6:1}}>
              {sending?"...":(lbl("Send message","Send melding"))}
            </button>
          </>
        )}
      </div>
    </div>
  );
}


// ─── NAV ──────────────────────────────────────────────────────────────────────
const TABS = [
  {id:"dashboard",label:"overview",ico:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"},
  {id:"goals",label:"myGoals",ico:"M9 12l2 2 4-4|M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"},
  {id:"planner",label:"planner",ico:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"},
  {id:"routine",label:"myRoutine",ico:"M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"},
  {id:"journal",label:"journal",ico:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572z"},
  {id:"settings",label:"settings",ico:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z|M15 12a3 3 0 11-6 0 3 3 0 016 0z"},
];
const BOTTOM_TABS = ["dashboard","goals","planner","routine","journal"];

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab] = useState("dashboard");
  const [menuOpen,setMenuOpen] = useState(false);
  const [feedbackOpen,setFeedbackOpen] = useState(false);
  const [onboarded,setOnboarded] = useState(()=>load("v4_ob",false));
  const [trialStart] = useState(()=>{ const s=load("v4_trial_start",null); if(!s){const n=Date.now();localStorage.setItem("v4_trial_start",JSON.stringify(n));return n;} return s; });
  const [confetti,setConfetti] = useState(false);
  const [toast,setToast] = useState({show:false,msg:""});
  const showConfetti = (msg) => { setConfetti(false); requestAnimationFrame(()=>{ setConfetti(true); setToast({show:true,msg:msg||"✓"}); setTimeout(()=>{setConfetti(false);setToast({show:false,msg:""});},2500); }); };
  const [lang,setLang] = useState(()=>load("v4_lang","en"));
  const [userName,setUserName] = useState(()=>load("v4_name",""));
  const [goals,setGoals] = useState(()=>load("v4_goals",[]));
  const [dayData,setDayData] = useState(()=>load("v4_day",{}));
  const [journalEntries,setJournalEntries] = useState(()=>load("v4_journal",{}));
  const [selectedDay,setSelectedDay] = useState(todayKey());
  const [weeklyGoals,setWeeklyGoals] = useState(()=>load("v4_wg",{}));
  const [monthlyData,setMonthlyData] = useState(()=>load("v4_mo",{}));
  const [evals,setEvals] = useState(()=>load("v4_evals",{}));

  useEffect(()=>{save("v4_goals",goals);},[goals]);
  useEffect(()=>{save("v4_day",dayData);},[dayData]);
  useEffect(()=>{save("v4_journal",journalEntries);},[journalEntries]);
  useEffect(()=>{save("v4_wg",weeklyGoals);},[weeklyGoals]);
  useEffect(()=>{save("v4_mo",monthlyData);},[monthlyData]);
  useEffect(()=>{save("v4_evals",evals);},[evals]);
  useEffect(()=>{save("v4_name",userName);},[userName]);

  const now = new Date();
  const ql = qLabel(now);
  const qs = qStart(now);
  const qe = qEnd(now);

  // Total goals + subs count
  const trialDaysLeft = Math.max(0, 7 - Math.floor((Date.now() - trialStart) / 86400000));
  const trialExpired = trialDaysLeft === 0 && trialStart > 0;

  const allGoalItems = goals.reduce((acc,g)=>{
    acc.total += 1 + (g.subs?.length||0);
    acc.done += (g.done?1:0) + (g.subs?.filter(s=>s.done).length||0);
    return acc;
  },{total:0,done:0});

  const updateDay = (k,f,v) => setDayData(d=>({...d,[k]:{...(d[k]||{}),[f]:v}}));
  const getDayField = (k,f,def="") => dayData[k]?.[f]??def;
  const openDay = (dk) => {setSelectedDay(dk);setTab("daily");};
  const navTab = (t) => {setTab(t);setMenuOpen(false);};

  const handleOnboardDone = ({name,goals:g,routines,morningTime,eveningTime,lang:l}) => {
    if(l){setLang(l);save("v4_lang",l);}
    setUserName(name);
    setGoals(g);
    const dk = todayKey();
    setDayData(d=>({...d,[dk]:{...(d[dk]||{}),...routines}}));
    save("morningTime",morningTime);
    save("eveningTime",eveningTime);
    setOnboarded(true);
    save("v4_ob",true);
  };

  const TT = {
    dashboard:{t:T(lang,"overview"),s:ql},
    goals:{t:T(lang,"myGoals"),s:`${allGoalItems.done}/${allGoalItems.total}`},
    planner:{t:T(lang,"planner"),s:fmtDate(parseKey(selectedDay),lang)},
    routine:{t:T(lang,"myRoutine"),s:""},
    journal:{t:T(lang,"journal"),s:""},
    settings:{t:T(lang,"settings"),s:""},
  };

  const calcStreak = () => {
    let s=0,d=new Date();
    while(true){const k=toKey(d);if(!dayData[k]?.goalCompleted)break;s++;d.setDate(d.getDate()-1);}
    return s;
  };
  const streak = calcStreak();
  const shared = {goals,setGoals,dayData,updateDay,getDayField,lang,setLang,setUserName,showConfetti,streak,
    journalEntries,setJournalEntries,
    selectedDay,setSelectedDay,weeklyGoals,setWeeklyGoals,
    monthlyData,setMonthlyData,evals,setEvals,openDay,ql,qs,qe,
    userName,allGoalItems};

  const VIEWS = {dashboard:DashboardView,goals:GoalsView,
    planner:PlannerView,routine:RoutineView,
    journal:JournalView,settings:SettingsView};
  const ActiveView = VIEWS[tab]||DashboardView;

  return (
    <>
      <style>{STYLE}</style>
      {!onboarded&&<Onboarding onDone={handleOnboardDone}/>}
      <div className="app">
        {menuOpen&&<div className="sb-overlay show" onClick={()=>setMenuOpen(false)}/>}
        <aside className={`sb ${menuOpen?'open':''}`}>
          <div className="sb-top">
            <p className="sb-q">{ql}</p>
            <p className="sb-name">{userName||"My Quarter"}</p>
            <p className="sb-date">{now.toLocaleDateString(lang==="en"?"en-GB":lang==="de"?"de-DE":lang==="es"?"es-ES":lang==="sv"?"sv-SE":lang==="da"?"da-DK":"nb-NO",{weekday:"long",day:"numeric",month:"long"})}</p>
            <div className="sb-counter">
              <div className="sb-nums">{allGoalItems.done}<span style={{fontSize:14,color:"#8A7E6E"}}>/{allGoalItems.total}</span></div>
              <div className="sb-clabel">{lang==="en"?"goals completed":lang==="de"?"Ziele erreicht":lang==="es"?"objetivos completados":lang==="sv"?"mål uppnådda":lang==="da"?"mål opnået":"mål og delmål fullført"}</div>
              <div className="sb-bar"><div className="sb-fill" style={{width:allGoalItems.total?`${(allGoalItems.done/allGoalItems.total)*100}%`:"0%"}}/></div>
            </div>
          </div>
          <nav className="sb-nav">
            <p className="ns">{lang==="en"?"Navigation":"Navigasjon"}</p>
            {TABS.map(t=>(
              <button key={t.id} className={`ni ${tab===t.id?'on':''}`} onClick={()=>navTab(t.id)}>
                <Ico d={t.ico}/>{T(lang,t.label)||t.label}
              </button>
            ))}
          </nav>
          <div className="sb-bot">
            <button className="ni" style={{width:"100%"}} onClick={()=>{setFeedbackOpen(true);setMenuOpen(false);}}>
              <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" s={16}/>
              <span>{lang==="en"?"Contact us":"Kontakt oss"}</span>
            </button>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <button className="ham" onClick={()=>setMenuOpen(o=>!o)}>
              <Ico d="M4 6h16|M4 12h16|M4 18h16" s={20}/>
            </button>
            <div style={{flex:1,minWidth:0}}>
              <div className="tb-title" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{TT[tab]?.t}</div>
              {TT[tab]?.s&&<div className="tb-sub">{TT[tab]?.s}</div>}
            </div>
            {/* Quarter stats in header */}
            {(()=>{
              const now2=new Date();
              const dInQ=Math.round((qe-qs)/86400000)+1;
              const passed=Math.max(0,Math.round((now2-qs)/86400000));
              const left=Math.max(0,dInQ-passed);
              const pct=Math.round((passed/dInQ)*100);
              const daysLeftLbl=lang==="en"?"days left":lang==="de"?"Tage übrig":lang==="es"?"días restantes":lang==="sv"?"dagar kvar":lang==="da"?"dage tilbage":"dager igjen";
              const goalsLbl=lang==="en"?"goals":lang==="de"?"Ziele":lang==="es"?"objetivos":lang==="sv"?"mål":lang==="da"?"mål":"mål";
              return (
                <div style={{display:"flex",alignItems:"center",gap:8,marginRight:4}}>
                  <div style={{textAlign:"center",lineHeight:1.2}}>
                    <div style={{fontSize:13,fontWeight:500,color:"#2A2318",fontFamily:"DM Sans,sans-serif"}}>{passed}<span style={{fontSize:10,color:"#8A7E6E",fontWeight:400}}>/{dInQ}</span></div>
                    <div style={{width:44,height:3,background:"#E2DDD3",borderRadius:2,margin:"3px auto 0",overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:"#A8C9B0",borderRadius:2,transition:"width .6s"}}/></div>
                    <div style={{fontSize:9,color:"#8A7E6E",textTransform:"uppercase",letterSpacing:".04em",marginTop:2}}>{left} {daysLeftLbl}</div>
                  </div>
                  <div style={{width:1,height:32,background:"#E2DDD3"}}/>
                  <div style={{textAlign:"center",lineHeight:1.2}}>
                    <div style={{fontSize:13,fontWeight:500,color:"#2A2318",fontFamily:"DM Sans,sans-serif"}}>{allGoalItems.done}<span style={{fontSize:10,color:"#8A7E6E",fontWeight:400}}>/{allGoalItems.total}</span></div>
                    <div style={{fontSize:9,color:"#8A7E6E",textTransform:"uppercase",letterSpacing:".04em",marginTop:2}}>{goalsLbl}</div>
                  </div>
                  {streak>0&&<>
                    <div style={{width:1,height:32,background:"#E2DDD3"}}/>
                    <div style={{display:"flex",alignItems:"center",gap:3,flexDirection:"column"}}>
                      <div style={{display:"flex",alignItems:"center",gap:2}}><FlameIco s={11}/><span style={{fontSize:13,fontWeight:500,color:"#2A2318",fontFamily:"DM Sans,sans-serif"}}>{streak}</span></div>
                      <div style={{fontSize:9,color:"#8A7E6E",textTransform:"uppercase",letterSpacing:".04em"}}>streak</div>
                    </div>
                  </>}
                </div>
              );
            })()}
          </div>
          {trialDaysLeft>0&&trialDaysLeft<=7&&(
            <div style={{background:"#EAF3EC",borderBottom:"1px solid #C8DFC9",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#4A6B50"}}>
                {lang==="en"?`Free trial: ${trialDaysLeft} day${trialDaysLeft===1?"":"s"} left`:`Prøveperiode: ${trialDaysLeft} dag${trialDaysLeft===1?"":"er"} igjen`}
              </span>
              <span style={{fontSize:11,color:"#8A7E6E"}}>{lang==="en"?"NOK 49/mo · 489/yr":"NOK 49/mnd · 489/år"}</span>
            </div>
          )}
          {trialExpired&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
              <div style={{background:"#F6F3EE",borderRadius:16,padding:28,maxWidth:340,textAlign:"center"}}>
                <SproutIco s={36}/>
                <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#2A2318",marginTop:12,marginBottom:8}}>
                  {lang==="en"?"Your free trial has ended":"Prøveperioden er over"}
                </p>
                <p style={{fontSize:13,color:"#8A7E6E",lineHeight:1.7,marginBottom:20}}>
                  {lang==="en"?"Subscribe to keep using My Quarter and all your data.":"Abonner for å fortsette å bruke Mitt Kvartal og all dataen din."}
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <button style={{background:"#2A2318",color:"#F6F3EE",border:"none",borderRadius:10,padding:"14px 20px",fontSize:14,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>
                    {lang==="en"?"Subscribe – NOK 489/year":"Abonner – NOK 489/år"}
                  </button>
                  <button style={{background:"transparent",color:"#2A2318",border:"1px solid #E2DDD3",borderRadius:10,padding:"12px 20px",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>
                    {lang==="en"?"Monthly – NOK 49/month":"Månedlig – NOK 49/mnd"}
                  </button>
                  <p style={{fontSize:10,color:"#C4BDB0",marginTop:4}}>
                    {lang==="en"?"Payments handled by Apple App Store":"Betaling håndteres av Apple App Store"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="content">
            <ActiveView {...shared}/>
          </div>
        </div>

        
        <Confetti show={confetti} onDone={()=>setConfetti(false)}/>
        {feedbackOpen&&<FeedbackModal onClose={()=>setFeedbackOpen(false)} lang={lang}/>}
        <Toast msg={toast.msg} show={toast.show}/>
        

        <nav className="bottom-nav">
          {BOTTOM_TABS.map(tid=>{
            const t=TABS.find(x=>x.id===tid);
            return (
              <button key={tid} className={`bn-item ${tab===tid?'on':''}`} onClick={()=>navTab(tid)}>
                <Ico d={t.ico} s={20}/>{T(lang,t.label)||t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}


// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({goals,setGoals,dayData,updateDay,getDayField,openDay,ql,qs,qe,userName,allGoalItems,lang,showConfetti,streak}) {
  const dk = todayKey();
  const now = new Date();
  const daysInQ = Math.round((qe-qs)/86400000)+1;
  const daysPassed = Math.max(0,Math.round((now-qs)/86400000));
  const qPct = Math.round((daysPassed/daysInQ)*100);
  const todayGoal = getDayField(dk,"goal","");
  const [editingGoal,setEditingGoal] = useState(false);
  const nextStep = getDayField(dk,"nextStep","");
  const goalCompleted = getDayField(dk,"goalCompleted",false);
  const grateful = getDayField(dk,"grateful","");
  const intention = getDayField(dk,"intention","");
  const starred = goals.filter(g=>g.starred&&!g.done).slice(0,3);

  const hr = now.getHours();
  const greet = hr<12?T(lang,"greetMorning"):hr<18?T(lang,"greetDay"):T(lang,"greetEvening");

  // Today's schedule for "today panel"
  const todaySchedule = Object.entries(getDayField(dk,"schedule",{}))
    .filter(([k,v])=>v&&!k.endsWith("_remind")&&!k.endsWith("_repeat"))
    .sort(([a],[b])=>a.localeCompare(b));
  const todayTasks = getDayField(dk,"tasks",[]).filter(t=>t.text);

  const toggleGoalDone = (id) => {
    const g = goals.find(g=>g.id===id);
    if(g&&!g.done) showConfetti&&showConfetti(lang==="en"?"Goal completed! 🎉":"Mål fullført! 🎉");
    setGoals(goals.map(g=>g.id===id?{...g,done:!g.done,starred:g.done?g.starred:false}:g));
  };

  const [expandedGoalId,setExpandedGoalId] = useState(null);
  const noStarred = lang==="en"?"No starred goals – go to My Goals":lang==="de"?"Keine priorisierten Ziele":lang==="es"?"Sin objetivos destacados":lang==="sv"?"Inga stjärnmål":lang==="da"?"Ingen stjernede mål":"Ingen stjernede mål – gå til Mine mål";

  return (
    <div className="fade">

      {/* ── Streak milestone ── */}
      {streak>0&&streak%7===0&&(
        <div className="streak-cel">
          <p style={{fontSize:14,fontWeight:500,display:"flex",alignItems:"center",gap:5}}><FlameIco s={16}/> {streak} {lang==="en"?"days in a row!":"dager på rad!"}</p>
          <p style={{fontSize:12,color:"#8A7E6E",marginTop:2}}>{lang==="en"?"You complete what you set out to do – well done!":"Du fullfører det du setter deg fore – godt jobbet!"}</p>
        </div>
      )}

      {/* ── Greeting ── */}
      <div style={{marginBottom:12,paddingBottom:12,borderBottom:"1px solid #E2DDD3"}}>
        <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#2A2318"}}>
          {lang==="en"?"Good":lang==="de"?"Guten":lang==="es"?"Buenos":lang==="sv"?"God":lang==="da"?"God":"God"} {greet}{userName?`, ${userName}`:""}
        </p>
        {editingGoal
          ? <input autoFocus type="text" value={todayGoal}
              onChange={e=>updateDay(dk,"goal",e.target.value)}
              onBlur={()=>setEditingGoal(false)}
              onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")setEditingGoal(false);}}
              placeholder={lang==="en"?"What is your most important task today?":"Hva er din viktigste oppgave i dag?"}
              style={{background:"transparent",border:"none",borderBottom:"1px solid #E2DDD3",borderRadius:0,padding:"4px 0",fontFamily:"Cormorant Garamond,serif",fontSize:15,fontWeight:300,color:"#2A2318",width:"100%",outline:"none",marginTop:6}}/>
          : <p onClick={()=>setEditingGoal(true)} style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontWeight:300,color:todayGoal?"#2A2318":"#C4BDB0",lineHeight:1.4,cursor:"text",marginTop:6}}>
              {todayGoal||(lang==="en"?"Tap to set today's goal":"Trykk for å sette dagens mål")}
            </p>
        }
      </div>

            {/* ── I dag ── */}
      <div className="card" style={{marginBottom:12}}>
        <p className="ctitle" style={{marginBottom:10}}>
          {lang==="en"?"Today":lang==="de"?"Heute":lang==="es"?"Hoy":lang==="sv"?"Idag":lang==="da"?"I dag":"I dag"}
          <span style={{fontSize:11,color:"#8A7E6E",marginLeft:6,fontWeight:300}}>{fmtDate(parseKey(dk),lang)}</span>
        </p>

        {/* Schedule */}
        {todaySchedule.length>0&&(
          <div style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid #F5F2ED"}}>
            {todaySchedule.map(([h,v])=>(
              <div key={h} style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:3}}>
                <span style={{fontSize:11,color:"#A8C9B0",width:38,flexShrink:0,fontWeight:500}}>{h.includes(":")?h:h+":00"}</span>
                <span style={{fontSize:13,color:"#2A2318"}}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tasks */}
        {todayTasks.length>0&&(
          <div>
            {todayTasks.slice(0,4).map((t,i)=>(
              <div key={i} style={{display:"flex",gap:7,alignItems:"center",marginBottom:5,cursor:"pointer"}}
                onClick={()=>{
                  const allTasks=getDayField(dk,"tasks",[]);
                  const idx=allTasks.findIndex(x=>x.text===t.text&&x.id===t.id);
                  if(idx>=0){const u=[...allTasks];u[idx]={...u[idx],done:!u[idx].done};updateDay(dk,"tasks",u);}
                }}>
                <div style={{width:13,height:13,borderRadius:3,flexShrink:0,
                  border:`1.5px solid ${t.done?"#A8C9B0":"#C4BDB0"}`,
                  background:t.done?"#A8C9B0":"transparent",transition:"all .15s"}}/>
                <span style={{fontSize:12,textDecoration:t.done?"line-through":"none",
                  color:t.done?"#C4BDB0":"#2A2318",flex:1}}>{t.text}</span>
              </div>
            ))}
            {todayTasks.length>4&&<p style={{fontSize:11,color:"#8A7E6E",marginTop:3}}>+{todayTasks.length-4} {lang==="en"?"more":"til"}</p>}
          </div>
        )}

        {!todayGoal&&todaySchedule.length===0&&todayTasks.length===0&&(
          <p style={{fontSize:12,color:"#C4BDB0"}}>{lang==="en"?"Nothing planned – open Planner to add your day":"Ingenting planlagt – åpne Planlegger"}</p>
        )}
      </div>

      {/* ── Kvartalsprioriteringer ── */}
      <div className="card" style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:starred.length?10:0}}>
          <p className="ctitle" style={{margin:0}}>{T(lang,"quarterPriorities")}</p>
          <span style={{fontSize:11,color:"#8A7E6E"}}>{allGoalItems.done}/{allGoalItems.total} {lang==="en"?"done":"fullført"}</span>
        </div>
        {starred.length===0&&<p style={{fontSize:12,color:"#C4BDB0",marginTop:6}}>{noStarred}</p>}
        {starred.map(g=>{
          const subs = g.subs?.filter(s=>s.text)||[];
          const doneSubs = subs.filter(s=>s.done).length;
          const expanded = expandedGoalId===g.id;
          return (
            <div key={g.id} style={{marginBottom:4}}>
              {/* Goal row */}
              <div style={{display:"flex",gap:9,alignItems:"center",padding:"6px 0",
                borderBottom:expanded?"none":"1px solid #F5F2ED",cursor:"pointer"}}
                onClick={()=>setExpandedGoalId(expanded?null:g.id)}>
                <div onClick={e=>{e.stopPropagation();toggleGoalDone(g.id);}}>
                  <Cb on={g.done} toggle={()=>toggleGoalDone(g.id)}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <p style={{fontSize:13,textDecoration:g.done?"line-through":"none",
                      color:g.done?"#C4BDB0":"#2A2318",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>
                      {g.text}
                    </p>
                    {subs.length>0&&(
                      <span style={{fontSize:10,color:"#8A7E6E",flexShrink:0,background:"#F5F2ED",
                        padding:"1px 6px",borderRadius:10,display:"flex",alignItems:"center",gap:3}}>
                        {doneSubs}/{subs.length}
                        <span style={{fontSize:8,transform:`rotate(${expanded?"180deg":"0deg"})`,display:"inline-block",transition:"transform .2s"}}>▼</span>
                      </span>
                    )}
                  </div>
                  {subs.length>0&&(
                    <div style={{height:3,background:"#F0EDE6",borderRadius:2,marginTop:4,overflow:"hidden"}}>
                      <div style={{height:"100%",background:CAT_COLOR[g.cat]||"#A8C9B0",borderRadius:2,
                        width:`${subs.length?(doneSubs/subs.length)*100:0}%`,transition:"width .4s"}}/>
                    </div>
                  )}
                </div>
                <CatBadge cat={g.cat||"Personlig"} lang={lang}/>
              </div>
              {/* Sub-goals expanded */}
              {expanded&&subs.length>0&&(
                <div style={{paddingLeft:22,paddingBottom:8,borderBottom:"1px solid #F5F2ED"}}>
                  {subs.map(s=>(
                    <div key={s.id} style={{display:"flex",gap:7,alignItems:"center",padding:"4px 0",
                      borderBottom:"1px solid #FAFAF7",cursor:"pointer"}}
                      onClick={()=>{
                        const updated=goals.map(goal=>goal.id===g.id?{...goal,subs:goal.subs.map(sub=>sub.id===s.id?{...sub,done:!sub.done}:sub)}:goal);
                        setGoals(updated);
                        if(!s.done) showConfetti&&showConfetti("✓");
                      }}>
                      <div style={{width:11,height:11,borderRadius:2,flexShrink:0,
                        border:`1.5px solid ${s.done?"#A8C9B0":"#C4BDB0"}`,
                        background:s.done?"#A8C9B0":"transparent",transition:"all .15s"}}/>
                      <span style={{fontSize:12,flex:1,color:s.done?"#C4BDB0":"#5A5040",
                        textDecoration:s.done?"line-through":"none"}}>{s.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Habit tracker ── */}
      {(()=>{
        const now2 = new Date();
        const year = now2.getFullYear();
        const month = now2.getMonth();
        const daysInMonth = new Date(year,month+1,0).getDate();
        const todayDate = now2.getDate();
        const monthDays = Array.from({length:daysInMonth},(_,i)=>{
          const dd=String(i+1).padStart(2,"0"), mm=String(month+1).padStart(2,"0");
          return `${year}-${mm}-${dd}`;
        });
        const morningDone = monthDays.map(k=>{ const r=dayData[k]?.morningRoutine||[]; return r.length>0&&r.every(x=>x.done); });
        const eveningDone = monthDays.map(k=>{ const r=dayData[k]?.eveningRoutine||[]; return r.length>0&&r.every(x=>x.done); });
        const habitNames=[];
        monthDays.forEach(k=>(dayData[k]?.egenRoutine||[]).forEach(h=>{ if(h.text&&!habitNames.includes(h.text))habitNames.push(h.text); }));
        const habitRows=habitNames.map(name=>monthDays.map(k=>{ const h=(dayData[k]?.egenRoutine||[]).find(x=>x.text===name); return h?h.done:false; }));
        const monthNames=lang==="en"?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]:["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Des"];
        const Row=({label,icon,arr})=>(
          <div style={{marginBottom:9}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                {icon}<span style={{fontSize:11,color:"#5A5040",fontWeight:500}}>{label}</span>
              </div>
              <span style={{fontSize:10,color:"#8A7E6E"}}>{arr.filter(Boolean).length}/{arr.length}</span>
            </div>
            <div style={{display:"flex",gap:2}}>
              {arr.map((done,i)=>{
                const isFut=(i+1)>todayDate, isTo=(i+1)===todayDate;
                return <div key={i} style={{flex:1,height:16,borderRadius:3,
                  background:done?"#A8C9B0":isFut?"transparent":"#F0EDE6",
                  border:`1px solid ${done?"#8ABD9A":isTo?"#2A2318":isFut?"#E2DDD3":"#D4CFC8"}`,
                  minWidth:0,transition:"background .2s"}}/>;
              })}
            </div>
          </div>
        );
        return (
          <div className="card" style={{marginBottom:12}}>
            <p className="ctitle" style={{marginBottom:10}}>
              {lang==="en"?"Habits":lang==="de"?"Gewohnheiten":lang==="es"?"Hábitos":lang==="sv"?"Vanor":lang==="da"?"Vaner":"Vaner"}
              <span style={{fontSize:11,color:"#8A7E6E",marginLeft:6,fontWeight:300}}>{monthNames[month]}</span>
            </p>
            <Row label={lang==="en"?"Morning routine":lang==="de"?"Morgenroutine":lang==="es"?"Rutina mañana":lang==="sv"?"Morgenrutin":lang==="da"?"Morgenrutine":"Morgenrutine"} icon={<SunIco s={10}/>} arr={morningDone}/>
            <Row label={lang==="en"?"Evening routine":lang==="de"?"Abendroutine":lang==="es"?"Rutina tarde":lang==="sv"?"Kvällsrutin":lang==="da"?"Aftenrutine":"Kveldsrutine"} icon={<MoonIco s={10}/>} arr={eveningDone}/>
            {habitNames.length>0&&habitRows.map((arr,i)=>(
              <Row key={i} label={habitNames[i]} icon={<LeafIco s={10}/>} arr={arr}/>
            ))}
            {habitNames.length===0&&morningDone.every(d=>!d)&&(
              <p style={{fontSize:11,color:"#C4BDB0"}}>{lang==="en"?"Add routines in My Routine":"Legg til rutiner i Min Rutine"}</p>
            )}
          </div>
        );
      })()}

    </div>
  );
}

// ─── GOALS ────────────────────────────────────────────────────────────────────
function GoalsView({goals,setGoals,lang,showConfetti}) {
  const [newText,setNewText] = useState("");
  const [newCat,setNewCat] = useState("Personlig");
  const [newDl,setNewDl] = useState("");
  const [filter,setFilter] = useState("Alle");
  const [showDone,setShowDone] = useState(false);
  const [editId,setEditId] = useState(null);
  const [editSubId,setEditSubId] = useState(null);
  const starredCount = goals.filter(g=>g.starred&&!g.done).length;

  const addGoal = () => {
    if(!newText.trim()) return;
    setGoals([...goals,{id:Date.now(),text:newText,cat:newCat,done:false,starred:false,subs:[],deadline:newDl}]);
    setNewText("");setNewDl("");
  };

  const updateGoal = (id,field,val) => setGoals(goals.map(g=>g.id===id?{...g,[field]:val}:g));

  const toggleDone = id => { const g2=goals.find(g=>g.id===id); if(g2&&!g2.done) showConfetti&&showConfetti(lang==="en"?"Goal completed! 🎉":"Mål fullført! 🎉"); setGoals(goals.map(g=>{
    if(g.id!==id) return g;
    return {...g,done:!g.done,starred:g.done?g.starred:false};
  }));}; 

  const toggleStar = id => {
    const g = goals.find(g=>g.id===id);
    if(!g) return;
    if(!g.starred&&starredCount>=3){alert("Maks 3 stjernede mål om gangen. Fullfør ett for å frigjøre en plass.");return;}
    setGoals(goals.map(g=>g.id===id?{...g,starred:!g.starred}:g));
  };

  const toggleSub = (gid,sid) => { const g2=goals.find(g=>g.id===gid); const s2=g2?.subs?.find(s=>s.id===sid); if(s2&&!s2.done) showConfetti&&showConfetti("✓"); setGoals(goals.map(g=>{
    if(g.id!==gid) return g;
    const subs=[...g.subs];const idx=subs.findIndex(s=>s.id===sid);
    if(idx>=0) subs[idx]={...subs[idx],done:!subs[idx].done};
    return {...g,subs};
  }));};

  const updateSub = (gid,sid,field,val) => setGoals(goals.map(g=>{
    if(g.id!==gid) return g;
    return {...g,subs:g.subs.map(s=>s.id===sid?{...s,[field]:val}:s)};
  }));

  const addSub = gid => {
    const newId = Date.now();
    setGoals(goals.map(g=>g.id===gid?{...g,subs:[...(g.subs||[]),{id:newId,text:"",done:false}]}:g));
    setEditSubId(`${gid}-${newId}`);
  };
  const removeSub = (gid,sid) => setGoals(goals.map(g=>g.id===gid?{...g,subs:g.subs.filter(s=>s.id!==sid)}:g));
  const removeGoal = id => setGoals(goals.filter(g=>g.id!==id));












  const active = goals.filter(g=>!g.done&&(filter==="Alle"||g.cat===filter));
  const done = goals.filter(g=>g.done&&(filter==="Alle"||g.cat===filter));

  return (
    <div className="fade">
      {/* ── Add goal – compact inline ── */}
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <input type="text" placeholder={T(lang,"addGoalPlaceholder")||"What do you want to achieve?"} value={newText}
          onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGoal()}
          style={{flex:1,borderRadius:24,padding:"9px 14px",fontSize:13}}/>
        <button className="btn bd bs" onClick={addGoal}
          style={{borderRadius:24,padding:"9px 16px",fontSize:16,lineHeight:1}}>+</button>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:10}}>
        <select value={newCat} onChange={e=>setNewCat(e.target.value)}
          style={{flex:1,fontSize:12,borderRadius:20,padding:"5px 10px"}}>
          {getCats(lang).map((label,i)=><option key={CATS[i]} value={CATS[i]}>{label}</option>)}
        </select>
        <input type="date" value={newDl} onChange={e=>setNewDl(e.target.value)}
          placeholder={lang==="en"?"📅 Deadline":lang==="de"?"📅 Frist":lang==="es"?"📅 Fecha":lang==="sv"?"📅 Datum":lang==="da"?"📅 Dato":"📅 Dato"}
          style={{flex:1,fontSize:12,borderRadius:20,padding:"5px 10px",color:newDl?"#2A2318":"#8A7E6E"}}/>
        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
          {[1,2,3].map(i=>(
            <span key={i} style={{opacity:starredCount>=i?1:0.25}}><StarIco s={12} filled={starredCount>=i}/></span>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:2}}>
        {[T(lang,"all")||"All",...getCats(lang)].map((label,i)=>{
          const key=i===0?"Alle":CATS[i-1];
          const bg = key==="Alle" ? (filter==="Alle"?"#2A2318":"transparent") : (filter===key ? (CAT_COLOR[key]||"#E2DDD3") : "transparent");
          const border = key==="Alle" ? (filter==="Alle"?"#2A2318":"#C4BDB0") : (CAT_COLOR[key]||"#E2DDD3");
          const col = key==="Alle" ? (filter==="Alle"?"#F6F3EE":"#2A2318") : (CAT_TEXT[key]||"#4A4535");
          return <button key={key} onClick={()=>setFilter(key)}
            style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${border}`,background:bg,color:col,fontSize:12,cursor:"pointer",transition:"all .15s",fontFamily:"DM Sans,sans-serif",fontWeight:filter===key?"500":"400"}}>
            {label}
          </button>;
        })}
      </div>

      {active.map(g=>(
        <div key={g.id} className={`star-goal ${g.starred?'starred':''}`}
          style={{background:g.starred?`${CAT_COLOR[g.cat]||'#F5F2ED'}44`:`${CAT_COLOR[g.cat]||'#fff'}33`,
                  borderColor:g.starred?(CAT_COLOR[g.cat]||'#C4A85A'):CAT_COLOR[g.cat]||'#E2DDD3'}}>

          {/* Top row: checkbox + name + star + actions */}
          <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
            <Cb on={g.done} toggle={()=>toggleDone(g.id)} style={{marginTop:3,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              {editId===g.id?(
                <div style={{display:"flex",gap:5,marginBottom:5}}>
                  <input className="edit-inp" value={g.text} onChange={e=>updateGoal(g.id,"text",e.target.value)} style={{flex:1}}/>
                  <select className="edit-inp" value={g.cat} onChange={e=>updateGoal(g.id,"cat",e.target.value)} style={{width:"auto",fontSize:11}}>
                    {getCats(lang).map((label,i)=><option key={CATS[i]} value={CATS[i]}>{label}</option>)}
                  </select>
                  <button className="bd bs" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>setEditId(null)}>✓</button>
                </div>
              ):(
                <p className={`sg-name ${g.done?'done-t':''}`} onClick={()=>setEditId(g.id)} style={{cursor:"text",lineHeight:1.4,marginBottom:5}}>{g.text}</p>
              )}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                <CatBadge cat={g.cat||"Personlig"} lang={lang}/>
                {g.deadline&&<span style={{fontSize:10,color:"#8A7E6E"}}>{g.deadline}</span>}
                {g.subs?.filter(s=>s.text).length>0&&(
                  <span style={{fontSize:10,color:"#8A7E6E",background:"rgba(0,0,0,.04)",padding:"1px 6px",borderRadius:10}}>
                    {g.subs.filter(s=>s.done).length}/{g.subs.filter(s=>s.text).length} {lang==="en"?"sub-goals":"delmål"}
                  </span>
                )}
              </div>
            </div>
            {/* Actions – star, AI, delete */}
            <div style={{display:"flex",gap:1,alignItems:"center",flexShrink:0,marginTop:1}}>
              <button className="bi" onClick={()=>toggleStar(g.id)} style={{padding:"4px 5px"}}><StarIco s={15} filled={g.starred}/></button>
              <button className="bi" onClick={()=>removeGoal(g.id)} style={{padding:"4px 5px"}}>
                <Ico d="M6 18L18 6M6 6l12 12" s={12}/>
              </button>
            </div>
          </div>

          {/* Sub-goals */}
          {(g.subs||[]).length>0&&(
            <div className="sub-list">
              {g.subs.map(s=>(
                <div key={s.id} className="sub-row" style={{gap:6}}>
                  <Cb on={!!s.done} toggle={()=>toggleSub(g.id,s.id)}/>
                  {editSubId===`${g.id}-${s.id}`?(
                    <div style={{display:"flex",gap:5,flex:1}}>
                      <input autoFocus className="edit-inp" value={s.text} onChange={e=>updateSub(g.id,s.id,"text",e.target.value)} onKeyDown={e=>{if(e.key==="Enter")setEditSubId(null);}} placeholder={lang==="en"?"Sub-goal...":"Delmål..."} style={{flex:1,fontSize:12}}/>
                      <button className="bd bs" style={{fontSize:11,padding:"2px 7px"}} onClick={()=>{if(!s.text.trim())removeSub(g.id,s.id);setEditSubId(null);}}>✓</button>
                    </div>
                  ):(
                    <span onClick={()=>setEditSubId(`${g.id}-${s.id}`)} style={{flex:1,fontSize:12,textDecoration:s.done?"line-through":"none",color:s.done?"#C4BDB0":"#2A2318",cursor:"text",lineHeight:1.4}}>{s.text}</span>
                  )}
                  <button className="bi" onClick={()=>removeSub(g.id,s.id)} style={{flexShrink:0,padding:"2px 3px"}}>
                    <Ico d="M6 18L18 6M6 6l12 12" s={10}/>
                  </button>
                </div>
              ))}
            </div>
          )}
          <button className="bo bs" onClick={()=>addSub(g.id)}
            style={{marginTop:7,fontSize:11,padding:"3px 10px",color:"#8A7E6E"}}>
            {T(lang,"subgoal")}
          </button>
        </div>
      ))}

      {done.length>0&&(
        <div style={{marginTop:8}}>
          <button className="btn bo bs" onClick={()=>setShowDone(s=>!s)}>{showDone?T(lang,"hide"):T(lang,"show")} {T(lang,"done")} ({done.length})</button>
          {showDone&&done.map(g=>(
            <div key={g.id} className="star-goal done-g" style={{marginTop:8}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Cb on={true} toggle={()=>toggleDone(g.id)}/>
                <p className="sg-name done-t" style={{flex:1}}>{g.text}</p>
                <CatBadge cat={g.cat||"Personlig"} lang={lang}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



// ─── WEEK DAY CARD ────────────────────────────────────────────────────────────
function WeekDayCard({dk,day,isT,sched,schedFilled,updateDay,lang,dayGoal,isActive,onClick}) {
  const [adding,setAdding] = useState(false);
  const [newHour,setNewHour] = useState("08");
  const [newText,setNewText] = useState("");
  const noEv = lang==="en"?"Empty":lang==="de"?"Leer":lang==="es"?"Vacío":lang==="sv"?"Tom":lang==="da"?"Tom":"Tom";

  const confirmAdd = () => {
    const raw = newHour.trim();
    const key = raw.includes(":")?raw:raw.padStart(2,"0")+":00";
    if(key&&newText.trim()) updateDay(dk,"schedule",{...sched,[key]:newText.trim()});
    setAdding(false);setNewHour("08:00");setNewText("");
  };

  return (
    <div className="card" style={{borderColor:isActive?"#A8C9B0":isT?"#C8DFC9":undefined,padding:"10px 12px",marginBottom:0,cursor:onClick?"pointer":"default"}}
      onClick={onClick}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:schedFilled.length||adding||dayGoal?5:0}}>
        <p className="ctitle" style={{margin:0,fontSize:13}}>
          {DAYS_F[day.getDay()===0?6:day.getDay()-1]||DAYS_F[0]}
          <span style={{fontSize:10,color:"#8A7E6E",marginLeft:4,fontWeight:300}}>{day.getDate()}. {MONTHS[day.getMonth()].slice(0,3).toLowerCase()}</span>
          {isT&&<span style={{marginLeft:5,fontSize:9,background:"#EAF3EC",color:"#4A8A5A",padding:"1px 5px",borderRadius:20}}>I dag</span>}
        </p>
        <button onClick={e=>{e.stopPropagation();setAdding(true);setNewHour("08:00");setNewText("");}}
          style={{background:"none",border:"none",cursor:"pointer",color:"#8A7E6E",fontSize:18,lineHeight:1,padding:"0 2px",fontWeight:300}}>+</button>
      </div>

      {dayGoal&&<p style={{fontSize:11,color:"#5A5040",marginBottom:4,paddingBottom:4,borderBottom:"1px solid #F5F2ED",display:"flex",alignItems:"center",gap:4}}><TargetIco s={10}/>{dayGoal}</p>}

      {adding&&(
        <div style={{display:"flex",gap:5,marginBottom:6,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
          <input type="text" value={newHour} onChange={e=>setNewHour(e.target.value)}
            placeholder="08:00" maxLength={5}
            style={{width:52,fontSize:11,padding:"3px 5px",borderRadius:5,border:"1px solid #E2DDD3",background:"#FAFAF7",textAlign:"center"}}/>
          <input autoFocus type="text" value={newText} onChange={e=>setNewText(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")confirmAdd();if(e.key==="Escape")setAdding(false);}}
            placeholder={lang==="en"?"Event...":"Avtale..."}
            style={{fontSize:11,flex:1}}/>
          <button onClick={e=>{e.stopPropagation();confirmAdd();}}
            style={{background:"#A8C9B0",border:"none",borderRadius:4,cursor:"pointer",color:"#2A2318",fontSize:10,padding:"3px 6px",flexShrink:0}}>✓</button>
        </div>
      )}

      {schedFilled.map(h=>(
        <div key={h} style={{display:"flex",gap:5,alignItems:"center",marginBottom:2}} onClick={e=>e.stopPropagation()}>
          <span style={{fontSize:10,color:"#8A7E6E",width:34,flexShrink:0}}>{h.includes(":")?h:h+":00"}</span>
          <span style={{fontSize:11,color:"#2A2318",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sched[h]}</span>
          <button onClick={()=>{const s={...sched};delete s[h];updateDay(dk,"schedule",s);}}
            style={{background:"none",border:"none",cursor:"pointer",color:"#C4BDB0",fontSize:12,flexShrink:0,padding:0}}>×</button>
        </div>
      ))}

      {schedFilled.length===0&&!adding&&!dayGoal&&(
        <p style={{fontSize:11,color:"#E2DDD3"}}>{noEv}</p>
      )}
    </div>
  );
}

// ─── SCHEDULE CARD ────────────────────────────────────────────────────────────
function ScheduleCard({schedule,dk,updateDay,lang,filledHours}) {
  const [adding,setAdding] = useState(false);
  const [newHour,setNewHour] = useState("08:00");
  const [newText,setNewText] = useState("");
  const [remind,setRemind] = useState("");
  const [customRemind,setCustomRemind] = useState("");
  const [repeat,setRepeat] = useState("");

  const noEvents = lang==="en"?"No appointments today":lang==="de"?"Keine Termine heute":lang==="es"?"Sin citas hoy":lang==="sv"?"Inga möten idag":lang==="da"?"Ingen aftaler i dag":"Ingen avtaler i dag";
  const schLabel = lang==="en"?"Schedule":lang==="de"?"Zeitplan":lang==="es"?"Horario":lang==="sv"?"Tidsplan":lang==="da"?"Tidsplan":"Timeplan";
  const placeholder = lang==="en"?"Event...":lang==="de"?"Termin...":lang==="es"?"Evento...":lang==="sv"?"Händelse...":lang==="da"?"Begivenhed...":"Avtale...";

  const confirmAdd = () => {
    const raw = newHour.trim();
    const key = raw.includes(":")?raw:raw.padStart(2,"0")+":00";
    if(key&&newText.trim()){
      const upd = {...schedule,[key]:newText.trim()};
      const remindVal = remind==="custom"?customRemind:remind;
      if(remindVal) upd[key+"_remind"]=remindVal;
      if(repeat) upd[key+"_repeat"]=repeat;
      updateDay(dk,"schedule",upd);
      if(remindVal&&Notification.permission==="granted"){
        const [hh,mm] = key.split(":").map(Number);
        const base = parseKey(dk);
        const evTime = new Date(base.getFullYear(),base.getMonth(),base.getDate(),hh,mm||0,0);
        const notifTime = new Date(evTime.getTime()-parseInt(remindVal)*60000);
        const delay = notifTime.getTime()-Date.now();
        if(delay>0) setTimeout(()=>{
          new Notification("My Quarter",{body:`${lang==="en"?"In":"Om"} ${remindVal} min: ${newText.trim()}`,icon:"/favicon.ico"});
        },delay);
      }
    }
    setAdding(false);
    setNewHour("08:00");
    setNewText("");
    setRemind("");
    setCustomRemind("");
    setRepeat("");
  };

  return (
    <div className="card" style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:filledHours.length||adding?10:4}}>
        <p className="ctitle" style={{margin:0}}>{schLabel}</p>
        <button onClick={()=>{setAdding(true);setNewHour("08:00");setNewText("");}}
          style={{background:"none",border:"none",cursor:"pointer",color:"#8A7E6E",fontSize:20,lineHeight:1,padding:"0 2px",fontWeight:300}}>+</button>
      </div>

      {adding&&(
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
            <input type="text" value={newHour} onChange={e=>setNewHour(e.target.value)}
              placeholder="08:00" maxLength={5}
              style={{width:54,fontSize:12,padding:"4px 6px",borderRadius:6,border:"1px solid #E2DDD3",background:"#FAFAF7",textAlign:"center",color:"#2A2318"}}/>
            <input autoFocus type="text" value={newText} onChange={e=>setNewText(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")confirmAdd();if(e.key==="Escape"){setAdding(false);}}}
              placeholder={placeholder}
              style={{fontSize:12,flex:1}}/>
            <button onClick={confirmAdd}
              style={{background:"#A8C9B0",border:"none",borderRadius:4,cursor:"pointer",color:"#2A2318",fontSize:11,padding:"4px 9px",flexShrink:0}}>✓</button>
            <button onClick={()=>{setAdding(false);setRemind("");}}
              style={{background:"none",border:"none",cursor:"pointer",color:"#C4BDB0",fontSize:14,padding:"0 2px"}}>×</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
            <span style={{fontSize:12,color:"#8A7E6E",flexShrink:0}}>🔔</span>
            <select value={remind} onChange={e=>setRemind(e.target.value)}
              style={{fontSize:11,padding:"4px 8px",borderRadius:20,border:"1px solid #E2DDD3",background:"#FAFAF7",color:remind?"#2A2318":"#8A7E6E",flex:1}}>
              <option value="">{lang==="en"?"No reminder":lang==="de"?"Keine Erinnerung":lang==="es"?"Sin recordatorio":lang==="sv"?"Ingen påminnelse":lang==="da"?"Ingen påmindelse":"Ingen varsel"}</option>
              <option value="5">{lang==="en"?"5 min before":"5 min før"}</option>
              <option value="10">10 min</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">{lang==="en"?"1 hour before":"1 time før"}</option>
              <option value="120">{lang==="en"?"2 hours before":"2 timer før"}</option>
              <option value="1440">{lang==="en"?"1 day before":"1 dag før"}</option>
              <option value="custom">{lang==="en"?"Custom...":"Egendefinert..."}</option>
            </select>
            {remind==="custom"&&(
              <div style={{display:"flex",alignItems:"center",gap:3}}>
                <input type="number" min="1" max="1440" value={customRemind} onChange={e=>setCustomRemind(e.target.value)}
                  placeholder="30" style={{width:44,fontSize:11,padding:"3px 5px",borderRadius:6,textAlign:"center"}}/>
                <span style={{fontSize:11,color:"#8A7E6E"}}>min</span>
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12,color:"#8A7E6E",flexShrink:0}}>🔁</span>
            <select value={repeat} onChange={e=>setRepeat(e.target.value)}
              style={{fontSize:11,padding:"4px 8px",borderRadius:20,border:"1px solid #E2DDD3",background:"#FAFAF7",color:repeat?"#2A2318":"#8A7E6E",flex:1}}>
              <option value="">{lang==="en"?"No repeat":lang==="de"?"Keine Wiederholung":lang==="es"?"Sin repetición":lang==="sv"?"Ingen upprepning":lang==="da"?"Ingen gentagelse":"Ingen gjentakelse"}</option>
              <option value="daily">{lang==="en"?"Daily":"Daglig"}</option>
              <option value="weekly">{lang==="en"?"Weekly":"Ukentlig"}</option>
              <option value="biweekly">{lang==="en"?"Every 2 weeks":"Annenhver uke"}</option>
              <option value="monthly">{lang==="en"?"Monthly":"Månedlig"}</option>
              <option value="yearly">{lang==="en"?"Yearly":"Årlig"}</option>
              <option value="custom">{lang==="en"?"Custom...":"Egendefinert..."}</option>
            </select>
          </div>
        </div>
      )}

      {filledHours.map(h=>(
        <div key={h} className="tb-row" style={{alignItems:"center"}}>
          <span className="tb-lbl">{h.includes(":")?h:h+":00"}</span>
          <input type="text" style={{fontSize:12,flex:1}} value={schedule[h]}
            onChange={e=>updateDay(dk,"schedule",{...schedule,[h]:e.target.value})}/>
          <div style={{display:"flex",gap:3,alignItems:"center",flexShrink:0}}>
            {schedule[h+"_remind"]&&(
              <span style={{fontSize:9,color:"#A8C9B0",padding:"1px 4px",borderRadius:8,border:"1px solid #C8DFC9",lineHeight:1.4}}>
                🔔{schedule[h+"_remind"]==="1440"?"1d":schedule[h+"_remind"]==="120"?"2h":schedule[h+"_remind"]+"m"}
              </span>
            )}
            {schedule[h+"_repeat"]&&(
              <span style={{fontSize:9,color:"#B8C8D8",padding:"1px 4px",borderRadius:8,border:"1px solid #C8D8E8",lineHeight:1.4}}>
                🔁{schedule[h+"_repeat"]==="daily"?"d":schedule[h+"_repeat"]==="weekly"?"w":schedule[h+"_repeat"]==="biweekly"?"2w":schedule[h+"_repeat"]==="monthly"?"mo":schedule[h+"_repeat"]==="yearly"?"yr":"✎"}
              </span>
            )}
          </div>
          <button onClick={()=>{const s={...schedule};delete s[h];delete s[h+"_remind"];delete s[h+"_repeat"];updateDay(dk,"schedule",s);}}
            style={{background:"none",border:"none",cursor:"pointer",color:"#C4BDB0",fontSize:14,flexShrink:0,padding:"0 2px"}}>×</button>
        </div>
      ))}

      {filledHours.length===0&&!adding&&(
        <p style={{fontSize:12,color:"#C4BDB0"}}>{noEvents}</p>
      )}
    </div>
  );
}

// ─── DAILY ────────────────────────────────────────────────────────────────────
function DailyView({dayData,updateDay,getDayField,selectedDay,setSelectedDay,weeklyGoals,setWeeklyGoals,monthlyData,setMonthlyData,openDay,ql,lang,hideTabs,showConfetti}) {
  const dk = selectedDay;
  const isToday = dk===todayKey();
  const parsedDate = parseKey(dk);
  const schedule = getDayField(dk,"schedule",{});
  const filledHours = Object.keys(schedule).filter(h=>schedule[h]&&!h.endsWith("_remind")&&!h.endsWith("_repeat")).sort((a,b)=>a.localeCompare(b));
  const tasks = getDayField(dk,"tasks",[]);
  const goalCompleted = getDayField(dk,"goalCompleted",false);
  const nextStep = getDayField(dk,"nextStep","");
  const morningR = getDayField(dk,"morningRoutine",[]);
  const eveningR = getDayField(dk,"eveningRoutine",[]);

  const navigate = dir => {
    const d=new Date(dk+"T12:00:00");d.setDate(d.getDate()+dir);setSelectedDay(toKey(d));
  };

  return (
    <div className="fade">
      <>
      <div className="card" style={{padding:"11px 14px",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button className="btn bo bs" onClick={()=>navigate(-1)}>←</button>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,flex:1,textAlign:"center"}}>{fmtDate(parsedDate,lang)}</span>
          <button className="btn bo bs" onClick={()=>navigate(1)}>→</button>
          {!isToday&&<button className="btn bd bs" onClick={()=>setSelectedDay(todayKey())}>I dag</button>}
        </div>
      </div>

      <div className="card" style={{marginBottom:12,borderColor:goalCompleted?"#A8C9B0":undefined,background:goalCompleted?"#EAF3EC":undefined}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <p className="ctitle" style={{margin:0}}>{T(lang,"todayGoal")}</p>
          {getDayField(dk,"goal","")&&(
            <span style={{fontSize:10,color:"#A8C9B0",display:"flex",alignItems:"center",gap:3}}>
              ✓ {lang==="en"?"Saved":lang==="de"?"Gespeichert":lang==="es"?"Guardado":lang==="sv"?"Sparat":lang==="da"?"Gemt":"Lagret"}
            </span>
          )}
        </div>
        <input type="text"
          placeholder={lang==="en"?"What is your most important task today?":lang==="de"?"Was ist deine wichtigste Aufgabe heute?":lang==="es"?"¿Cuál es tu tarea más importante hoy?":lang==="sv"?"Vad är din viktigaste uppgift idag?":lang==="da"?"Hvad er din vigtigste opgave i dag?":"Hva er din viktigste oppgave i dag?"}
          value={getDayField(dk,"goal","")}
          onChange={e=>updateDay(dk,"goal",e.target.value)}
          style={{marginBottom:12,borderColor:goalCompleted?"#A8C9B0":undefined}}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Cb on={goalCompleted} toggle={()=>{ if(!goalCompleted) showConfetti&&showConfetti(lang==="en"?"Daily goal done! 🔥":"Dagens mål fullført! 🔥"); updateDay(dk,"goalCompleted",!goalCompleted); }}/>
          <span style={{fontSize:13,color:goalCompleted?"#4A8A5A":"#8A7E6E",fontWeight:goalCompleted?"500":"400"}}>
            {T(lang,"goalCompleted")}
          </span>
          {goalCompleted&&<span className="streak-badge"><FlameIco s={12}/> Streak!</span>}
        </div>
      </div>

      {morningR.length>0&&(
        <div className="card" style={{marginBottom:12}}>
          <p className="ctitle" style={{display:"flex",alignItems:"center",gap:6}}><SunIco s={15}/>{T(lang,"morningRoutine")}</p>
          {morningR.map((r,i)=>(
            <div key={i} className="cr">
              <Cb on={!!r.done} toggle={()=>{const u=[...morningR];u[i]={...u[i],done:!u[i].done};updateDay(dk,"morningRoutine",u);}}/>
              <span style={{fontSize:13,textDecoration:r.done?"line-through":"none",color:r.done?"#C4BDB0":undefined}}>{r.text}</span>
            </div>
          ))}
        </div>
      )}

      <ScheduleCard schedule={schedule} dk={dk} updateDay={updateDay} lang={lang} filledHours={filledHours}/>

      <div className="card" style={{marginBottom:12}}>
        <p className="ctitle">{T(lang,"tasks")}</p>
        {tasks.map((t,i)=>(
          <div key={i} className="cr">
            <Cb on={!!t.done} toggle={()=>{const u=[...tasks];u[i]={...u[i],done:!u[i].done};updateDay(dk,"tasks",u);}}/>
            <input className="ig" placeholder={`Oppgave ${i+1}`} value={t.text}
              onChange={e=>{const u=[...tasks];u[i]={...u[i],text:e.target.value};updateDay(dk,"tasks",u);}}
              style={{textDecoration:t.done?"line-through":"none",color:t.done?"#C4BDB0":undefined}}/>
          </div>
        ))}
        <button className="btn bo bs" style={{marginTop:8}} onClick={()=>updateDay(dk,"tasks",[...tasks,{text:"",done:false}])}>{T(lang,"addTask")}</button>
      </div>

      {eveningR.length>0&&(
        <div className="card" style={{borderColor:"#C4A85A",background:"#FDFAF3"}}>
          <p className="ctitle" style={{display:"flex",alignItems:"center",gap:6}}><MoonIco s={15}/>{T(lang,"eveningRoutine")}</p>
          {eveningR.map((r,i)=>(
            <div key={i} className="cr">
              <Cb on={!!r.done} toggle={()=>{const u=[...eveningR];u[i]={...u[i],done:!u[i].done};updateDay(dk,"eveningRoutine",u);}}/>
              <span style={{fontSize:13,textDecoration:r.done?"line-through":"none",color:r.done?"#C4BDB0":undefined}}>{r.text}</span>
            </div>
          ))}
          <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #EDE0C0"}}>
            <p style={{fontSize:12,color:"#8A7E6E",marginBottom:6}}>{T(lang,"nextStep")} –</p>
            <input type="text" placeholder='F.eks. "Løpe 20 min"' value={nextStep} onChange={e=>updateDay(dk,"nextStep",e.target.value)}/>
            
          </div>
        </div>
      )}
      </>
    </div>
  );
}

// ─── DAILY WEEK TAB ───────────────────────────────────────────────────────────
function DailyWeekTab({dayData,updateDay,getDayField,selectedDay,setSelectedDay,weeklyGoals,setWeeklyGoals,lang}) {
  const [offset,setOffset] = useState(0);
  const ws = (() => {
    // Find the week containing selectedDay
    const base = parseKey(selectedDay);
    const d = new Date(base);
    d.setDate(d.getDate()-dow(d)+offset*7);
    d.setHours(0,0,0,0);
    return d;
  })();
  const days = Array(7).fill(null).map((_,i)=>addDays(ws,i));
  const wk = toKey(ws);
  const wg = weeklyGoals[wk]||[];
  const setWG = (i,f,v) => {const u=[...wg];u[i]={...(u[i]||{}),[f]:v};setWeeklyGoals({...weeklyGoals,[wk]:u});};
  const wLabel = `${fmtShort(days[0],lang)} – ${fmtShort(days[6],lang)} ${days[6].getFullYear()}`;
  const rows = [[0,1],[2,3],[4,5],[6,null]];

  return (
    <div>
      <div className="card" style={{padding:"10px 13px",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button className="btn bo bs" onClick={()=>setOffset(o=>o-1)}>←</button>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:14,flex:1,textAlign:"center"}}>{wLabel}</span>
          <button className="btn bo bs" onClick={()=>setOffset(o=>o+1)}>→</button>
          {offset!==0&&<button className="btn bd bs" onClick={()=>setOffset(0)}>Nå</button>}
        </div>
      </div>
      {rows.map(([a,b],ri)=>(
        <div key={ri} className="g2" style={{marginBottom:4}}>
          {[a,b].map(idx=>{
            if(idx===null) return (
              <div key="wg" className="card" style={{padding:"11px 14px",marginBottom:0}}>
                <p className="ctitle">{T(lang,"weeklyGoals")}</p>
                {wg.map((g,i)=>(
                  <div key={i} className="cr">
                    <Cb on={!!g.done} toggle={()=>setWG(i,"done",!g.done)}/>
                    <input className="ig" placeholder={`Mål ${i+1}`} value={g.text||""}
                      onChange={e=>setWG(i,"text",e.target.value)}
                      style={{textDecoration:g.done?"line-through":"none",color:g.done?"#C4BDB0":undefined}}/>
                  </div>
                ))}
                <button className="btn bo bs" style={{marginTop:7}} onClick={()=>setWeeklyGoals({...weeklyGoals,[wk]:[...wg,{text:"",done:false}]})}>{T(lang,"addTask")}</button>
              </div>
            );
            const day=days[idx];const dk2=toKey(day);
            const isActive=dk2===selectedDay;const isT=dk2===todayKey();
            const dayGoal=getDayField(dk2,"goal","");
            const daySchedule=getDayField(dk2,"schedule",{});
            const scheduleEvents=Object.entries(daySchedule).filter(([,v])=>v).sort(([a2],[b2])=>a2.localeCompare(b2));
            const items=getDayField(dk2,"weekItems",[]);
            return (
              <div key={idx} className="card"
                style={{borderColor:isActive?"#A8C9B0":isT?"#C8DFC9":undefined,cursor:"pointer",padding:"11px 14px",marginBottom:0}}
                onClick={()=>setSelectedDay(dk2)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <p className="ctitle" style={{margin:0}}>
                    {DAYS_F[idx]}
                    <span style={{fontSize:11,color:"#8A7E6E",marginLeft:5,fontWeight:300}}>{day.getDate()}. {MONTHS[day.getMonth()].slice(0,3).toLowerCase()}</span>
                    {isActive&&<span style={{marginLeft:6,fontSize:10,background:"#2A2318",color:"#F6F3EE",padding:"1px 6px",borderRadius:20}}>Valgt</span>}
                    {!isActive&&isT&&<span style={{marginLeft:6,fontSize:10,background:"#EAF3EC",color:"#4A8A5A",padding:"1px 6px",borderRadius:20}}>I dag</span>}
                  </p>
                  <button onClick={e=>{e.stopPropagation();updateDay(dk2,"weekItems",[...items,""]);}}
                    style={{width:22,height:22,borderRadius:"50%",border:"none",background:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#8A7E6E",fontSize:18,lineHeight:1,flexShrink:0,fontWeight:300}}>+</button>
                </div>
                {dayGoal&&<p style={{fontSize:12,color:"#2A2318",fontWeight:500,marginBottom:5,paddingBottom:5,borderBottom:"1px solid #F5F2ED"}}><span style={{display:"flex",alignItems:"center",gap:4}}><TargetIco s={12}/>{dayGoal}</span></p>}
                {scheduleEvents.map(([h,v])=>(
                  <p key={h} style={{fontSize:11,color:"#5A5040",marginBottom:2}}>
                    <span style={{color:"#8A7E6E",marginRight:4}}>{h.includes(":")?h:h+":00"}</span>{v}
                  </p>
                ))}
                {items.map((item,ii)=>(
                  <div key={ii} className="cr" style={{gap:4}} onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",flexDirection:"column",gap:1,flexShrink:0,opacity:0.4}}>
                      <button style={{background:"none",border:"none",cursor:"pointer",padding:"1px 3px",color:"#8A7E6E",fontSize:10,lineHeight:1}}
                        onClick={e=>{e.stopPropagation();if(ii===0)return;const u=[...items];[u[ii-1],u[ii]]=[u[ii],u[ii-1]];updateDay(dk2,"weekItems",u);}}>▲</button>
                      <button style={{background:"none",border:"none",cursor:"pointer",padding:"1px 3px",color:"#8A7E6E",fontSize:10,lineHeight:1}}
                        onClick={e=>{e.stopPropagation();if(ii===items.length-1)return;const u=[...items];[u[ii],u[ii+1]]=[u[ii+1],u[ii]];updateDay(dk2,"weekItems",u);}}>▼</button>
                    </div>
                    <input className="ig" placeholder="..." value={item}
                      onChange={e=>{const u=[...items];u[ii]=e.target.value;updateDay(dk2,"weekItems",u);}}
                      style={{flex:1}}/>
                    <button onClick={e=>{e.stopPropagation();updateDay(dk2,"weekItems",items.filter((_,j)=>j!==ii));}}
                      style={{background:"none",border:"none",cursor:"pointer",color:"#C4BDB0",fontSize:14,lineHeight:1,flexShrink:0,padding:"0 2px"}}>×</button>
                  </div>
                ))}

              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── DAILY MONTH TAB ──────────────────────────────────────────────────────────
function DailyMonthTab({dayData,openDay,monthlyData,setMonthlyData,ql,selectedDay,setSelectedDay,lang}) {
  const base = parseKey(selectedDay);
  const [vd,setVd] = useState(new Date(base.getFullYear(),base.getMonth(),1));
  const yr=vd.getFullYear(),mo=vd.getMonth();
  const dim=daysInMonth(yr,mo),firstDow2=dow(new Date(yr,mo,1));
  const mk=`${yr}-${mo}`;
  const cells=Array(firstDow2).fill(null).concat(Array(dim).fill(null).map((_,i)=>i+1));

  return (
    <div>
      <div className="card" style={{marginBottom:12}}>
        <div className="cal-hdr">
          <button className="btn bo bs" onClick={()=>{const d=new Date(vd);d.setMonth(d.getMonth()-1);setVd(d);}}>←</button>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:17}}>{MONTHS[mo]} {yr}</span>
          <button className="btn bo bs" onClick={()=>{const d=new Date(vd);d.setMonth(d.getMonth()+1);setVd(d);}}>→</button>
        </div>
        <div className="cal-grid" style={{marginBottom:1}}>
          {DAYS_S.map(d=><div key={d} className="cal-dl">{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map((day,idx)=>{
            if(!day) return <div key={`e${idx}`} className="cal-cell cal-empty"/>;
            const dateObj=new Date(yr,mo,day);
            const dk=toKey(dateObj);
            const info=dayData[dk]||{};
            const isToday=dk===todayKey();
            const isSelected=dk===selectedDay;
            const hasContent=!!(info.goal||info.tasks?.some(t=>t.text)||Object.values(info.schedule||{}).some(Boolean));
            const firstEvent=info.goal||(Object.entries(info.schedule||{}).find(([k,v])=>v&&!k.endsWith("_remind")&&!k.endsWith("_repeat"))||[])[1]||"";
            return (
              <div key={day}
                className={`cal-cell ${isToday?'cal-today':''} ${hasContent?'cal-dot':''}`}
                style={{background:isSelected?"#EDE8DF":undefined,borderColor:isSelected?"#2A2318":undefined}}
                onClick={()=>setSelectedDay(dk)}>
                <span className="cal-num">{day}</span>
                {firstEvent&&<span className="cal-ev">{firstEvent}</span>}
              </div>
            );
          })}
        </div>
        <p style={{fontSize:11,color:"#8A7E6E",marginTop:8}}>Trykk en dag for å bytte til den i dag-fanen</p>
      </div>
    </div>
  );
}

// ─── PLANNER VIEW ─────────────────────────────────────────────────────────────
function PlannerView(props) {
  const {dayData,updateDay,getDayField,weeklyGoals,setWeeklyGoals,
    monthlyData,setMonthlyData,openDay,ql,lang,selectedDay,setSelectedDay} = props;
  const [innerTab,setInnerTab] = useState("day");

  const tabs = [
    {id:"day",   label:T(lang,"day")||"Day"},
    {id:"week",  label:T(lang,"week")||"Week"},
    {id:"month", label:T(lang,"month")||"Month"},
  ];

  const switchDay = (dk) => { setSelectedDay(dk); setInnerTab("day"); };

  return (
    <div className="fade">
      <div style={{display:"flex",gap:4,marginBottom:12,borderBottom:"1px solid #E2DDD3",paddingBottom:10}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setInnerTab(t.id)}
            style={{padding:"6px 18px",borderRadius:20,border:`1px solid ${innerTab===t.id?"#2A2318":"#E2DDD3"}`,background:innerTab===t.id?"#2A2318":"transparent",color:innerTab===t.id?"#F6F3EE":"#5A5040",fontSize:12,cursor:"pointer",transition:"all .15s",fontFamily:"DM Sans,sans-serif"}}>
            {t.label}
          </button>
        ))}
      </div>
      {innerTab==="day"&&(
        <DailyView dayData={dayData} updateDay={updateDay} getDayField={getDayField}
          selectedDay={selectedDay} setSelectedDay={setSelectedDay}
          weeklyGoals={weeklyGoals} setWeeklyGoals={setWeeklyGoals}
          monthlyData={monthlyData} setMonthlyData={setMonthlyData}
          openDay={openDay} ql={ql} lang={lang} hideTabs={true} showConfetti={props.showConfetti}/>
      )}
      {innerTab==="week"&&(
        <WeeklyView dayData={dayData} updateDay={updateDay} getDayField={getDayField}
          weeklyGoals={weeklyGoals} setWeeklyGoals={setWeeklyGoals}
          selectedDay={selectedDay} setSelectedDay={switchDay} lang={lang}/>
      )}
      {innerTab==="month"&&(
        <MonthlyView dayData={dayData} updateDay={updateDay} getDayField={getDayField}
          openDay={switchDay} monthlyData={monthlyData} setMonthlyData={setMonthlyData}
          ql={ql} lang={lang} selectedDay={selectedDay}/>
      )}
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
// ─── TERMS VIEW ───────────────────────────────────────────────────────────────
function TermsView({onClose, lang}) {
  const t = (en,no) => lang==="en"?en:no;
  const Section = ({num, title, children}) => (
    <div style={{marginBottom:20}}>
      <p style={{fontSize:13,fontWeight:600,color:"#2A2318",marginBottom:8}}>{num}. {title}</p>
      {children}
    </div>
  );
  const P = ({children}) => <p style={{fontSize:12,color:"#5A5040",lineHeight:1.8,marginBottom:6}}>{children}</p>;

  return (
    <div style={{position:"fixed",inset:0,background:"#F6F3EE",zIndex:500,overflowY:"auto",padding:"0 0 40px"}}>
      <div style={{position:"sticky",top:0,background:"#F6F3EE",borderBottom:"1px solid #E2DDD3",padding:"14px 16px",display:"flex",alignItems:"center",gap:10,zIndex:10}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center"}}>
          <Ico d="M19 12H5|M12 5l-7 7 7 7" s={20}/>
        </button>
        <p style={{fontSize:16,fontFamily:"Cormorant Garamond,serif",fontWeight:400}}>{t("Terms & Conditions","Brukervilkår")}</p>
      </div>

      <div style={{padding:"20px 16px"}}>
        <p style={{fontSize:11,color:"#8A7E6E",marginBottom:20}}>{t("Last updated: June 2026","Sist oppdatert: Juni 2026")}</p>

        <P>{t(
          "These Terms and Conditions govern your use of the My Quarter app. By using the app, you agree to these terms. If you do not agree, do not use the app.",
          "Disse brukervilkårene regulerer din bruk av Mitt Kvartal-appen. Ved å bruke appen godtar du disse vilkårene. Hvis du ikke godtar, ikke bruk appen."
        )}</P>

        <Section num={1} title={t("Nature of the App","Appens formål")}>
          <P>{t("My Quarter is a goal-planning and self-organization tool for personal use only. It is not a substitute for professional advice of any kind, including medical, psychological, health, financial, investment, legal, or business advice.","Mitt Kvartal er et verktøy for målplanlegging og selvorganisering, kun for personlig bruk. Det er ikke en erstatning for profesjonell rådgivning av noe slag, inkludert medisinsk, psykologisk, helse-, finansiell-, investerings-, juridisk eller forretningsmessig rådgivning.")}</P>
          <P>{t("Any content, suggestions, or reminders in the app are generic and must not be relied upon as professional guidance. Always consult a qualified professional before making decisions that may affect your health, finances, or wellbeing.","Alt innhold, forslag eller påminnelser i appen er generiske og skal ikke brukes som profesjonell veiledning. Konsulter alltid en kvalifisert fagperson før du tar beslutninger som kan påvirke helse, økonomi eller velvære.")}</P>
        </Section>

        <Section num={2} title={t("No Guarantee of Results","Ingen garanti for resultater")}>
          <P>{t("We make no promise, warranty, or guarantee that using My Quarter will help you achieve any goal or produce any particular outcome. Your goals and results depend entirely on your own actions, effort, and circumstances.","Vi gir ingen løfter, garantier eller forsikringer om at bruk av Mitt Kvartal vil hjelpe deg å nå mål eller gi bestemte resultater. Dine mål og resultater avhenger utelukkende av dine egne handlinger, innsats og omstendigheter.")}</P>
          <P>{t("Any outcome — or lack of outcome — is your sole responsibility.","Ethvert resultat – eller mangel på resultat – er ditt eget ansvar.")}</P>
        </Section>

        <Section num={3} title={t("Assumption of Risk","Risikoaksept")}>
          <P>{t("You use the app entirely at your own risk. You are solely responsible for all decisions and actions you take, whether or not influenced by the app, and for any consequences that result.","Du bruker appen utelukkende på egen risiko. Du er eneansvarlig for alle beslutninger og handlinger du tar, uavhengig av om de er påvirket av appen, og for eventuelle konsekvenser som følger.")}</P>
          <P>{t("We are not responsible or liable for any outcome, decision, action, loss, or harm arising from your use of the app.","Vi er ikke ansvarlige for noe resultat, beslutning, handling, tap eller skade som oppstår fra din bruk av appen.")}</P>
        </Section>

        <Section num={4} title={t("Eligibility","Alderskrav")}>
          <P>{t("You must be at least 18 years old to use the app. By using the app you confirm you meet this requirement.","Du må være minst 18 år for å bruke appen. Ved å bruke appen bekrefter du at du oppfyller dette kravet.")}</P>
        </Section>

        <Section num={5} title={t("Licence and Acceptable Use","Lisens og akseptabel bruk")}>
          <P>{t("We grant you a limited, personal, non-commercial licence to use the app. You agree not to reverse engineer, resell, or commercially exploit the app, or use it for any unlawful purpose.","Vi gir deg en begrenset, personlig, ikke-kommersiell lisens til å bruke appen. Du godtar å ikke reverse engineere, videreselge eller kommersielt utnytte appen, eller bruke den til ulovlige formål.")}</P>
        </Section>

        <Section num={6} title={t("User Content","Brukerinnhold")}>
          <P>{t("You retain ownership of all goals, notes, and content you create in the app. You are solely responsible for your content and for keeping your own backups. All data is stored locally on your device.","Du beholder eierskap til alle mål, notater og annet innhold du oppretter i appen. Du er eneansvarlig for ditt innhold og for å ta egne sikkerhetskopier. Alle data lagres lokalt på enheten din.")}</P>
        </Section>

        <Section num={7} title={t("Disclaimer of Warranties","Fraskrivelse av garantier")}>
          <P>{t('The app is provided "as is" and "as available", without warranty of any kind. We do not warrant that the app will be uninterrupted, error-free, or free of harmful components.','"Appen er levert "som den er" og "som tilgjengelig", uten noen form for garanti. Vi garanterer ikke at appen vil være uavbrutt, feilfri eller fri for skadelige komponenter.')}</P>
        </Section>

        <Section num={8} title={t("Limitation of Liability","Ansvarsbegrensning")}>
          <P>{t("To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, arising from your use of the app.","I den grad loven tillater det, skal vi ikke være ansvarlige for indirekte, tilfeldige, spesielle, konsekventielle eller straffemessige skader, eller tap av data, som oppstår fra din bruk av appen.")}</P>
          <P>{t("Our total aggregate liability to you shall not exceed the greater of (a) the total amount you have paid to us in the 3 months preceding the claim, or (b) NOK 49.","Vårt totale ansvar overfor deg skal ikke overstige det høyeste av (a) det du har betalt oss de siste 3 månedene forut for kravet, eller (b) NOK 49.")}</P>
        </Section>

        <Section num={9} title={t("Indemnification","Skadesløsholdelse")}>
          <P>{t("You agree to hold harmless My Quarter from any claims, damages, or expenses arising from your use of the app, your violation of these terms, or your violation of any law or third-party rights.","Du godtar å holde Mitt Kvartal skadesløst fra krav, skader eller utgifter som oppstår fra din bruk av appen, brudd på disse vilkårene, eller brudd på lover eller tredjeparts rettigheter.")}</P>
        </Section>

        <Section num={10} title={t("Changes and Termination","Endringer og avslutning")}>
          <P>{t("We may update these Terms at any time. Continued use after changes constitutes acceptance. We may discontinue the app at any time without notice or liability.","Vi kan oppdatere disse vilkårene når som helst. Fortsatt bruk etter endringer utgjør aksept. Vi kan avvikle appen når som helst uten varsel eller ansvar.")}</P>
        </Section>

        <Section num={11} title={t("Governing Law","Gjeldende lov")}>
          <P>{t("These Terms are governed by the laws of Norway. Any disputes shall be subject to the exclusive jurisdiction of the courts of Oslo, Norway, except where mandatory consumer law grants you the right to bring proceedings elsewhere.","Disse vilkårene er underlagt norsk lov. Eventuelle tvister skal behandles av domstolene i Oslo, Norge, med mindre ufravikelig forbrukervernlovgivning gir deg rett til å reise sak et annet sted.")}</P>
        </Section>

        <Section num={12} title={t("Mandatory Rights","Ufravikelige rettigheter")}>
          <P>{t("Nothing in these Terms excludes liability that cannot be excluded under applicable mandatory law, including for death or personal injury caused by negligence, or fraud.","Ingenting i disse vilkårene fraskriver ansvar som ikke kan fraskives etter ufravikelig lovgivning, inkludert ansvar for død eller personskade forårsaket av uaktsomhet, eller svindel.")}</P>
        </Section>

        <Section num={13} title={t("Subscription and Payment","Abonnement og betaling")}>
          <P>{t(
            "My Quarter requires a paid subscription after a 7-day free trial. Subscription options: NOK 49/month or NOK 489/year. Payment is processed by Apple through the App Store. Prices may vary by region.",
            "Mitt Kvartal krever et betalt abonnement etter en 7-dagers gratis prøveperiode. Abonnementsalternativer: NOK 49/mnd eller NOK 489/år. Betaling behandles av Apple via App Store. Priser kan variere etter region."
          )}</P>
          <P>{t(
            "Your subscription automatically renews unless cancelled at least 24 hours before the end of the current period. You can manage and cancel your subscription in your Apple ID Account Settings.",
            "Abonnementet ditt fornyes automatisk med mindre det avbestilles minst 24 timer før slutten av gjeldende periode. Du kan administrere og avbestille abonnementet i Apple ID-kontoinnstillingene dine."
          )}</P>
          <P>{t(
            "The 7-day free trial is available to new users only. Unused trial time is forfeited upon purchase of a subscription.",
            "Den 7-dagers gratis prøveperioden er kun tilgjengelig for nye brukere. Ubrukt prøvetid bortfaller ved kjøp av abonnement."
          )}</P>
        </Section>

        <Section num={14} title={t("Contact","Kontakt")}>
          <P>My Quarter — hello@myquarter.app</P>
        </Section>

        <p style={{fontSize:11,color:"#C4BDB0",marginTop:20,lineHeight:1.8,fontStyle:"italic"}}>
          {t("By using the app, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.","Ved å bruke appen bekrefter du at du har lest, forstått og godtar å være bundet av disse brukervilkårene.")}
        </p>
        <p style={{fontSize:11,color:"#C4BDB0",marginTop:8}}>© {new Date().getFullYear()} My Quarter. {t("All rights reserved.","Alle rettigheter forbeholdt.")}</p>
      </div>
    </div>
  );
}


function SettingsView({lang,setLang,userName,setUserName}) {
  const [showTerms,setShowTerms] = useState(false);
  const [localName,setLocalName] = useState(userName||"");
  const [localLang,setLocalLang] = useState(lang||"en");
  const isSaved = localName===userName && localLang===lang;

  const doSave = () => {
    setUserName(localName);
    setLang(localLang);
    save("v4_lang",localLang);
    save("v4_name",localName);
  };

  return (
    <div className="fade">
      <div className="card" style={{marginBottom:12}}>
        <p className="ctitle">{T(lang,"profile")}</p>
        <p style={{fontSize:12,color:"#8A7E6E",marginBottom:7}}>
          {lang==="en"?"Your name":lang==="de"?"Dein Name":lang==="es"?"Tu nombre":lang==="sv"?"Ditt namn":lang==="da"?"Dit navn":"Ditt navn"}
        </p>
        <input type="text" value={localName} onChange={e=>setLocalName(e.target.value)}
          placeholder={lang==="en"?"First name":lang==="de"?"Vorname":lang==="es"?"Nombre":lang==="sv"?"Förnamn":lang==="da"?"Fornavn":"Fornavn"}/>
      </div>
      <div className="card" style={{marginBottom:12}}>
        <p className="ctitle">{T(lang,"languageLabel")}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:6}}>
          {LANGUAGES.map(l=>(
            <button key={l.code} onClick={()=>setLocalLang(l.code)}
              style={{padding:"10px 12px",border:`1.5px solid ${localLang===l.code?"#2A2318":"#E2DDD3"}`,borderRadius:8,background:localLang===l.code?"#2A2318":"#FAFAF7",color:localLang===l.code?"#F6F3EE":"#2A2318",cursor:"pointer",display:"flex",alignItems:"center",gap:9,fontSize:13,transition:"all .15s",fontFamily:"DM Sans,sans-serif"}}>
              <span style={{fontSize:20}}>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      </div>
      <button className="btn bd" onClick={doSave}
        style={{width:"100%",justifyContent:"center",padding:"11px",fontSize:14,opacity:isSaved?0.5:1}}>
        {isSaved
          ?(lang==="en"?"Saved ✓":lang==="de"?"Gespeichert ✓":lang==="es"?"Guardado ✓":lang==="sv"?"Sparat ✓":lang==="da"?"Gemt ✓":"Lagret ✓")
          :T(lang,"saveSettings")||"Save"}
      </button>
      {showTerms&&<TermsView onClose={()=>setShowTerms(false)} lang={lang}/>}
      <div className="card" style={{marginTop:12,marginBottom:12}}>
        <p className="ctitle" style={{marginBottom:10}}>{lang==="en"?"About":"Om"}</p>

        {/* App info */}
        <div style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid #F0EDE6"}}>
          <p style={{fontSize:15,fontFamily:"Cormorant Garamond,serif",fontWeight:400,color:"#2A2318",marginBottom:4}}>
            {lang==="en"?"My Quarter":"Mitt Kvartal"}
          </p>
          <p style={{fontSize:12,color:"#8A7E6E",lineHeight:1.7}}>
            {lang==="en"
              ?"A personal planning app built around 90-day quarterly cycles. Set goals, build daily routines, track habits and reflect – day by day, quarter by quarter."
              :"En personlig planleggingsapp bygget rundt 90-dagers kvartalssykluser. Sett mål, bygg daglige rutiner, spor vaner og reflekter – dag for dag, kvartal etter kvartal."}
          </p>
        </div>

        {/* Version + contact */}
        <div style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid #F0EDE6"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#8A7E6E"}}>{lang==="en"?"Version":"Versjon"}</span>
            <span style={{fontSize:12,color:"#2A2318"}}>1.0.0</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:12,color:"#8A7E6E"}}>{lang==="en"?"Contact":"Kontakt"}</span>
            <span style={{fontSize:12,color:"#A8C9B0"}}>hello@myquarter.app</span>
          </div>
        </div>

        {/* Legal */}
        <div>
          <p style={{fontSize:11,color:"#C4BDB0",lineHeight:1.8}}>
            {lang==="en"
              ?"By using this app you agree to our Terms of Service and Privacy Policy. My Quarter does not provide medical, psychological or financial advice. Content is for personal planning purposes only. Use at your own discretion."
              :"Ved å bruke denne appen godtar du våre brukervilkår og personvernerklæring. Mitt Kvartal gir ikke medisinsk, psykologisk eller finansiell rådgivning. Innholdet er kun ment for personlig planlegging. Bruk etter eget skjønn."}
          </p>
          <button onClick={()=>setShowTerms(true)}
            style={{fontSize:11,color:"#A8C9B0",background:"none",border:"none",cursor:"pointer",padding:"4px 0",textDecoration:"underline",display:"block",marginBottom:4}}>
            {lang==="en"?"Read Terms & Conditions":"Les brukervilkårene"}
          </button>
          <p style={{fontSize:11,color:"#C4BDB0",marginTop:4}}>
            © {new Date().getFullYear()} My Quarter. {lang==="en"?"All rights reserved.":"Alle rettigheter forbeholdt."}
          </p>
        </div>
      </div>
    </div>
  );
}
function WeeklyView({weeklyGoals,setWeeklyGoals,dayData,updateDay,getDayField,lang,selectedDay,setSelectedDay}) {
  const [offset,setOffset] = useState(0);
  const ws = (() => {const d=new Date();d.setDate(d.getDate()-dow(d)+offset*7);d.setHours(0,0,0,0);return d;})();
  const days = Array(7).fill(null).map((_,i)=>addDays(ws,i));
  const wk = toKey(ws);
  const wg = weeklyGoals[wk]||[];
  const setWG = (i,f,v) => {const u=[...wg];u[i]={...(u[i]||{}),[f]:v};setWeeklyGoals({...weeklyGoals,[wk]:u});};
  const wLabel = `${fmtShort(days[0],lang)} – ${fmtShort(days[6],lang)} ${days[6].getFullYear()}`;
  const rows = [[0,1],[2,3],[4,5],[6,null]];

  return (
    <div className="fade">
      <div className="card" style={{padding:"11px 14px",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button className="btn bo bs" onClick={()=>setOffset(o=>o-1)}>←</button>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,flex:1,textAlign:"center"}}>{wLabel}</span>
          <button className="btn bo bs" onClick={()=>setOffset(o=>o+1)}>→</button>
          {offset!==0&&<button className="btn bd bs" onClick={()=>setOffset(0)}>Nå</button>}
        </div>
      </div>
      {rows.map(([a,b],ri)=>(
        <div key={ri} className="g2" style={{marginBottom:4}}>
          {[a,b].map(idx=>{
            if(idx===null) return (
              <div key="wg" className="card" style={{padding:"11px 14px",marginBottom:0}}>
                <p className="ctitle">{T(lang,"weeklyGoals")}</p>
                {wg.map((g,i)=>(
                  <div key={i} className="cr">
                    <Cb on={!!g.done} toggle={()=>setWG(i,"done",!g.done)}/>
                    <input className="ig" placeholder={`Mål ${i+1}`} value={g.text||""}
                      onChange={e=>setWG(i,"text",e.target.value)}
                      style={{textDecoration:g.done?"line-through":"none",color:g.done?"#C4BDB0":undefined}}/>
                  </div>
                ))}
                <button className="btn bo bs" style={{marginTop:7}} onClick={()=>setWeeklyGoals({...weeklyGoals,[wk]:[...wg,{text:"",done:false}]})}>{T(lang,"addTask")}</button>
              </div>
            );
            const day=days[idx];const dk=toKey(day);const isT=dk===todayKey();
            const items=getDayField(dk,"weekItems",[]);
            const sched = getDayField(dk,"schedule",{});
            const schedFilled = Object.keys(sched).filter(k=>sched[k]&&!k.endsWith("_remind")&&!k.endsWith("_repeat")).sort();
            return (
              <WeekDayCard key2={idx} dk={dk} day={day} isT={isT}
                sched={sched} schedFilled={schedFilled}
                updateDay={updateDay} lang={lang}
                dayGoal={getDayField(dk,"goal","")}/>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── MONTHLY ──────────────────────────────────────────────────────────────────
function MonthlyView({dayData,updateDay,getDayField,openDay,monthlyData,setMonthlyData,ql,lang,selectedDay}) {
  const [vd,setVd] = useState(new Date());
  const [activeDk,setActiveDk] = useState(null);
  const yr=vd.getFullYear(),mo=vd.getMonth();
  const dim=daysInMonth(yr,mo),firstDow2=dow(new Date(yr,mo,1));
  const cells=Array(firstDow2).fill(null).concat(Array(dim).fill(null).map((_,i)=>i+1));

  const handleDayClick = (dk) => {
    setActiveDk(prev => prev===dk ? null : dk);
  };

  const activeInfo = activeDk ? dayData[activeDk]||{} : null;
  const activeDate = activeDk ? parseKey(activeDk) : null;
  const scheduleEvents = activeInfo ? Object.entries(activeInfo.schedule||{}).filter(([,v])=>v).sort(([a],[b])=>a.localeCompare(b)) : [];
  const activeTasks = activeInfo ? (activeInfo.tasks||[]).filter(t=>t.text) : [];

  return (
    <div className="fade">
      <div className="card" style={{marginBottom:12}}>
        <div className="cal-hdr">
          <button className="btn bo bs" onClick={()=>{const d=new Date(vd);d.setMonth(d.getMonth()-1);setVd(d);}}>←</button>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:17}}>{getMo(lang)[mo].charAt(0).toUpperCase()+getMo(lang)[mo].slice(1)} {yr}</span>
          <button className="btn bo bs" onClick={()=>{const d=new Date(vd);d.setMonth(d.getMonth()+1);setVd(d);}}>→</button>
        </div>
        <div className="cal-grid" style={{marginBottom:1}}>
          {DAYS_S.map(d=><div key={d} className="cal-dl">{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map((day,idx)=>{
            if(!day) return <div key={`e${idx}`} className="cal-cell cal-empty"/>;
            const dateObj=new Date(yr,mo,day);
            const dk=toKey(dateObj);
            const info=dayData[dk]||{};
            const isToday=dk===todayKey();
            const isActive=dk===activeDk;
            const hasContent=!!(info.goal||info.tasks?.some(t=>t.text)||Object.values(info.schedule||{}).some(Boolean));
            const firstEvent=info.goal||(Object.entries(info.schedule||{}).find(([k,v])=>v&&!k.endsWith("_remind")&&!k.endsWith("_repeat"))||[])[1]||"";
            return (
              <div key={day} className={`cal-cell ${isToday?'cal-today':''} ${hasContent?'cal-dot':''}`}
                style={{background:isActive?"#EDE8DF":undefined,borderColor:isActive?"#2A2318":undefined}}
                onClick={()=>handleDayClick(dk)}>
                <span className="cal-num">{day}</span>
                {firstEvent&&<span className="cal-ev">{firstEvent}</span>}
              </div>
            );
          })}
        </div>
        <p style={{fontSize:11,color:"#8A7E6E",marginTop:8}}>{lang==="en"?"Tap a day to see details":"Trykk en dag for å se detaljer"}</p>
      </div>

      {activeDk&&(
        <div className="card fade" style={{marginBottom:12,borderColor:"#2A2318"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:17}}>{fmtDate(activeDate,lang)}</p>
            <button className="btn bd bs" onClick={()=>openDay(activeDk)}>
              {lang==="en"?"Open day":lang==="de"?"Tag öffnen":lang==="es"?"Abrir día":lang==="sv"?"Öppna dag":lang==="da"?"Åbn dag":"Åpne dag"}
            </button>
          </div>
          {activeInfo.goal&&(
            <div style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid #F5F2ED"}}>
              <p style={{fontSize:11,color:"#8A7E6E",marginBottom:3}}><span style={{display:"flex",alignItems:"center",gap:4}}><TargetIco s={12}/>{T(lang,"todayGoal")}</span></p>
              <p style={{fontSize:13}}>{activeInfo.goal}</p>
            </div>
          )}
          {scheduleEvents.length>0&&(
            <div style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid #F5F2ED"}}>
              <p style={{fontSize:11,color:"#8A7E6E",marginBottom:6}}>{T(lang,"schedule")}</p>
              {scheduleEvents.map(([h,v])=>(
                <div key={h} style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:3}}>
                  <span style={{fontSize:11,color:"#8A7E6E",width:38,flexShrink:0}}>{h}:00</span>
                  <span style={{fontSize:13}}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {activeTasks.length>0&&(
            <div>
              <p style={{fontSize:11,color:"#8A7E6E",marginBottom:6}}>{T(lang,"tasks")}</p>
              {activeTasks.map((t,i)=>(
                <div key={i} style={{display:"flex",gap:7,alignItems:"center",marginBottom:3}}>
                  <div style={{width:13,height:13,borderRadius:2,border:`1.5px solid ${t.done?"#2A2318":"#C4BDB0"}`,background:t.done?"#2A2318":"#fff",flexShrink:0}}/>
                  <span style={{fontSize:13,textDecoration:t.done?"line-through":"none",color:t.done?"#C4BDB0":"#2A2318"}}>{t.text}</span>
                </div>
              ))}
            </div>
          )}
          {!activeInfo.goal&&scheduleEvents.length===0&&activeTasks.length===0&&(
            <p style={{fontSize:13,color:"#C4BDB0",textAlign:"center",padding:"8px 0"}}>{T(lang,"noAppointments")||"No appointments"}</p>
          )}
        </div>
      )}
    </div>
  );
}
// ─── HABIT TRACKER ────────────────────────────────────────────────────────────
function HabitTracker({dayData,updateDay,getDayField,lang}) {
  const [view,setView] = useState("week");
  const now = new Date();

  // Get days for current view
  const getDays = (n) => Array.from({length:n},(_,i)=>{
    const d=new Date(now); d.setDate(now.getDate()-(n-1-i)); return d;
  });

  // For month view: days in current month
  const monthDays = (() => {
    const yr=now.getFullYear(), mo=now.getMonth();
    const dim=new Date(yr,mo+1,0).getDate();
    return Array.from({length:dim},(_,i)=>{
      const d=new Date(yr,mo,i+1); return d;
    });
  })();

  const days = view==="week" ? getDays(7) : monthDays;

  // Collect all unique morning routine items from last 30 days
  const morningItems = (() => {
    const set=new Set();
    for(let i=0;i<30;i++){const d=new Date();d.setDate(d.getDate()-i);(dayData[toKey(d)]?.morningRoutine||[]).forEach(h=>h.text&&set.add(h.text));}
    return [...set];
  })();

  // Collect all unique evening routine items
  const eveningItems = (() => {
    const set=new Set();
    for(let i=0;i<30;i++){const d=new Date();d.setDate(d.getDate()-i);(dayData[toKey(d)]?.eveningRoutine||[]).forEach(h=>h.text&&set.add(h.text));}
    return [...set];
  })();

  // Collect all unique habits (egenRoutine)
  const allHabits = (() => {
    const set=new Set();
    for(let i=0;i<30;i++){const d=new Date();d.setDate(d.getDate()-i);(dayData[toKey(d)]?.egenRoutine||[]).forEach(h=>h.text&&set.add(h.text));}
    return [...set];
  })();

  const isDone = (field, itemText, date) => {
    const k=toKey(date);
    return (dayData[k]?.[field]||[]).some(h=>h.text===itemText&&h.done);
  };

  const getStreak = (field, itemText) => {
    let s=0;
    for(let i=0;i<365;i++){
      const d=new Date(); d.setDate(d.getDate()-i);
      if(!isDone(field,itemText,d)) break;
      s++;
    }
    return s;
  };

  const toggleItem = (field, itemText, date) => {
    const k=toKey(date);
    const items=[...(dayData[k]?.[field]||[])];
    const idx=items.findIndex(h=>h.text===itemText);
    if(idx>=0) items[idx]={...items[idx],done:!items[idx].done};
    else items.push({id:Date.now(),text:itemText,done:true});
    updateDay(k,field,items);
  };

  // Row component - uses flex so boxes always fit
  const Row = ({field, itemText, icon}) => {
    const streak=getStreak(field,itemText);
    const doneCount=days.filter(d=>isDone(field,itemText,d)).length;
    const todayDone=isDone(field,itemText,now);
    return (
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:5,minWidth:0,flex:1}}>
            {icon}
            <span style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{itemText}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:8}}>
            {streak>0&&<span style={{fontSize:10,color:"#A8C9B0",display:"flex",alignItems:"center",gap:2}}><FlameIco s={10}/>{streak}</span>}
            <span style={{fontSize:10,color:"#8A7E6E"}}>{doneCount}/{days.length}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:2}}>
          {days.map((d,i)=>{
            const done=isDone(field,itemText,d);
            const isT=toKey(d)===todayKey();
            const isFut=toKey(d)>todayKey();
            return (
              <div key={i} onClick={()=>!isFut&&toggleItem(field,itemText,d)}
                style={{flex:1,height:view==="week"?22:14,borderRadius:3,minWidth:0,
                  background:done?"#A8C9B0":isFut?"transparent":isT?"#EAF3EC":"#F0EDE6",
                  border:`1px solid ${done?"#8ABD9A":isT?"#A8C9B0":isFut?"#E2DDD3":"#D4CFC8"}`,
                  cursor:isFut?"default":"pointer",transition:"background .15s"}}/>
            );
          })}
        </div>
      </div>
    );
  };

  const empty = morningItems.length===0&&eveningItems.length===0&&allHabits.length===0;

  return (
    <div className="card" style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <p className="ctitle" style={{margin:0}}>
          {lang==="en"?"Habit Tracker":lang==="sv"?"Vanespårare":lang==="da"?"Vane-tracker":"Vane-tracker"}
        </p>
        <div style={{display:"flex",gap:4}}>
          {["week","month"].map(v=>(
            <button key={v} onClick={()=>setView(v)}
              style={{padding:"3px 10px",borderRadius:20,border:`1px solid ${view===v?"#A8C9B0":"#E2DDD3"}`,
                background:view===v?"#A8C9B0":"transparent",color:view===v?"#2A2318":"#8A7E6E",
                fontSize:11,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>
              {v==="week"?(lang==="en"?"Week":"Uke"):(lang==="en"?"Month":"Mnd")}
            </button>
          ))}
        </div>
      </div>

      {empty&&(
        <p style={{fontSize:12,color:"#C4BDB0"}}>
          {lang==="en"?"Add routines and habits in the other tabs":"Legg til rutiner og vaner i de andre fanene"}
        </p>
      )}

      {morningItems.length>0&&(
        <div style={{marginBottom:12}}>
          <p style={{fontSize:10,textTransform:"uppercase",letterSpacing:".06em",color:"#8A7E6E",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
            <SunIco s={11}/>{lang==="en"?"Morning routine":"Morgenrutine"}
          </p>
          {morningItems.map(item=><Row key={item} field="morningRoutine" itemText={item} icon={null}/>)}
        </div>
      )}

      {eveningItems.length>0&&(
        <div style={{marginBottom:12}}>
          <p style={{fontSize:10,textTransform:"uppercase",letterSpacing:".06em",color:"#8A7E6E",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
            <MoonIco s={11}/>{lang==="en"?"Evening routine":"Kveldsrutine"}
          </p>
          {eveningItems.map(item=><Row key={item} field="eveningRoutine" itemText={item} icon={null}/>)}
        </div>
      )}

      {allHabits.length>0&&(
        <div>
          <p style={{fontSize:10,textTransform:"uppercase",letterSpacing:".06em",color:"#8A7E6E",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
            <LeafIco s={11}/>{lang==="en"?"My habits":"Mine vaner"}
          </p>
          {allHabits.map(habit=><Row key={habit} field="egenRoutine" itemText={habit} icon={null}/>)}
        </div>
      )}
    </div>
  );
}


// ─── ROUTINE ──────────────────────────────────────────────────────────────────
function RoutineSection({dk,field,label,icon,items,updateDay,getDayField,lang,showConfetti,addLabel}) {
  const toggle = i => {const u=[...items]; if(!u[i].done) showConfetti&&showConfetti("✓"); u[i]={...u[i],done:!u[i].done};updateDay(dk,field,u);};
  const updateText = (i,v) => {const u=[...items];u[i]={...u[i],text:v};updateDay(dk,field,u);};
  const addItem = () => updateDay(dk,field,[...items,{text:"",done:false}]);
  const removeItem = i => updateDay(dk,field,items.filter((_,j)=>j!==i));
  const done = items.filter(i=>i.done).length;
  const total = items.filter(i=>i.text).length;
  return (
    <div className="card" style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:total>0?8:6}}>
        <p className="ctitle" style={{margin:0,display:"flex",alignItems:"center",gap:6}}>{icon}{label}</p>
        {total>0&&<span style={{fontSize:11,color:"#8A7E6E"}}>{done}/{total}</span>}
      </div>
      {total>0&&(
        <div style={{marginBottom:10,height:3,background:"#EDE8E0",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(done/total)*100}%`,background:"#A8C9B0",borderRadius:2,transition:"width .3s"}}/>
        </div>
      )}
      {items.map((item,i)=>(
        <div key={i} className="cr">
          <Cb on={!!item.done} toggle={()=>toggle(i)}/>
          <input className="ig" placeholder={`${label} ${i+1}`} value={item.text||""}
            onChange={e=>updateText(i,e.target.value)}
            style={{textDecoration:item.done?"line-through":"none",color:item.done?"#C4BDB0":undefined}}/>
          <button className="bi" onClick={()=>removeItem(i)}><Ico d="M6 18L18 6M6 6l12 12" s={12}/></button>
        </div>
      ))}
      <button className="btn bo bs" style={{marginTop:8,fontSize:12}} onClick={addItem}>{addLabel}</button>
    </div>
  );
}

function RoutineView({dayData,updateDay,getDayField,lang,showConfetti}) {
  const [rtab,setRtab] = useState("all");
  const dk = todayKey();
  const morningItems = getDayField(dk,"morningRoutine",[]);
  const eveningItems = getDayField(dk,"eveningRoutine",[]);
  const habitItems   = getDayField(dk,"egenRoutine",[]);
  const nextStep     = getDayField(dk,"nextStep","");
  const addLbl = T(lang,"addStep")||"+ Add step";

  const tabs = [
    {id:"all",     label:lang==="en"?"All":lang==="de"?"Alle":lang==="es"?"Todo":lang==="sv"?"Alla":lang==="da"?"Alle":"Alle", icon:null},
    {id:"morning", label:T(lang,"morningRoutine"), icon:<SunIco s={12}/>},
    {id:"evening", label:T(lang,"eveningRoutine"), icon:<MoonIco s={12}/>},
    {id:"habits",  label:T(lang,"myHabits"),       icon:<LeafIco s={12}/>},
    {id:"tracker", label:lang==="en"?"Tracker":lang==="de"?"Tracker":lang==="es"?"Tracker":lang==="sv"?"Tracker":lang==="da"?"Tracker":"Tracker", icon:<TargetIco s={12}/>},
  ];

  return (
    <div className="fade">
      <div style={{display:"flex",gap:4,marginBottom:14,borderBottom:"1px solid #E2DDD3",paddingBottom:10,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setRtab(t.id)}
            style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${rtab===t.id?"#A8C9B0":"#E2DDD3"}`,background:rtab===t.id?"#A8C9B0":"transparent",color:rtab===t.id?"#2A2318":"#5A5040",fontSize:11,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap",flexShrink:0,fontFamily:"DM Sans,sans-serif"}}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {rtab==="tracker"&&(
        <HabitTracker dayData={dayData} updateDay={updateDay} getDayField={getDayField} lang={lang}/>
      )}
      {(rtab==="all"||rtab==="morning")&&(
        <RoutineSection dk={dk} field="morningRoutine" label={T(lang,"morningRoutine")} icon={<SunIco s={14}/>}
          items={morningItems} updateDay={updateDay} getDayField={getDayField} lang={lang} showConfetti={showConfetti} addLabel={addLbl}/>
      )}
      {(rtab==="all"||rtab==="evening")&&(
        <RoutineSection dk={dk} field="eveningRoutine" label={T(lang,"eveningRoutine")} icon={<MoonIco s={14}/>}
          items={eveningItems} updateDay={updateDay} getDayField={getDayField} lang={lang} showConfetti={showConfetti} addLabel={addLbl}/>
      )}
      {(rtab==="all"||rtab==="habits")&&(
        <RoutineSection dk={dk} field="egenRoutine" label={T(lang,"myHabits")} icon={<LeafIco s={14}/>}
          items={habitItems} updateDay={updateDay} getDayField={getDayField} lang={lang} showConfetti={showConfetti} addLabel={addLbl}/>
      )}

    </div>
  );
}

// ─── DEFAULT PROMPTS ──────────────────────────────────────────────────────────

// ─── JOURNAL ──────────────────────────────────────────────────────────────────
function JournalView({journalEntries,setJournalEntries,lang,evals,setEvals,goals}) {
  const [journalTab,setJournalTab] = useState("write");
  const dk = todayKey();

  const entry = journalEntries[dk]||{text:"",title:""};
  const save = (field,val) => setJournalEntries(j=>({...j,[dk]:{...entry,[field]:val,date:dk,type:"journal"}}));

  const tabs = [
    {id:"write",  label:lang==="en"?"Write":lang==="de"?"Schreiben":lang==="es"?"Escribir":lang==="sv"?"Skriv":lang==="da"?"Skriv":"Skriv"},
    {id:"archive",label:lang==="en"?"Archive":lang==="de"?"Archiv":lang==="es"?"Archivo":lang==="sv"?"Arkiv":lang==="da"?"Arkiv":"Arkiv"},
    {id:"eval",   label:lang==="en"?"Evaluate":lang==="de"?"Auswerten":lang==="es"?"Evaluar":lang==="sv"?"Utvärdera":lang==="da"?"Evaluer":"Evaluer"},
  ];

  const TabBar = () => (
    <div style={{display:"flex",gap:4,marginBottom:14,borderBottom:"1px solid #E2DDD3",paddingBottom:10}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setJournalTab(t.id)}
          style={{padding:"5px 14px",borderRadius:20,border:`1px solid ${journalTab===t.id?"#A8C9B0":"#E2DDD3"}`,
            background:journalTab===t.id?"#A8C9B0":"transparent",color:journalTab===t.id?"#2A2318":"#5A5040",
            fontSize:12,cursor:"pointer",transition:"all .15s",fontFamily:"DM Sans,sans-serif"}}>
          {t.label}
        </button>
      ))}
    </div>
  );

  if(journalTab==="archive") return (
    <div className="fade"><TabBar/><ArchiveView journalEntries={journalEntries} evals={evals} lang={lang}/></div>
  );
  if(journalTab==="eval") return (
    <div className="fade"><TabBar/><EvaluationView evals={evals} setEvals={setEvals} goals={goals} lang={lang}/></div>
  );

  return (
    <div className="fade">
      <TabBar/>
      <div className="card">
        <input type="text"
          placeholder={lang==="en"?"Title (optional)…":lang==="de"?"Titel (optional)…":lang==="es"?"Título (opcional)…":lang==="sv"?"Titel (valfritt)…":lang==="da"?"Titel (valgfrit)…":"Tittel (valgfritt)…"}
          value={entry.title||""}
          onChange={e=>save("title",e.target.value)}
          style={{marginBottom:10,fontFamily:"Cormorant Garamond,serif",fontSize:18,border:"none",borderBottom:"1px solid #E2DDD3",borderRadius:0,paddingLeft:0,paddingRight:0,fontWeight:300}}/>
        <textarea
          placeholder={lang==="en"?"Write about your day, thoughts or reflections…":lang==="de"?"Schreibe über deinen Tag, Gedanken oder Reflexionen…":lang==="es"?"Escribe sobre tu día, pensamientos o reflexiones…":lang==="sv"?"Skriv om din dag, tankar eller reflektioner…":lang==="da"?"Skriv om din dag, tanker eller refleksioner…":"Skriv om dagen din, tanker eller refleksjoner…"}
          value={entry.text||""}
          onChange={e=>save("text",e.target.value)}
          style={{minHeight:300,resize:"none"}}/>
        <p style={{fontSize:11,color:"#C4BDB0",marginTop:6}}>{T(lang,"savedAuto")} · {dk}</p>
      </div>
    </div>
  );
}

// ─── ARCHIVE ──────────────────────────────────────────────────────────────────
function ArchiveView({journalEntries,evals,lang}) {
  const [search,setSearch] = useState("");
  const [archTab,setArchTab] = useState("journal");
  const [exp,setExp] = useState(null);

  const journalItems = Object.entries(journalEntries)
    .filter(([,v])=>v.text?.trim()&&(v.type==="journal"||!v.type))
    .sort(([a],[b])=>b.localeCompare(a));

  const evalItems = Object.entries(evals)
    .filter(([,v])=>Object.values(v).some(x=>typeof x==="string"&&x.trim()))
    .map(([k,v])=>({key:k,label:{weekly:T(lang,"evalWeek"),monthly30:T(lang,"evalMonth"),quarterly:T(lang,"evalQuarter")}[k]||k,stars:v.stars,qs:[v.q0,v.q1,v.q2,v.q3].filter(Boolean)}))
    .filter(e=>e.qs.length>0);

  const filtered = archTab==="journal"
    ? (search?journalItems.filter(([,v])=>v.text?.toLowerCase().includes(search.toLowerCase())||v.prompt?.toLowerCase().includes(search.toLowerCase())):journalItems)
    : evalItems;

  return (
    <div className="fade">
      <div className="arch-tabs">
        <button className={`arch-tab ${archTab==='journal'?'on':''}`} onClick={()=>setArchTab("journal")}>Journal</button>
        <button className={`arch-tab ${archTab==='eval'?'on':''}`} onClick={()=>setArchTab("eval")}>{lang==="en"?"Evaluate":lang==="de"?"Auswerten":lang==="es"?"Evaluar":lang==="sv"?"Utvärdera":lang==="da"?"Evaluer":"Evaluer"}</button>
      </div>

      {archTab==="journal"&&(
        <input type="text" placeholder={T(lang,"searchJournal")} value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}}/>
      )}

      {filtered.length===0&&(
        <div className="card" style={{textAlign:"center",padding:36}}>
          <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,color:"#C4BDB0",fontStyle:"italic"}}>Ingen oppføringer ennå</p>
        </div>
      )}

      {archTab==="journal"&&filtered.map(([key,entry])=>{
        const isOpen=exp===key;
        return (
          <div key={key} className="card" style={{cursor:"pointer",marginBottom:9}} onClick={()=>setExp(isOpen?null:key)}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:11,color:"#8A7E6E",marginBottom:3}}>{entry.date}</p>
                {entry.prompt&&<p style={{fontSize:12,color:"#C4A85A",fontStyle:"italic",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{entry.prompt}"</p>}
                <p style={{fontSize:13,color:"#5A5040",lineHeight:1.5}}>
                  {isOpen?entry.text:entry.text.slice(0,100)+(entry.text.length>100?"…":"")}
                </p>
              </div>
              <span style={{fontSize:12,color:"#8A7E6E",flexShrink:0}}>{isOpen?"▲":"▼"}</span>
            </div>
          </div>
        );
      })}

      {archTab==="chat"&&Object.entries(journalEntries)
        .filter(([,e])=>e.type==="chat")
        .sort(([,a],[,b])=>b.date?.localeCompare(a.date))
        .map(([key,entry])=>(
          <div key={key} className="card" style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:500}}>{entry.title||"AI conversation"}</span>
              <span style={{fontSize:11,color:"#8A7E6E"}}>{entry.date}</span>
            </div>
            <p style={{fontSize:12,color:"#8A7E6E",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{entry.text?.slice(0,200)}{entry.text?.length>200?"…":""}</p>
          </div>
        ))
      }
      {archTab==="eval"&&evalItems.map(e=>(
        <div key={e.key} className="card" style={{marginBottom:9,cursor:"pointer"}} onClick={()=>setExp(exp===e.key?null:e.key)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <p style={{fontSize:14,fontWeight:500}}>{e.label}</p>
            <div style={{display:"flex",gap:2}}>
              {e.stars&&[1,2,3,4,5].map(s=><span key={s} style={{fontSize:14,color:s<=e.stars?"#8A7E6E":"#E2DDD3"}}>★</span>)}
            </div>
          </div>
          {exp===e.key&&e.qs.map((q,i)=>(
            <div key={i} style={{marginTop:10,paddingTop:10,borderTop:"1px solid #F0EDE6"}}>
              <p style={{fontSize:13,color:"#5A5040",lineHeight:1.55}}>{q}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── EVALUATION ───────────────────────────────────────────────────────────────
function EvaluationView({evals,setEvals,goals,lang}) {
  const [at,setAt] = useState("weekly");
  const SECS = {
    weekly:{label:T(lang,"evalWeek"),qs:lang==="en"?["What went well?","What was challenging?","What am I proud of?","What will I do differently?"]:lang==="de"?["Was lief gut?","Was war schwierig?","Worauf bin ich stolz?","Was mache ich anders?"]:lang==="es"?["¿Qué salió bien?","¿Qué fue difícil?","¿De qué estoy orgulloso/a?","¿Qué haré diferente?"]:lang==="sv"?["Vad gick bra?","Vad var utmanande?","Vad är jag stolt över?","Vad gör jag annorlunda?"]:lang==="da"?["Hvad gik godt?","Hvad var udfordrende?","Hvad er jeg stolt af?","Hvad gør jeg anderledes?"]:["Hva gikk bra?","Hva var utfordrende?","Hva er jeg stolt av?","Hva gjør jeg annerledes?"]},
    monthly30:{label:T(lang,"evalMonth"),qs:lang==="en"?["Which goals did I reach?","What did I learn?","What will I adjust?","What am I most proud of?"]:lang==="de"?["Welche Ziele habe ich erreicht?","Was habe ich gelernt?","Was werde ich anpassen?","Worauf bin ich am stolzesten?"]:lang==="es"?["¿Qué objetivos logré?","¿Qué aprendí?","¿Qué ajustaré?","¿De qué estoy más orgulloso/a?"]:lang==="sv"?["Vilka mål nådde jag?","Vad lärde jag mig?","Vad vill jag justera?","Vad är jag mest stolt över?"]:lang==="da"?["Hvilke mål nåede jeg?","Hvad lærte jeg?","Hvad vil jeg justere?","Hvad er jeg mest stolt af?"]:["Hvilke mål nådde jeg?","Hva lærte jeg?","Hva vil jeg justere?","Hva er jeg mest stolt av?"]},
    quarterly:{label:T(lang,"evalQuarter"),qs:lang==="en"?["Which starred goals did I reach?","What worked best?","What do I take forward?","What do I adjust next quarter?"]:lang==="de"?["Welche Prioritätsziele habe ich erreicht?","Was hat am besten funktioniert?","Was nehme ich mit?","Was ändere ich nächstes Quartal?"]:lang==="es"?["¿Qué objetivos destacados logré?","¿Qué funcionó mejor?","¿Qué me llevo adelante?","¿Qué ajusto el próximo trimestre?"]:lang==="sv"?["Vilka stjärnmål nådde jag?","Vad fungerade bäst?","Vad tar jag med mig?","Vad justerar jag nästa kvartal?"]:lang==="da"?["Hvilke stjernede mål nåede jeg?","Hvad fungerede bedst?","Hvad tager jeg med videre?","Hvad justerer jeg næste kvartal?"]:["Hvilke stjernede mål nådde jeg?","Hva fungerte best?","Hva tar jeg med videre?","Hva justerer jeg neste kvartal?"]},
  };
  const sec=SECS[at];
  const ev=evals[at]||{};
  const set=(f,v)=>setEvals(e=>({...e,[at]:{...(e[at]||{}),[f]:v}}));
  const starred=goals.filter(g=>g.starred);

  return (
    <div className="fade">
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {Object.entries(SECS).map(([id,s])=>(
          <button key={id} className={`btn bs ${at===id?'bd':'bo'}`} onClick={()=>setAt(id)}>{s.label}</button>
        ))}
      </div>
      <div className="card">
        <div style={{marginBottom:16}}>
          <p style={{fontSize:11,color:"#8A7E6E",marginBottom:6,textTransform:"uppercase",letterSpacing:".07em"}}>{T(lang,"score")}</p>
          <div style={{display:"flex",gap:5}}>
            {[1,2,3,4,5].map(s=>(
              <span key={s} style={{fontSize:22,cursor:"pointer",color:s<=(ev.stars||0)?"#8A7E6E":"#E2DDD3",transition:"color .15s"}} onClick={()=>set("stars",s)}>★</span>
            ))}
          </div>
        </div>
        {at==="quarterly"&&starred.length>0&&(
          <div style={{marginBottom:16}}>
            <p style={{fontSize:12,color:"#8A7E6E",marginBottom:8}}>Kvartalsmål – huk av hva du oppnådde:</p>
            {starred.map(g=>(
              <div key={g.id} className="cr">
                <Cb on={!!g.done} toggle={()=>{}}/>
                <span style={{fontSize:13,flex:1,textDecoration:g.done?"line-through":"none",color:g.done?"#C4BDB0":undefined}}>{g.text}</span>
                <CatBadge cat={g.cat||"Personlig"} lang={lang}/>
              </div>
            ))}
          </div>
        )}
        {sec.qs.map((q,i)=>(
          <div key={i} style={{marginBottom:14}}>
            <p style={{fontSize:12,color:"#8A7E6E",marginBottom:5,fontStyle:"italic"}}>{q}</p>
            <textarea style={{minHeight:70}} placeholder={T(lang,"evalPlaceholder")} value={ev[`q${i}`]||""} onChange={e=>set(`q${i}`,e.target.value)}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
