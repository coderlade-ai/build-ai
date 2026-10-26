import type { Locale } from "@ladestack/i18n";

/** Checkpoint history panel strings, in all eight locales. */
export interface HistoryStrings {
  history: string;
  title: string;
  empty: string;
  saveNow: string;
  saving: string;
  restore: string;
  restoreConfirm: string;
  restored: string;
  failed: string;
  busy: string;
  files: string;
  current: string;
  reasonAuto: string;
  reasonManual: string;
  reasonBeforeRestore: string;
  reasonTask: string;
}

export const history: Record<Locale, HistoryStrings> = {
  en: {
    history: "History",
    title: "Checkpoints",
    empty: "No checkpoints yet. One is saved before every agent run.",
    saveNow: "Save checkpoint",
    saving: "Saving…",
    restore: "Restore",
    restoreConfirm:
      "Restore your files to this checkpoint? Your current files are saved as a checkpoint first.",
    restored: "Files restored. Your previous files were saved as a checkpoint.",
    failed: "Something went wrong. Your files were not changed.",
    busy: "Wait for the agent to finish.",
    files: "{count} files",
    current: "Unsaved edits in the editor are not included until they save.",
    reasonAuto: "Before agent run",
    reasonManual: "Saved by you",
    reasonBeforeRestore: "Before restore",
    reasonTask: "Task step",
  },
  ru: {
    history: "История",
    title: "Контрольные точки",
    empty: "Контрольных точек пока нет. Точка сохраняется перед каждым запуском агента.",
    saveNow: "Сохранить точку",
    saving: "Сохранение…",
    restore: "Восстановить",
    restoreConfirm:
      "Восстановить файлы из этой точки? Текущие файлы сначала будут сохранены как точка.",
    restored: "Файлы восстановлены. Прежние файлы сохранены как точка.",
    failed: "Что-то пошло не так. Файлы не изменены.",
    busy: "Дождитесь завершения работы агента.",
    files: "Файлов: {count}",
    current: "Несохранённые правки в редакторе не попадут в точку, пока не сохранятся.",
    reasonAuto: "Перед запуском агента",
    reasonManual: "Сохранено вами",
    reasonBeforeRestore: "Перед восстановлением",
    reasonTask: "Шаг задачи",
  },
  ja: {
    history: "履歴",
    title: "チェックポイント",
    empty: "チェックポイントはまだありません。エージェントの実行前に毎回保存されます。",
    saveNow: "チェックポイントを保存",
    saving: "保存中…",
    restore: "復元",
    restoreConfirm:
      "このチェックポイントにファイルを復元しますか？現在のファイルは先にチェックポイントとして保存されます。",
    restored: "ファイルを復元しました。以前のファイルはチェックポイントとして保存されています。",
    failed: "問題が発生しました。ファイルは変更されていません。",
    busy: "エージェントの完了をお待ちください。",
    files: "{count} ファイル",
    current: "エディターの未保存の編集は、保存されるまで含まれません。",
    reasonAuto: "エージェント実行前",
    reasonManual: "手動で保存",
    reasonBeforeRestore: "復元前",
    reasonTask: "タスクの区切り",
  },
  ko: {
    history: "기록",
    title: "체크포인트",
    empty: "아직 체크포인트가 없습니다. 에이전트를 실행할 때마다 먼저 저장됩니다.",
    saveNow: "체크포인트 저장",
    saving: "저장 중…",
    restore: "복원",
    restoreConfirm: "이 체크포인트로 파일을 복원할까요? 현재 파일은 먼저 체크포인트로 저장됩니다.",
    restored: "파일을 복원했습니다. 이전 파일은 체크포인트로 저장되었습니다.",
    failed: "문제가 발생했습니다. 파일은 변경되지 않았습니다.",
    busy: "에이전트가 끝날 때까지 기다려 주세요.",
    files: "파일 {count}개",
    current: "편집기의 저장되지 않은 변경 내용은 저장되기 전까지 포함되지 않습니다.",
    reasonAuto: "에이전트 실행 전",
    reasonManual: "직접 저장함",
    reasonBeforeRestore: "복원 전",
    reasonTask: "작업 단계",
  },
  zh: {
    history: "历史",
    title: "检查点",
    empty: "还没有检查点。每次运行智能体前都会保存一个。",
    saveNow: "保存检查点",
    saving: "正在保存…",
    restore: "恢复",
    restoreConfirm: "要把文件恢复到这个检查点吗？当前文件会先保存为一个检查点。",
    restored: "文件已恢复。之前的文件已保存为检查点。",
    failed: "出了点问题。你的文件没有改变。",
    busy: "请等待智能体完成。",
    files: "{count} 个文件",
    current: "编辑器中未保存的修改在保存之前不会包含在内。",
    reasonAuto: "智能体运行前",
    reasonManual: "由你保存",
    reasonBeforeRestore: "恢复前",
    reasonTask: "任务步骤",
  },
  tr: {
    history: "Geçmiş",
    title: "Kontrol noktaları",
    empty: "Henüz kontrol noktası yok. Her ajan çalışmasından önce bir tane kaydedilir.",
    saveNow: "Kontrol noktası kaydet",
    saving: "Kaydediliyor…",
    restore: "Geri yükle",
    restoreConfirm:
      "Dosyalar bu kontrol noktasına geri yüklensin mi? Mevcut dosyalarınız önce kontrol noktası olarak kaydedilir.",
    restored: "Dosyalar geri yüklendi. Önceki dosyalarınız kontrol noktası olarak kaydedildi.",
    failed: "Bir sorun oluştu. Dosyalarınız değiştirilmedi.",
    busy: "Ajanın bitirmesini bekleyin.",
    files: "{count} dosya",
    current: "Düzenleyicideki kaydedilmemiş değişiklikler kaydedilene kadar dahil edilmez.",
    reasonAuto: "Ajan çalışmasından önce",
    reasonManual: "Sizin kaydettiğiniz",
    reasonBeforeRestore: "Geri yüklemeden önce",
    reasonTask: "Görev adımı",
  },
  fr: {
    history: "Historique",
    title: "Points de restauration",
    empty:
      "Aucun point de restauration pour l'instant. Un point est enregistré avant chaque exécution de l'agent.",
    saveNow: "Enregistrer un point",
    saving: "Enregistrement…",
    restore: "Restaurer",
    restoreConfirm:
      "Restaurer vos fichiers à ce point ? Vos fichiers actuels sont d'abord enregistrés comme point de restauration.",
    restored:
      "Fichiers restaurés. Vos fichiers précédents ont été enregistrés comme point de restauration.",
    failed: "Un problème est survenu. Vos fichiers n'ont pas été modifiés.",
    busy: "Attendez que l'agent ait terminé.",
    files: "{count} fichiers",
    current:
      "Les modifications non enregistrées de l'éditeur ne sont incluses qu'une fois enregistrées.",
    reasonAuto: "Avant l'exécution de l'agent",
    reasonManual: "Enregistré par vous",
    reasonBeforeRestore: "Avant la restauration",
    reasonTask: "Étape de tâche",
  },
  pt: {
    history: "Histórico",
    title: "Pontos de restauração",
    empty: "Ainda não há pontos de restauração. Um é salvo antes de cada execução do agente.",
    saveNow: "Salvar ponto",
    saving: "Salvando…",
    restore: "Restaurar",
    restoreConfirm:
      "Restaurar seus arquivos para este ponto? Seus arquivos atuais são salvos como ponto de restauração antes.",
    restored:
      "Arquivos restaurados. Seus arquivos anteriores foram salvos como ponto de restauração.",
    failed: "Algo deu errado. Seus arquivos não foram alterados.",
    busy: "Aguarde o agente terminar.",
    files: "{count} arquivos",
    current: "Edições não salvas no editor só entram depois de salvas.",
    reasonAuto: "Antes da execução do agente",
    reasonManual: "Salvo por você",
    reasonBeforeRestore: "Antes de restaurar",
    reasonTask: "Etapa da tarefa",
  },
};
