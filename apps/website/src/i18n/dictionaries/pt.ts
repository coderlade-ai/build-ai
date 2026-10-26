import type { Dictionary } from "./en";

/** Brazilian Portuguese (ADR 0012). */
export const pt: Dictionary = {
  meta: {
    title: "LadeStack Build: criador de sites e apps com IA, no navegador",
    description:
      "Descreva o que você quer, veja um agente de IA escrever código de verdade, visualize e baixe os arquivos. Grátis, sem conta, com sua própria chave de IA. Em desenvolvimento.",
  },
  skipToContent: "Pular para o conteúdo",
  nav: {
    features: "Recursos",
    useCases: "Casos de uso",
    howItWorks: "Como funciona",
    technology: "Tecnologia",
    menu: "Menu",
    language: "Idioma",
    start: "Começar a criar",
  },
  status:
    "Em desenvolvimento. Esta página descreve o que estamos construindo; nada disso está no ar ainda.",
  hero: {
    eyebrow: "Desenvolvimento com IA, do seu jeito",
    title: "Da ideia ao código funcionando",
    subtitle:
      "Descreva um site ou app. Um agente de IA planeja, escreve os arquivos em um editor de código de verdade e roda uma prévia ao vivo, tudo no seu navegador. Cada linha continua sendo sua.",
    primary: "Começar a criar",
    secondary: "Veja como funciona",
  },
  features: {
    title: "O que você ganha",
    intro: "Um ambiente de desenvolvimento de verdade, não uma caixa-preta.",
    items: [
      {
        title: "Modos do agente",
        body: "Modos Code, Plan, Ask e Debug com permissões claras: o agente só faz o que o modo permite.",
      },
      {
        title: "Editor de código ao vivo",
        body: "Os arquivos aparecem em um editor Monaco com árvore de pastas. Edite o que quiser, quando quiser.",
      },
      {
        title: "Prévia no navegador",
        body: "As dependências são instaladas a partir do package.json e um servidor de desenvolvimento roda em um ambiente no navegador, onde houver suporte.",
      },
      {
        title: "Sua própria chave",
        body: "Conecte seu provedor de IA. Você paga direto a ele; a LadeStack não cobra taxas.",
      },
      {
        title: "Pontos de restauração",
        body: "As alterações ficam salvas em pontos de restauração que você pode comparar e restaurar antes e depois das edições da IA.",
      },
      {
        title: "Download em ZIP",
        body: "Exporte todo o código-fonte com a estrutura de pastas quando quiser, sem conta.",
      },
    ],
  },
  useCases: {
    title: "O que você pode criar",
    intro: "Primeiro, projetos front-end com React, TypeScript e Vite; outras tecnologias depois.",
    items: [
      { title: "Landing pages", body: "Lançamentos de produtos, eventos e campanhas." },
      { title: "Painéis SaaS", body: "Áreas administrativas, gráficos e tabelas de dados." },
      { title: "Portfólios", body: "Sites pessoais para designers, desenvolvedores e criadores." },
      {
        title: "Sites institucionais",
        body: "Sites com várias páginas para pequenas empresas e agências.",
      },
      { title: "Vitrines de loja", body: "Catálogos e carrinhos ligados ao seu próprio back-end." },
      { title: "Sites de documentação", body: "Guias e referências para o seu projeto." },
    ],
  },
  howItWorks: {
    title: "Como funciona",
    steps: [
      { title: "Descreva", body: "Escreva o que você quer e, se quiser, adicione referências." },
      {
        title: "O agente planeja e escreve",
        body: "Ele cria os arquivos passo a passo no editor.",
      },
      { title: "Os arquivos aparecem", body: "Cada arquivo salvo é marcado conforme é escrito." },
      {
        title: "Visualize e ajuste",
        body: "Rode o projeto, peça mudanças ou edite o código você mesmo.",
      },
      { title: "Exporte", body: "Baixe seu projeto em ZIP." },
    ],
  },
  technology: {
    title: "Tecnologia",
    intro: "As escolhas que ainda estão em avaliação estão sinalizadas.",
    items: [
      {
        title: "Agente inspirado no Kilo Code",
        body: "Modos, ferramentas, permissões e pontos de restauração baseados em ideias de agentes de código aberto.",
      },
      { title: "Editor Monaco", body: "O motor de edição do VS Code, rodando no seu navegador." },
      {
        title: "Ambiente no navegador (em avaliação)",
        body: "Os candidatos passam por testes de compatibilidade, licença e segurança antes da escolha.",
      },
      {
        title: "Armazenamento local primeiro",
        body: "Os projetos ficam no armazenamento do seu navegador. Não há cópia na nuvem, então exporte com frequência.",
      },
    ],
  },
  byok: {
    title: "Sua chave, seu código",
    items: [
      {
        title: "Sem taxas da plataforma",
        body: "Você paga ao seu provedor de IA pelo que usar. Aqui não há planos nem créditos.",
      },
      {
        title: "A chave fica só na sessão",
        body: "Por padrão, sua chave é guardada apenas na sessão atual e nunca é gravada no seu projeto.",
      },
      {
        title: "Transparência com os dados",
        body: "Os prompts vão para o provedor de IA que você escolher, e a instalação de pacotes acessa o npm. Seus arquivos ficam no navegador até você exportá-los.",
      },
    ],
  },
  faq: {
    title: "Perguntas",
    items: [
      {
        q: "É grátis?",
        a: "Sim. O LadeStack Build não tem planos pagos. Seu provedor de IA pode cobrar pelo uso do modelo.",
      },
      { q: "Preciso de uma conta?", a: "Não. Você pode começar sem se cadastrar." },
      {
        q: "Onde meus projetos ficam salvos?",
        a: "No seu navegador, neste dispositivo. Limpar os dados do navegador pode apagá-los, então baixe um ZIP para guardar.",
      },
      {
        q: "Quais frameworks são suportados?",
        a: "Primeiro React com TypeScript e Vite, no Chrome e no Edge para desktop. Outros virão depois de passarem nos testes.",
      },
    ],
  },
  cta: {
    title: "Pronto quando você estiver",
    body: "Abra o criador e descreva seu primeiro projeto.",
    button: "Começar a criar",
  },
  footer: {
    tagline: "Um criador com IA gratuito e local, da LadeStack.",
    product: "Produto",
    licence: "Código aberto sob a licença MIT.",
  },
};
