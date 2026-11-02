import type { Locale } from "@ladestack/i18n";

/** The builder settings page (SET-01..04), in all eight locales. */
export interface SettingsStrings {
  link: string;
  title: string;
  back: string;
  provider: string;
  providerBody: string;
  language: string;
  languageBody: string;
  data: string;
  about: string;
  aboutBody: string;
  openSource: string;
}

export const settingsStrings: Record<Locale, SettingsStrings> = {
  en: {
    link: "Settings",
    title: "Settings",
    back: "Back to the builder",
    provider: "AI provider",
    providerBody:
      "Your key is kept only for this tab and sent only to the provider you choose. You pay that provider directly; LadeStack Build itself is free.",
    language: "Language",
    languageBody: "Changes the builder's language. Your projects are not affected.",
    data: "Data",
    about: "About",
    aboutBody:
      "LadeStack Build is free and open source under the MIT licence. No account is needed.",
    openSource: "Open-source credits",
  },
  ru: {
    link: "Настройки",
    title: "Настройки",
    back: "Вернуться в конструктор",
    provider: "Провайдер ИИ",
    providerBody:
      "Ваш ключ хранится только для этой вкладки и отправляется только выбранному провайдеру. Вы платите провайдеру напрямую; сам LadeStack Build бесплатен.",
    language: "Язык",
    languageBody: "Меняет язык конструктора. Ваши проекты не затрагиваются.",
    data: "Данные",
    about: "О программе",
    aboutBody:
      "LadeStack Build — бесплатный проект с открытым исходным кодом под лицензией MIT. Аккаунт не нужен.",
    openSource: "Открытое ПО",
  },
  ja: {
    link: "設定",
    title: "設定",
    back: "ビルダーに戻る",
    provider: "AI プロバイダー",
    providerBody:
      "キーはこのタブでのみ保持され、選択したプロバイダーにのみ送信されます。料金はプロバイダーに直接支払います。LadeStack Build 自体は無料です。",
    language: "言語",
    languageBody: "ビルダーの表示言語を変更します。プロジェクトには影響しません。",
    data: "データ",
    about: "概要",
    aboutBody: "LadeStack Build は MIT ライセンスの無料オープンソースです。アカウントは不要です。",
    openSource: "オープンソースのクレジット",
  },
  ko: {
    link: "설정",
    title: "설정",
    back: "빌더로 돌아가기",
    provider: "AI 제공업체",
    providerBody:
      "키는 이 탭에서만 보관되며 선택한 제공업체에만 전송됩니다. 요금은 제공업체에 직접 지불하며, LadeStack Build 자체는 무료입니다.",
    language: "언어",
    languageBody: "빌더의 언어를 바꿉니다. 프로젝트에는 영향을 주지 않습니다.",
    data: "데이터",
    about: "정보",
    aboutBody: "LadeStack Build는 MIT 라이선스의 무료 오픈 소스입니다. 계정이 필요하지 않습니다.",
    openSource: "오픈 소스 크레딧",
  },
  zh: {
    link: "设置",
    title: "设置",
    back: "返回构建器",
    provider: "AI 提供商",
    providerBody:
      "你的密钥只在此标签页中保留，并且只发送给你选择的提供商。费用直接支付给提供商；LadeStack Build 本身免费。",
    language: "语言",
    languageBody: "更改构建器的语言，不会影响你的项目。",
    data: "数据",
    about: "关于",
    aboutBody: "LadeStack Build 是基于 MIT 许可证的免费开源项目，无需账号。",
    openSource: "开源致谢",
  },
  tr: {
    link: "Ayarlar",
    title: "Ayarlar",
    back: "Oluşturucuya dön",
    provider: "Yapay zekâ sağlayıcısı",
    providerBody:
      "Anahtarınız yalnızca bu sekme için tutulur ve yalnızca seçtiğiniz sağlayıcıya gönderilir. Ücreti doğrudan sağlayıcıya ödersiniz; LadeStack Build'in kendisi ücretsizdir.",
    language: "Dil",
    languageBody: "Oluşturucunun dilini değiştirir. Projeleriniz etkilenmez.",
    data: "Veriler",
    about: "Hakkında",
    aboutBody: "LadeStack Build, MIT lisansıyla ücretsiz ve açık kaynaktır. Hesap gerekmez.",
    openSource: "Açık kaynak katkıları",
  },
  fr: {
    link: "Paramètres",
    title: "Paramètres",
    back: "Retour au constructeur",
    provider: "Fournisseur d’IA",
    providerBody:
      "Votre clé est conservée uniquement pour cet onglet et envoyée uniquement au fournisseur choisi. Vous payez ce fournisseur directement ; LadeStack Build est gratuit.",
    language: "Langue",
    languageBody: "Change la langue du constructeur. Vos projets ne sont pas modifiés.",
    data: "Données",
    about: "À propos",
    aboutBody:
      "LadeStack Build est gratuit et open source sous licence MIT. Aucun compte n’est nécessaire.",
    openSource: "Crédits open source",
  },
  pt: {
    link: "Configurações",
    title: "Configurações",
    back: "Voltar ao construtor",
    provider: "Provedor de IA",
    providerBody:
      "Sua chave fica guardada só nesta aba e é enviada apenas ao provedor que você escolher. Você paga o provedor diretamente; o LadeStack Build em si é gratuito.",
    language: "Idioma",
    languageBody: "Muda o idioma do construtor. Seus projetos não são afetados.",
    data: "Dados",
    about: "Sobre",
    aboutBody:
      "O LadeStack Build é gratuito e de código aberto sob a licença MIT. Não é preciso criar conta.",
    openSource: "Créditos de código aberto",
  },
};
