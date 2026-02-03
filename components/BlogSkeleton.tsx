export function BlogListSkeleton() {
    return (
        <div className="max-w-3xl mx-auto w-full">
            {/* Header Skeleton */}
            <header className="mb-8 md:mb-12">
                <div className="h-10 md:h-14 bg-gray-800/50 rounded-lg w-40 mb-4 animate-pulse" />
                <div className="h-4 bg-gray-800/30 rounded w-80 animate-pulse" />
            </header>

            {/* Search Bar Skeleton */}
            <div className="mb-6">
                <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse" />
            </div>

            {/* Posts Count Skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="h-4 bg-gray-800/30 rounded w-32 animate-pulse" />
            </div>

            {/* Posts List Skeleton */}
            <div className="space-y-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="py-4 md:py-5 px-4 md:px-5 border-b border-white/5">
                        <div className="flex items-start justify-between gap-3 md:gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="h-5 md:h-6 bg-gray-800/50 rounded w-3/4 mb-2 animate-pulse" />
                                <div className="h-4 bg-gray-800/30 rounded w-full mb-3 animate-pulse" />
                                <div className="flex items-center gap-2">
                                    <div className="h-3 bg-gray-800/30 rounded w-20 animate-pulse" />
                                    <div className="flex gap-1.5">
                                        <div className="h-5 bg-gray-800/40 rounded-full w-14 animate-pulse" />
                                        <div className="h-5 bg-gray-800/40 rounded-full w-12 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="h-5 w-5 bg-gray-800/30 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function CuratedSidebarSkeleton() {
    return (
        <aside className="lg:w-[320px] flex-shrink-0">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-800/30 rounded-lg animate-pulse">
                    <div className="w-[18px] h-[18px]" />
                </div>
                <div>
                    <div className="h-5 bg-gray-800/50 rounded w-28 mb-1 animate-pulse" />
                    <div className="h-3 bg-gray-800/30 rounded w-24 animate-pulse" />
                </div>
            </div>

            {/* Posts list Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-800/60 bg-gray-900/30">
                        <div className="flex gap-2 mb-2">
                            <div className="h-4 bg-gray-800/40 rounded w-12 animate-pulse" />
                            <div className="h-4 bg-gray-800/40 rounded w-10 animate-pulse" />
                        </div>
                        <div className="h-4 bg-gray-800/50 rounded w-full mb-2 animate-pulse" />
                        <div className="h-3 bg-gray-800/30 rounded w-3/4 mb-3 animate-pulse" />
                        <div className="flex items-center justify-between">
                            <div className="h-3 bg-gray-800/30 rounded w-16 animate-pulse" />
                            <div className="h-3 bg-gray-800/30 rounded w-12 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}
