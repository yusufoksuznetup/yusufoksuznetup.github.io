# Net Up — Landing Page

Tek dosyalık (vanilla HTML + CSS + JS) statik landing page. GitHub Pages'e hazır.

> **⚠️ Önemli proje gerçeği:** iOS ve Android **aynı anda** yayınlanır. Site iOS'u "yakında" değil, "hazır" gösterir. Lansmandan önce her iki store URL'si gerçeğiyle değiştirilmeli.

## Klasör yapısı

```
5_Web_Sitesi/
├── index.html        ← bu dosya canlıya gider
├── README.md         ← bu dosya
└── assets/           ← görseller ve video buraya konacak
    ├── app-icon.png         (uygulama ikonu, 36x36 yeterli ama 192x192 önerilir — mevcut: 3_Neto_Karakter/soul_referanslari/14_app_icon.png)
    ├── neto-mascot.png      (hero'da telefonun yanından çıkan Neto figürü — opsiyonel, mevcut değilse otomatik gizlenir)
    ├── reels-v3.mp4         (showcase video — 2_Reels/NetUp_Reels_v3.mp4)
    ├── video-poster.png     (video oynatılmadan önce gösterilen kapak — opsiyonel)
    └── og-image.png         (sosyal medyada paylaşıldığında çıkan görsel — 1200x630 önerilir)
```

## Asset listesi (mevcut klasörden kopyalanacak)

| Hedef yol | Kaynak (NetUp Pazarlama içinden) | Notu |
|-----------|----------------------------------|------|
| `assets/app-icon.png` | `3_Neto_Karakter/soul_referanslari/14_app_icon.png` | App icon, mevcut |
| `assets/reels-v3.mp4` | `2_Reels/NetUp_Reels_v3.mp4` | Showcase video |
| `assets/neto-mascot.png` | (yeni üretilecek) Higgsfield Soul'dan thumbs-up Neto, transparent PNG | Opsiyonel — yoksa hero'da görünmez |
| `assets/video-poster.png` | (üretilecek) Reels v3 ilk kare ya da özel kapak | Opsiyonel — varsayılan video gri kapakla başlar |
| `assets/og-image.png` | (üretilecek) 1200x630 — Neto + slogan + Net Up logo | Opsiyonel ama Twitter/Facebook paylaşımları için önemli |

## Deploy adımları (GitHub Pages)

1. **Repo'yu klonla:**
   ```bash
   git clone https://github.com/yusufoksuznetup/yusufoksuznetup.github.io.git
   cd yusufoksuznetup.github.io
   ```

2. **Mevcut `index.html` varsa yedekle:**
   ```bash
   mv index.html index_old.html  # eski ana sayfa varsa sakla
   ```

3. **Yeni dosyayı kopyala:**
   ```bash
   cp /path/to/NetUp\ Pazarlama/5_Web_Sitesi/index.html .
   mkdir -p assets
   ```

4. **Asset'leri kopyala** (yukarıdaki tabloya göre — örneğin):
   ```bash
   BASE="/Users/juss/Documents/NetUp Pazarlama"
   cp "$BASE/3_Neto_Karakter/soul_referanslari/14_app_icon.png" assets/app-icon.png
   cp "$BASE/uygulama2.png"                                     assets/hero-mockup.png
   cp "$BASE/2_Reels/NetUp_Reels_v3.mp4"                        assets/reels-v3.mp4
   ```

5. **Lokal test:**
   ```bash
   python3 -m http.server 8000   # ya da `npx serve`
   # tarayıcıda http://localhost:8000
   ```

6. **Push:**
   ```bash
   git add .
   git commit -m "feat: launch NetUp landing page"
   git push origin main
   ```

7. **GitHub Pages aktivasyonu:** Repo → Settings → Pages → Source: `main` branch / `(root)`. Birkaç dakika içinde `https://yusufoksuznetup.github.io/` üzerinde canlı.

## Özelleştirme noktaları

### Store link'leri (lansmandan önce mutlaka güncelle)
`index.html` içinde iki adet placeholder URL var, ikisini de gerçeğiyle değiştir:

- **Google Play:** `play.google.com/store/apps/details?id=com.netup.app` aratıp **gerçek package adıyla** değiştir (2 yerde geçiyor — hero + final CTA)
- **App Store:** `apps.apple.com/tr/app/net-up/id000000000` aratıp **gerçek App Store URL'siyle** değiştir (2 yerde geçiyor — hero + final CTA). App Store ID lansmandan önce App Store Connect'ten alınır.

> Tüm Google Play / App Store URL'leri sayfada 2'şer kez geçer (hero CTA + final CTA bölümü). Find &amp; replace ile toplu değiştirilmesi en güvenli yol.

### SEO
- `<title>` ve meta description kontrol et
- Open Graph image (`assets/og-image.png`) yüklemeyi unutma — Twitter/Facebook paylaşımlarında bu görünür
- Google Search Console'a `https://yusufoksuznetup.github.io` ekle, sitemap submit et

### Analytics (önerilir)
Lansmandan önce `<head>` içine ekle (Google Analytics 4 örneği):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

### "İndir" butonu tıklamalarını ölç
Indir butonuna `onclick="gtag('event', 'click', {event_category: 'cta', event_label: 'google_play'});"` ekleyebilirsin (analytics ekledikten sonra).

## Notlar

- **Kullanıcı toplama yok:** Tasarım kararı olarak e-mail formu/waitlist konmadı. Tek hedef store yönlendirmesi (Play Store + App Store).
- **Çift platform lansmanı:** iOS ve Android aynı anda yayınlandığı için iki store badge'i hem hero'da hem final CTA'da yan yana ve eşit ağırlıkta sunuldu.
- **Mobil öncelikli:** İçerik en çok telefondan tıklanacağı için mobil layout titizlikle ayarlandı.
- **External dependency:** Sadece Google Fonts (Plus Jakarta Sans). Tamamen offline çalışmasını istersen `<link>` etiketini kaldır ve fontu local indir.
- **Hero telefon mockup'u:** Asset değil — HTML+CSS ile çizilmiş gerçek profil ekranı (status bar + üst mor header + 3 stat kartı + rozetler grid + Pro CTA + alt nav). Bu yüzden her resolution'da net, dosya kopyalamaya gerek yok. App tasarımı değişirse `<div class="phone-screen">` içeriğini güncellemek yeter.
- **Performans:** Inline CSS/JS — 2 HTTP request (HTML + font CSS). Asset'ler yüklendikten sonra ~250KB.
- **Tarayıcı desteği:** Modern tarayıcılar (Chrome/Safari/Firefox/Edge son 3 sürüm). IE desteklenmiyor.

## Sonraki iyileştirmeler

- [ ] Google Play package adı + App Store ID'yi gerçeğiyle değiştir (lansmandan önce şart)
- [ ] OG image üret (1200x630, Neto + slogan + Net Up logo)
- [ ] Video poster üret (Reels v3 ilk frame)
- [ ] Neto mascot transparent PNG üret (Higgsfield Soul, thumbs-up pozu)
- [ ] Google Analytics 4 entegre et
- [ ] Search Console'da doğrula, sitemap.xml ekle
- [ ] (opsiyonel) blog/içerik bölümü ekle — SEO için
