import type { PagesDictionary } from "./en";

export const fr: PagesDictionary = {
  common: {
    legal: "Mentions légales",
    draft:
      "Brouillon : ce texte n'a pas encore été relu par un avocat et peut changer avant le lancement.",
    updated: "Dernière mise à jour",
    backHome: "Retour à l'accueil",
  },
  links: {
    privacy: "Confidentialité",
    terms: "Conditions",
    disclaimer: "Avertissement",
    openSource: "Open source",
    about: "À propos",
    contact: "Contact",
  },
  privacy: {
    title: "Confidentialité",
    description:
      "Comment LadeStack Build traite vos données : stockage local, clé d'IA et services tiers.",
    sections: [
      {
        h: "Ni compte ni profil",
        p: "Vous pouvez utiliser LadeStack Build sans vous inscrire. Nous ne gérons pas de comptes utilisateurs et ce site ne dépose aucun cookie publicitaire ou de mesure d'audience.",
      },
      {
        h: "Vos projets restent dans votre navigateur",
        p: "Le créateur enregistre projets, fichiers et points de restauration dans le stockage local de votre navigateur, sur votre appareil. Nous n'en gardons aucune copie sur nos serveurs. Effacer les données du navigateur peut les supprimer : téléchargez un ZIP pour les conserver.",
      },
      {
        h: "Votre clé d'IA et vos requêtes",
        p: "Vous connectez votre propre fournisseur d'IA. Par défaut, votre clé n'est conservée que pour la session de navigation en cours et n'est jamais écrite dans votre projet ni dans ses exports. Vos requêtes et les fichiers dont l'agent a besoin sont envoyés au fournisseur choisi, selon ses propres conditions de confidentialité.",
      },
      {
        h: "Autres services",
        p: "L'installation de paquets contacte le registre npm. Notre hébergeur peut traiter des données techniques de requête, comme les adresses IP, pour fournir et protéger le site.",
      },
      {
        h: "Vos choix",
        p: "Vous pouvez supprimer vos projets et réglages enregistrés à tout moment depuis votre navigateur ou les paramètres du créateur, après avoir téléchargé votre travail.",
      },
    ],
  },
  terms: {
    title: "Conditions d'utilisation",
    description: "Les conditions de base pour utiliser LadeStack Build.",
    sections: [
      {
        h: "Utilisation du service",
        p: "LadeStack Build est proposé gratuitement et en l'état pendant son développement. Les fonctionnalités peuvent changer ou devenir indisponibles à tout moment.",
      },
      {
        h: "Votre contenu",
        p: "Ce que vous créez vous appartient, y compris le code écrit pour vous par l'agent. Vous êtes responsable de sa relecture et de son utilisation.",
      },
      {
        h: "Services tiers",
        p: "Les fournisseurs d'IA, npm et les autres services que vous connectez ont leurs propres conditions et peuvent vous facturer. Ces frais vous concernent, vous et eux.",
      },
      {
        h: "Usage acceptable",
        p: "N'utilisez pas le service pour enfreindre la loi, nuire à autrui ou attaquer d'autres systèmes.",
      },
      {
        h: "Absence de garantie",
        p: "Le logiciel est fourni sans aucune garantie, dans les limites permises par la loi, comme le prévoit la licence MIT.",
      },
    ],
  },
  disclaimer: {
    title: "Avertissement",
    description:
      "Les limites du code généré par l'IA et de l'environnement d'exécution dans le navigateur.",
    sections: [
      {
        h: "L'IA peut se tromper",
        p: "Le code et les textes écrits par des modèles d'IA peuvent contenir des erreurs, des failles de sécurité ou des pratiques dépassées. Relisez et testez tout avant de vous y fier.",
      },
      {
        h: "Limites de l'exécution dans le navigateur",
        p: "Exécuter des projets dans le navigateur a ses limites. Certains paquets, modules natifs et fonctions back-end peuvent ne pas fonctionner, et la prise en charge varie selon les navigateurs.",
      },
      {
        h: "Pas un conseil professionnel",
        p: "Rien de ce que produit le créateur ne constitue un conseil juridique, financier, médical ou de sécurité.",
      },
    ],
  },
  openSource: {
    title: "Open source",
    description: "La licence de LadeStack Build et les projets open source sur lesquels il repose.",
    intro:
      "LadeStack Build est open source sous licence MIT. Il s'appuie sur les projets ci-dessous ; leurs licences et mentions sont conservées avec le code source.",
    planned: "prévu",
  },
  about: {
    title: "À propos",
    description: "Ce qu'est LadeStack Build, comment il fonctionne et où en est le projet.",
    sections: [
      {
        h: "Ce que c'est",
        p: "LadeStack Build est un créateur de sites et d'applications par IA, gratuit et open source, qui fonctionne dans votre navigateur. Vous décrivez ce que vous voulez, un agent IA écrit le code, et vous pouvez le modifier, le prévisualiser et l'exporter.",
      },
      {
        h: "Comment ça marche",
        p: "Aucun compte à créer. Vous utilisez votre propre clé de fournisseur d'IA, vos projets restent dans votre navigateur sur votre appareil, et vous pouvez télécharger votre travail en ZIP à tout moment.",
      },
      {
        h: "Où en est le projet",
        p: "LadeStack Build est en début de développement. Ce site est en ligne pendant que le créateur est encore en construction : les fonctionnalités sont donc présentées comme prévues jusqu'à leur sortie.",
      },
      {
        h: "Open source",
        p: "Le code source est public sur GitHub sous licence MIT. Vous pouvez y lire le code, signaler des problèmes et proposer des modifications.",
      },
    ],
    source: "Voir le code source sur GitHub",
  },
  contact: {
    title: "Contact",
    description: "Comment joindre le projet LadeStack Build.",
    sections: [
      {
        h: "Questions, bugs et idées",
        p: "Le meilleur moyen de joindre le projet est d'ouvrir une issue sur GitHub. Les issues sont publiques : n'y mettez jamais de clés d'API, de mots de passe ni de fichiers de projet privés.",
      },
      {
        h: "Problèmes de sécurité",
        p: "Si vous trouvez un problème de sécurité, n'en publiez pas les détails dans une issue publique. Ouvrez une issue qui demande seulement un canal privé, puis partagez les détails une fois celui-ci en place.",
      },
    ],
    issues: "Ouvrir une issue sur GitHub",
  },
  blog: {
    title: "Blog",
    description: "Articles sur LadeStack Build, la création locale avec l'IA et la plateforme web.",
    empty:
      "Aucun article n'a encore été publié. Chaque article apparaîtra ici dès qu'il sera disponible dans les huit langues.",
    published: "Publié le",
    updated: "Mis à jour le",
    allArticles: "Tous les articles",
  },
  notFound: {
    title: "Page introuvable",
    description: "La page que vous cherchez n'existe pas.",
    body: "Cette page n'existe pas ou a été déplacée.",
  },
};
