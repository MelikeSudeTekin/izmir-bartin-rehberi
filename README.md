# İzmir & Bartın Rehberi

İzmir ve Bartın şehirlerini keşfetmek isteyen kullanıcılar için geliştirilmiş, yapay zeka destekli interaktif şehir ve turizm rehberi.

Bu proje; şehirlerin tarihi, doğal güzellikleri, kültürel özellikleri ve gezilecek yerleri hakkında bilgi sunarken, kullanıcıların sorularına yapay zeka destekli bir sohbet asistanı üzerinden yanıt vermeyi amaçlar.

## Projenin Amacı

Projenin amacı, kullanıcıların İzmir ve Bartın hakkında ihtiyaç duydukları bilgilere modern ve kullanıcı dostu bir web arayüzü üzerinden ulaşmasını sağlamaktır.

Platform içerisinde şehir rehberinin yanı sıra yapay zeka destekli bir sohbet sistemi de bulunmaktadır.

## Temel Özellikler

- İzmir şehir rehberi
- Bartın şehir rehberi
- Tarihi ve kültürel bilgiler
- Doğal güzellikler ve gezilecek yerler
- Şehirler hakkında bilgilendirici içerikler
- Yapay zeka destekli sohbet asistanı
- Kullanıcı sorularına dinamik yanıt sistemi
- Responsive web tasarımı
- Express.js tabanlı backend
- OpenAI API entegrasyonu
- OpenAI API anahtarı bulunmadığında yerel simülasyon modu

## Yapay Zeka Asistanı

Projenin önemli özelliklerinden biri yapay zeka destekli şehir rehberi asistanıdır.

Kullanıcılar İzmir ve Bartın hakkında sorular sorarak şehirler, gezilecek yerler, kültür ve turizm konularında bilgi alabilir.

Backend tarafında Express.js kullanılarak oluşturulan `/api/chat` endpoint'i üzerinden yapay zeka servisiyle iletişim kurulmaktadır.

OpenAI API anahtarı tanımlanmadığında uygulama yerel simülasyon modunda çalışabilecek şekilde tasarlanmıştır.

## Kullanılan Teknolojiler

### Frontend

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts

### Backend

- Node.js
- Express.js
- CORS
- dotenv
- OpenAI API

## Proje Yapısı

```text
izmir-bartin-rehberi/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## Gereksinimler
Projeyi çalıştırmak için bilgisayarınızda aşağıdaki yazılımların bulunması gerekir:
- Node.js
- npm
Node.js'in güncel LTS sürümünün kullanılması önerilir.

## Kurulum

### 1. Projeyi klonlayın
```bash
git clone https://github.com/MelikeSudeTekin/izmir-bartin-rehberi.git
```

### 2. Proje klasörüne girin
```bash
cd izmir-bartin-rehberi
```

### 3. Bağımlılıkları yükleyin
```bash
npm install
```

### 4. Ortam değişkenlerini oluşturun
Proje klasöründe `.env` adında bir dosya oluşturun.

Dosyanın içerisine:
```env
OPENAI_API_KEY=your_openai_api_key_here
```
yazın.
Gerçek API anahtarınızı `.env` dosyasında saklayın.

**API anahtarınızı GitHub'a yüklemeyin.**
`.env` dosyası `.gitignore` içerisinde bulunduğu için Git tarafından takip edilmez.

### 5. Uygulamayı çalıştırın
```bash
npm run dev
```
Daha sonra tarayıcınızdan uygulamanın çalıştığı yerel adresi açabilirsiniz.

## API Yapısı

Uygulamanın backend tarafında yapay zeka istekleri için:
```text
POST /api/chat
```
endpoint'i kullanılmaktadır.

Frontend tarafından gönderilen kullanıcı mesajı backend tarafından işlenir ve uygun yanıt frontend'e geri gönderilir.

## Güvenlik
API anahtarının frontend tarafında tutulmaması için OpenAI API iletişimi backend üzerinden gerçekleştirilmektedir.
Gizli bilgilerin korunması amacıyla `.env` dosyası GitHub repository'sine dahil edilmemiştir.
`.gitignore` içerisinde:
```text
node_modules/
.env
.env.local
npm-debug.log*
.DS_Store
```

kuralları bulunmaktadır.

## Geliştirme Alanları

Proje gelecekte aşağıdaki özelliklerle geliştirilebilir:

- Kullanıcı hesap sistemi
- Favori mekanlar
- Harita entegrasyonu
- Konum tabanlı öneriler
- Otel ve restoran önerileri
- Etkinlik takvimi
- Daha gelişmiş yapay zeka önerileri
- Şehirler için detaylı kategori sistemi
- Yönetim paneli
- Veritabanı entegrasyonu
- Mobil uygulama desteği

## Proje Durumu
Proje geliştirme aşamasındadır.
Temel şehir rehberi, frontend arayüzü, Express.js backend yapısı ve yapay zeka sohbet sistemi oluşturulmuştur.

## Geliştirici
**Melike Sude Tekin**
Yapay Zeka Operatörlüğü öğrencisi.

GitHub:
https://github.com/MelikeSudeTekin

## Lisans
Bu proje eğitim ve portföy amacıyla geliştirilmiştir.
