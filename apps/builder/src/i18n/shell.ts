import type { Locale } from "@ladestack/i18n";

/** Welcome screen strings for the builder, in all eight locales. */
export interface ShellStrings {
  kicker: string;
  title: string;
  body: string;
  composerLabel: string;
  placeholder: string;
  modeLabel: string;
  hintCode: string;
  hintPlan: string;
  hintAsk: string;
  hintDebug: string;
  submit: string;
  shortcut: string;
  providerStatus: string;
  freeNote: string;
  needProvider: string;
  tooLong: string;
  back: string;
  templatesTitle: string;
  templatesNote: string;
  staticName: string;
  staticDesc: string;
  reactName: string;
  reactDesc: string;
  showFiles: string;
}

export const shell: Record<Locale, ShellStrings> = {
  en: {
    kicker: "Builder · in development",
    title: "What do you want to build?",
    body: "The agent, editor and preview are still being built. Only your draft is kept, in this browser tab.",
    composerLabel: "Describe your website or app",
    placeholder: "A portfolio site with a projects grid, an about section and a contact link…",
    modeLabel: "Agent mode",
    hintCode: "Writes and edits project files",
    hintPlan: "Plans the work before changing anything",
    hintAsk: "Answers questions without editing files",
    hintDebug: "Finds and fixes errors",
    submit: "Start",
    shortcut: "Ctrl or ⌘ + Enter to start",
    providerStatus: "No AI provider connected",
    freeNote:
      "LadeStack Build is free. You use your own AI key, and your provider may charge you for what you use.",
    needProvider:
      "Connect an AI provider to run this prompt. Provider setup is not available yet, so nothing was sent and your draft is still here.",
    tooLong: "This prompt is too long. Keep it under 20,000 characters.",
    back: "Back to the homepage",
    templatesTitle: "Start from a template",
    templatesNote:
      "Browse what each starter contains. Opening one in the editor comes with the workspace.",
    staticName: "Static site",
    staticDesc: "HTML, CSS and a little JavaScript. No build step.",
    reactName: "React + Vite",
    reactDesc: "A TypeScript React app with Vite, ready for components.",
    showFiles: "Show files",
  },
  ru: {
    kicker: "Конструктор · в разработке",
    title: "Что вы хотите создать?",
    body: "Агент, редактор и превью ещё в разработке. Сохраняется только ваш черновик, в этой вкладке браузера.",
    composerLabel: "Опишите свой сайт или приложение",
    placeholder: "Сайт-портфолио с сеткой проектов, разделом «Обо мне» и ссылкой для связи…",
    modeLabel: "Режим агента",
    hintCode: "Пишет и редактирует файлы проекта",
    hintPlan: "Планирует работу, ничего не меняя",
    hintAsk: "Отвечает на вопросы, не редактируя файлы",
    hintDebug: "Находит и исправляет ошибки",
    submit: "Начать",
    shortcut: "Ctrl или ⌘ + Enter, чтобы начать",
    providerStatus: "ИИ-провайдер не подключён",
    freeNote:
      "LadeStack Build бесплатен. Вы используете свой ключ ИИ, и провайдер может взимать плату за использование.",
    needProvider:
      "Чтобы выполнить запрос, подключите ИИ-провайдера. Настройка провайдера пока недоступна, поэтому ничего не отправлено, а черновик сохранён.",
    tooLong: "Запрос слишком длинный. Сократите его до 20 000 символов.",
    back: "На главную",
    templatesTitle: "Начать с шаблона",
    templatesNote:
      "Посмотрите, что входит в каждый шаблон. Открыть его в редакторе можно будет, когда появится рабочее пространство.",
    staticName: "Статический сайт",
    staticDesc: "HTML, CSS и немного JavaScript. Без сборки.",
    reactName: "React + Vite",
    reactDesc: "Приложение React на TypeScript с Vite, готовое для компонентов.",
    showFiles: "Показать файлы",
  },
  ja: {
    kicker: "ビルダー · 開発中",
    title: "何を作りたいですか?",
    body: "エージェント、エディタ、プレビューはまだ開発中です。保存されるのは下書きのみで、このブラウザタブ内に限られます。",
    composerLabel: "作りたいサイトやアプリを説明してください",
    placeholder: "プロジェクト一覧、自己紹介、連絡先リンクのあるポートフォリオサイト…",
    modeLabel: "エージェントモード",
    hintCode: "プロジェクトのファイルを作成・編集します",
    hintPlan: "変更する前に作業を計画します",
    hintAsk: "ファイルを編集せずに質問に答えます",
    hintDebug: "エラーを見つけて修正します",
    submit: "開始",
    shortcut: "Ctrl または ⌘ + Enter で開始",
    providerStatus: "AI プロバイダー未接続",
    freeNote:
      "LadeStack Build は無料です。ご自身の AI キーを使うため、利用分はプロバイダーから請求される場合があります。",
    needProvider:
      "このプロンプトを実行するには AI プロバイダーを接続してください。プロバイダー設定はまだ利用できないため、何も送信されておらず、下書きはそのまま残っています。",
    tooLong: "プロンプトが長すぎます。20,000 文字以内にしてください。",
    back: "ホームページに戻る",
    templatesTitle: "テンプレートから始める",
    templatesNote:
      "各スターターの中身を確認できます。エディタで開く機能はワークスペースとともに提供予定です。",
    staticName: "静的サイト",
    staticDesc: "HTML、CSS と少しの JavaScript。ビルド不要です。",
    reactName: "React + Vite",
    reactDesc: "Vite を使った TypeScript の React アプリ。すぐにコンポーネントを追加できます。",
    showFiles: "ファイルを表示",
  },
  ko: {
    kicker: "빌더 · 개발 중",
    title: "무엇을 만들고 싶으세요?",
    body: "에이전트, 편집기, 미리보기는 아직 개발 중입니다. 초안만 이 브라우저 탭에 보관됩니다.",
    composerLabel: "만들고 싶은 웹사이트나 앱을 설명하세요",
    placeholder: "프로젝트 목록, 소개 섹션, 연락처 링크가 있는 포트폴리오 사이트…",
    modeLabel: "에이전트 모드",
    hintCode: "프로젝트 파일을 작성하고 수정합니다",
    hintPlan: "변경하기 전에 작업을 계획합니다",
    hintAsk: "파일을 수정하지 않고 질문에 답합니다",
    hintDebug: "오류를 찾아 고칩니다",
    submit: "시작",
    shortcut: "Ctrl 또는 ⌘ + Enter로 시작",
    providerStatus: "연결된 AI 제공업체 없음",
    freeNote:
      "LadeStack Build는 무료입니다. 직접 AI 키를 사용하며, 사용량에 따라 제공업체가 요금을 청구할 수 있습니다.",
    needProvider:
      "이 프롬프트를 실행하려면 AI 제공업체를 연결하세요. 제공업체 설정은 아직 사용할 수 없어 아무것도 전송되지 않았고 초안은 그대로 있습니다.",
    tooLong: "프롬프트가 너무 깁니다. 20,000자 이내로 줄여 주세요.",
    back: "홈페이지로 돌아가기",
    templatesTitle: "템플릿으로 시작하기",
    templatesNote:
      "각 스타터에 무엇이 들어 있는지 살펴보세요. 편집기에서 여는 기능은 작업 공간과 함께 제공됩니다.",
    staticName: "정적 사이트",
    staticDesc: "HTML, CSS와 약간의 JavaScript. 빌드 단계가 없습니다.",
    reactName: "React + Vite",
    reactDesc: "Vite 기반 TypeScript React 앱으로, 바로 컴포넌트를 만들 수 있습니다.",
    showFiles: "파일 보기",
  },
  zh: {
    kicker: "构建器 · 开发中",
    title: "你想构建什么?",
    body: "智能体、编辑器和预览仍在开发中。目前只会保存你的草稿,且仅限于当前浏览器标签页。",
    composerLabel: "描述你的网站或应用",
    placeholder: "一个包含项目展示、个人简介和联系链接的作品集网站…",
    modeLabel: "智能体模式",
    hintCode: "编写和修改项目文件",
    hintPlan: "先规划工作,不做任何改动",
    hintAsk: "回答问题,不修改文件",
    hintDebug: "查找并修复错误",
    submit: "开始",
    shortcut: "按 Ctrl 或 ⌘ + Enter 开始",
    providerStatus: "未连接 AI 服务商",
    freeNote: "LadeStack Build 免费使用。你使用自己的 AI 密钥,服务商可能会按用量向你收费。",
    needProvider:
      "请先连接 AI 服务商才能运行此提示词。服务商设置尚未开放,因此没有发送任何内容,你的草稿仍然保留。",
    tooLong: "提示词过长,请控制在 20,000 个字符以内。",
    back: "返回首页",
    templatesTitle: "从模板开始",
    templatesNote: "查看每个起始模板包含的内容。在编辑器中打开模板的功能将随工作区一起推出。",
    staticName: "静态网站",
    staticDesc: "HTML、CSS 和少量 JavaScript,无需构建。",
    reactName: "React + Vite",
    reactDesc: "基于 Vite 的 TypeScript React 应用,可直接编写组件。",
    showFiles: "显示文件",
  },
  tr: {
    kicker: "Oluşturucu · geliştirme aşamasında",
    title: "Ne oluşturmak istiyorsunuz?",
    body: "Ajan, düzenleyici ve önizleme hâlâ geliştiriliyor. Yalnızca taslağınız, bu tarayıcı sekmesinde saklanır.",
    composerLabel: "Web sitenizi ya da uygulamanızı anlatın",
    placeholder:
      "Proje ızgarası, hakkımda bölümü ve iletişim bağlantısı olan bir portfolyo sitesi…",
    modeLabel: "Ajan modu",
    hintCode: "Proje dosyalarını yazar ve düzenler",
    hintPlan: "Hiçbir şeyi değiştirmeden önce işi planlar",
    hintAsk: "Dosyaları düzenlemeden soruları yanıtlar",
    hintDebug: "Hataları bulur ve düzeltir",
    submit: "Başla",
    shortcut: "Başlamak için Ctrl ya da ⌘ + Enter",
    providerStatus: "Bağlı yapay zekâ sağlayıcısı yok",
    freeNote:
      "LadeStack Build ücretsizdir. Kendi yapay zekâ anahtarınızı kullanırsınız ve sağlayıcınız kullanımınız için ücret alabilir.",
    needProvider:
      "Bu istemi çalıştırmak için bir yapay zekâ sağlayıcısı bağlayın. Sağlayıcı kurulumu henüz kullanılamıyor; bu yüzden hiçbir şey gönderilmedi ve taslağınız duruyor.",
    tooLong: "Bu istem çok uzun. 20.000 karakterin altında tutun.",
    back: "Ana sayfaya dön",
    templatesTitle: "Bir şablonla başlayın",
    templatesNote:
      "Her başlangıç şablonunun içeriğine göz atın. Düzenleyicide açma özelliği çalışma alanıyla birlikte gelecek.",
    staticName: "Statik site",
    staticDesc: "HTML, CSS ve biraz JavaScript. Derleme adımı yok.",
    reactName: "React + Vite",
    reactDesc: "Vite ile TypeScript tabanlı, bileşenlere hazır bir React uygulaması.",
    showFiles: "Dosyaları göster",
  },
  fr: {
    kicker: "Créateur · en développement",
    title: "Que voulez-vous créer ?",
    body: "L'agent, l'éditeur et l'aperçu sont encore en développement. Seul votre brouillon est conservé, dans cet onglet du navigateur.",
    composerLabel: "Décrivez votre site ou votre application",
    placeholder:
      "Un site portfolio avec une grille de projets, une section à propos et un lien de contact…",
    modeLabel: "Mode de l'agent",
    hintCode: "Écrit et modifie les fichiers du projet",
    hintPlan: "Planifie le travail avant de modifier quoi que ce soit",
    hintAsk: "Répond aux questions sans modifier de fichiers",
    hintDebug: "Trouve et corrige les erreurs",
    submit: "Commencer",
    shortcut: "Ctrl ou ⌘ + Entrée pour commencer",
    providerStatus: "Aucun fournisseur d'IA connecté",
    freeNote:
      "LadeStack Build est gratuit. Vous utilisez votre propre clé d'IA, et votre fournisseur peut vous facturer votre consommation.",
    needProvider:
      "Connectez un fournisseur d'IA pour lancer cette requête. La configuration des fournisseurs n'est pas encore disponible : rien n'a été envoyé et votre brouillon est conservé.",
    tooLong: "Cette requête est trop longue. Limitez-la à 20 000 caractères.",
    back: "Retour à l'accueil",
    templatesTitle: "Partir d'un modèle",
    templatesNote:
      "Parcourez le contenu de chaque modèle. L'ouverture dans l'éditeur arrivera avec l'espace de travail.",
    staticName: "Site statique",
    staticDesc: "HTML, CSS et un peu de JavaScript. Aucune étape de compilation.",
    reactName: "React + Vite",
    reactDesc: "Une application React en TypeScript avec Vite, prête pour vos composants.",
    showFiles: "Afficher les fichiers",
  },
  pt: {
    kicker: "Criador · em desenvolvimento",
    title: "O que você quer criar?",
    body: "O agente, o editor e a prévia ainda estão em desenvolvimento. Só o seu rascunho fica guardado, nesta aba do navegador.",
    composerLabel: "Descreva seu site ou aplicativo",
    placeholder: "Um site de portfólio com grade de projetos, seção sobre mim e link de contato…",
    modeLabel: "Modo do agente",
    hintCode: "Escreve e edita os arquivos do projeto",
    hintPlan: "Planeja o trabalho antes de mudar qualquer coisa",
    hintAsk: "Responde perguntas sem editar arquivos",
    hintDebug: "Encontra e corrige erros",
    submit: "Começar",
    shortcut: "Ctrl ou ⌘ + Enter para começar",
    providerStatus: "Nenhum provedor de IA conectado",
    freeNote:
      "O LadeStack Build é gratuito. Você usa sua própria chave de IA, e seu provedor pode cobrar pelo uso.",
    needProvider:
      "Conecte um provedor de IA para executar este prompt. A configuração de provedores ainda não está disponível, então nada foi enviado e seu rascunho continua aqui.",
    tooLong: "Este prompt é muito longo. Mantenha-o abaixo de 20.000 caracteres.",
    back: "Voltar para a página inicial",
    templatesTitle: "Comece com um modelo",
    templatesNote:
      "Veja o que cada modelo inicial contém. Abrir no editor vai chegar junto com o espaço de trabalho.",
    staticName: "Site estático",
    staticDesc: "HTML, CSS e um pouco de JavaScript. Sem etapa de build.",
    reactName: "React + Vite",
    reactDesc: "Um app React em TypeScript com Vite, pronto para componentes.",
    showFiles: "Mostrar arquivos",
  },
};
