const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Detailed knowledge base for Bartın & Amasra to generate high-fidelity simulated responses
const BARTIN_KNOWLEDGE = {
  history: `### 🏛️ Bartın ve Amasra'nın Tarihi Gelişimi

Bartın, antik çağlarda **Parthenios** (Sular Tanrısı veya Bakire Nehir anlamına gelir) olarak bilinen Bartın Irmağı'nın kenarında kurulmuştur. Tarihi M.Ö. 14. yüzyıla, Gasgaslar dönemine kadar uzanır. Daha sonra Hititler, Frigler, Lidyalılar, Persler, Makedonlar, Romalılar, Bizanslılar, Cenevizliler ve Osmanlılar bölgeye hakim olmuştur.

**Önemli Tarihi Duraklar:**
1. **Amasra Kalesi:** Bizans döneminde inşa edilmiş, Cenevizliler ve Osmanlılar tarafından aktif olarak kullanılmış görkemli bir kaledir. Zindan Kalesi ve Sormagir Kalesi olmak üzere iki ana bölümden oluşur.
2. **Kuşkayası Yol Anıtı:** Roma İmparatoru Tiberius Claudius Germanicus zamanında, eyalet valisi Aquila tarafından M.S. 41-54 yıllarında yaptırılmıştır. Kaya içine oyulmuş Roma kartalı heykeli ve bir askeri figür içerir. Dünyada eşi benzeri az bulunan bir yol anıtıdır.
3. **Kemere Köprüsü:** Amasra'da anakara ile Boztepe Adası'nı birbirine bağlayan, Bizans döneminden kalma tarihi tek kemerli köprüdür.
4. **Tarihi Bartın Evleri:** 18. ve 19. yüzyıl Osmanlı sivil mimarisini yansıtan ahşap, iki-üç katlı ve genellikle "yalı" olarak adlandırılan estetik yapılardır. Giyotin pencereleri ve özgün tavan süslemeleriyle ünlüdür.`,

  nature: `### 🌲 Bartın'ın Eşsiz Doğal Güzellikleri

Bartın, Karadeniz'in yeşili ile mavisinin en cömert birleştiği coğrafyalardan biridir. Batı Karadeniz'in büyüleyici doğasını barındırır.

**Görülmesi Gereken Doğal Alanlar:**
1. **Küre Dağları Milli Parkı:** Türkiye'nin ilk "Pan Parks" (Korunan Alanlar Ağı) üyesi olup, zengin yaban hayatı, derin kanyonları ve el değmemiş ormanları ile bir doğa harikasıdır.
2. **İnkumu Plajı:** Bartın kent merkezine 15 km uzaklıkta, yaklaşık 3 km uzunluğundaki incecik kumu ve çam ormanlarıyla çevrili sahiliyle Karadeniz'in en popüler plajlarındandır.
3. **Güzelcehisar Bazalt Sütunları:** Tam **80 milyon yıllık** olduğu tahmin edilen devasa volkanik sütunlardır. Dünyada sadece birkaç yerde bulunan bu doğa harikası, Güzelcehisar sahilinde göğe doğru yükselmektedir.
4. **Ulukaya Şelalesi ve Kanyonu:** Ulukaya köyünde yer alan şelale, yaklaşık 20 metre yükseklikten dökülür ve kanyon boyunca büyüleyici bir manzara sunar.
5. **Göldere Şelalesi:** Kurucaşile ilçesinde saklı bir cennettir. Doğa yürüyüşü ve fotoğrafçılık için harika bir rotadır.`,

  culture: `### 🧵 Bartın Kültürü, Sanatı ve Lezzetleri

Bartın, kendine has geleneksel el sanatları, denizci kültürü ve eşsiz mutfağıyla zengin bir kültürel mirasa sahiptir.

**Kültürel Değerler ve El Sanatları:**
1. **Tel Kırma Sanatı:** Bartın'a özgü, gümüş veya altın tellerin özel bir iğne yardımıyla tül üzerine kırılıp işlenmesiyle yapılan, dünya çapında tescilli bir el sanatıdır. Genellikle yazma, şal ve çeyiz ürünlerinde kullanılır.
2. **Ahşap Tekne (Ahşap Yat) Yapımı:** Kurucaşile ilçesi, Osmanlı döneminden bu yana babadan oğula geçen yöntemlerle ahşap tekne ve yat yapımının merkezidir. Tekne yapım ustalarıyla ünlüdür.

**Meşhur Bartın Lezzetleri:**
1. **Amasra Salatası:** En az 25-30 çeşit mevsim yeşilliği ve sebzenin (roka, tere, marul, turp, havuç, pancar vb.) üst üste özenle dizilmesi, üzerine zeytinyağı, limon ve sirkeden oluşan sosun dökülmesi ve turşu süslemeleriyle adeta bir sanat eseri gibi sunulan ünlü salatadır.
2. **Taze Karadeniz Balıkları:** Mevsimine göre kalkan, istavrit, hamsi, lüfer ve mezgit Amasra'daki tarihi balıkçılarda enfes bir şekilde servis edilir.
3. **Bartın Gerdan Tatlısı:** Özellikle bayramlarda yapılan, hamur, ceviz ve şerbetin uyumuyla hazırlanan geleneksel bir tatlıdır.
4. **Pum Pum Çorbası:** Mısır unu, süt ve tereyağı ile yapılan, içine pastırma veya sucuk eklenen oldukça lezzetli yöresel bir çorbadır.`
};

// Search database function for simple queries
function getSimulatedResponse(userMessage) {
  const query = userMessage.toLowerCase();

  // Keyword check
  if (query.includes('tarih') || query.includes('müze') || query.includes('kale') || query.includes('antik') || query.includes('kuşkayası') || query.includes('kemere')) {
    return BARTIN_KNOWLEDGE.history;
  }
  if (query.includes('doğa') || query.includes('plaj') || query.includes('deniz') || query.includes('inkumu') || query.includes('sütun') || query.includes('bazalt') || query.includes('şelale') || query.includes('kanyon') || query.includes('küre dağ')) {
    return BARTIN_KNOWLEDGE.nature;
  }
  if (query.includes('kültür') || query.includes('yemek') || query.includes('ne yenir') || query.includes('salata') || query.includes('tel kırma') || query.includes('tekne') || query.includes('balık') || query.includes('lezzet')) {
    return BARTIN_KNOWLEDGE.culture;
  }
  if (query.includes('merhaba') || query.includes('selam') || query.includes('kimsin') || query.includes('yardım')) {
    return `### 👋 Merhaba! Ben Bartın & İzmir Turizm Rehberi Yapay Zeka Asistanıyım.

Size Bartın ve Amasra'nın büyüleyici tarihi, eşsiz doğal güzellikleri (İnkumu, Bazalt Sütunları), zengin mutfak kültürü (Amasra Salatası) ve el sanatları (Tel Kırma) hakkında bilgi verebilirim.

Ayrıca İzmir'in tarihi ve turistik yerleri hakkında da sorularınızı yanıtlayabilirim!

**Bana şu soruları sorabilirsiniz:**
- *Bartın'ın tarihi yerleri nelerdir?*
- *Amasra Salatası'nda ne bulunur ve nerede yenir?*
- *Güzelcehisar Bazalt Sütunları kaç yıllık?*
- *İnkumu plajı hakkında bilgi verir misin?*
- *Bartın'ın meşhur el sanatı nedir?*

Hangi konuyu keşfetmek istersiniz?`;
  }

  if (query.includes('izmir') || query.includes('efes') || query.includes('boyoz') || query.includes('kordon') || query.includes('çeşme')) {
    return `### 🌊 Ege'nin İncisi: İzmir Hakkında Bilgiler

İzmir, Türkiye'nin batısında, Ege Denizi kıyısında yer alan tarihi 8500 yıl öncesine dayanan görkemli bir şehirdir.

**İzmir Hakkında Sıkça Sorulan Konular:**
- **Tarih:** Antik Smyrna kenti kalıntıları, UNESCO Dünya Mirası listesindeki **Efes Antik Kenti** ve **Bergama (Pergamon)**, tarihi **İzmir Saat Kulesi** ve **Kemeraltı Çarşısı**.
- **Doğal Güzellikler:** **Kordon Boyu** gün batımı, **Çeşme & Alaçatı** plajları, sakin şehir **Seferihisar** ve tarihi **Şirince Köyü**.
- **Kültür ve Lezzet:** Kahvaltıların vazgeçilmezi çıtır **Boyoz**, tatlı **Bomba**, **Gevrek**, zeytinyağlı Ege yemekleri ve geleneksel **Zeybek** halk oyunu.

İzmir hakkında sormak istediğiniz daha detaylı bir soru var mı?`;
  }

  // General fallback
  return `### 🗺️ Bartın & Amasra Rehberi Asistanı

Sorduğunuz soruya en yakın bilgileri derledim. **Bartın ve Amasra**, Batı Karadeniz'in en kıymetli turizm merkezlerindendir. Küre Dağları Milli Parkı'nın yemyeşil ormanları, Güzelcehisar'ın 80 milyon yıllık bazalt sütunları ve Amasra Kalesi'nin köklü tarihi ile her yıl binlerce turisti ağırlar.

Sorunuza tam cevap verebilmem için lütfen şunlardan biriyle ilgili detay belirtin:
1. **Tarih ve Mimari** (Amasra Kalesi, Tarihi Evler, Yol Anıtı vb.)
2. **Doğal Güzellikler ve Plajlar** (İnkumu plajı, Güzelcehisar Sütunları, Şelaleler vb.)
3. **Yöresel Lezzetler ve Kültür** (Amasra Salatası, Tel Kırma, Ahşap Teknecilik vb.)`;
}

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mesaj içeriği boş olamaz.' });
  }

  // Check if OPENAI_API_KEY env variable is present and is NOT the placeholder
  const apiKey = process.env.OPENAI_API_KEY;
  const isRealApiKeyPresent = apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-');

  console.log(`[Chat API] Yeni soru alındı: "${message}"`);

  if (isRealApiKeyPresent) {
    try {
      console.log('[Chat API] Gerçek OpenAI API anahtarı algılandı. İstek gönderiliyor...');
      const openai = new OpenAI({ apiKey: apiKey });
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Sen Bartın ve İzmir şehirlerini tanıtan profesyonel bir turizm rehberi ve yapay zeka asistanısın. Bartın hakkında sorulan sorulara son derece detaylı, tarih, doğa, kültür ve lezzetleri içeren, Türkçe dilinde, şık ve samimi bir üslupla markdown formatında cevap ver. İzmir ile ilgili sorular gelirse onu da Ege esintisiyle anlat. Cevaplarında başlıklar (###), kalın yazılar (**), ve liste işaretleri kullanarak okunabilirliği artır.'
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const responseText = completion.choices[0].message.content;
      console.log('[Chat API] OpenAI API yanıtı başarıyla alındı.');
      return res.json({ response: responseText, source: 'OpenAI API' });

    } catch (error) {
      console.error('[Chat API] OpenAI API çağrısı sırasında bir hata oluştu:', error.message);
      console.log('[Chat API] Simülasyon moduna geri dönülüyor...');
      
      // Fallback with small delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      const simulatedText = getSimulatedResponse(message);
      return res.json({ 
        response: simulatedText, 
        source: 'Simulated API (OpenAI Error Fallback)',
        error: error.message 
      });
    }
  } else {
    // Simulated path
    console.log('[Chat API] OpenAI API anahtarı bulunamadı veya varsayılan değerde. Simüle edilmiş OpenAI yanıtı hazırlanıyor...');
    
    // Simulate network delay of 1.5 seconds for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const simulatedText = getSimulatedResponse(message);
    return res.json({ 
      response: simulatedText, 
      source: 'Simulated OpenAI API (Offline Mode)' 
    });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const isRealApiKeyPresent = apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-');
  res.json({
    mode: isRealApiKeyPresent ? 'Gerçek OpenAI API' : 'Simulated OpenAI API (Offline Mode)'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Sunucu http://localhost:${PORT} portunda başarıyla başlatıldı!`);
  console.log(`📂 Statik dosyalar public/ dizininden sunuluyor.`);
  console.log(`🤖 OpenAI API Durumu: ${process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' ? 'Aktif (Gerçek API)' : 'Pasif (Simülatör Aktif)'}`);
  console.log(`================================================================`);
});
