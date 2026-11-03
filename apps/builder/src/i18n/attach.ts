import type { Locale } from "@ladestack/i18n";

/** Composer attachments, in all eight locales. `{name}` is a file name, `{model}` a model id. */
export interface AttachStrings {
  attach: string;
  note: string;
  remove: string;
  blocked: string;
  unsupported: string;
  tooLarge: string;
  tooMany: string;
  readFailed: string;
  /** `{model}` is the chosen model id. */
  cantImages: string;
  cantPdf: string;
  unsureImages: string;
  unsurePdf: string;
}

export const attachStrings: Record<Locale, AttachStrings> = {
  en: {
    attach: "Attach files",
    note: "Images, PDFs, code and text files, up to 6. They are sent only to your provider with this request and are not saved.",
    remove: "Remove {name}",
    blocked: "{name}: credential and executable files are never attached.",
    unsupported: "{name}: this file type isn't supported.",
    tooLarge:
      "{name}: too large (images and PDFs up to 4 MB, text up to 200 KB, 300 KB of text in total).",
    tooMany: "{name}: you can attach up to 6 files.",
    readFailed: "{name}: couldn't read the file.",
    cantImages: "{model} can't read images. Remove them or choose another model in Settings.",
    cantPdf: "{model} can't read PDFs. Remove them or choose another model in Settings.",
    unsureImages:
      "Couldn't confirm that {model} reads images. Your provider may refuse the request.",
    unsurePdf: "Couldn't confirm that {model} reads PDFs. Your provider may refuse the request.",
  },
  ru: {
    attach: "Прикрепить файлы",
    note: "Изображения, PDF, код и текстовые файлы, до 6 штук. Они отправляются только вашему провайдеру вместе с этим запросом и не сохраняются.",
    remove: "Убрать {name}",
    blocked: "{name}: файлы с учётными данными и исполняемые файлы никогда не прикрепляются.",
    unsupported: "{name}: этот тип файла не поддерживается.",
    tooLarge:
      "{name}: слишком большой файл (изображения и PDF до 4 МБ, текст до 200 КБ, всего текста до 300 КБ).",
    tooMany: "{name}: можно прикрепить не более 6 файлов.",
    readFailed: "{name}: не удалось прочитать файл.",
    cantImages:
      "{model} не умеет читать изображения. Уберите их или выберите другую модель в настройках.",
    cantPdf: "{model} не умеет читать PDF. Уберите их или выберите другую модель в настройках.",
    unsureImages:
      "Не удалось подтвердить, что {model} читает изображения. Провайдер может отклонить запрос.",
    unsurePdf: "Не удалось подтвердить, что {model} читает PDF. Провайдер может отклонить запрос.",
  },
  ja: {
    attach: "ファイルを添付",
    note: "画像、PDF、コード、テキストファイルを最大 6 件まで。このリクエストとともにあなたのプロバイダーにのみ送信され、保存されません。",
    remove: "{name} を削除",
    blocked: "{name}: 認証情報ファイルと実行ファイルは添付できません。",
    unsupported: "{name}: このファイル形式には対応していません。",
    tooLarge:
      "{name}: サイズが大きすぎます（画像と PDF は 4 MB まで、テキストは 200 KB まで、テキスト合計 300 KB まで）。",
    tooMany: "{name}: 添付できるのは 6 件までです。",
    readFailed: "{name}: ファイルを読み込めませんでした。",
    cantImages: "{model} は画像を読み取れません。画像を外すか、設定で別のモデルを選んでください。",
    cantPdf: "{model} は PDF を読み取れません。PDF を外すか、設定で別のモデルを選んでください。",
    unsureImages:
      "{model} が画像を読み取れるか確認できませんでした。プロバイダーがリクエストを拒否する場合があります。",
    unsurePdf:
      "{model} が PDF を読み取れるか確認できませんでした。プロバイダーがリクエストを拒否する場合があります。",
  },
  ko: {
    attach: "파일 첨부",
    note: "이미지, PDF, 코드, 텍스트 파일을 최대 6개까지 첨부할 수 있습니다. 이 요청과 함께 내 제공업체에만 전송되며 저장되지 않습니다.",
    remove: "{name} 제거",
    blocked: "{name}: 자격 증명 파일과 실행 파일은 첨부할 수 없습니다.",
    unsupported: "{name}: 지원하지 않는 파일 형식입니다.",
    tooLarge:
      "{name}: 파일이 너무 큽니다(이미지·PDF 최대 4MB, 텍스트 최대 200KB, 텍스트 합계 최대 300KB).",
    tooMany: "{name}: 최대 6개 파일까지 첨부할 수 있습니다.",
    readFailed: "{name}: 파일을 읽지 못했습니다.",
    cantImages:
      "{model}은(는) 이미지를 읽을 수 없습니다. 이미지를 빼거나 설정에서 다른 모델을 선택하세요.",
    cantPdf: "{model}은(는) PDF를 읽을 수 없습니다. PDF를 빼거나 설정에서 다른 모델을 선택하세요.",
    unsureImages:
      "{model}이(가) 이미지를 읽을 수 있는지 확인하지 못했습니다. 제공업체가 요청을 거부할 수 있습니다.",
    unsurePdf:
      "{model}이(가) PDF를 읽을 수 있는지 확인하지 못했습니다. 제공업체가 요청을 거부할 수 있습니다.",
  },
  zh: {
    attach: "添加附件",
    note: "图片、PDF、代码和文本文件，最多 6 个。它们只会随本次请求发送给你的提供商，不会被保存。",
    remove: "移除 {name}",
    blocked: "{name}：凭据文件和可执行文件永远不会被附加。",
    unsupported: "{name}：不支持此文件类型。",
    tooLarge: "{name}：文件过大（图片和 PDF 最大 4 MB，文本最大 200 KB，文本合计最大 300 KB）。",
    tooMany: "{name}：最多只能附加 6 个文件。",
    readFailed: "{name}：无法读取文件。",
    cantImages: "{model} 无法读取图片。请移除图片，或在设置中选择其他模型。",
    cantPdf: "{model} 无法读取 PDF。请移除 PDF，或在设置中选择其他模型。",
    unsureImages: "无法确认 {model} 能否读取图片。提供商可能会拒绝该请求。",
    unsurePdf: "无法确认 {model} 能否读取 PDF。提供商可能会拒绝该请求。",
  },
  tr: {
    attach: "Dosya ekle",
    note: "Görseller, PDF, kod ve metin dosyaları, en fazla 6 adet. Yalnızca bu istekle birlikte sağlayıcınıza gönderilir ve kaydedilmez.",
    remove: "{name} dosyasını kaldır",
    blocked: "{name}: kimlik bilgisi ve çalıştırılabilir dosyalar asla eklenmez.",
    unsupported: "{name}: bu dosya türü desteklenmiyor.",
    tooLarge:
      "{name}: dosya çok büyük (görseller ve PDF en fazla 4 MB, metin en fazla 200 KB, toplam metin en fazla 300 KB).",
    tooMany: "{name}: en fazla 6 dosya ekleyebilirsiniz.",
    readFailed: "{name}: dosya okunamadı.",
    cantImages:
      "{model} görselleri okuyamaz. Görselleri kaldırın veya Ayarlar'dan başka bir model seçin.",
    cantPdf: "{model} PDF okuyamaz. PDF'leri kaldırın veya Ayarlar'dan başka bir model seçin.",
    unsureImages:
      "{model} modelinin görselleri okuyup okuyamadığı doğrulanamadı. Sağlayıcınız isteği reddedebilir.",
    unsurePdf:
      "{model} modelinin PDF okuyup okuyamadığı doğrulanamadı. Sağlayıcınız isteği reddedebilir.",
  },
  fr: {
    attach: "Joindre des fichiers",
    note: "Images, PDF, code et fichiers texte, jusqu’à 6. Ils sont envoyés uniquement à votre fournisseur avec cette requête et ne sont pas enregistrés.",
    remove: "Retirer {name}",
    blocked: "{name} : les fichiers d’identifiants et les exécutables ne sont jamais joints.",
    unsupported: "{name} : ce type de fichier n’est pas pris en charge.",
    tooLarge:
      "{name} : fichier trop volumineux (images et PDF jusqu’à 4 Mo, texte jusqu’à 200 Ko, 300 Ko de texte au total).",
    tooMany: "{name} : vous pouvez joindre jusqu’à 6 fichiers.",
    readFailed: "{name} : impossible de lire le fichier.",
    cantImages:
      "{model} ne peut pas lire les images. Retirez-les ou choisissez un autre modèle dans les réglages.",
    cantPdf:
      "{model} ne peut pas lire les PDF. Retirez-les ou choisissez un autre modèle dans les réglages.",
    unsureImages:
      "Impossible de confirmer que {model} lit les images. Votre fournisseur peut refuser la requête.",
    unsurePdf:
      "Impossible de confirmer que {model} lit les PDF. Votre fournisseur peut refuser la requête.",
  },
  pt: {
    attach: "Anexar arquivos",
    note: "Imagens, PDFs, código e arquivos de texto, até 6. Eles são enviados apenas ao seu provedor com esta solicitação e não são salvos.",
    remove: "Remover {name}",
    blocked: "{name}: arquivos de credenciais e executáveis nunca são anexados.",
    unsupported: "{name}: este tipo de arquivo não é compatível.",
    tooLarge:
      "{name}: arquivo grande demais (imagens e PDFs até 4 MB, texto até 200 KB, 300 KB de texto no total).",
    tooMany: "{name}: você pode anexar até 6 arquivos.",
    readFailed: "{name}: não foi possível ler o arquivo.",
    cantImages: "{model} não lê imagens. Remova-as ou escolha outro modelo nas Configurações.",
    cantPdf: "{model} não lê PDFs. Remova-os ou escolha outro modelo nas Configurações.",
    unsureImages:
      "Não foi possível confirmar que {model} lê imagens. Seu provedor pode recusar a solicitação.",
    unsurePdf:
      "Não foi possível confirmar que {model} lê PDFs. Seu provedor pode recusar a solicitação.",
  },
};
