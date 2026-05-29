import { useState } from 'react';
import { GlobalRankingTable } from '../components/rankings/GlobalRankingTable';
import { WeeklyRankingTable } from '../components/rankings/WeeklyRankingTable';
import { CountryRankingTable } from '../components/rankings/CountryRankingTable';
import { clsx } from 'clsx';
import { Globe, Calendar, Flag } from 'lucide-react';

const TABS = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'weekly', label: 'Semanal', icon: Calendar },
  { id: 'country', label: 'País', icon: Flag },
] as const;

type TabId = typeof TABS[number]['id'];

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('global');
  const [countryCode, setCountryCode] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Clasificaciones</h1>
        <p className="text-gray-400 mt-1">Mira cómo te comparas con la competencia.</p>
      </div>

      <div className="flex border-b border-f1-gray-light/20">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all',
                activeTab === tab.id
                  ? 'border-f1-red text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300',
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'global' && <GlobalRankingTable />}
        {activeTab === 'weekly' && <WeeklyRankingTable />}
        {activeTab === 'country' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="Introduce país o código..."
                className="flex-1 bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-f1-red transition-colors duration-200"
              />
            </div>
            {countryCode ? (
              <CountryRankingTable countryCode={countryCode} />
            ) : (
              <p className="text-center py-12 text-gray-400">Introduce un país para filtrar clasificaciones.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
