import type { LocaleCode } from "@/lib/locale";
import { SITE_NAME } from "@/lib/site-config";

export type AboutSectionId = "hero" | "journey" | "mission" | "promise" | "team" | "join";

export type AboutPromiseCard = {
  icon: string;
  title: string;
  description: string;
};

export type AboutPageContentData = {
  ariaLabel: string;
  navAriaLabel: string;
  goToSectionAriaLabel: (sectionLabel: string) => string;
  sections: readonly { id: AboutSectionId; label: string }[];
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  journey: {
    title: string;
    text: string;
    cta: string;
  };
  mission: {
    title: string;
    cta: string;
  };
  promise: {
    title: string;
    cards: readonly AboutPromiseCard[];
    cta: string;
  };
  team: {
    title: string;
    text: string;
    cta: string;
  };
  join: {
    title: string;
    text: string;
    cta: string;
  };
};

const aboutPageEn = (): AboutPageContentData => ({
  ariaLabel: "About page sections",
  navAriaLabel: "Page sections",
  goToSectionAriaLabel: (sectionLabel) => `Go to section: ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Hero" },
    { id: "journey", label: "Our Journey" },
    { id: "mission", label: "Mission" },
    { id: "promise", label: "Our Promise" },
    { id: "team", label: "Team" },
    { id: "join", label: "Join" },
  ],
  hero: {
    kicker: `About ${SITE_NAME}`,
    title: "Style starts in the browser.",
    subtitle: `Welcome to ${SITE_NAME} — unblocked games and free HTML5 browser games. Open a title, hit play, and skip the download.`,
    cta: "Start styling",
  },
  journey: {
    title: "How this closet grew",
    text: `We started with unblocked HTML5 games we actually reopen: action, puzzles, racing, sports, arcade, and strategy in a browser tab. ${SITE_NAME} is that collection — same play style as other unblocked sites, with our own page copy.`,
    cta: "See what’s next →",
  },
  mission: {
    title: "Make outfit play easy, creative, and free for anyone who likes getting dressed up.",
    cta: "Sounds good →",
  },
  promise: {
    title: "What we stand for",
    cards: [
      {
        icon: "∞",
        title: "Free looks",
        description: "No paywall. Every unblocked game here is free to open.",
      },
      {
        icon: "♡",
        title: "Instant outfits",
        description: "Click a game and start dragging clothes. No installer, no account wall.",
      },
      {
        icon: "◆",
        title: "Gentle play",
        description: "We aim for family-friendly styling games — creative, not gory or grim.",
      },
      {
        icon: "+",
        title: "New wardrobes",
        description: "New unblocked HTML5 titles join the grid as we find them.",
      },
    ],
    cta: "Ready to mix a look? →",
  },
  team: {
    title: `The people behind ${SITE_NAME}`,
    text: `We are a small group who still lose time in virtual closets. Each game is added because it is actually fun to style — not because it filled a generic games homepage.`,
    cta: "Browse the racks →",
  },
  join: {
    title: "Open a closet",
    text: "Unblocked games and free HTML5 browser games. Zero downloads. Play on any device.",
    cta: "Play unblocked games",
  },
});

const aboutPageEs = (): AboutPageContentData => ({
  ariaLabel: "Secciones de la página Acerca de",
  navAriaLabel: "Secciones de la página",
  goToSectionAriaLabel: (sectionLabel) => `Ir a la sección: ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Inicio" },
    { id: "journey", label: "Nuestro recorrido" },
    { id: "mission", label: "Misión" },
    { id: "promise", label: "Nuestra promesa" },
    { id: "team", label: "Equipo" },
    { id: "join", label: "Únete" },
  ],
  hero: {
    kicker: `Acerca de ${SITE_NAME}`,
    title: "El estilo empieza en el navegador.",
    subtitle: `Bienvenido a ${SITE_NAME} — un espacio para juegos de vestir, maquillaje y moda gratis. Abre un armario, prueba un look y olvídate de las descargas.`,
    cta: "Empezar a vestir",
  },
  journey: {
    title: "Cómo creció este armario",
    text: `Empezamos reuniendo juegos de vestir a los que sí queríamos volver: armarios amplios, paletas de maquillaje decentes y salones donde puedes cambiar el peinado dos veces. ${SITE_NAME} es esa colección, ordenada para que encuentres un vestido de princesa o un look urbano sin mezclarlo con otros géneros.`,
    cta: "Ver qué sigue →",
  },
  mission: {
    title: "Hacer que vestir personajes sea fácil, creativo y gratis para quien disfrute combinando ropa.",
    cta: "Me gusta →",
  },
  promise: {
    title: "Nuestra promesa",
    cards: [
      {
        icon: "∞",
        title: "Looks gratis",
        description: "Sin muro de pago. Cada juego de vestir o maquillaje se abre sin coste.",
      },
      {
        icon: "♡",
        title: "Al instante",
        description: "Haz clic y empieza a arrastrar ropa. Sin instalador ni registro.",
      },
      {
        icon: "◆",
        title: "Juego suave",
        description: "Buscamos juegos de estilo aptos para familias: creativos, no violentos.",
      },
      {
        icon: "+",
        title: "Nuevos armarios",
        description: "Vamos sumando juegos de vestir, salón y moda cuando encontramos buenos títulos.",
      },
    ],
    cta: "¿Listo para un look? →",
  },
  team: {
    title: `Las personas detrás de ${SITE_NAME}`,
    text: `Somos un equipo pequeño que todavía pierde el tiempo en armarios virtuales. Cada juego entra porque da gusto vestirlo, no para rellenar una portada genérica.`,
    cta: "Ver la colección →",
  },
  join: {
    title: "Abre un armario",
    text: "Juegos de vestir, maquillaje y moda gratis en el navegador. Cero descargas. Combina un look en cualquier dispositivo.",
    cta: "Jugar ahora",
  },
});

const aboutPageFr = (): AboutPageContentData => ({
  ariaLabel: "Sections de la page À propos",
  navAriaLabel: "Sections de la page",
  goToSectionAriaLabel: (sectionLabel) => `Aller à la section : ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Accueil" },
    { id: "journey", label: "Notre parcours" },
    { id: "mission", label: "Mission" },
    { id: "promise", label: "Notre promesse" },
    { id: "team", label: "Équipe" },
    { id: "join", label: "Rejoindre" },
  ],
  hero: {
    kicker: `À propos de ${SITE_NAME}`,
    title: "Le style commence dans le navigateur.",
    subtitle: `Bienvenue sur ${SITE_NAME} — des jeux d'habillage, de maquillage et de mode gratuits. Ouvrez un dressing, composez un look, sans téléchargement.`,
    cta: "Commencer à styliser",
  },
  journey: {
    title: "Comment ce dressing s'est agrandi",
    text: `Nous avons d'abord rassemblé des jeux d'habillage que nous avions vraiment envie de rejouer : des dressings généreux, des palettes correctes, des salons où l'on peut changer de coupe deux fois. ${SITE_NAME}, c'est cette collection, rangée pour trouver une robe de princesse ou un look street sans traverser d'autres genres.`,
    cta: "La suite →",
  },
  mission: {
    title: "Rendre le jeu d'habillage simple, créatif et gratuit pour tous ceux qui aiment composer une tenue.",
    cta: "Parfait →",
  },
  promise: {
    title: "Notre promesse",
    cards: [
      {
        icon: "∞",
        title: "Looks gratuits",
        description: "Pas de péage. Chaque jeu d'habillage ou de maquillage s'ouvre sans frais.",
      },
      {
        icon: "♡",
        title: "Tout de suite",
        description: "Cliquez et glissez des vêtements. Pas d'installateur, pas de compte obligatoire.",
      },
      {
        icon: "◆",
        title: "Jeu doux",
        description: "Nous visons des jeux de style familiaux — créatifs, pas violents.",
      },
      {
        icon: "+",
        title: "Nouveaux dressings",
        description: "Des titres d'habillage, de salon et de mode rejoignent les cintres au fil du temps.",
      },
    ],
    cta: "Prêt pour un look ? →",
  },
  team: {
    title: `Les personnes derrière ${SITE_NAME}`,
    text: `Nous sommes une petite équipe qui perd encore du temps dans les dressings virtuels. Chaque jeu est ajouté parce qu'il est vraiment plaisant à styliser.`,
    cta: "Voir les cintres →",
  },
  join: {
    title: "Ouvrir un dressing",
    text: "Jeux d'habillage, de maquillage et de mode gratuits dans le navigateur. Zéro téléchargement. Composez un look sur n'importe quel appareil.",
    cta: "Jouer maintenant",
  },
});

const aboutPageNl = (): AboutPageContentData => ({
  ariaLabel: "Over ons-paginasecties",
  navAriaLabel: "Paginasecties",
  goToSectionAriaLabel: (sectionLabel) => `Ga naar sectie: ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Start" },
    { id: "journey", label: "Onze reis" },
    { id: "mission", label: "Missie" },
    { id: "promise", label: "Onze belofte" },
    { id: "team", label: "Team" },
    { id: "join", label: "Doe mee" },
  ],
  hero: {
    kicker: `Over ${SITE_NAME}`,
    title: "Styling begint in de browser.",
    subtitle: `Welkom bij ${SITE_NAME} — een plek voor gratis aankleed-, make-up- en modespelletjes. Open een kast, mix een look, zonder download.`,
    cta: "Begin met stylen",
  },
  journey: {
    title: "Hoe deze kast groeide",
    text: `We begonnen met aankleedspellen die we zelf opnieuw wilden openen: ruime kasten, fatsoenlijke make-up trays en salons waar je een kapsel twee keer mag veranderen. ${SITE_NAME} is die collectie, zodat je een prinsessenjurk of een street look vindt zonder door andere genres te waden.`,
    cta: "Wat nu? →",
  },
  mission: {
    title: "Outfit-spel makkelijk, creatief en gratis maken voor iedereen die graag aankleed.",
    cta: "Mooi →",
  },
  promise: {
    title: "Onze belofte",
    cards: [
      {
        icon: "∞",
        title: "Gratis looks",
        description: "Geen betaalmuur. Elk aankleed- of make-upspel is hier gratis te openen.",
      },
      {
        icon: "♡",
        title: "Direct stylen",
        description: "Klik en sleep kleding. Geen installer, geen verplicht account.",
      },
      {
        icon: "◆",
        title: "Zacht spelen",
        description: "We mikken op gezinsvriendelijke stylinggames — creatief, niet grimmig.",
      },
      {
        icon: "+",
        title: "Nieuwe kasten",
        description: "Nieuwe dress-up-, salon- en modestitels komen erbij wanneer we ze vinden.",
      },
    ],
    cta: "Klaar voor een look? →",
  },
  team: {
    title: `De mensen achter ${SITE_NAME}`,
    text: `We zijn een klein team dat nog steeds tijd verliest in virtuele kasten. Elk spel komt erbij omdat stylen er écht leuk is.`,
    cta: "Bekijk de rekken →",
  },
  join: {
    title: "Open een kast",
    text: "Gratis aankleed-, make-up- en modespelletjes in je browser. Geen downloads. Mix een look op elk apparaat.",
    cta: "Nu aankleden",
  },
});

export function getAboutPageContent(locale: LocaleCode): AboutPageContentData {
  switch (locale) {
    case "es":
      return aboutPageEs();
    case "fr":
      return aboutPageFr();
    case "nl":
      return aboutPageNl();
    default:
      return aboutPageEn();
  }
}
