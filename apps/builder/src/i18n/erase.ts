import type { Locale } from "@ladestack/i18n";

/** "Erase local data" on the welcome screen (SET-03), in all eight locales. */
export interface EraseStrings {
  title: string;
  body: string;
  button: string;
  confirm: string;
  busy: string;
  blocked: string;
  done: string;
  failed: string;
}

export const erase: Record<Locale, EraseStrings> = {
  en: {
    title: "Data in this browser",
    body: "Projects, checkpoints, drafts and the provider key for this tab are stored only in this browser. Erasing removes all of them here. Export any project you want to keep first.",
    button: "Erase all local data",
    confirm:
      "Erase every project, checkpoint, draft and the provider key from this browser? This can't be undone.",
    busy: "Erasing…",
    blocked: "Waiting for other LadeStack Build tabs to close. Close them to finish erasing.",
    done: "All local data was erased from this browser.",
    failed: "Couldn't erase the data. Please try again.",
  },
  ru: {
    title: "Данные в этом браузере",
    body: "Проекты, контрольные точки, черновики и ключ провайдера для этой вкладки хранятся только в этом браузере. Очистка удалит их все здесь. Сначала экспортируйте проекты, которые хотите сохранить.",
    button: "Удалить все локальные данные",
    confirm:
      "Удалить из этого браузера все проекты, контрольные точки, черновики и ключ провайдера? Это действие нельзя отменить.",
    busy: "Удаление…",
    blocked:
      "Ожидание закрытия других вкладок LadeStack Build. Закройте их, чтобы завершить удаление.",
    done: "Все локальные данные удалены из этого браузера.",
    failed: "Не удалось удалить данные. Попробуйте ещё раз.",
  },
  ja: {
    title: "このブラウザのデータ",
    body: "プロジェクト、チェックポイント、下書き、このタブのプロバイダーキーはこのブラウザにのみ保存されます。消去するとここからすべて削除されます。残したいプロジェクトは先にエクスポートしてください。",
    button: "ローカルデータをすべて消去",
    confirm:
      "このブラウザからすべてのプロジェクト、チェックポイント、下書き、プロバイダーキーを消去しますか？元に戻せません。",
    busy: "消去中…",
    blocked: "ほかの LadeStack Build タブが閉じられるのを待っています。閉じると消去が完了します。",
    done: "このブラウザのローカルデータをすべて消去しました。",
    failed: "データを消去できませんでした。もう一度お試しください。",
  },
  ko: {
    title: "이 브라우저의 데이터",
    body: "프로젝트, 체크포인트, 초안, 이 탭의 제공업체 키는 이 브라우저에만 저장됩니다. 지우면 여기서 모두 삭제됩니다. 보관할 프로젝트는 먼저 내보내세요.",
    button: "로컬 데이터 모두 지우기",
    confirm:
      "이 브라우저에서 모든 프로젝트, 체크포인트, 초안, 제공업체 키를 지울까요? 되돌릴 수 없습니다.",
    busy: "지우는 중…",
    blocked: "다른 LadeStack Build 탭이 닫히기를 기다리는 중입니다. 탭을 닫으면 삭제가 완료됩니다.",
    done: "이 브라우저의 로컬 데이터를 모두 지웠습니다.",
    failed: "데이터를 지우지 못했습니다. 다시 시도해 주세요.",
  },
  zh: {
    title: "此浏览器中的数据",
    body: "项目、检查点、草稿和此标签页的提供商密钥只保存在此浏览器中。清除后将从这里全部删除。请先导出想要保留的项目。",
    button: "清除所有本地数据",
    confirm: "要从此浏览器清除所有项目、检查点、草稿和提供商密钥吗？此操作无法撤销。",
    busy: "正在清除…",
    blocked: "正在等待其他 LadeStack Build 标签页关闭。关闭它们即可完成清除。",
    done: "已从此浏览器清除所有本地数据。",
    failed: "无法清除数据，请重试。",
  },
  tr: {
    title: "Bu tarayıcıdaki veriler",
    body: "Projeler, kontrol noktaları, taslaklar ve bu sekmenin sağlayıcı anahtarı yalnızca bu tarayıcıda saklanır. Silme işlemi bunların hepsini buradan kaldırır. Saklamak istediğiniz projeleri önce dışa aktarın.",
    button: "Tüm yerel verileri sil",
    confirm:
      "Bu tarayıcıdaki tüm projeler, kontrol noktaları, taslaklar ve sağlayıcı anahtarı silinsin mi? Bu işlem geri alınamaz.",
    busy: "Siliniyor…",
    blocked:
      "Diğer LadeStack Build sekmelerinin kapanması bekleniyor. Silmeyi tamamlamak için onları kapatın.",
    done: "Tüm yerel veriler bu tarayıcıdan silindi.",
    failed: "Veriler silinemedi. Lütfen tekrar deneyin.",
  },
  fr: {
    title: "Données dans ce navigateur",
    body: "Les projets, points de contrôle, brouillons et la clé du fournisseur pour cet onglet sont stockés uniquement dans ce navigateur. L’effacement les supprime tous ici. Exportez d’abord les projets que vous voulez garder.",
    button: "Effacer toutes les données locales",
    confirm:
      "Effacer de ce navigateur tous les projets, points de contrôle, brouillons et la clé du fournisseur ? Cette action est irréversible.",
    busy: "Effacement…",
    blocked:
      "En attente de la fermeture des autres onglets LadeStack Build. Fermez-les pour terminer l’effacement.",
    done: "Toutes les données locales ont été effacées de ce navigateur.",
    failed: "Impossible d’effacer les données. Veuillez réessayer.",
  },
  pt: {
    title: "Dados neste navegador",
    body: "Projetos, checkpoints, rascunhos e a chave do provedor desta aba ficam salvos apenas neste navegador. Apagar remove tudo isso daqui. Exporte antes os projetos que quiser manter.",
    button: "Apagar todos os dados locais",
    confirm:
      "Apagar deste navegador todos os projetos, checkpoints, rascunhos e a chave do provedor? Isso não pode ser desfeito.",
    busy: "Apagando…",
    blocked:
      "Aguardando o fechamento de outras abas do LadeStack Build. Feche-as para concluir a exclusão.",
    done: "Todos os dados locais foram apagados deste navegador.",
    failed: "Não foi possível apagar os dados. Tente novamente.",
  },
};
