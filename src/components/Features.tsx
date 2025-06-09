import React from 'react';
import { Zap, Shield, Link2, Smartphone, Globe, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Blitzschnell',
    description: 'Links werden in Millisekunden erstellt und weitergeleitet.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Sicher & Zuverlässig',
    description: 'Deine Links sind sicher und funktionieren immer zuverlässig.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: Link2,
    title: 'Einfache Nutzung',
    description: 'Keine Registrierung nötig. Einfach Link einfügen und fertig.',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimiert',
    description: 'Perfekte Darstellung auf allen Geräten und Bildschirmgrößen.',
    color: 'from-purple-400 to-violet-500'
  },
  {
    icon: Globe,
    title: 'Global Verfügbar',
    description: 'Weltweite Verfügbarkeit mit schnellen Servern überall.',
    color: 'from-indigo-400 to-blue-500'
  },
  {
    icon: Users,
    title: 'Discord Spezialist',
    description: 'Speziell für Discord Communities entwickelt und optimiert.',
    color: 'from-pink-400 to-rose-500'
  }
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Warum <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">dcs.lol</span>?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Der beste URL-Verkürzer für Discord Communities. 
            <span className="text-purple-400"> Einfach, schnell und kostenlos.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};