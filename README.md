# İzmir & Bartın Şehir Rehberi ve Yapay Zeka Chatbot Portalı

Bu proje, Ege'nin incisi **İzmir** ile Batı Karadeniz'in gözbebeği **Bartın** (Amasra dahil) şehirlerini tanıtan, tarihi, doğal güzellikleri ve kültürleri hakkında zengin bilgiler sunan premium tasarımlı bir web portalıdır.

Portala entegre edilmiş **RotaYapayZeka** asistanı, kullanıcının Bartın ve İzmir hakkında sorduğu soruları cevaplandırır. Arka planda Node.js/Express tabanlı sunucu, eğer `.env` dosyasında geçerli bir OpenAI API anahtarı varsa gerçek OpenAI API'si ile haberleşir. API anahtarı girilmemişse, **Yapay Zeka Simülatörü** devreye girerek kullanıcının sorduğu soruları zeki bir şekilde tahlil eder ve gerçekçi bir gecikmeyle (1.5 saniye düşünme süresi) harf harf ekrana yazarak (streaming) yanıt üretir.

## Özellikler

1. **Premium & Glassmorphic Tasarım**:
   - İzmir için **Ege Esintisi** teması (Mavi ve Gün Batımı Sarısı).
   - Bartın için **Karadeniz Ormanı** teması (Zümrüt Yeşili ve Bakır/Gümüş).
   - Şehir değiştirildiğinde arka plan renkleri, kart gölgeleri ve ikonlar yumuşak geçiş efektleriyle değişir.
2. **Yapay Zeka Sohbet Asistanı**:
   - Sabit ve yüzen butonlarla açılabilen modern sohbet arayüzü.
   - Hızlı soru sorma butonları ("Bartın'ın tarihi yerleri", "Amasra Salatası nedir?" vb.).
   - Harf harf akan (streaming) yazma efekti.
   - Gerçek OpenAI API veya yerel yapay zeka simülatörü arasında dinamik geçiş.
3. **Responsive Düzen**:
   - Masaüstü, tablet ve mobil cihazlar için optimize edilmiş tamamen duyarlı tasarım.
   - Mobil görünümde tek parmakla kontrol edilebilen tam ekran sohbet deneyimi.

## Gereksinimler

- Node.js (v16 veya üzeri tavsiye edilir)
- npm (Node Package Manager)

## Kurulum ve Çalıştırma

1. Proje dizininde terminali açın:
   ```bash
   cd C:\Users\Mesu\.gemini\antigravity-ide\scratch\izmir-bartin-rehberi
   ```

2. Bağımlılıkları yükleyin (Eğer henüz yüklenmediyse):
   ```bash
   npm install
   ```

3. (İsteğe bağlı) Gerçek OpenAI API'sini kullanmak için `.env` dosyasını düzenleyin:
   - `.env` dosyasını açıp `OPENAI_API_KEY=your_openai_api_key_here` kısmına kendi OpenAI API anahtarınızı (örneğin `sk-...`) yapıştırın.
   - API anahtarı girmemeniz halinde, uygulama otomatik olarak çok detaylı ve hazır yanıt kütüphanesine sahip yerel Yapay Zeka Simülatör modunda çalışacaktır.

4. Sunucuyu başlatın:
   ```bash
   npm run dev
   ```
   veya
   ```bash
   npm start
   ```

5. Tarayıcınızda şu adrese gidin:
   [http://localhost:3000](http://localhost:3000)

## Dosya Yapısı

- `server.js` - Express sunucusu, `/api/chat` (OpenAI & Simülasyon) ve `/api/status` endpoint'leri.
- `public/` - Web arayüzü dosyaları.
  - `index.html` - Semantik HTML yapısı, İzmir & Bartın bilgi kartları.
  - `style.css` - Göz alıcı animasyonlar, HSL renk paletleri ve modern cam efekti (glassmorphism) stilleri.
  - `app.js` - Sekme geçiş mantığı, sohbet işlemleri, yazma (streaming) animasyonu ve durum kontrolü.
- `.env` - Sunucu portu ve OpenAI API Key tanımları.
- `package.json` - Proje bağımlılıkları ve komutları.
