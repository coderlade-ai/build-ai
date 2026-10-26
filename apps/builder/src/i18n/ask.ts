import type { Locale } from "@ladestack/i18n";

/** Ask-mode answer strings, in all eight locales. Placeholder: {provider}. */
export interface AskStrings {
  question: string;
  answer: string;
  waiting: string;
  stop: string;
  stopped: string;
  interrupted: string;
  notSaved: string;
}

export const askStrings: Record<Locale, AskStrings> = {
  en: {
    question: "You asked",
    answer: "Answer from {provider}",
    waiting: "Waiting for {provider}…",
    stop: "Stop",
    stopped: "Stopped. The answer so far is kept.",
    interrupted:
      "The answer was cut off before it finished. What arrived is kept; ask again to retry.",
    notSaved: "Ask mode answers aren't saved yet and disappear when you leave this page.",
  },
  ru: {
    question: "Ваш вопрос",
    answer: "Ответ от {provider}",
    waiting: "Ожидание ответа от {provider}…",
    stop: "Остановить",
    stopped: "Остановлено. Полученная часть ответа сохранена.",
    interrupted:
      "Ответ прервался, не завершившись. Полученная часть сохранена; спросите снова, чтобы повторить.",
    notSaved: "Ответы режима Ask пока не сохраняются и исчезнут, когда вы покинете страницу.",
  },
  ja: {
    question: "あなたの質問",
    answer: "{provider} からの回答",
    waiting: "{provider} の応答を待っています…",
    stop: "停止",
    stopped: "停止しました。ここまでの回答は残っています。",
    interrupted:
      "回答が途中で途切れました。受信した部分は残っています。もう一度質問すると再試行できます。",
    notSaved: "Ask モードの回答はまだ保存されず、このページを離れると消えます。",
  },
  ko: {
    question: "질문",
    answer: "{provider}의 답변",
    waiting: "{provider}의 응답을 기다리는 중…",
    stop: "중지",
    stopped: "중지했습니다. 지금까지의 답변은 남아 있습니다.",
    interrupted:
      "답변이 끝나기 전에 끊겼습니다. 받은 부분은 남아 있으며, 다시 질문하면 재시도합니다.",
    notSaved: "Ask 모드 답변은 아직 저장되지 않으며 이 페이지를 떠나면 사라집니다.",
  },
  zh: {
    question: "你的问题",
    answer: "来自 {provider} 的回答",
    waiting: "正在等待 {provider}…",
    stop: "停止",
    stopped: "已停止。已收到的回答会保留。",
    interrupted: "回答在完成前中断了。已收到的内容会保留；再次提问即可重试。",
    notSaved: "Ask 模式的回答暂不保存，离开此页面后会消失。",
  },
  tr: {
    question: "Sorunuz",
    answer: "{provider} yanıtı",
    waiting: "{provider} bekleniyor…",
    stop: "Durdur",
    stopped: "Durduruldu. Şu ana kadarki yanıt korunuyor.",
    interrupted:
      "Yanıt bitmeden kesildi. Gelen kısım korunuyor; yeniden denemek için tekrar sorun.",
    notSaved: "Ask modu yanıtları henüz kaydedilmiyor ve bu sayfadan ayrıldığınızda kaybolur.",
  },
  fr: {
    question: "Votre question",
    answer: "Réponse de {provider}",
    waiting: "En attente de {provider}…",
    stop: "Arrêter",
    stopped: "Arrêté. La réponse reçue jusqu'ici est conservée.",
    interrupted:
      "La réponse a été coupée avant la fin. Ce qui est arrivé est conservé ; reposez la question pour réessayer.",
    notSaved:
      "Les réponses du mode Ask ne sont pas encore enregistrées et disparaissent quand vous quittez cette page.",
  },
  pt: {
    question: "Sua pergunta",
    answer: "Resposta de {provider}",
    waiting: "Aguardando {provider}…",
    stop: "Parar",
    stopped: "Parado. A resposta recebida até agora foi mantida.",
    interrupted:
      "A resposta foi interrompida antes de terminar. O que chegou foi mantido; pergunte de novo para tentar outra vez.",
    notSaved: "As respostas do modo Ask ainda não são salvas e somem quando você sai desta página.",
  },
};
