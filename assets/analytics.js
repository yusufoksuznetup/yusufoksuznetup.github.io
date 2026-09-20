/* =============================================================
   Net Up — paylaşımlı analitik + çerez onayı
   GA4 (G-XE7YQ3V03H) + Meta Pixel (1031762782588276)

   Ana sayfadaki (index.html) satır içi kurulumla AYNI davranışı taşır:
   aynı localStorage anahtarı ('netup_cookie_consent'), aynı metin, aynı akış.
   Etiketler YALNIZCA onay verildikten sonra yüklenir (KVKK/GDPR).

   Neden ayrı dosya: konu sayfalarında (8-sinif-*) onay banner'ının HTML'i
   ve stili yoktu; bu dosya ikisini de kendisi enjekte eder. Böylece doğrudan
   bir konu sayfasına düşen ziyaretçi (arama/AI motoru senaryosu) da onay
   sorusunu görür — onaysız ölçüm yapılmaz.

   Kullanım: <script defer src="/assets/analytics.js"></script>
   ============================================================= */
(function () {
  var CONSENT_KEY = 'netup_cookie_consent'; // 'granted' | 'denied'
  var GA_ID = 'G-XE7YQ3V03H';
  var FB_ID = '1031762782588276';
  var PRIVACY_URL = 'https://netup.website/netup-privacy';

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
  }

  // --- Onay ÖNCESİ güvenli gtag kılıfı ---
  // Sayfa içi olay çağrıları (ör. lgs_hesapla, store_click) onay verilmemişken
  // hata vermesin diye: etiket yüklenmediyse çağrı sessizce DÜŞÜRÜLÜR (ağa hiçbir
  // şey gitmez, dataLayer'a da yazılmaz -> onaysız veri toplanmaz).
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      if (window.netupAnalyticsLoaded) { window.dataLayer.push(arguments); }
    };
  }

  // --- Etiket yükleyici (index.html'deki netupLoadAnalytics ile aynı) ---
  window.netupLoadAnalytics = window.netupLoadAnalytics || function () {
    if (window.netupAnalyticsLoaded) return;
    window.netupAnalyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    // page_title verilmiyor: her sayfa kendi <title>'ını göndersin
    gtag('config', GA_ID, { send_page_view: true, anonymize_ip: true });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    !function (f, b, e, v, n, t, s2) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s2 = b.getElementsByTagName(e)[0]; s2.parentNode.insertBefore(t, s2);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', FB_ID);
    fbq('track', 'PageView');
  };

  // --- Banner (sayfada yoksa enjekte edilir) ---
  function ensureBanner() {
    var b = document.getElementById('cookieConsent');
    if (b) return b; // ana sayfada zaten var

    var css = document.createElement('style');
    css.textContent =
      '#cookieConsent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;' +
      'max-width:720px;margin:0 auto;background:#fff;color:#1a1a2e;border:1px solid #e2e2ee;' +
      'border-radius:14px;box-shadow:0 10px 32px rgba(0,0,0,.18);padding:16px 18px;' +
      'font:14px/1.5 "Plus Jakarta Sans",system-ui,sans-serif}' +
      '#cookieConsent[hidden]{display:none}' +
      '#cookieConsent p{margin:0 0 12px}' +
      '#cookieConsent a{color:#5B2ECC}' +
      '#cookieConsent .cc-actions{display:flex;gap:10px;flex-wrap:wrap}' +
      '#cookieConsent button{cursor:pointer;border-radius:10px;padding:9px 18px;' +
      'font:600 14px/1 "Plus Jakarta Sans",system-ui,sans-serif;border:1px solid #d5d5e4;' +
      'background:#f5f5fb;color:#1a1a2e}' +
      '#cookieConsent #cookieAccept{background:#5B2ECC;border-color:#5B2ECC;color:#fff}' +
      '@media(prefers-color-scheme:dark){#cookieConsent{background:#1A1438;color:#f2f2f7;' +
      'border-color:#2D2560}#cookieConsent button{background:#221B4A;color:#f2f2f7;border-color:#2D2560}' +
      '#cookieConsent a{color:#a78bfa}}';
    document.head.appendChild(css);

    b = document.createElement('div');
    b.id = 'cookieConsent';
    b.className = 'cookie-consent';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Çerez tercihleri');
    b.hidden = true;
    b.innerHTML =
      '<p>Bu site, ziyaretleri anlamak ve reklamlarımızın etkisini ölçmek için Google Analytics ' +
      've Meta (Facebook) piksel çerezlerini kullanır. Bu çerezlere yalnızca onay verirseniz izin ' +
      'veririz. Detaylar için <a href="' + PRIVACY_URL + '">Gizlilik Politikamıza</a> bakabilirsiniz.</p>' +
      '<div class="cc-actions">' +
      '<button type="button" id="cookieAccept">Kabul Et</button>' +
      '<button type="button" id="cookieReject">Reddet</button>' +
      '</div>';
    document.body.appendChild(b);
    return b;
  }

  function init() {
    var consent = getConsent();
    if (consent === 'granted') { window.netupLoadAnalytics(); return; }
    if (consent === 'denied') return;

    var banner = ensureBanner();
    banner.hidden = false;
    var ok = document.getElementById('cookieAccept');
    var no = document.getElementById('cookieReject');
    if (ok) ok.addEventListener('click', function () {
      setConsent('granted'); banner.hidden = true; window.netupLoadAnalytics();
    });
    if (no) no.addEventListener('click', function () {
      setConsent('denied'); banner.hidden = true;
    });
  }

  // --- MAGAZA TIKLAMASI OLCUMU -------------------------------------
  // 134 ders sayfasinda magaza rozetine basilip basilmadigi olculmuyordu;
  // "sayfa -> indirme" oranini bilmeden ucretli trafik almak anlamsiz.
  // Delegasyonla dinliyoruz: sayfalara satir ici kod eklemeye gerek yok.
  // Onay yoksa yukarudaki gtag kilifi cagriyi sessizce dusurur.
  function sayfaTipi(yol) {
    if (yol === '/' || yol === '/index.html') return 'anasayfa';
    if (yol.indexOf('/k/') === 0)             return 'kirtasiye_qr';
    if (/^\/[78]-sinif-[^\/]+\/?$/.test(yol)) return 'ders_pillar';
    if (/^\/[78]-sinif-[^\/]+\/.+/.test(yol)) return 'ders_konu';
    return 'diger';
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var magaza = href.indexOf('apps.apple.com') > -1 ? 'app_store'
               : href.indexOf('play.google.com') > -1 ? 'google_play' : null;
    if (!magaza) return;
    var yol = location.pathname;
    // Anasayfada ZATEN satir ici store_click var (index.html ~2111) -> cift
    // saymamak icin orayi atliyoruz; bu dinleyici eksik olan yerleri kapatiyor.
    if (sayfaTipi(yol) === 'anasayfa') return;
    gtag('event', 'store_click', {
      magaza:     magaza,
      sayfa_yolu: yol,
      sayfa_tipi: sayfaTipi(yol)
    });
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
