import type { Dictionary } from "./en";

export const fr: Dictionary = {
  meta: {
    title: "LadeStack Build : créateur de sites et d'applications par IA, dans le navigateur",
    description:
      "Décrivez votre projet, regardez un agent IA écrire du vrai code, prévisualisez-le et téléchargez les fichiers. Gratuit, sans compte, avec votre propre clé d'IA. En développement.",
  },
  skipToContent: "Aller au contenu",
  nav: {
    features: "Fonctionnalités",
    useCases: "Cas d'usage",
    howItWorks: "Fonctionnement",
    technology: "Technologie",
    menu: "Menu",
    language: "Langue",
    start: "Commencer",
  },
  status:
    "En développement. Cette page décrit ce que nous construisons ; rien n'est encore en ligne.",
  hero: {
    eyebrow: "Le développement assisté par IA, selon vos règles",
    title: "De l'idée au code qui fonctionne",
    subtitle:
      "Décrivez un site ou une application. Un agent IA le planifie, écrit les fichiers dans un véritable éditeur de code et lance un aperçu en direct, le tout dans votre navigateur. Chaque ligne vous appartient.",
    primary: "Commencer",
    secondary: "Voir le fonctionnement",
  },
  features: {
    title: "Ce que vous obtenez",
    intro: "Un véritable espace de développement, pas une boîte noire.",
    items: [
      {
        title: "Modes de l'agent",
        body: "Des modes Code, Plan, Ask et Debug aux permissions claires : l'agent ne fait que ce que le mode autorise.",
      },
      {
        title: "Éditeur de code en direct",
        body: "Les fichiers apparaissent dans un éditeur Monaco avec arborescence. Modifiez ce que vous voulez, quand vous voulez.",
      },
      {
        title: "Aperçu dans le navigateur",
        body: "Les dépendances s'installent depuis package.json et un serveur de développement tourne dans un environnement navigateur, là où c'est pris en charge.",
      },
      {
        title: "Votre propre clé",
        body: "Connectez votre fournisseur d'IA. Vous le payez directement ; LadeStack ne prend aucuns frais.",
      },
      {
        title: "Points de restauration",
        body: "Les modifications sont enregistrées en points de restauration, à comparer et restaurer avant et après les modifications de l'IA.",
      },
      {
        title: "Téléchargement ZIP",
        body: "Exportez tout le code source avec son arborescence à tout moment, sans compte.",
      },
    ],
  },
  useCases: {
    title: "Ce que vous pouvez créer",
    intro:
      "D'abord des projets front-end en React, TypeScript et Vite, d'autres technologies ensuite.",
    items: [
      { title: "Pages d'atterrissage", body: "Lancements de produits, événements et campagnes." },
      {
        title: "Tableaux de bord SaaS",
        body: "Interfaces d'administration, graphiques et tableaux de données.",
      },
      {
        title: "Portfolios",
        body: "Sites personnels pour designers, développeurs et créateurs.",
      },
      {
        title: "Sites d'entreprise",
        body: "Sites multipages pour petites entreprises et agences.",
      },
      {
        title: "Vitrines e-commerce",
        body: "Catalogues et paniers reliés à votre propre back-end.",
      },
      { title: "Sites de documentation", body: "Guides et références pour votre projet." },
    ],
  },
  howItWorks: {
    title: "Fonctionnement",
    steps: [
      {
        title: "Décrivez",
        body: "Écrivez ce que vous voulez et ajoutez des références si besoin.",
      },
      {
        title: "L'agent planifie et écrit",
        body: "Il crée les fichiers pas à pas dans l'éditeur.",
      },
      {
        title: "Les fichiers apparaissent",
        body: "Chaque fichier enregistré est signalé au fil de l'écriture.",
      },
      {
        title: "Prévisualisez et affinez",
        body: "Lancez-le, demandez des changements ou modifiez le code vous-même.",
      },
      { title: "Exportez", body: "Téléchargez votre projet en ZIP." },
    ],
  },
  technology: {
    title: "Technologie",
    intro: "Les choix encore en cours d'évaluation sont indiqués comme tels.",
    items: [
      {
        title: "Un agent inspiré de Kilo Code",
        body: "Modes, outils, permissions et points de restauration inspirés d'agents open source.",
      },
      {
        title: "Éditeur Monaco",
        body: "Le moteur d'édition de VS Code, directement dans votre navigateur.",
      },
      {
        title: "Environnement navigateur (en évaluation)",
        body: "Les candidats sont testés pour la compatibilité, la licence et la sécurité avant d'être retenus.",
      },
      {
        title: "Stockage local d'abord",
        body: "Les projets sont conservés dans le stockage de votre navigateur. Il n'y a pas de copie dans le cloud : exportez régulièrement.",
      },
    ],
  },
  byok: {
    title: "Votre clé, votre code",
    items: [
      {
        title: "Aucuns frais de plateforme",
        body: "Vous payez votre fournisseur d'IA selon votre usage. Ici, ni abonnement ni crédits.",
      },
      {
        title: "La clé reste dans la session",
        body: "Par défaut, votre clé n'est conservée que pour la session en cours et n'est jamais écrite dans votre projet.",
      },
      {
        title: "Transparence sur les données",
        body: "Les requêtes partent vers le fournisseur d'IA choisi et l'installation des paquets passe par npm. Vos fichiers restent dans votre navigateur jusqu'à ce que vous les exportiez.",
      },
    ],
  },
  faq: {
    title: "Questions",
    items: [
      {
        q: "Est-ce gratuit ?",
        a: "Oui. LadeStack Build n'a aucune offre payante. Votre fournisseur d'IA peut facturer l'utilisation des modèles.",
      },
      {
        q: "Faut-il un compte ?",
        a: "Non. Vous pouvez commencer sans vous inscrire.",
      },
      {
        q: "Où sont stockés mes projets ?",
        a: "Dans votre navigateur, sur cet appareil. Effacer les données du navigateur peut les supprimer : téléchargez un ZIP pour les garder.",
      },
      {
        q: "Quels frameworks sont pris en charge ?",
        a: "React avec TypeScript et Vite en premier, sur Chrome et Edge pour ordinateur. D'autres suivront une fois testés.",
      },
    ],
  },
  cta: {
    title: "Prêt quand vous l'êtes",
    body: "Ouvrez le créateur et décrivez votre premier projet.",
    button: "Commencer",
  },
  footer: {
    tagline: "Un créateur IA gratuit et local d'abord, par LadeStack.",
    product: "Produit",
    licence: "Open source sous licence MIT.",
  },
};
