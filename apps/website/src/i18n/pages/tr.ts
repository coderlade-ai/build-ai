import type { PagesDictionary } from "./en";

export const tr: PagesDictionary = {
  common: {
    legal: "Yasal",
    draft: "Taslak: Bu metin henüz bir avukat tarafından incelenmedi ve yayından önce değişebilir.",
    updated: "Son güncelleme",
    backHome: "Ana sayfaya dön",
  },
  links: {
    privacy: "Gizlilik",
    terms: "Koşullar",
    disclaimer: "Sorumluluk reddi",
    openSource: "Açık kaynak",
    about: "Hakkında",
    contact: "İletişim",
  },
  privacy: {
    title: "Gizlilik",
    description:
      "LadeStack Build verilerinizi nasıl ele alır: yerel depolama, yapay zekâ anahtarınız ve üçüncü taraflar.",
    sections: [
      {
        h: "Hesap yok, profil yok",
        p: "LadeStack Build'i kayıt olmadan kullanabilirsiniz. Kullanıcı hesapları tutmuyoruz ve bu site reklam ya da analiz çerezi yerleştirmiyor.",
      },
      {
        h: "Projeleriniz tarayıcınızda kalır",
        p: "Oluşturucu projeleri, dosyaları ve kontrol noktalarını cihazınızdaki tarayıcı depolama alanında saklar. Sunucularımızda kopyasını tutmayız. Tarayıcı verilerini temizlemek bunları silebilir, bu yüzden ZIP yedeği indirin.",
      },
      {
        h: "Yapay zekâ anahtarınız ve istemleriniz",
        p: "Yapay zekâ sağlayıcınızı kendiniz bağlarsınız. Varsayılan olarak anahtarınız yalnızca geçerli tarayıcı oturumunda tutulur ve projenize ya da dışa aktarımlarına asla yazılmaz. İstemleriniz ve ajanın ihtiyaç duyduğu dosyalar, seçtiğiniz sağlayıcıya onun gizlilik koşulları çerçevesinde gönderilir.",
      },
      {
        h: "Diğer hizmetler",
        p: "Paket kurulumu npm kayıt deposuna bağlanır. Barındırma sağlayıcımız, siteyi sunmak ve korumak için IP adresleri gibi teknik istek verilerini işleyebilir.",
      },
      {
        h: "Sizin tercihleriniz",
        p: "Projelerinizi ve kayıtlı ayarlarınızı istediğiniz zaman tarayıcınızdan ya da oluşturucu ayarlarından silebilirsiniz; silmeden önce çalışmanızı indirin.",
      },
    ],
  },
  terms: {
    title: "Kullanım koşulları",
    description: "LadeStack Build'i kullanmanın temel koşulları.",
    sections: [
      {
        h: "Hizmetin kullanımı",
        p: "LadeStack Build geliştirme aşamasında olduğu için ücretsiz ve olduğu gibi sunulur. Özellikler her an değişebilir ya da kullanılamaz hâle gelebilir.",
      },
      {
        h: "İçeriğiniz",
        p: "Ajanın sizin için yazdığı kod dahil, oluşturduğunuz her şey size aittir. İncelenmesinden ve nasıl kullanıldığından siz sorumlusunuz.",
      },
      {
        h: "Üçüncü taraf hizmetler",
        p: "Yapay zekâ sağlayıcıları, npm ve bağladığınız diğer hizmetlerin kendi koşulları vardır ve sizden ücret alabilirler. Bu ücretler sizinle onlar arasındadır.",
      },
      {
        h: "Kabul edilebilir kullanım",
        p: "Hizmeti yasaları çiğnemek, başkalarına zarar vermek ya da başka sistemlere saldırmak için kullanmayın.",
      },
      {
        h: "Garanti yok",
        p: "Yazılım, MIT lisansında açıklandığı gibi, yasaların izin verdiği ölçüde hiçbir garanti olmaksızın sunulur.",
      },
    ],
  },
  disclaimer: {
    title: "Sorumluluk reddi",
    description: "Yapay zekâ ile üretilen kodun ve tarayıcı çalışma ortamının sınırları.",
    sections: [
      {
        h: "Yapay zekâ yanılabilir",
        p: "Yapay zekâ modellerinin yazdığı kod ve metinler hatalar, güvenlik sorunları ya da eskimiş yöntemler içerebilir. Güvenmeden önce her şeyi inceleyin ve test edin.",
      },
      {
        h: "Tarayıcı ortamının sınırları",
        p: "Projeleri tarayıcıda çalıştırmanın sınırları vardır. Bazı paketler, yerel modüller ve arka uç özellikleri çalışmayabilir; tarayıcı desteği de değişkenlik gösterir.",
      },
      {
        h: "Profesyonel tavsiye değildir",
        p: "Oluşturucunun ürettiği hiçbir şey hukuki, mali, tıbbi ya da güvenlik tavsiyesi değildir.",
      },
    ],
  },
  openSource: {
    title: "Açık kaynak",
    description: "LadeStack Build'in lisansı ve üzerine kurulduğu açık kaynak projeler.",
    intro:
      "LadeStack Build, MIT lisansıyla açık kaynaktır. Aşağıdaki projelerle geliştirilmiştir; lisansları ve bildirimleri kaynak koduyla birlikte saklanır.",
    planned: "planlanıyor",
  },
  about: {
    title: "Hakkında",
    description: "LadeStack Build nedir, nasıl çalışır ve proje hangi aşamada.",
    sections: [
      {
        h: "Nedir",
        p: "LadeStack Build, tarayıcınızda çalışan ücretsiz ve açık kaynaklı bir yapay zekâ web sitesi ve uygulama oluşturucusudur. Ne istediğinizi anlatırsınız, bir yapay zekâ ajanı kodu yazar; siz de onu düzenleyebilir, önizleyebilir ve dışa aktarabilirsiniz.",
      },
      {
        h: "Nasıl çalışır",
        p: "Hesap oluşturmanız gerekmez. Kendi yapay zekâ sağlayıcı anahtarınızı kullanırsınız, projeleriniz cihazınızdaki tarayıcıda saklanır ve çalışmanızı istediğiniz zaman ZIP olarak indirebilirsiniz.",
      },
      {
        h: "Şu anki durum",
        p: "LadeStack Build geliştirmenin erken aşamasında. Bu web sitesi yayında, oluşturucu ise hâlâ geliştiriliyor; bu yüzden özellikler kullanıma sunulana kadar planlanan olarak anlatılıyor.",
      },
      {
        h: "Açık kaynak",
        p: "Kaynak kodu MIT lisansıyla GitHub'da herkese açıktır. Kodu orada inceleyebilir, sorun bildirebilir ve değişiklik önerebilirsiniz.",
      },
    ],
    source: "Kaynak kodu GitHub'da görüntüle",
  },
  contact: {
    title: "İletişim",
    description: "LadeStack Build projesine nasıl ulaşılır.",
    sections: [
      {
        h: "Sorular, hatalar ve fikirler",
        p: "Projeye ulaşmanın en iyi yolu GitHub'da bir issue açmaktır. Issue'lar herkese açıktır; bu yüzden API anahtarı, parola ya da özel proje dosyalarını asla eklemeyin.",
      },
      {
        h: "Güvenlik sorunları",
        p: "Bir güvenlik sorunu bulursanız ayrıntıları herkese açık bir issue'da paylaşmayın. Yalnızca özel bir iletişim kanalı isteyen bir issue açın ve kanal kurulduğunda ayrıntıları paylaşın.",
      },
    ],
    issues: "GitHub'da issue aç",
  },
  blog: {
    title: "Blog",
    description:
      "LadeStack Build, yerel öncelikli yapay zekâ ile geliştirme ve web platformu üzerine yazılar.",
    empty:
      "Henüz yayımlanmış yazı yok. Her yazı sekiz dilin tamamında hazır olduğunda burada yer alacak.",
    published: "Yayımlanma",
    updated: "Güncellenme",
    allArticles: "Tüm yazılar",
  },
  notFound: {
    title: "Sayfa bulunamadı",
    description: "Aradığınız sayfa mevcut değil.",
    body: "Bu sayfa yok ya da taşınmış.",
  },
};
