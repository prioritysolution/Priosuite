import { TrendingUp } from "lucide-react";

const StatCard = ({ label, value, change, icon: Icon, iconBg, iconColor }) => {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        <p className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {value}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">+ {change}</span>
        </p>
      </div>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${iconBg}`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </span>
    </div>
  );
};

export default StatCard;
