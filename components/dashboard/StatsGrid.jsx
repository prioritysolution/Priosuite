import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "./StatCard";
import { getStatCards } from "./dashboardData";

const StatsGrid = ({ dashboardItemData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[108px] rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = getStatCards(dashboardItemData);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {cards.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
