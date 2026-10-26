import type { Locale } from "@ladestack/i18n";

/** ZIP import on the welcome screen, in all eight locales. Placeholders: {count}, {hooks}, {path}. */
export interface ImportStrings {
  title: string;
  desc: string;
  choose: string;
  importing: string;
  open: string;
  skipped: string;
  hooks: string;
  createError: string;
  archiveTooLarge: string;
  notAZip: string;
  unsafePath: string;
  tooManyFiles: string;
  tooLargeTotal: string;
  empty: string;
  fallbackName: string;
}

export const importZip: Record<Locale, ImportStrings> = {
  en: {
    title: "Import a project",
    desc: "Open a ZIP of an HTML/CSS/JS or React + Vite project. It stays in this browser; nothing is uploaded or run.",
    choose: "Choose ZIP file",
    importing: "Importing…",
    open: "Open project",
    skipped:
      "Imported. {count} files were left out (images and other binaries, .env secrets, or files over 2 MB).",
    hooks:
      "package.json has install scripts ({hooks}). LadeStack Build never runs them automatically.",
    createError:
      "Couldn't save the project in this browser. Check that storage isn't blocked and try again.",
    archiveTooLarge: "That ZIP is larger than 25 MB.",
    notAZip: "That file isn't a readable ZIP.",
    unsafePath: "The ZIP contains an unsafe path ({path}) and was not imported.",
    tooManyFiles: "The ZIP has more than 2,000 files.",
    tooLargeTotal: "The ZIP unpacks to more than 50 MB.",
    empty: "No text source files were found in the ZIP.",
    fallbackName: "Imported project",
  },
  ru: {
    title: "Импорт проекта",
    desc: "Откройте ZIP с проектом HTML/CSS/JS или React + Vite. Он останется в этом браузере: ничего не загружается и не запускается.",
    choose: "Выбрать ZIP-файл",
    importing: "Импорт…",
    open: "Открыть проект",
    skipped:
      "Импортировано. Пропущено файлов: {count} (изображения и другие двоичные файлы, секреты .env или файлы больше 2 МБ).",
    hooks:
      "В package.json есть скрипты установки ({hooks}). LadeStack Build никогда не запускает их автоматически.",
    createError:
      "Не удалось сохранить проект в этом браузере. Проверьте, не заблокировано ли хранилище, и повторите попытку.",
    archiveTooLarge: "Этот ZIP больше 25 МБ.",
    notAZip: "Этот файл не является читаемым ZIP-архивом.",
    unsafePath: "ZIP содержит небезопасный путь ({path}) и не был импортирован.",
    tooManyFiles: "В ZIP больше 2000 файлов.",
    tooLargeTotal: "После распаковки ZIP занимает больше 50 МБ.",
    empty: "В ZIP не найдено текстовых исходных файлов.",
    fallbackName: "Импортированный проект",
  },
  ja: {
    title: "プロジェクトをインポート",
    desc: "HTML/CSS/JS または React + Vite プロジェクトの ZIP を開きます。このブラウザ内に留まり、アップロードも実行もされません。",
    choose: "ZIP ファイルを選択",
    importing: "インポート中…",
    open: "プロジェクトを開く",
    skipped:
      "インポートしました。{count} 個のファイルを除外しました（画像などのバイナリ、.env のシークレット、2 MB を超えるファイル）。",
    hooks:
      "package.json にインストールスクリプト（{hooks}）があります。LadeStack Build がこれを自動で実行することはありません。",
    createError:
      "このブラウザにプロジェクトを保存できませんでした。ストレージがブロックされていないか確認して、もう一度お試しください。",
    archiveTooLarge: "この ZIP は 25 MB を超えています。",
    notAZip: "このファイルは読み取り可能な ZIP ではありません。",
    unsafePath: "ZIP に安全でないパス（{path}）が含まれているため、インポートしませんでした。",
    tooManyFiles: "ZIP に 2,000 個を超えるファイルがあります。",
    tooLargeTotal: "ZIP を展開すると 50 MB を超えます。",
    empty: "ZIP にテキストのソースファイルが見つかりませんでした。",
    fallbackName: "インポートしたプロジェクト",
  },
  ko: {
    title: "프로젝트 가져오기",
    desc: "HTML/CSS/JS 또는 React + Vite 프로젝트의 ZIP을 엽니다. 이 브라우저에만 남으며 업로드되거나 실행되지 않습니다.",
    choose: "ZIP 파일 선택",
    importing: "가져오는 중…",
    open: "프로젝트 열기",
    skipped:
      "가져왔습니다. 파일 {count}개를 제외했습니다(이미지 등 바이너리, .env 비밀 정보, 2MB 초과 파일).",
    hooks:
      "package.json에 설치 스크립트({hooks})가 있습니다. LadeStack Build는 이를 자동으로 실행하지 않습니다.",
    createError:
      "이 브라우저에 프로젝트를 저장하지 못했습니다. 저장소가 차단되지 않았는지 확인한 뒤 다시 시도해 주세요.",
    archiveTooLarge: "이 ZIP은 25MB를 초과합니다.",
    notAZip: "읽을 수 있는 ZIP 파일이 아닙니다.",
    unsafePath: "ZIP에 안전하지 않은 경로({path})가 있어 가져오지 않았습니다.",
    tooManyFiles: "ZIP에 파일이 2,000개를 초과합니다.",
    tooLargeTotal: "ZIP 압축을 풀면 50MB를 초과합니다.",
    empty: "ZIP에서 텍스트 소스 파일을 찾지 못했습니다.",
    fallbackName: "가져온 프로젝트",
  },
  zh: {
    title: "导入项目",
    desc: "打开 HTML/CSS/JS 或 React + Vite 项目的 ZIP。它只保留在此浏览器中，不会上传或运行任何内容。",
    choose: "选择 ZIP 文件",
    importing: "正在导入…",
    open: "打开项目",
    skipped: "已导入。有 {count} 个文件被排除（图片等二进制文件、.env 密钥或超过 2 MB 的文件）。",
    hooks: "package.json 包含安装脚本（{hooks}）。LadeStack Build 绝不会自动运行它们。",
    createError: "无法在此浏览器中保存项目。请确认存储未被阻止，然后重试。",
    archiveTooLarge: "该 ZIP 超过 25 MB。",
    notAZip: "该文件不是可读取的 ZIP。",
    unsafePath: "ZIP 中包含不安全的路径（{path}），未导入。",
    tooManyFiles: "ZIP 中的文件超过 2,000 个。",
    tooLargeTotal: "ZIP 解压后超过 50 MB。",
    empty: "ZIP 中没有找到文本源文件。",
    fallbackName: "导入的项目",
  },
  tr: {
    title: "Proje içe aktar",
    desc: "HTML/CSS/JS veya React + Vite projesinin ZIP dosyasını açın. Bu tarayıcıda kalır; hiçbir şey yüklenmez veya çalıştırılmaz.",
    choose: "ZIP dosyası seç",
    importing: "İçe aktarılıyor…",
    open: "Projeyi aç",
    skipped:
      "İçe aktarıldı. {count} dosya dışarıda bırakıldı (görseller ve diğer ikili dosyalar, .env gizli bilgileri veya 2 MB'tan büyük dosyalar).",
    hooks:
      "package.json kurulum betikleri içeriyor ({hooks}). LadeStack Build bunları asla otomatik çalıştırmaz.",
    createError:
      "Proje bu tarayıcıya kaydedilemedi. Depolamanın engellenmediğini kontrol edip tekrar deneyin.",
    archiveTooLarge: "Bu ZIP 25 MB'tan büyük.",
    notAZip: "Bu dosya okunabilir bir ZIP değil.",
    unsafePath: "ZIP güvenli olmayan bir yol ({path}) içeriyor ve içe aktarılmadı.",
    tooManyFiles: "ZIP 2.000'den fazla dosya içeriyor.",
    tooLargeTotal: "ZIP açıldığında 50 MB'ı aşıyor.",
    empty: "ZIP içinde metin kaynak dosyası bulunamadı.",
    fallbackName: "İçe aktarılan proje",
  },
  fr: {
    title: "Importer un projet",
    desc: "Ouvrez le ZIP d'un projet HTML/CSS/JS ou React + Vite. Il reste dans ce navigateur : rien n'est envoyé ni exécuté.",
    choose: "Choisir un fichier ZIP",
    importing: "Importation…",
    open: "Ouvrir le projet",
    skipped:
      "Importé. {count} fichiers ont été écartés (images et autres fichiers binaires, secrets .env ou fichiers de plus de 2 Mo).",
    hooks:
      "package.json contient des scripts d'installation ({hooks}). LadeStack Build ne les exécute jamais automatiquement.",
    createError:
      "Impossible d'enregistrer le projet dans ce navigateur. Vérifiez que le stockage n'est pas bloqué, puis réessayez.",
    archiveTooLarge: "Ce ZIP dépasse 25 Mo.",
    notAZip: "Ce fichier n'est pas un ZIP lisible.",
    unsafePath: "Le ZIP contient un chemin non sûr ({path}) et n'a pas été importé.",
    tooManyFiles: "Le ZIP contient plus de 2 000 fichiers.",
    tooLargeTotal: "Le ZIP décompressé dépasse 50 Mo.",
    empty: "Aucun fichier source texte n'a été trouvé dans le ZIP.",
    fallbackName: "Projet importé",
  },
  pt: {
    title: "Importar um projeto",
    desc: "Abra o ZIP de um projeto HTML/CSS/JS ou React + Vite. Ele fica neste navegador; nada é enviado ou executado.",
    choose: "Escolher arquivo ZIP",
    importing: "Importando…",
    open: "Abrir projeto",
    skipped:
      "Importado. {count} arquivos ficaram de fora (imagens e outros binários, segredos .env ou arquivos com mais de 2 MB).",
    hooks:
      "O package.json tem scripts de instalação ({hooks}). O LadeStack Build nunca os executa automaticamente.",
    createError:
      "Não foi possível salvar o projeto neste navegador. Verifique se o armazenamento não está bloqueado e tente novamente.",
    archiveTooLarge: "Esse ZIP tem mais de 25 MB.",
    notAZip: "Esse arquivo não é um ZIP legível.",
    unsafePath: "O ZIP contém um caminho inseguro ({path}) e não foi importado.",
    tooManyFiles: "O ZIP tem mais de 2.000 arquivos.",
    tooLargeTotal: "O ZIP descompactado passa de 50 MB.",
    empty: "Nenhum arquivo de código-fonte em texto foi encontrado no ZIP.",
    fallbackName: "Projeto importado",
  },
};

export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}
