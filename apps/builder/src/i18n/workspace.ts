import type { Locale } from "@ladestack/i18n";

/** Workspace (PRD Screen B) strings, in all eight locales. */
export interface WorkspaceStrings {
  useTemplate: string;
  creating: string;
  createError: string;
  loading: string;
  missingId: string;
  notFound: string;
  files: string;
  code: string;
  preview: string;
  previewBundleNote: string;
  selectFile: string;
  saved: string;
  unsaved: string;
  saving: string;
  saveError: string;
  conflict: string;
  reloadFile: string;
  back: string;
  viewLabel: string;
  editorLoading: string;
  exportZip: string;
  exporting: string;
  exportError: string;
  followEdits: string;
  agentWriting: string;
  previewOff: string;
  previewNoEntry: string;
  previewLoading: string;
  previewFrame: string;
  reloadPreview: string;
  console: string;
  consoleEmpty: string;
  consoleClear: string;
  debugErrors: string;
  consoleDebugPrompt: string;
}

export const workspace: Record<Locale, WorkspaceStrings> = {
  en: {
    useTemplate: "Use this template",
    creating: "Creating…",
    createError:
      "Couldn't create the project in this browser's storage. Check that site storage is allowed and try again.",
    loading: "Opening project…",
    missingId: "No project was specified.",
    notFound:
      "This project isn't in this browser. Projects are stored only on the device and browser where they were created.",
    files: "Files",
    code: "Code",
    preview: "Preview",
    previewBundleNote:
      "Experimental: your code is bundled in the browser and npm packages load from esm.sh. There is no npm install or dev server yet.",
    selectFile: "Select a file to edit.",
    saved: "Saved",
    unsaved: "Unsaved changes",
    saving: "Saving…",
    saveError: "Couldn't save. Your edits are still in the editor.",
    conflict:
      "This file changed somewhere else, perhaps in another tab. Your edits were not saved over it.",
    reloadFile: "Load the latest version",
    back: "Back to start",
    viewLabel: "View",
    editorLoading: "Loading editor…",
    exportZip: "Export ZIP",
    exporting: "Exporting…",
    exportError: "Export failed. Your files are still saved in this browser.",
    followEdits: "Follow AI edits",
    agentWriting: "Agent is writing…",
    previewOff: "Preview isn't set up on this deployment yet. Your files are saved and ready.",
    previewNoEntry: "Add an index.html at the top of the project to preview it.",
    previewLoading: "Loading preview…",
    previewFrame: "Preview of your project",
    reloadPreview: "Reload preview",
    console: "Console",
    consoleEmpty: "No console messages yet.",
    consoleClear: "Clear",
    debugErrors: "Debug these errors",
    consoleDebugPrompt: "Find the cause of these errors from the project preview:",
  },
  ru: {
    useTemplate: "Использовать шаблон",
    creating: "Создание…",
    createError:
      "Не удалось создать проект в хранилище браузера. Проверьте, что хранение данных сайтов разрешено, и попробуйте снова.",
    loading: "Открытие проекта…",
    missingId: "Проект не указан.",
    notFound:
      "Этого проекта нет в этом браузере. Проекты хранятся только на том устройстве и в том браузере, где они созданы.",
    files: "Файлы",
    code: "Код",
    preview: "Превью",
    previewBundleNote:
      "Экспериментально: код собирается в браузере, а npm-пакеты загружаются с esm.sh. npm install и dev-сервера пока нет.",
    selectFile: "Выберите файл для редактирования.",
    saved: "Сохранено",
    unsaved: "Есть несохранённые изменения",
    saving: "Сохранение…",
    saveError: "Не удалось сохранить. Ваши правки остались в редакторе.",
    conflict:
      "Этот файл изменился в другом месте, возможно в другой вкладке. Ваши правки не записаны поверх него.",
    reloadFile: "Загрузить последнюю версию",
    back: "В начало",
    viewLabel: "Вид",
    editorLoading: "Загрузка редактора…",
    exportZip: "Экспорт ZIP",
    exporting: "Экспорт…",
    exportError: "Не удалось экспортировать. Файлы по-прежнему сохранены в этом браузере.",
    followEdits: "Следить за правками ИИ",
    agentWriting: "Агент пишет…",
    previewOff: "Предпросмотр на этом развёртывании ещё не настроен. Файлы сохранены и готовы.",
    previewNoEntry: "Добавьте index.html в корень проекта, чтобы увидеть предпросмотр.",
    previewLoading: "Загрузка предпросмотра…",
    previewFrame: "Предпросмотр вашего проекта",
    reloadPreview: "Обновить предпросмотр",
    console: "Консоль",
    consoleEmpty: "Сообщений в консоли пока нет.",
    consoleClear: "Очистить",
    debugErrors: "Найти причину ошибок",
    consoleDebugPrompt: "Найди причину этих ошибок из предпросмотра проекта:",
  },
  ja: {
    useTemplate: "このテンプレートを使う",
    creating: "作成中…",
    createError:
      "このブラウザのストレージにプロジェクトを作成できませんでした。サイトデータの保存が許可されているか確認して、もう一度お試しください。",
    loading: "プロジェクトを開いています…",
    missingId: "プロジェクトが指定されていません。",
    notFound:
      "このプロジェクトはこのブラウザにありません。プロジェクトは作成したデバイスとブラウザにのみ保存されます。",
    files: "ファイル",
    code: "コード",
    preview: "プレビュー",
    previewBundleNote:
      "試験的機能：コードはブラウザ内でバンドルされ、npm パッケージは esm.sh から読み込まれます。npm install や開発サーバーはまだありません。",
    selectFile: "編集するファイルを選んでください。",
    saved: "保存済み",
    unsaved: "未保存の変更があります",
    saving: "保存中…",
    saveError: "保存できませんでした。編集内容はエディタに残っています。",
    conflict:
      "このファイルは別の場所(別のタブなど)で変更されました。あなたの編集で上書きはしていません。",
    reloadFile: "最新版を読み込む",
    back: "最初に戻る",
    viewLabel: "表示",
    editorLoading: "エディタを読み込んでいます…",
    exportZip: "ZIPでエクスポート",
    exporting: "エクスポート中…",
    exportError: "エクスポートに失敗しました。ファイルはこのブラウザに保存されたままです。",
    followEdits: "AI の編集を追跡",
    agentWriting: "エージェントが書き込み中…",
    previewOff: "このデプロイではプレビューがまだ設定されていません。ファイルは保存済みです。",
    previewNoEntry: "プレビューするには、プロジェクトの最上位に index.html を追加してください。",
    previewLoading: "プレビューを読み込み中…",
    previewFrame: "プロジェクトのプレビュー",
    reloadPreview: "プレビューを再読み込み",
    console: "コンソール",
    consoleEmpty: "コンソールのメッセージはまだありません。",
    consoleClear: "クリア",
    debugErrors: "これらのエラーをデバッグ",
    consoleDebugPrompt: "プロジェクトのプレビューで出た次のエラーの原因を見つけてください:",
  },
  ko: {
    useTemplate: "이 템플릿 사용",
    creating: "만드는 중…",
    createError:
      "이 브라우저 저장소에 프로젝트를 만들지 못했습니다. 사이트 데이터 저장이 허용되어 있는지 확인한 뒤 다시 시도하세요.",
    loading: "프로젝트를 여는 중…",
    missingId: "지정된 프로젝트가 없습니다.",
    notFound:
      "이 프로젝트는 이 브라우저에 없습니다. 프로젝트는 만든 기기와 브라우저에만 저장됩니다.",
    files: "파일",
    code: "코드",
    preview: "미리보기",
    previewBundleNote:
      "실험 기능: 코드는 브라우저에서 번들되고 npm 패키지는 esm.sh에서 불러옵니다. 아직 npm install이나 개발 서버는 없습니다.",
    selectFile: "편집할 파일을 선택하세요.",
    saved: "저장됨",
    unsaved: "저장되지 않은 변경 사항",
    saving: "저장 중…",
    saveError: "저장하지 못했습니다. 편집한 내용은 편집기에 남아 있습니다.",
    conflict:
      "이 파일이 다른 곳(예: 다른 탭)에서 변경되었습니다. 편집 내용으로 덮어쓰지 않았습니다.",
    reloadFile: "최신 버전 불러오기",
    back: "처음으로",
    viewLabel: "보기",
    editorLoading: "편집기를 불러오는 중…",
    exportZip: "ZIP 내보내기",
    exporting: "내보내는 중…",
    exportError: "내보내기에 실패했습니다. 파일은 이 브라우저에 그대로 저장되어 있습니다.",
    followEdits: "AI 편집 따라가기",
    agentWriting: "에이전트가 작성 중…",
    previewOff: "이 배포에는 아직 미리보기가 설정되지 않았습니다. 파일은 저장되어 있습니다.",
    previewNoEntry: "미리보려면 프로젝트 최상위에 index.html을 추가하세요.",
    previewLoading: "미리보기 불러오는 중…",
    previewFrame: "프로젝트 미리보기",
    reloadPreview: "미리보기 새로고침",
    console: "콘솔",
    consoleEmpty: "아직 콘솔 메시지가 없습니다.",
    consoleClear: "지우기",
    debugErrors: "이 오류 디버그",
    consoleDebugPrompt: "프로젝트 미리보기에서 나온 다음 오류의 원인을 찾아 주세요:",
  },
  zh: {
    useTemplate: "使用此模板",
    creating: "正在创建…",
    createError: "无法在此浏览器的存储中创建项目。请确认已允许网站存储数据,然后重试。",
    loading: "正在打开项目…",
    missingId: "未指定项目。",
    notFound: "此浏览器中没有这个项目。项目只保存在创建它的设备和浏览器中。",
    files: "文件",
    code: "代码",
    preview: "预览",
    previewBundleNote:
      "实验功能:代码在浏览器中打包,npm 包从 esm.sh 加载。目前还没有 npm install 或开发服务器。",
    selectFile: "选择要编辑的文件。",
    saved: "已保存",
    unsaved: "有未保存的更改",
    saving: "正在保存…",
    saveError: "保存失败。你的修改仍保留在编辑器中。",
    conflict: "此文件已在其他地方(可能是另一个标签页)被修改。你的修改没有覆盖它。",
    reloadFile: "加载最新版本",
    back: "返回开始",
    viewLabel: "视图",
    editorLoading: "正在加载编辑器…",
    exportZip: "导出 ZIP",
    exporting: "正在导出…",
    exportError: "导出失败。你的文件仍保存在此浏览器中。",
    followEdits: "跟随 AI 编辑",
    agentWriting: "智能体正在写入…",
    previewOff: "此部署尚未设置预览。你的文件已保存。",
    previewNoEntry: "在项目根目录添加 index.html 即可预览。",
    previewLoading: "正在加载预览…",
    previewFrame: "你的项目预览",
    reloadPreview: "重新加载预览",
    console: "控制台",
    consoleEmpty: "暂无控制台消息。",
    consoleClear: "清除",
    debugErrors: "调试这些错误",
    consoleDebugPrompt: "找出项目预览中这些错误的原因:",
  },
  tr: {
    useTemplate: "Bu şablonu kullan",
    creating: "Oluşturuluyor…",
    createError:
      "Proje bu tarayıcının depolama alanında oluşturulamadı. Site verilerinin saklanmasına izin verildiğini kontrol edip yeniden deneyin.",
    loading: "Proje açılıyor…",
    missingId: "Bir proje belirtilmedi.",
    notFound:
      "Bu proje bu tarayıcıda yok. Projeler yalnızca oluşturuldukları cihaz ve tarayıcıda saklanır.",
    files: "Dosyalar",
    code: "Kod",
    preview: "Önizleme",
    previewBundleNote:
      "Deneysel: kodunuz tarayıcıda paketlenir ve npm paketleri esm.sh'den yüklenir. Henüz npm install veya geliştirme sunucusu yok.",
    selectFile: "Düzenlemek için bir dosya seçin.",
    saved: "Kaydedildi",
    unsaved: "Kaydedilmemiş değişiklikler",
    saving: "Kaydediliyor…",
    saveError: "Kaydedilemedi. Düzenlemeleriniz düzenleyicide duruyor.",
    conflict:
      "Bu dosya başka bir yerde, belki başka bir sekmede değişti. Düzenlemeleriniz onun üzerine yazılmadı.",
    reloadFile: "En son sürümü yükle",
    back: "Başa dön",
    viewLabel: "Görünüm",
    editorLoading: "Düzenleyici yükleniyor…",
    exportZip: "ZIP olarak dışa aktar",
    exporting: "Dışa aktarılıyor…",
    exportError: "Dışa aktarma başarısız. Dosyalarınız bu tarayıcıda kayıtlı olmaya devam ediyor.",
    followEdits: "Yapay zekâ düzenlemelerini izle",
    agentWriting: "Ajan yazıyor…",
    previewOff: "Bu dağıtımda önizleme henüz kurulmadı. Dosyalarınız kayıtlı ve hazır.",
    previewNoEntry: "Önizlemek için projenin en üstüne bir index.html ekleyin.",
    previewLoading: "Önizleme yükleniyor…",
    previewFrame: "Projenizin önizlemesi",
    reloadPreview: "Önizlemeyi yenile",
    console: "Konsol",
    consoleEmpty: "Henüz konsol mesajı yok.",
    consoleClear: "Temizle",
    debugErrors: "Bu hataları ayıkla",
    consoleDebugPrompt: "Proje önizlemesindeki bu hataların nedenini bul:",
  },
  fr: {
    useTemplate: "Utiliser ce modèle",
    creating: "Création…",
    createError:
      "Impossible de créer le projet dans le stockage de ce navigateur. Vérifiez que le stockage des données de site est autorisé, puis réessayez.",
    loading: "Ouverture du projet…",
    missingId: "Aucun projet indiqué.",
    notFound:
      "Ce projet n'est pas dans ce navigateur. Les projets sont enregistrés uniquement sur l'appareil et le navigateur où ils ont été créés.",
    files: "Fichiers",
    code: "Code",
    preview: "Aperçu",
    previewBundleNote:
      "Expérimental : votre code est empaqueté dans le navigateur et les paquets npm sont chargés depuis esm.sh. Pas encore de npm install ni de serveur de développement.",
    selectFile: "Sélectionnez un fichier à modifier.",
    saved: "Enregistré",
    unsaved: "Modifications non enregistrées",
    saving: "Enregistrement…",
    saveError: "Échec de l'enregistrement. Vos modifications sont toujours dans l'éditeur.",
    conflict:
      "Ce fichier a été modifié ailleurs, peut-être dans un autre onglet. Vos modifications ne l'ont pas écrasé.",
    reloadFile: "Charger la dernière version",
    back: "Retour au début",
    viewLabel: "Vue",
    editorLoading: "Chargement de l'éditeur…",
    exportZip: "Exporter en ZIP",
    exporting: "Exportation…",
    exportError: "L'exportation a échoué. Vos fichiers restent enregistrés dans ce navigateur.",
    followEdits: "Suivre les modifications de l'IA",
    agentWriting: "L'agent écrit…",
    previewOff:
      "L'aperçu n'est pas encore configuré sur ce déploiement. Vos fichiers sont enregistrés.",
    previewNoEntry: "Ajoutez un index.html à la racine du projet pour l'afficher en aperçu.",
    previewLoading: "Chargement de l'aperçu…",
    previewFrame: "Aperçu de votre projet",
    reloadPreview: "Recharger l'aperçu",
    console: "Console",
    consoleEmpty: "Aucun message dans la console pour l'instant.",
    consoleClear: "Effacer",
    debugErrors: "Déboguer ces erreurs",
    consoleDebugPrompt: "Trouve la cause de ces erreurs de l'aperçu du projet :",
  },
  pt: {
    useTemplate: "Usar este modelo",
    creating: "Criando…",
    createError:
      "Não foi possível criar o projeto no armazenamento deste navegador. Verifique se o armazenamento de dados de sites está permitido e tente de novo.",
    loading: "Abrindo o projeto…",
    missingId: "Nenhum projeto foi indicado.",
    notFound:
      "Este projeto não está neste navegador. Os projetos ficam salvos só no dispositivo e no navegador onde foram criados.",
    files: "Arquivos",
    code: "Código",
    preview: "Prévia",
    previewBundleNote:
      "Experimental: seu código é empacotado no navegador e os pacotes npm são carregados do esm.sh. Ainda não há npm install nem servidor de desenvolvimento.",
    selectFile: "Selecione um arquivo para editar.",
    saved: "Salvo",
    unsaved: "Alterações não salvas",
    saving: "Salvando…",
    saveError: "Não foi possível salvar. Suas edições continuam no editor.",
    conflict:
      "Este arquivo foi alterado em outro lugar, talvez em outra aba. Suas edições não foram gravadas por cima dele.",
    reloadFile: "Carregar a versão mais recente",
    back: "Voltar ao início",
    viewLabel: "Visualização",
    editorLoading: "Carregando o editor…",
    exportZip: "Exportar ZIP",
    exporting: "Exportando…",
    exportError: "Falha na exportação. Seus arquivos continuam salvos neste navegador.",
    followEdits: "Acompanhar edições da IA",
    agentWriting: "O agente está escrevendo…",
    previewOff:
      "A pré-visualização ainda não está configurada nesta implantação. Seus arquivos estão salvos.",
    previewNoEntry: "Adicione um index.html na raiz do projeto para pré-visualizar.",
    previewLoading: "Carregando pré-visualização…",
    previewFrame: "Pré-visualização do seu projeto",
    reloadPreview: "Recarregar pré-visualização",
    console: "Console",
    consoleEmpty: "Nenhuma mensagem no console ainda.",
    consoleClear: "Limpar",
    debugErrors: "Depurar estes erros",
    consoleDebugPrompt: "Encontre a causa destes erros da pré-visualização do projeto:",
  },
};
