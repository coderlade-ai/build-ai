import type { PagesDictionary } from "./en";

/** Brazilian Portuguese (ADR 0012). */
export const pt: PagesDictionary = {
  common: {
    legal: "Informações legais",
    draft:
      "Rascunho: este texto ainda não foi revisado por um advogado e pode mudar antes do lançamento.",
    updated: "Última atualização",
    backHome: "Voltar para a página inicial",
  },
  links: {
    privacy: "Privacidade",
    terms: "Termos",
    disclaimer: "Aviso legal",
    openSource: "Código aberto",
    about: "Sobre",
    contact: "Contato",
  },
  privacy: {
    title: "Privacidade",
    description:
      "Como o LadeStack Build trata seus dados: armazenamento local, sua chave de IA e serviços de terceiros.",
    sections: [
      {
        h: "Sem conta, sem perfil",
        p: "Você pode usar o LadeStack Build sem se cadastrar. Não mantemos contas de usuário, e este site não usa cookies de publicidade ou de análise.",
      },
      {
        h: "Seus projetos ficam no navegador",
        p: "O criador guarda projetos, arquivos e pontos de restauração no armazenamento local do navegador, no seu dispositivo. Não mantemos cópias em nossos servidores. Limpar os dados do navegador pode apagá-los, então baixe um ZIP para guardar.",
      },
      {
        h: "Sua chave de IA e seus prompts",
        p: "Você conecta seu próprio provedor de IA. Por padrão, sua chave fica guardada só na sessão atual do navegador e nunca é gravada no projeto nem nas exportações. Seus prompts e os arquivos de que o agente precisa são enviados ao provedor escolhido, de acordo com a política de privacidade dele.",
      },
      {
        h: "Outros serviços",
        p: "A instalação de pacotes acessa o registro do npm. Nosso provedor de hospedagem pode tratar dados técnicos das requisições, como endereços IP, para entregar e proteger o site.",
      },
      {
        h: "Suas escolhas",
        p: "Você pode apagar seus projetos e configurações salvas a qualquer momento pelo navegador ou pelas configurações do criador; baixe seu trabalho antes.",
      },
    ],
  },
  terms: {
    title: "Termos de uso",
    description: "Os termos básicos para usar o LadeStack Build.",
    sections: [
      {
        h: "Uso do serviço",
        p: "O LadeStack Build é oferecido gratuitamente, no estado em que se encontra, enquanto está em desenvolvimento. Os recursos podem mudar ou ficar indisponíveis a qualquer momento.",
      },
      {
        h: "Seu conteúdo",
        p: "Tudo o que você cria é seu, inclusive o código que o agente escreve para você. Você é responsável por revisá-lo e pela forma como o utiliza.",
      },
      {
        h: "Serviços de terceiros",
        p: "Provedores de IA, o npm e outros serviços que você conecta têm termos próprios e podem cobrar de você. Essas cobranças são entre você e eles.",
      },
      {
        h: "Uso aceitável",
        p: "Não use o serviço para violar a lei, prejudicar outras pessoas ou atacar outros sistemas.",
      },
      {
        h: "Sem garantia",
        p: "O software é fornecido sem nenhuma garantia, na medida permitida por lei, conforme descrito na licença MIT.",
      },
    ],
  },
  disclaimer: {
    title: "Aviso legal",
    description: "Os limites do código gerado por IA e do ambiente de execução no navegador.",
    sections: [
      {
        h: "A IA pode errar",
        p: "Código e textos escritos por modelos de IA podem conter erros, falhas de segurança ou práticas desatualizadas. Revise e teste tudo antes de confiar no resultado.",
      },
      {
        h: "Limites do ambiente no navegador",
        p: "Rodar projetos no navegador tem limites. Alguns pacotes, módulos nativos e recursos de back-end podem não funcionar, e o suporte varia entre navegadores.",
      },
      {
        h: "Não é aconselhamento profissional",
        p: "Nada do que o criador produz constitui aconselhamento jurídico, financeiro, médico ou de segurança.",
      },
    ],
  },
  openSource: {
    title: "Código aberto",
    description:
      "A licença do LadeStack Build e os projetos de código aberto em que ele se baseia.",
    intro:
      "O LadeStack Build é código aberto sob a licença MIT. Ele é construído com os projetos abaixo; suas licenças e avisos são mantidos junto com o código-fonte.",
    planned: "previsto",
  },
  about: {
    title: "Sobre",
    description: "O que é o LadeStack Build, como ele funciona e em que fase o projeto está.",
    sections: [
      {
        h: "O que é",
        p: "O LadeStack Build é um criador de sites e aplicativos com IA, gratuito e de código aberto, que roda no seu navegador. Você descreve o que quer, um agente de IA escreve o código, e você pode editar, visualizar e exportar.",
      },
      {
        h: "Como funciona",
        p: "Não é preciso criar conta. Você usa sua própria chave de um provedor de IA, seus projetos ficam no navegador do seu dispositivo, e você pode baixar seu trabalho em ZIP a qualquer momento.",
      },
      {
        h: "Em que fase está",
        p: "O LadeStack Build está no início do desenvolvimento. Este site está no ar enquanto o criador ainda está sendo construído, então os recursos são descritos como previstos até serem lançados.",
      },
      {
        h: "Código aberto",
        p: "O código-fonte é público no GitHub sob a licença MIT. Lá você pode ler o código, relatar problemas e sugerir mudanças.",
      },
    ],
    source: "Ver o código-fonte no GitHub",
  },
  contact: {
    title: "Contato",
    description: "Como entrar em contato com o projeto LadeStack Build.",
    sections: [
      {
        h: "Dúvidas, bugs e ideias",
        p: "A melhor forma de falar com o projeto é abrir uma issue no GitHub. As issues são públicas, então nunca inclua chaves de API, senhas ou arquivos de projetos privados.",
      },
      {
        h: "Problemas de segurança",
        p: "Se você encontrar um problema de segurança, não publique os detalhes em uma issue pública. Abra uma issue pedindo apenas um canal privado e compartilhe os detalhes quando ele estiver disponível.",
      },
    ],
    issues: "Abrir uma issue no GitHub",
  },
  blog: {
    title: "Blog",
    description: "Artigos sobre o LadeStack Build, criação local com IA e a plataforma web.",
    empty:
      "Nenhum artigo foi publicado ainda. Cada artigo aparecerá aqui quando estiver disponível nos oito idiomas.",
    published: "Publicado em",
    updated: "Atualizado em",
    allArticles: "Todos os artigos",
  },
  notFound: {
    title: "Página não encontrada",
    description: "A página que você procura não existe.",
    body: "Esta página não existe ou foi movida.",
  },
};
