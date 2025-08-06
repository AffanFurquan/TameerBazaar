import { translations } from "./translations";

export type Language = "en" | "ru" | "de" | "ar" | "ur" | "hi";

export const supportedLanguages: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
];

export function getTranslation(language: Language, key: string, params?: Record<string, string>): string {
  let translation = translations[language]?.[key] || translations.en[key] || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), value);
    });
  }
  
  return translation;
}

export function getBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0] as Language;
  return supportedLanguages.find(lang => lang.code === browserLang)?.code || 'en';
}

export function formatCurrency(amount: number, currency: string = 'USD', language: Language = 'en'): string {
  try {
    const locale = getLocaleFromLanguage(language);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function formatDate(date: Date | string, language: Language = 'en'): string {
  try {
    const locale = getLocaleFromLanguage(language);
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  } catch {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }
}

export function formatNumber(number: number, language: Language = 'en'): string {
  try {
    const locale = getLocaleFromLanguage(language);
    return new Intl.NumberFormat(locale).format(number);
  } catch {
    return number.toString();
  }
}

function getLocaleFromLanguage(language: Language): string {
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    ru: 'ru-RU',
    de: 'de-DE',
    ar: 'ar-SA',
    ur: 'ur-PK',
    hi: 'hi-IN',
  };
  
  return localeMap[language] || 'en-US';
}

export function isRTL(language: Language): boolean {
  return ['ar', 'ur'].includes(language);
}

export function getLanguageDirection(language: Language): 'ltr' | 'rtl' {
  return isRTL(language) ? 'rtl' : 'ltr';
}
