export default function AlertSkeleton() {
  return (
    <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-gray-200/50 backdrop-blur-md shadow-lg overflow-hidden">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Icon + Title skeleton */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl animate-skeleton shrink-0"></div>
          <div className="flex-1 h-6 bg-white/40 rounded animate-skeleton"></div>
        </div>
        
        {/* Badges skeleton */}
        <div className="flex gap-2 sm:gap-3">
          <div className="h-7 w-20 bg-white/30 rounded-full animate-skeleton"></div>
          <div className="h-7 w-24 bg-white/30 rounded-full animate-skeleton"></div>
        </div>
      </div>
    </div>
  );
}
