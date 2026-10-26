import type { Locale } from "@ladestack/i18n";

/** Workspace agent strings, in all eight locales. Placeholders: {provider}, {path}, {steps}. */
export interface AgentStrings {
  label: string;
  placeholder: string;
  run: string;
  stop: string;
  note: string;
  needProvider: string;
  startPage: string;
  working: string;
  listed: string;
  read: string;
  wrote: string;
  toolFailed: string;
  done: string;
  stopped: string;
  maxSteps: string;
  undo: string;
  undoConfirm: string;
  restored: string;
  undoRestore: string;
  restoreFailed: string;
  checkpointFailed: string;
}

export const agentStrings: Record<Locale, AgentStrings> = {
  en: {
    label: "Agent",
    placeholder: "Tell the agent what to build or change…",
    run: "Run",
    stop: "Stop",
    note: "Code mode with {provider}: reads and writes files in this project. It can't run or install anything yet.",
    needProvider: "Connect an AI provider on the start page to use the agent.",
    startPage: "Go to start page",
    working: "Working…",
    listed: "Listed files",
    read: "Read {path}",
    wrote: "Wrote {path}",
    toolFailed: "Couldn't change {path}",
    done: "Done.",
    stopped: "Stopped. Files already written are saved.",
    maxSteps:
      "Stopped after {steps} steps. Files already written are saved; run again to continue.",
    undo: "Undo this run",
    undoConfirm:
      "Put the project's files back to how they were before this run? You can undo this too.",
    restored: "Files restored to how they were before this run.",
    undoRestore: "Undo restore",
    restoreFailed: "Couldn't restore the files.",
    checkpointFailed: "Couldn't save a checkpoint, so the agent didn't start.",
  },
  ru: {
    label: "Агент",
    placeholder: "Опишите, что агенту создать или изменить…",
    run: "Запустить",
    stop: "Остановить",
    note: "Режим Code с {provider}: читает и записывает файлы этого проекта. Запускать и устанавливать что-либо он пока не умеет.",
    needProvider: "Чтобы использовать агента, подключите ИИ-провайдера на стартовой странице.",
    startPage: "На стартовую страницу",
    working: "Работаю…",
    listed: "Просмотрен список файлов",
    read: "Прочитан {path}",
    wrote: "Записан {path}",
    toolFailed: "Не удалось изменить {path}",
    done: "Готово.",
    stopped: "Остановлено. Уже записанные файлы сохранены.",
    maxSteps:
      "Остановлено после {steps} шагов. Уже записанные файлы сохранены; запустите снова, чтобы продолжить.",
    undo: "Отменить этот запуск",
    undoConfirm: "Вернуть файлы проекта к состоянию до этого запуска? Это тоже можно отменить.",
    restored: "Файлы возвращены к состоянию до этого запуска.",
    undoRestore: "Отменить восстановление",
    restoreFailed: "Не удалось восстановить файлы.",
    checkpointFailed: "Не удалось сохранить контрольную точку, поэтому агент не запущен.",
  },
  ja: {
    label: "エージェント",
    placeholder: "エージェントに作成・変更してほしい内容を入力…",
    run: "実行",
    stop: "停止",
    note: "{provider} の Code モード：このプロジェクトのファイルを読み書きします。コマンドの実行やインストールはまだできません。",
    needProvider: "エージェントを使うには、スタートページで AI プロバイダーを接続してください。",
    startPage: "スタートページへ",
    working: "作業中…",
    listed: "ファイル一覧を取得",
    read: "{path} を読み込み",
    wrote: "{path} を書き込み",
    toolFailed: "{path} を変更できませんでした",
    done: "完了しました。",
    stopped: "停止しました。書き込み済みのファイルは保存されています。",
    maxSteps:
      "{steps} ステップで停止しました。書き込み済みのファイルは保存されています。続けるにはもう一度実行してください。",
    undo: "この実行を元に戻す",
    undoConfirm: "プロジェクトのファイルをこの実行前の状態に戻しますか？この操作も元に戻せます。",
    restored: "ファイルをこの実行前の状態に戻しました。",
    undoRestore: "復元を取り消す",
    restoreFailed: "ファイルを復元できませんでした。",
    checkpointFailed: "チェックポイントを保存できなかったため、エージェントは開始しませんでした。",
  },
  ko: {
    label: "에이전트",
    placeholder: "에이전트에게 만들거나 바꿀 내용을 알려 주세요…",
    run: "실행",
    stop: "중지",
    note: "{provider} Code 모드: 이 프로젝트의 파일을 읽고 씁니다. 아직 실행하거나 설치할 수는 없습니다.",
    needProvider: "에이전트를 사용하려면 시작 페이지에서 AI 제공업체를 연결하세요.",
    startPage: "시작 페이지로",
    working: "작업 중…",
    listed: "파일 목록 확인",
    read: "{path} 읽음",
    wrote: "{path} 작성",
    toolFailed: "{path}을(를) 변경하지 못했습니다",
    done: "완료했습니다.",
    stopped: "중지했습니다. 이미 작성한 파일은 저장되어 있습니다.",
    maxSteps:
      "{steps}단계 후 중지했습니다. 이미 작성한 파일은 저장되어 있으며, 계속하려면 다시 실행하세요.",
    undo: "이번 실행 되돌리기",
    undoConfirm: "프로젝트 파일을 이번 실행 전 상태로 되돌릴까요? 이 작업도 되돌릴 수 있습니다.",
    restored: "파일을 이번 실행 전 상태로 되돌렸습니다.",
    undoRestore: "복원 취소",
    restoreFailed: "파일을 복원하지 못했습니다.",
    checkpointFailed: "체크포인트를 저장하지 못해 에이전트를 시작하지 않았습니다.",
  },
  zh: {
    label: "智能体",
    placeholder: "告诉智能体要创建或修改什么…",
    run: "运行",
    stop: "停止",
    note: "使用 {provider} 的 Code 模式：读取并写入此项目中的文件。目前还不能运行或安装任何东西。",
    needProvider: "请先在起始页连接 AI 服务商才能使用智能体。",
    startPage: "前往起始页",
    working: "正在处理…",
    listed: "已列出文件",
    read: "已读取 {path}",
    wrote: "已写入 {path}",
    toolFailed: "无法修改 {path}",
    done: "已完成。",
    stopped: "已停止。已写入的文件均已保存。",
    maxSteps: "已在 {steps} 步后停止。已写入的文件均已保存；再次运行即可继续。",
    undo: "撤销本次运行",
    undoConfirm: "要将项目文件恢复到本次运行之前的状态吗？此操作也可以撤销。",
    restored: "文件已恢复到本次运行之前的状态。",
    undoRestore: "撤销恢复",
    restoreFailed: "无法恢复文件。",
    checkpointFailed: "无法保存检查点，因此智能体未启动。",
  },
  tr: {
    label: "Ajan",
    placeholder: "Ajana ne oluşturmasını veya değiştirmesini istediğinizi yazın…",
    run: "Çalıştır",
    stop: "Durdur",
    note: "{provider} ile Code modu: bu projedeki dosyaları okur ve yazar. Henüz bir şey çalıştıramaz veya kuramaz.",
    needProvider: "Ajanı kullanmak için başlangıç sayfasından bir yapay zekâ sağlayıcısı bağlayın.",
    startPage: "Başlangıç sayfasına git",
    working: "Çalışıyor…",
    listed: "Dosyalar listelendi",
    read: "{path} okundu",
    wrote: "{path} yazıldı",
    toolFailed: "{path} değiştirilemedi",
    done: "Bitti.",
    stopped: "Durduruldu. Yazılmış dosyalar kaydedildi.",
    maxSteps:
      "{steps} adımdan sonra durduruldu. Yazılmış dosyalar kaydedildi; devam etmek için yeniden çalıştırın.",
    undo: "Bu çalıştırmayı geri al",
    undoConfirm:
      "Proje dosyaları bu çalıştırmadan önceki hâline döndürülsün mü? Bunu da geri alabilirsiniz.",
    restored: "Dosyalar bu çalıştırmadan önceki hâline döndürüldü.",
    undoRestore: "Geri yüklemeyi geri al",
    restoreFailed: "Dosyalar geri yüklenemedi.",
    checkpointFailed: "Kontrol noktası kaydedilemediği için ajan başlatılmadı.",
  },
  fr: {
    label: "Agent",
    placeholder: "Dites à l'agent quoi créer ou modifier…",
    run: "Lancer",
    stop: "Arrêter",
    note: "Mode Code avec {provider} : lit et écrit les fichiers de ce projet. Il ne peut encore rien exécuter ni installer.",
    needProvider: "Connectez un fournisseur d'IA sur la page d'accueil pour utiliser l'agent.",
    startPage: "Aller à la page d'accueil",
    working: "En cours…",
    listed: "Fichiers listés",
    read: "{path} lu",
    wrote: "{path} écrit",
    toolFailed: "Impossible de modifier {path}",
    done: "Terminé.",
    stopped: "Arrêté. Les fichiers déjà écrits sont enregistrés.",
    maxSteps:
      "Arrêté après {steps} étapes. Les fichiers déjà écrits sont enregistrés ; relancez pour continuer.",
    undo: "Annuler cette exécution",
    undoConfirm:
      "Remettre les fichiers du projet dans leur état d'avant cette exécution ? Vous pourrez aussi annuler ceci.",
    restored: "Fichiers remis dans leur état d'avant cette exécution.",
    undoRestore: "Annuler la restauration",
    restoreFailed: "Impossible de restaurer les fichiers.",
    checkpointFailed:
      "Impossible d'enregistrer un point de restauration : l'agent n'a pas démarré.",
  },
  pt: {
    label: "Agente",
    placeholder: "Diga ao agente o que criar ou alterar…",
    run: "Executar",
    stop: "Parar",
    note: "Modo Code com {provider}: lê e grava arquivos deste projeto. Ainda não pode executar nem instalar nada.",
    needProvider: "Conecte um provedor de IA na página inicial para usar o agente.",
    startPage: "Ir para a página inicial",
    working: "Trabalhando…",
    listed: "Arquivos listados",
    read: "{path} lido",
    wrote: "{path} gravado",
    toolFailed: "Não foi possível alterar {path}",
    done: "Concluído.",
    stopped: "Parado. Os arquivos já gravados estão salvos.",
    maxSteps:
      "Parado após {steps} etapas. Os arquivos já gravados estão salvos; execute de novo para continuar.",
    undo: "Desfazer esta execução",
    undoConfirm:
      "Voltar os arquivos do projeto para como estavam antes desta execução? Você também pode desfazer isso.",
    restored: "Arquivos restaurados para como estavam antes desta execução.",
    undoRestore: "Desfazer restauração",
    restoreFailed: "Não foi possível restaurar os arquivos.",
    checkpointFailed:
      "Não foi possível salvar um ponto de restauração, então o agente não começou.",
  },
};
