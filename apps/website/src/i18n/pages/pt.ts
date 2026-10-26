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
  notFound: {
    title: "Página não encontrada",
    description: "A página que você procura não existe.",
    body: "Esta página não existe ou foi movida.",
  },
};
