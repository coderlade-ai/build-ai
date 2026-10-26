import type { Locale } from "@ladestack/i18n";

/** "Your projects" on the welcome screen, in all eight locales. `{name}` is the project name. */
export interface RecentStrings {
  title: string;
  localNote: string;
  edited: string;
  remove: string;
  removeLabel: string;
  confirmRemove: string;
  removeError: string;
  static: string;
  reactVite: string;
}

export const recent: Record<Locale, RecentStrings> = {
  en: {
    title: "Your projects",
    localNote: "Saved only in this browser.",
    edited: "Edited",
    remove: "Delete",
    removeLabel: "Delete {name}",
    confirmRemove: "Delete “{name}”? It will be removed from this browser and can't be recovered.",
    removeError: "Couldn't delete the project. Please try again.",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
  ru: {
    title: "Ваши проекты",
    localNote: "Хранятся только в этом браузере.",
    edited: "Изменён",
    remove: "Удалить",
    removeLabel: "Удалить {name}",
    confirmRemove:
      "Удалить «{name}»? Проект будет удалён из этого браузера без возможности восстановления.",
    removeError: "Не удалось удалить проект. Попробуйте ещё раз.",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
  ja: {
    title: "あなたのプロジェクト",
    localNote: "このブラウザにのみ保存されています。",
    edited: "編集日時",
    remove: "削除",
    removeLabel: "{name} を削除",
    confirmRemove: "「{name}」を削除しますか？このブラウザから削除され、元に戻せません。",
    removeError: "プロジェクトを削除できませんでした。もう一度お試しください。",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
  ko: {
    title: "내 프로젝트",
    localNote: "이 브라우저에만 저장됩니다.",
    edited: "수정",
    remove: "삭제",
    removeLabel: "{name} 삭제",
    confirmRemove: "“{name}”을(를) 삭제할까요? 이 브라우저에서 삭제되며 복구할 수 없습니다.",
    removeError: "프로젝트를 삭제하지 못했습니다. 다시 시도해 주세요.",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
  zh: {
    title: "你的项目",
    localNote: "仅保存在此浏览器中。",
    edited: "编辑于",
    remove: "删除",
    removeLabel: "删除 {name}",
    confirmRemove: "删除“{name}”？它将从此浏览器中移除，且无法恢复。",
    removeError: "无法删除该项目，请重试。",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
  tr: {
    title: "Projeleriniz",
    localNote: "Yalnızca bu tarayıcıda kayıtlı.",
    edited: "Düzenlendi",
    remove: "Sil",
    removeLabel: "{name} projesini sil",
    confirmRemove: "“{name}” silinsin mi? Bu tarayıcıdan kaldırılacak ve geri alınamayacak.",
    removeError: "Proje silinemedi. Lütfen tekrar deneyin.",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
  fr: {
    title: "Vos projets",
    localNote: "Enregistrés uniquement dans ce navigateur.",
    edited: "Modifié",
    remove: "Supprimer",
    removeLabel: "Supprimer {name}",
    confirmRemove:
      "Supprimer « {name} » ? Il sera retiré de ce navigateur et ne pourra pas être récupéré.",
    removeError: "Impossible de supprimer le projet. Veuillez réessayer.",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
  pt: {
    title: "Seus projetos",
    localNote: "Salvos apenas neste navegador.",
    edited: "Editado",
    remove: "Excluir",
    removeLabel: "Excluir {name}",
    confirmRemove:
      "Excluir “{name}”? Ele será removido deste navegador e não poderá ser recuperado.",
    removeError: "Não foi possível excluir o projeto. Tente novamente.",
    static: "HTML/CSS/JS",
    reactVite: "React + Vite",
  },
};

export function fill(template: string, name: string): string {
  return template.replaceAll("{name}", name);
}
