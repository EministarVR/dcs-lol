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
    
    // Stats
    statsTitle: 'dcs.lol in',
    statsSubtitle: 'Zahlen',
    statsDescription: 'Vertraue auf die Plattform, die bereits',
    statsHighlight: 'hunderte Communities',
    statsDescEnd: 'erfolgreich macht',
    linksCreated: 'Links verkürzt',
    activeUsers: 'Aktive Nutzer',
    clicksGenerated: 'Klicks generiert',
    countriesReached: 'Länder erreicht',
    uptimePercent: 'Uptime',
    rating: 'Bewertung',
    topShortener: '#1 Discord Shortener',
    topShortenerDesc: 'Meistgenutzte Plattform für Discord-Links',
    lightningFast: 'Blitzschnell',
    lightningFastDesc: 'Durchschnittlich 50ms Antwortzeit',
    globallyAvailable: 'Global verfügbar',
    globallyAvailableDesc: 'CDN in mehreren Ländern',
    
    // Analytics
    analyticsTitle: 'Leistungsstarke',
    analyticsSubtitle: 'Analytics',
    analyticsDescription: 'Erhalte detaillierte Einblicke in das Wachstum deines Discord-Servers mit umfassenden Analytics und Tracking.',
    realTimeTracking: 'Echtzeit-Tracking',
    realTimeTrackingDesc: 'Überwache Klicks, Referrer und Nutzerengagement in Echtzeit mit Live-Updates.',
    clickAnalytics: 'Klick-Analytics',
    clickAnalyticsDesc: 'Detaillierte Aufschlüsselung, wer deine Links geklickt hat und wann sie deinem Server beigetreten sind.',
    geographicData: 'Geografische Daten',
    geographicDataDesc: 'Sieh, woher deine Community-Mitglieder aus der ganzen Welt beitreten.',
    deviceAnalytics: 'Geräte-Analytics',
    deviceAnalyticsDesc: 'Verstehe, welche Geräte deine Community nutzt, um dein Server-Erlebnis zu optimieren.',
    dashboardPreview: 'Analytics Dashboard Vorschau',
    liveData: 'Live-Daten von deinen verkürzten Links',
    totalClicks: 'Gesamte Klicks',
    newMembers: 'Neue Mitglieder',
    conversionRate: 'Conversion-Rate',
    countries: 'Länder',
    
    // Testimonials
    testimonialsTitle: 'Was',
    testimonialsSubtitle: 'Communities',
    testimonialsEnd: 'sagen',
    testimonialsDescription: 'Über',
    testimonialsCount: '100+',
    testimonialsDescEnd: 'Discord-Server vertrauen bereits auf dcs.lol',
    starsRating: '4.9/5 Sterne',
    reviewsCount: 'Über 10+ Bewertungen',
    
    // FAQ
    faqTitle: 'Häufig gestellte',
    faqSubtitle: 'Fragen',
    faqDescription: 'Alles was du über dcs.lol wissen musst',
    stillQuestions: 'Noch Fragen?',
    supportTeam: 'Unser Support-Team hilft dir gerne weiter!',
    discordSupport: 'Discord Support',
    emailSupport: 'E-Mail Support',
    
    // CTA
    ctaReady: 'Bereit für den nächsten Level?',
    ctaStart: 'Starte jetzt',
    ctaFree: 'kostenlos!',
    ctaJoin: 'Schließe dich',
    ctaCommunities: 'Discord-Communities an, die bereits auf dcs.lol vertrauen',
    ctaShortenLink: 'Link verkürzen',
    ctaNoRegistration: '✨ Keine Registrierung',
    ctaInstantAvailable: '⚡ Sofort verfügbar',
    ctaFreeForever: '🎯 100% kostenlos',
    ctaFastTitle: 'Blitzschnell',
    ctaFastDesc: 'Links in Millisekunden erstellt und sofort einsatzbereit',
    ctaSimpleTitle: 'Einfach',
    ctaSimpleDesc: 'Keine Registrierung, keine Limits - einfach Link einfügen und fertig',
    ctaCommunityTitle: 'Community',
    ctaCommunityDesc: 'Speziell für Discord-Communities entwickelt und optimiert',
    ctaUptimeIndicator: '99.9% Uptime',
    ctaLinksIndicator: '50+ Links erstellt',
    ctaCommunitiesIndicator: '25+ Communities',
    
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
    lastUpdated: 'Letzte Aktualisierung: 10. Juni 2025',
    
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
    
    // Stats
    statsTitle: 'dcs.lol in',
    statsSubtitle: 'Numbers',
    statsDescription: 'Trust the platform that already makes',
    statsHighlight: 'hundreds of communities',
    statsDescEnd: 'successful',
    linksCreated: 'Links shortened',
    activeUsers: 'Active users',
    clicksGenerated: 'Clicks generated',
    countriesReached: 'Countries reached',
    uptimePercent: 'Uptime',
    rating: 'Rating',
    topShortener: '#1 Discord Shortener',
    topShortenerDesc: 'Most used platform for Discord links',
    lightningFast: 'Lightning Fast',
    lightningFastDesc: 'Average 50ms response time',
    globallyAvailable: 'Globally Available',
    globallyAvailableDesc: 'CDN in lots of countries',
    
    // Analytics
    analyticsTitle: 'Powerful',
    analyticsSubtitle: 'Analytics',
    analyticsDescription: 'Get detailed insights into your Discord server growth with comprehensive analytics and tracking.',
    realTimeTracking: 'Real-time Tracking',
    realTimeTrackingDesc: 'Monitor clicks, referrers, and user engagement in real-time with live updates.',
    clickAnalytics: 'Click Analytics',
    clickAnalyticsDesc: 'Detailed breakdown of who clicked your links and when they joined your server.',
    geographicData: 'Geographic Data',
    geographicDataDesc: 'See where your community members are joining from around the world.',
    deviceAnalytics: 'Device Analytics',
    deviceAnalyticsDesc: 'Understand what devices your community uses to optimize your server experience.',
    dashboardPreview: 'Analytics Dashboard Preview',
    liveData: 'Live data from your shortened links',
    totalClicks: 'Total Clicks',
    newMembers: 'New Members',
    conversionRate: 'Conversion Rate',
    countries: 'Countries',
    
    // Testimonials
    testimonialsTitle: 'What',
    testimonialsSubtitle: 'Communities',
    testimonialsEnd: 'Say',
    testimonialsDescription: 'Over',
    testimonialsCount: '100+',
    testimonialsDescEnd: 'Discord servers already trust dcs.lol',
    starsRating: '4.9/5 Stars',
    reviewsCount: 'Over 10+ Reviews',
    
    // FAQ
    faqTitle: 'Frequently Asked',
    faqSubtitle: 'Questions',
    faqDescription: 'Everything you need to know about dcs.lol',
    stillQuestions: 'Still have questions?',
    supportTeam: 'Our support team is happy to help!',
    discordSupport: 'Discord Support',
    emailSupport: 'Email Support',
    
    // CTA
    ctaReady: 'Ready for the next level?',
    ctaStart: 'Start now',
    ctaFree: 'for free!',
    ctaJoin: 'Join',
    ctaCommunities: 'Discord communities that already trust dcs.lol',
    ctaShortenLink: 'Shorten Link',
    ctaNoRegistration: '✨ No registration',
    ctaInstantAvailable: '⚡ Instantly available',
    ctaFreeForever: '🎯 100% free',
    ctaFastTitle: 'Lightning Fast',
    ctaFastDesc: 'Links created in milliseconds and instantly ready',
    ctaSimpleTitle: 'Simple',
    ctaSimpleDesc: 'No registration, no limits - just paste link and go',
    ctaCommunityTitle: 'Community',
    ctaCommunityDesc: 'Specially developed and optimized for Discord communities',
    ctaUptimeIndicator: '99.9% Uptime',
    ctaLinksIndicator: '50+ Links created',
    ctaCommunitiesIndicator: '25+ Communities',
    
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
    lastUpdated: 'Last updated: 10. June, 2025',
    
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