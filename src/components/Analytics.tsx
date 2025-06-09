import React from 'react';
import { TrendingUp, Eye, MapPin, Smartphone } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Analytics</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get detailed insights into your Discord server growth with comprehensive analytics and tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">Monitor clicks, referrers, and user engagement in real-time with live updates.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Click Analytics</h3>
                <p className="text-gray-600">Detailed breakdown of who clicked your links and when they joined your server.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Geographic Data</h3>
                <p className="text-gray-600">See where your community members are joining from around the world.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Device Analytics</h3>
                <p className="text-gray-600">Understand what devices your community uses to optimize your server experience.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard Preview</h4>
              <p className="text-gray-600">Live data from your shortened links</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <span className="text-gray-700">Total Clicks</span>
                <span className="text-2xl font-bold text-blue-600">2,547</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <span className="text-gray-700">New Members</span>
                <span className="text-2xl font-bold text-green-600">1,823</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                <span className="text-gray-700">Conversion Rate</span>
                <span className="text-2xl font-bold text-purple-600">71.6%</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <span className="text-gray-700">Countries</span>
                <span className="text-2xl font-bold text-orange-600">47</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};