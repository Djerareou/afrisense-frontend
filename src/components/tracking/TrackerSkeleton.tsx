export default function TrackerSkeleton() {
  return (
    <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon skeleton */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl animate-skeleton shrink-0"></div>
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded animate-skeleton w-3/4"></div>
          
          {/* Badge */}
          <div className="h-6 bg-gray-200 rounded-full animate-skeleton w-24"></div>
          
          {/* Info cards */}
          <div className="space-y-2">
            <div className="h-12 bg-gray-100 rounded-lg animate-skeleton"></div>
            <div className="h-12 bg-gray-100 rounded-lg animate-skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
