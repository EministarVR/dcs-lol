import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  de: {
    // Header
    features: 'Features',
    about: 'Über uns',
    getStarted: 'Loslegen',
    
    // Hero
    heroTitle: 'Discord Links',
    heroSubtitle: 'verkürzen',
    heroDescription: 'Verwandle deine langen Discord Server Einladungen in kurze, elegante Links.',
    heroHighlight: 'Einfach. Schnell. Kostenlos.',
    fastFree: 'Blitzschnell & Kostenlos',
    discordPlaceholder: 'Discord Invite Link hier einfügen...',
    customPlaceholder: 'Wunsch-Link (z. B. meinserver)',
    shortenButton: 'Link verkürzen',
    creating: 'Link wird erstellt...',
    yourLink: 'Dein verkürzter Link:',
    linksShortened: 'Links verkürzt',
    uptime: 'Verfügbarkeit',
    free: 'Kostenlos',
    
    // Features
    whyTitle: 'Warum',
    whySubtitle: 'Der beste URL-Verkürzer für Discord Communities.',
    whyHighlight: 'Einfach, schnell und kostenlos.',
    fastTitle: 'Blitzschnell',
    fastDesc: 'Links werden in Millisekunden erstellt und weitergeleitet.',
    secureTitle: 'Sicher & Zuverlässig',
    secureDesc: 'Deine Links sind sicher und funktionieren immer zuverlässig.',
    easyTitle: 'Einfache Nutzung',
    easyDesc: 'Keine Registrierung nötig. Einfach Link einfügen und fertig.',
    mobileTitle: 'Mobile Optimiert',
    mobileDesc: 'Perfekte Darstellung auf allen Geräten und Bildschirmgrößen.',
    globalTitle: 'Global Verfügbar',
    globalDesc: 'Weltweite Verfügbarkeit mit schnellen Servern überall.',
    discordTitle: 'Discord Spezialist',
    discordDesc: 'Speziell für Discord Communities entwickelt und optimiert.',
    
    // Last URLs
    recentTitle: 'Zuletzt',
    recentSubtitle: 'erstellt',
    recentDescription: 'Sieh dir die neuesten verkürzten Discord Links an und lass dich inspirieren.',
    original: 'Original:',
    shortened: 'Verkürzt:',
    clicksToday: 'Klicks heute',
    showAll: 'Alle Links anzeigen',
    
    // Footer
    footerDescription: 'Der beste Discord URL-Verkürzer. Einfach, schnell und kostenlos für alle Communities.',
    links: 'Links',
    support: 'Support',
    help: 'Hilfe',
    contact: 'Kontakt',
    discord: 'Discord',
    feedback: 'Feedback',
    status: 'Status',
    donate: 'Spenden',
    privacy: 'Datenschutz',
    allRights: 'Alle Rechte vorbehalten.',
    madeWith: 'Gemacht mit',
    forCommunities: 'für Discord Communities',
    
    // Privacy
    privacyTitle: 'Datenschutzerklärung',
    privacyIntro: 'nehmen wir deinen Datenschutz ernst. Diese Erklärung zeigt, wie wir mit deinen Daten umgehen.',
    dataCollection: 'Welche Daten sammeln wir?',
    dataUsage: 'Wie verwenden wir deine Daten?',
    dataProtection: 'Wie schützen wir deine Daten?',
    dataSharing: 'Teilen wir deine Daten?',
    yourRights: 'Deine Rechte (DSGVO)',
    privacyContact: 'Fragen zum Datenschutz?',
    lastUpdated: 'Letzte Aktualisierung: 15. Januar 2024',
    
    // Errors
    enterUrl: 'Bitte gib eine Discord Invite URL ein',
    invalidUrl: 'Bitte gib eine gültige Discord Invite URL ein (discord.gg/... oder discord.com/invite/...)',
    enterCustom: 'Bitte gib einen Wunsch-Link ein',
  },
  en: {
    // Header
    features: 'Features',
    about: 'About',
    getStarted: 'Get Started',
    
    // Hero
    heroTitle: 'Shorten Discord',
    heroSubtitle: 'Links',
    heroDescription: 'Transform your long Discord server invitations into short, elegant links.',
    heroHighlight: 'Simple. Fast. Free.',
    fastFree: 'Lightning Fast & Free',
    discordPlaceholder: 'Paste Discord invite link here...',
    customPlaceholder: 'Custom link (e.g. myserver)',
    shortenButton: 'Shorten Link',
    creating: 'Creating link...',
    yourLink: 'Your shortened link:',
    linksShortened: 'Links shortened',
    uptime: 'Uptime',
    free: 'Free',
    
    // Features
    whyTitle: 'Why',
    whySubtitle: 'The best URL shortener for Discord communities.',
    whyHighlight: 'Simple, fast and free.',
    fastTitle: 'Lightning Fast',
    fastDesc: 'Links are created and redirected in milliseconds.',
    secureTitle: 'Secure & Reliable',
    secureDesc: 'Your links are safe and always work reliably.',
    easyTitle: 'Easy to Use',
    easyDesc: 'No registration required. Just paste link and go.',
    mobileTitle: 'Mobile Optimized',
    mobileDesc: 'Perfect display on all devices and screen sizes.',
    globalTitle: 'Globally Available',
    globalDesc: 'Worldwide availability with fast servers everywhere.',
    discordTitle: 'Discord Specialist',
    discordDesc: 'Specially developed and optimized for Discord communities.',
    
    // Last URLs
    recentTitle: 'Recently',
    recentSubtitle: 'created',
    recentDescription: 'Check out the latest shortened Discord links and get inspired.',
    original: 'Original:',
    shortened: 'Shortened:',
    clicksToday: 'Clicks today',
    showAll: 'Show all links',
    
    // Footer
    footerDescription: 'The best Discord URL shortener. Simple, fast and free for all communities.',
    links: 'Links',
    support: 'Support',
    help: 'Help',
    contact: 'Contact',
    discord: 'Discord',
    feedback: 'Feedback',
    status: 'Status',
    donate: 'Donate',
    privacy: 'Privacy',
    allRights: 'All rights reserved.',
    madeWith: 'Made with',
    forCommunities: 'for Discord communities',
    
    // Privacy
    privacyTitle: 'Privacy Policy',
    privacyIntro: 'we take your privacy seriously. This policy explains how we handle your data.',
    dataCollection: 'What data do we collect?',
    dataUsage: 'How do we use your data?',
    dataProtection: 'How do we protect your data?',
    dataSharing: 'Do we share your data?',
    yourRights: 'Your Rights (GDPR)',
    privacyContact: 'Privacy questions?',
    lastUpdated: 'Last updated: January 15, 2024',
    
    // Errors
    enterUrl: 'Please enter a Discord invite URL',
    invalidUrl: 'Please enter a valid Discord invite URL (discord.gg/... or discord.com/invite/...)',
    enterCustom: 'Please enter a custom link',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('de');

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};