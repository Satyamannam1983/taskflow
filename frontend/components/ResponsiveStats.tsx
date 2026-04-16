'use client';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string;
}

export default function StatsCard({ title, value, subtitle, icon, color, gradient }: StatsCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:transform hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${gradient} rounded-full flex items-center justify-center shadow-lg`}>
          <span className="text-lg sm:text-xl">{icon}</span>
        </div>
      </div>
      <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${color} mb-2`}>{value}</div>
      <div className="text-xs sm:text-sm text-gray-400">{subtitle}</div>
    </div>
  );
}

interface ResponsiveStatsProps {
  totalBoards: number;
  totalCards: number;
  totalLists: number;
  avgCardsPerBoard: number;
  avgListsPerBoard: number;
}

export function ResponsiveStats({ 
  totalBoards, 
  totalCards, 
  totalLists, 
  avgCardsPerBoard, 
  avgListsPerBoard 
}: ResponsiveStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <StatsCard
        title="Active Boards"
        value={totalBoards}
        subtitle="Total boards"
        icon="📊"
        color="text-blue-400"
        gradient="bg-gradient-to-r from-blue-600 to-blue-700"
      />
      
      <StatsCard
        title="Total Cards"
        value={totalCards}
        subtitle="Across all boards"
        icon="🃏"
        color="text-green-400"
        gradient="bg-gradient-to-r from-green-600 to-green-700"
      />
      
      <StatsCard
        title="Total Lists"
        value={totalLists}
        subtitle="Across all boards"
        icon="📝"
        color="text-purple-400"
        gradient="bg-gradient-to-r from-purple-600 to-purple-700"
      />
      
      <StatsCard
        title="Avg Cards/Board"
        value={avgCardsPerBoard}
        subtitle="Average per board"
        icon="📈"
        color="text-orange-400"
        gradient="bg-gradient-to-r from-orange-600 to-orange-700"
      />
      
      <StatsCard
        title="Avg Lists/Board"
        value={avgListsPerBoard}
        subtitle="Average per board"
        icon="📊"
        color="text-pink-400"
        gradient="bg-gradient-to-r from-pink-600 to-pink-700"
      />
    </div>
  );
}
