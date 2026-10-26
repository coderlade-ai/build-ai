import type { Dictionary } from "./en";

export const tr: Dictionary = {
  meta: {
    title: "LadeStack Build: Tarayıcıda çalışan yapay zekâ web sitesi ve uygulama oluşturucu",
    description:
      "Ne istediğinizi anlatın, bir yapay zekâ ajanının gerçek kod yazmasını izleyin, önizleyin ve dosyaları indirin. Ücretsiz, hesap gerektirmez, kendi yapay zekâ anahtarınızı kullanırsınız. Geliştirme aşamasında.",
  },
  skipToContent: "İçeriğe geç",
  nav: {
    features: "Özellikler",
    useCases: "Kullanım alanları",
    howItWorks: "Nasıl çalışır",
    technology: "Teknoloji",
    menu: "Menü",
    language: "Dil",
    start: "Oluşturmaya başla",
  },
  status:
    "Geliştirme aşamasında. Bu sayfa üzerinde çalıştığımız ürünü anlatıyor; henüz hiçbiri yayında değil.",
  hero: {
    eyebrow: "Kendi koşullarınızda yapay zekâ ile geliştirme",
    title: "Fikirden çalışan koda",
    subtitle:
      "Bir web sitesi ya da uygulama tarif edin. Yapay zekâ ajanı planlar, dosyaları gerçek bir kod düzenleyicide yazar ve canlı önizlemeyi tarayıcınızda çalıştırır. Her satır sizin olarak kalır.",
    primary: "Oluşturmaya başla",
    secondary: "Nasıl çalıştığını gör",
  },
  features: {
    title: "Neler sunuyor",
    intro: "Kara kutu değil, gerçek bir geliştirme ortamı.",
    items: [
      {
        title: "Ajan modları",
        body: "Code, Plan, Ask ve Debug modlarının izinleri nettir; ajan yalnızca modun izin verdiğini yapar.",
      },
      {
        title: "Canlı kod düzenleyici",
        body: "Dosyalar, dosya ağacıyla birlikte Monaco düzenleyicide belirir. İstediğiniz zaman kendiniz düzenleyebilirsiniz.",
      },
      {
        title: "Tarayıcıda önizleme",
        body: "Bağımlılıklar package.json üzerinden kurulur ve desteklenen ortamlarda geliştirme sunucusu tarayıcı çalışma ortamında çalışır.",
      },
      {
        title: "Kendi anahtarınız",
        body: "Kendi yapay zekâ sağlayıcınızı bağlayın. Ödemeyi doğrudan ona yaparsınız; LadeStack ücret almaz.",
      },
      {
        title: "Kontrol noktaları",
        body: "Değişiklikler, yapay zekâ düzenlemelerinden önce ve sonra karşılaştırıp geri yükleyebileceğiniz kontrol noktalarına kaydedilir.",
      },
      {
        title: "ZIP olarak indir",
        body: "Tüm kaynak kodu klasör yapısıyla birlikte istediğiniz zaman dışa aktarın; hesap gerekmez.",
      },
    ],
  },
  useCases: {
    title: "Neler oluşturabilirsiniz",
    intro: "Önce React, TypeScript ve Vite ile ön yüz projeleri; diğer teknolojiler daha sonra.",
    items: [
      { title: "Açılış sayfaları", body: "Ürün lansmanları, etkinlikler ve kampanyalar." },
      { title: "SaaS panoları", body: "Yönetim panelleri, grafikler ve veri tabloları." },
      {
        title: "Portfolyolar",
        body: "Tasarımcılar, geliştiriciler ve içerik üreticileri için kişisel siteler.",
      },
      { title: "Kurumsal siteler", body: "Küçük şirketler ve ajanslar için çok sayfalı siteler." },
      {
        title: "Mağaza ön yüzleri",
        body: "Kendi arka ucunuza bağlanan ürün listeleri ve sepetler.",
      },
      { title: "Dokümantasyon siteleri", body: "Projeniz için kılavuzlar ve başvuru belgeleri." },
    ],
  },
  howItWorks: {
    title: "Nasıl çalışır",
    steps: [
      { title: "Anlatın", body: "Ne istediğinizi yazın, dilerseniz örnekler ekleyin." },
      { title: "Ajan planlar ve yazar", body: "Düzenleyicide dosyaları adım adım oluşturur." },
      { title: "Dosyalar belirir", body: "Kaydedilen her dosya yazıldıkça işaretlenir." },
      {
        title: "Önizleyin ve geliştirin",
        body: "Çalıştırın, değişiklik isteyin ya da kodu kendiniz düzenleyin.",
      },
      { title: "Dışa aktarın", body: "Projenizi ZIP olarak indirin." },
    ],
  },
  technology: {
    title: "Teknoloji",
    intro: "Hâlâ değerlendirilen seçimler ayrıca belirtilmiştir.",
    items: [
      {
        title: "Kilo Code'dan esinlenen ajan",
        body: "Açık kaynak ajan fikirlerinden uyarlanan modlar, araçlar, izinler ve kontrol noktaları.",
      },
      {
        title: "Monaco düzenleyici",
        body: "VS Code'un düzenleyici motoru, tarayıcınızda çalışır.",
      },
      {
        title: "Tarayıcı çalışma ortamı (değerlendiriliyor)",
        body: "Aday ortamlar, seçilmeden önce uyumluluk, lisans ve güvenlik açısından test edilir.",
      },
      {
        title: "Yerel öncelikli depolama",
        body: "Projeler tarayıcınızın depolama alanında tutulur. Bulut kopyası yoktur, bu yüzden düzenli olarak dışa aktarın.",
      },
    ],
  },
  byok: {
    title: "Anahtarınız ve kodunuz sizin",
    items: [
      {
        title: "Platform ücreti yok",
        body: "Kullandığınız kadarını yapay zekâ sağlayıcınıza ödersiniz. Burada paket ya da kredi yoktur.",
      },
      {
        title: "Anahtar yalnızca oturumda kalır",
        body: "Varsayılan olarak anahtarınız yalnızca geçerli oturumda tutulur ve projenize asla yazılmaz.",
      },
      {
        title: "Veri konusunda dürüstüz",
        body: "İstemler seçtiğiniz yapay zekâ sağlayıcısına gider, paket kurulumları npm'e bağlanır. Proje dosyalarınız siz dışa aktarana kadar tarayıcınızda kalır.",
      },
    ],
  },
  faq: {
    title: "Sorular",
    items: [
      {
        q: "Ücretsiz mi?",
        a: "Evet. LadeStack Build'in ücretli paketi yoktur. Yapay zekâ sağlayıcınız model kullanımı için ücret alabilir.",
      },
      { q: "Hesap gerekiyor mu?", a: "Hayır. Kayıt olmadan oluşturmaya başlayabilirsiniz." },
      {
        q: "Projelerim nerede saklanıyor?",
        a: "Bu cihazdaki tarayıcınızda. Tarayıcı verilerini temizlemek projeleri silebilir, bu yüzden ZIP yedeği indirin.",
      },
      {
        q: "Hangi çatılar destekleniyor?",
        a: "İlk desteklenen yığın, masaüstü Chrome ve Edge üzerinde React + TypeScript + Vite'tir. Diğerleri testleri geçtikçe eklenecek.",
      },
    ],
  },
  cta: {
    title: "Hazır olduğunuzda",
    body: "Oluşturucuyu açın ve ilk projenizi anlatın.",
    button: "Oluşturmaya başla",
  },
  footer: {
    tagline: "LadeStack'ten ücretsiz, yerel öncelikli yapay zekâ oluşturucu.",
    product: "Ürün",
    licence: "MIT lisansıyla açık kaynak.",
  },
};
