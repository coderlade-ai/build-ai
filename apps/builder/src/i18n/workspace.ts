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
  previewUnavailable: string;
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
    previewUnavailable:
      "Preview needs the project runtime, which isn't built yet. Your files are saved and ready.",
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
    previewUnavailable:
      "Для превью нужна среда выполнения проекта, она ещё в разработке. Ваши файлы сохранены и готовы.",
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
    previewUnavailable:
      "プレビューにはプロジェクトの実行環境が必要ですが、まだ開発中です。ファイルは保存済みで準備ができています。",
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
    previewUnavailable:
      "미리보기에는 프로젝트 런타임이 필요하며 아직 개발 중입니다. 파일은 저장되어 준비되었습니다.",
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
    previewUnavailable: "预览需要项目运行环境,目前仍在开发中。你的文件已保存,随时可用。",
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
    previewUnavailable:
      "Önizleme için proje çalışma ortamı gerekiyor ve bu henüz hazır değil. Dosyalarınız kaydedildi ve hazır.",
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
    previewUnavailable:
      "L'aperçu a besoin de l'environnement d'exécution du projet, qui n'est pas encore prêt. Vos fichiers sont enregistrés.",
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
    previewUnavailable:
      "A prévia precisa do ambiente de execução do projeto, que ainda está em desenvolvimento. Seus arquivos estão salvos.",
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
  },
};
