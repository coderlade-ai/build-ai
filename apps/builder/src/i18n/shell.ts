import type { Locale } from "@ladestack/i18n";

/** Strings for the temporary builder shell, in all eight locales. */
export interface ShellStrings {
  kicker: string;
  title: string;
  body: string;
  modes: string;
  back: string;
}

export const shell: Record<Locale, ShellStrings> = {
  en: {
    kicker: "Builder · in development",
    title: "LadeStack Build workspace",
    body: "The editor, agent, preview and checkpoints are not built yet. Nothing you do here is saved.",
    modes: "Planned alpha modes",
    back: "Back to the homepage",
  },
  ru: {
    kicker: "Конструктор · в разработке",
    title: "Рабочее пространство LadeStack Build",
    body: "Редактор, агент, превью и контрольные точки ещё не готовы. Здесь пока ничего не сохраняется.",
    modes: "Режимы, запланированные для альфа-версии",
    back: "На главную",
  },
  ja: {
    kicker: "ビルダー · 開発中",
    title: "LadeStack Build ワークスペース",
    body: "エディタ、エージェント、プレビュー、チェックポイントはまだ開発中です。ここでの操作は保存されません。",
    modes: "アルファ版で予定しているモード",
    back: "ホームページに戻る",
  },
  ko: {
    kicker: "빌더 · 개발 중",
    title: "LadeStack Build 작업 공간",
    body: "편집기, 에이전트, 미리보기, 체크포인트는 아직 개발 중입니다. 여기서 한 작업은 저장되지 않습니다.",
    modes: "알파 버전에 예정된 모드",
    back: "홈페이지로 돌아가기",
  },
  zh: {
    kicker: "构建器 · 开发中",
    title: "LadeStack Build 工作区",
    body: "编辑器、智能体、预览和检查点尚未完成。在这里的操作不会被保存。",
    modes: "Alpha 版计划提供的模式",
    back: "返回首页",
  },
  tr: {
    kicker: "Oluşturucu · geliştirme aşamasında",
    title: "LadeStack Build çalışma alanı",
    body: "Düzenleyici, ajan, önizleme ve kontrol noktaları henüz hazır değil. Burada yaptıklarınız kaydedilmez.",
    modes: "Alfa sürümü için planlanan modlar",
    back: "Ana sayfaya dön",
  },
  fr: {
    kicker: "Créateur · en développement",
    title: "Espace de travail LadeStack Build",
    body: "L'éditeur, l'agent, l'aperçu et les points de restauration ne sont pas encore prêts. Rien n'est enregistré ici.",
    modes: "Modes prévus pour la version alpha",
    back: "Retour à l'accueil",
  },
  pt: {
    kicker: "Criador · em desenvolvimento",
    title: "Espaço de trabalho do LadeStack Build",
    body: "O editor, o agente, a prévia e os pontos de restauração ainda não estão prontos. Nada do que você fizer aqui é salvo.",
    modes: "Modos previstos para a versão alfa",
    back: "Voltar para a página inicial",
  },
};
