import type { Locale } from "@ladestack/i18n";

/** BYOK provider setup strings, in all eight locales. Placeholders: {provider}, {model}. */
export interface ProviderStrings {
  connect: string;
  connected: string;
  title: string;
  intro: string;
  provider: string;
  key: string;
  show: string;
  hide: string;
  getKey: string;
  keyNote: string;
  test: string;
  testing: string;
  model: string;
  modelHint: string;
  tools: string;
  save: string;
  remove: string;
  close: string;
  badKey: string;
  invalidKey: string;
  billing: string;
  rateLimit: string;
  unavailable: string;
  network: string;
  timeout: string;
  noModels: string;
  unexpected: string;
  rejected: string;
  agentPending: string;
}

export const providerStrings: Record<Locale, ProviderStrings> = {
  en: {
    connect: "Connect AI provider",
    connected: "{provider} · {model}",
    title: "AI provider",
    intro:
      "LadeStack Build is free. Requests go straight from this browser to your provider with your key, and your provider may charge you for what you use.",
    provider: "Provider",
    key: "API key",
    show: "Show",
    hide: "Hide",
    getKey: "Get a {provider} key",
    keyNote:
      "Your key stays in this tab only and is forgotten when you close it. It is never saved to projects, exports, or any LadeStack server.",
    test: "Test connection",
    testing: "Testing…",
    model: "Model",
    modelHint: "Choose a model that supports tool calling to build projects.",
    tools: "tools",
    save: "Use this model",
    remove: "Forget key",
    close: "Close",
    badKey: "That doesn't look like an API key. Check for spaces or missing characters.",
    invalidKey: "The provider rejected this key. Check it, or create a new one.",
    billing:
      "Your provider account has no credit left. Add credit with the provider, then try again.",
    rateLimit: "The provider is limiting requests right now. Wait a moment and try again.",
    unavailable: "The provider is having problems. Try again later.",
    network:
      "Couldn't reach the provider. Check your connection, or whether a browser extension or network blocks it.",
    timeout: "The provider took too long to answer. Try again.",
    noModels: "This key works, but no usable chat models were found for it.",
    unexpected: "Something unexpected went wrong. Try again.",
    rejected:
      "The provider rejected the request. This model may not support tool calling; pick one marked “tools”.",
    agentPending:
      "{provider} is connected. The agent that turns prompts into code is still being built, so nothing was sent and your draft is still here.",
  },
  ru: {
    connect: "Подключить ИИ-провайдера",
    connected: "{provider} · {model}",
    title: "ИИ-провайдер",
    intro:
      "LadeStack Build бесплатен. Запросы идут напрямую из этого браузера к вашему провайдеру с вашим ключом, и провайдер может взимать плату за использование.",
    provider: "Провайдер",
    key: "API-ключ",
    show: "Показать",
    hide: "Скрыть",
    getKey: "Получить ключ {provider}",
    keyNote:
      "Ключ хранится только в этой вкладке и забывается при её закрытии. Он никогда не сохраняется в проектах, экспортах или на серверах LadeStack.",
    test: "Проверить подключение",
    testing: "Проверка…",
    model: "Модель",
    modelHint: "Для создания проектов выберите модель с поддержкой вызова инструментов.",
    tools: "инструменты",
    save: "Использовать эту модель",
    remove: "Забыть ключ",
    close: "Закрыть",
    badKey: "Это не похоже на API-ключ. Проверьте, нет ли пробелов или пропущенных символов.",
    invalidKey: "Провайдер отклонил этот ключ. Проверьте его или создайте новый.",
    billing: "На счёте у провайдера закончились средства. Пополните его и повторите попытку.",
    rateLimit: "Провайдер сейчас ограничивает запросы. Подождите немного и повторите попытку.",
    unavailable: "У провайдера проблемы. Повторите попытку позже.",
    network:
      "Не удалось связаться с провайдером. Проверьте подключение или не блокирует ли его расширение браузера или сеть.",
    timeout: "Провайдер слишком долго не отвечал. Повторите попытку.",
    noModels: "Ключ работает, но подходящих чат-моделей для него не найдено.",
    unexpected: "Произошла непредвиденная ошибка. Повторите попытку.",
    rejected:
      "Провайдер отклонил запрос. Возможно, модель не поддерживает вызов инструментов; выберите модель с пометкой «инструменты».",
    agentPending:
      "{provider} подключён. Агент, превращающий запросы в код, ещё в разработке, поэтому ничего не отправлено, а черновик сохранён.",
  },
  ja: {
    connect: "AI プロバイダーに接続",
    connected: "{provider} · {model}",
    title: "AI プロバイダー",
    intro:
      "LadeStack Build は無料です。リクエストはあなたのキーでこのブラウザからプロバイダーへ直接送られ、利用分はプロバイダーから請求される場合があります。",
    provider: "プロバイダー",
    key: "API キー",
    show: "表示",
    hide: "非表示",
    getKey: "{provider} のキーを取得",
    keyNote:
      "キーはこのタブ内にのみ保持され、タブを閉じると消去されます。プロジェクト、エクスポート、LadeStack のサーバーに保存されることはありません。",
    test: "接続をテスト",
    testing: "テスト中…",
    model: "モデル",
    modelHint: "プロジェクトを作成するには、ツール呼び出しに対応したモデルを選んでください。",
    tools: "ツール",
    save: "このモデルを使う",
    remove: "キーを消去",
    close: "閉じる",
    badKey: "API キーの形式ではないようです。空白や欠けている文字がないか確認してください。",
    invalidKey: "プロバイダーがこのキーを拒否しました。キーを確認するか、新しく作成してください。",
    billing:
      "プロバイダーのアカウント残高がありません。プロバイダーでクレジットを追加してから再試行してください。",
    rateLimit:
      "プロバイダーが現在リクエストを制限しています。しばらく待ってから再試行してください。",
    unavailable: "プロバイダーで問題が発生しています。後でもう一度お試しください。",
    network:
      "プロバイダーに接続できませんでした。接続状況や、ブラウザ拡張機能・ネットワークによるブロックを確認してください。",
    timeout: "プロバイダーの応答に時間がかかりすぎました。もう一度お試しください。",
    noModels: "このキーは有効ですが、使用できるチャットモデルが見つかりませんでした。",
    unexpected: "予期しないエラーが発生しました。もう一度お試しください。",
    rejected:
      "プロバイダーがリクエストを拒否しました。このモデルはツール呼び出しに対応していない可能性があります。「ツール」と表示されたモデルを選んでください。",
    agentPending:
      "{provider} に接続済みです。プロンプトをコードに変えるエージェントはまだ開発中のため、何も送信されず、下書きはそのまま残っています。",
  },
  ko: {
    connect: "AI 제공업체 연결",
    connected: "{provider} · {model}",
    title: "AI 제공업체",
    intro:
      "LadeStack Build는 무료입니다. 요청은 내 키로 이 브라우저에서 제공업체로 바로 전송되며, 사용량에 따라 제공업체가 요금을 청구할 수 있습니다.",
    provider: "제공업체",
    key: "API 키",
    show: "보기",
    hide: "숨기기",
    getKey: "{provider} 키 받기",
    keyNote:
      "키는 이 탭에만 보관되며 탭을 닫으면 삭제됩니다. 프로젝트, 내보내기, LadeStack 서버에 절대 저장되지 않습니다.",
    test: "연결 테스트",
    testing: "테스트 중…",
    model: "모델",
    modelHint: "프로젝트를 만들려면 도구 호출을 지원하는 모델을 선택하세요.",
    tools: "도구",
    save: "이 모델 사용",
    remove: "키 삭제",
    close: "닫기",
    badKey: "API 키 형식이 아닌 것 같습니다. 공백이나 빠진 문자가 없는지 확인하세요.",
    invalidKey: "제공업체가 이 키를 거부했습니다. 키를 확인하거나 새로 만드세요.",
    billing: "제공업체 계정에 크레딧이 없습니다. 제공업체에서 크레딧을 추가한 뒤 다시 시도하세요.",
    rateLimit: "제공업체가 지금 요청을 제한하고 있습니다. 잠시 후 다시 시도하세요.",
    unavailable: "제공업체에 문제가 있습니다. 나중에 다시 시도하세요.",
    network:
      "제공업체에 연결할 수 없습니다. 인터넷 연결이나 브라우저 확장 프로그램·네트워크 차단 여부를 확인하세요.",
    timeout: "제공업체 응답이 너무 오래 걸렸습니다. 다시 시도하세요.",
    noModels: "키는 유효하지만 사용할 수 있는 채팅 모델을 찾지 못했습니다.",
    unexpected: "예기치 않은 오류가 발생했습니다. 다시 시도하세요.",
    rejected:
      "제공업체가 요청을 거부했습니다. 이 모델은 도구 호출을 지원하지 않을 수 있습니다. ‘도구’ 표시가 있는 모델을 선택하세요.",
    agentPending:
      "{provider}에 연결되었습니다. 프롬프트를 코드로 바꾸는 에이전트는 아직 개발 중이라 아무것도 전송되지 않았고 초안은 그대로 있습니다.",
  },
  zh: {
    connect: "连接 AI 服务商",
    connected: "{provider} · {model}",
    title: "AI 服务商",
    intro:
      "LadeStack Build 免费。请求会使用你的密钥从此浏览器直接发送给服务商，服务商可能会按用量向你收费。",
    provider: "服务商",
    key: "API 密钥",
    show: "显示",
    hide: "隐藏",
    getKey: "获取 {provider} 密钥",
    keyNote:
      "密钥只保存在此标签页中，关闭后即被清除。它绝不会保存到项目、导出文件或任何 LadeStack 服务器。",
    test: "测试连接",
    testing: "正在测试…",
    model: "模型",
    modelHint: "要构建项目，请选择支持工具调用的模型。",
    tools: "工具",
    save: "使用此模型",
    remove: "清除密钥",
    close: "关闭",
    badKey: "这看起来不像 API 密钥。请检查是否有空格或缺少字符。",
    invalidKey: "服务商拒绝了此密钥。请检查密钥或创建新密钥。",
    billing: "你的服务商账户余额不足。请在服务商处充值后重试。",
    rateLimit: "服务商目前正在限制请求。请稍后重试。",
    unavailable: "服务商出现问题。请稍后重试。",
    network: "无法连接到服务商。请检查网络，或确认浏览器扩展或网络是否拦截了请求。",
    timeout: "服务商响应超时。请重试。",
    noModels: "此密钥有效，但没有找到可用的对话模型。",
    unexpected: "发生意外错误。请重试。",
    rejected: "服务商拒绝了该请求。此模型可能不支持工具调用；请选择标有“工具”的模型。",
    agentPending:
      "{provider} 已连接。将提示转换为代码的智能体仍在开发中，因此没有发送任何内容，草稿仍然保留。",
  },
  tr: {
    connect: "Yapay zekâ sağlayıcısı bağla",
    connected: "{provider} · {model}",
    title: "Yapay zekâ sağlayıcısı",
    intro:
      "LadeStack Build ücretsizdir. İstekler anahtarınızla bu tarayıcıdan doğrudan sağlayıcınıza gider ve sağlayıcınız kullanımınız için ücret alabilir.",
    provider: "Sağlayıcı",
    key: "API anahtarı",
    show: "Göster",
    hide: "Gizle",
    getKey: "{provider} anahtarı al",
    keyNote:
      "Anahtarınız yalnızca bu sekmede tutulur ve sekmeyi kapattığınızda unutulur. Projelere, dışa aktarımlara veya herhangi bir LadeStack sunucusuna asla kaydedilmez.",
    test: "Bağlantıyı test et",
    testing: "Test ediliyor…",
    model: "Model",
    modelHint: "Proje oluşturmak için araç çağrısını destekleyen bir model seçin.",
    tools: "araçlar",
    save: "Bu modeli kullan",
    remove: "Anahtarı unut",
    close: "Kapat",
    badKey:
      "Bu bir API anahtarına benzemiyor. Boşluk veya eksik karakter olup olmadığını kontrol edin.",
    invalidKey:
      "Sağlayıcı bu anahtarı reddetti. Anahtarı kontrol edin veya yeni bir tane oluşturun.",
    billing: "Sağlayıcı hesabınızda kredi kalmadı. Sağlayıcıdan kredi ekleyip tekrar deneyin.",
    rateLimit: "Sağlayıcı şu anda istekleri sınırlıyor. Biraz bekleyip tekrar deneyin.",
    unavailable: "Sağlayıcıda sorun var. Daha sonra tekrar deneyin.",
    network:
      "Sağlayıcıya ulaşılamadı. Bağlantınızı veya bir tarayıcı uzantısının ya da ağın engelleyip engellemediğini kontrol edin.",
    timeout: "Sağlayıcının yanıtı çok uzun sürdü. Tekrar deneyin.",
    noModels: "Bu anahtar çalışıyor ancak kullanılabilir sohbet modeli bulunamadı.",
    unexpected: "Beklenmeyen bir hata oluştu. Tekrar deneyin.",
    rejected:
      "Sağlayıcı isteği reddetti. Bu model araç çağrısını desteklemiyor olabilir; “araçlar” etiketli bir model seçin.",
    agentPending:
      "{provider} bağlı. İstemleri koda dönüştüren ajan hâlâ geliştiriliyor; bu yüzden hiçbir şey gönderilmedi ve taslağınız duruyor.",
  },
  fr: {
    connect: "Connecter un fournisseur d'IA",
    connected: "{provider} · {model}",
    title: "Fournisseur d'IA",
    intro:
      "LadeStack Build est gratuit. Les requêtes partent directement de ce navigateur vers votre fournisseur avec votre clé, et votre fournisseur peut vous facturer votre utilisation.",
    provider: "Fournisseur",
    key: "Clé API",
    show: "Afficher",
    hide: "Masquer",
    getKey: "Obtenir une clé {provider}",
    keyNote:
      "Votre clé reste uniquement dans cet onglet et est oubliée à sa fermeture. Elle n'est jamais enregistrée dans les projets, les exports ni sur un serveur LadeStack.",
    test: "Tester la connexion",
    testing: "Test en cours…",
    model: "Modèle",
    modelHint: "Choisissez un modèle compatible avec l'appel d'outils pour créer des projets.",
    tools: "outils",
    save: "Utiliser ce modèle",
    remove: "Oublier la clé",
    close: "Fermer",
    badKey:
      "Cela ne ressemble pas à une clé API. Vérifiez les espaces ou les caractères manquants.",
    invalidKey: "Le fournisseur a refusé cette clé. Vérifiez-la ou créez-en une nouvelle.",
    billing:
      "Votre compte fournisseur n'a plus de crédit. Ajoutez du crédit chez le fournisseur, puis réessayez.",
    rateLimit:
      "Le fournisseur limite les requêtes en ce moment. Patientez un instant, puis réessayez.",
    unavailable: "Le fournisseur rencontre des problèmes. Réessayez plus tard.",
    network:
      "Impossible de joindre le fournisseur. Vérifiez votre connexion, ou si une extension de navigateur ou le réseau le bloque.",
    timeout: "Le fournisseur a mis trop de temps à répondre. Réessayez.",
    noModels: "Cette clé fonctionne, mais aucun modèle de conversation utilisable n'a été trouvé.",
    unexpected: "Une erreur inattendue s'est produite. Réessayez.",
    rejected:
      "Le fournisseur a refusé la requête. Ce modèle ne prend peut-être pas en charge l'appel d'outils ; choisissez-en un marqué « outils ».",
    agentPending:
      "{provider} est connecté. L'agent qui transforme les prompts en code est encore en développement : rien n'a été envoyé et votre brouillon est conservé.",
  },
  pt: {
    connect: "Conectar provedor de IA",
    connected: "{provider} · {model}",
    title: "Provedor de IA",
    intro:
      "O LadeStack Build é gratuito. As solicitações vão direto deste navegador para o seu provedor com a sua chave, e o provedor pode cobrar pelo que você usar.",
    provider: "Provedor",
    key: "Chave de API",
    show: "Mostrar",
    hide: "Ocultar",
    getKey: "Obter uma chave {provider}",
    keyNote:
      "Sua chave fica apenas nesta aba e é esquecida quando você a fecha. Ela nunca é salva em projetos, exportações ou em qualquer servidor do LadeStack.",
    test: "Testar conexão",
    testing: "Testando…",
    model: "Modelo",
    modelHint: "Escolha um modelo com suporte a chamada de ferramentas para criar projetos.",
    tools: "ferramentas",
    save: "Usar este modelo",
    remove: "Esquecer chave",
    close: "Fechar",
    badKey: "Isso não parece uma chave de API. Verifique se há espaços ou caracteres faltando.",
    invalidKey: "O provedor recusou esta chave. Verifique-a ou crie uma nova.",
    billing:
      "Sua conta no provedor está sem crédito. Adicione crédito no provedor e tente novamente.",
    rateLimit: "O provedor está limitando solicitações agora. Aguarde um pouco e tente novamente.",
    unavailable: "O provedor está com problemas. Tente novamente mais tarde.",
    network:
      "Não foi possível acessar o provedor. Verifique sua conexão ou se uma extensão do navegador ou a rede está bloqueando.",
    timeout: "O provedor demorou demais para responder. Tente novamente.",
    noModels: "Esta chave funciona, mas nenhum modelo de chat utilizável foi encontrado.",
    unexpected: "Algo inesperado deu errado. Tente novamente.",
    rejected:
      "O provedor recusou a solicitação. Este modelo pode não ter suporte a chamada de ferramentas; escolha um marcado como “ferramentas”.",
    agentPending:
      "{provider} está conectado. O agente que transforma prompts em código ainda está em desenvolvimento, então nada foi enviado e seu rascunho continua aqui.",
  },
};
