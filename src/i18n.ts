const translations: { [key: string]: any } = {};
let translationsLoaded = false;
let initializationPromise: Promise<boolean> | null = null;

async function loadTranslations() {
  try {
    const [enResponse, zhResponse] = await Promise.all([
      fetch('./src/locales/en.json'),
      fetch('./src/locales/zh.json')
    ]);
    if (!enResponse.ok || !zhResponse.ok) {
      throw new Error('Failed to fetch translation files');
    }
    translations.en = await enResponse.json();
    translations.zh = await zhResponse.json();
    translationsLoaded = true;
  } catch (error) {
    console.error("Failed to load i18n dictionaries:", error);
    translationsLoaded = false;
  }
}

let currentLanguage = localStorage.getItem('language') || 'zh';

export function setLanguage(lang: 'en' | 'zh') {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  if (translationsLoaded) {
    translateAll();
    const event = new CustomEvent('languageChanged', { detail: lang });
    window.dispatchEvent(event);
  }
}

export function getLanguage() {
  return currentLanguage;
}

export function t(key: string, options?: { [key:string]: string | number }): string {
  if (!translationsLoaded) return key;

  const keys = key.split('.');
  let result = translations[currentLanguage];
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) {
      let fallbackResult = translations['en'];
       for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if (fallbackResult === undefined) return key;
       }
       result = fallbackResult;
       break;
    }
  }

  if (typeof result === 'string' && options) {
    return Object.entries(options).reduce((acc, [k, v]) => {
      return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    }, result);
  }

  return result || key;
}

function translateAll() {
  if (!translationsLoaded) return;
  document.querySelectorAll('[data-i18n-key]').forEach(element => {
    const key = element.getAttribute('data-i18n-key');
    if (key) {
        const translation = t(key);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            (element as HTMLInputElement | HTMLTextAreaElement).placeholder = translation;
        } else if (element.tagName === 'META') {
            (element as HTMLMetaElement).content = translation;
        }
        else {
            element.innerHTML = translation;
        }
    }
  });

  const lang = getLanguage();
  document.documentElement.lang = lang;
  
  const currentLangElement = document.getElementById('current-lang');
  if (currentLangElement) {
      currentLangElement.textContent = lang === 'zh' ? '中文' : 'English';
  }
}

async function initialize() {
  await loadTranslations();
  translateAll();
  
  document.querySelectorAll('.lang-dropdown-content a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = link.getAttribute('data-lang');
        if (lang === 'en' || lang === 'zh') {
            setLanguage(lang);
        }
    });
  });

  const event = new CustomEvent('languageChanged', { detail: getLanguage() });
  window.dispatchEvent(event);
  return true;
}

export function initializeI18n() {
    if (!initializationPromise) {
        initializationPromise = initialize();
    }
    return initializationPromise;
}
