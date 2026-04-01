export interface BlogPost {
    _id: string
    slug: string
    title: string
    description: string
    tags: string[]
    external?: string
    isStarred: boolean
    createdAt: string
}

export interface PaginationInfo {
    currentPage: number
    totalPages: number
    totalPosts: number
    postsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface BlogApiResponse {
    success: boolean
    posts: BlogPost[]
    curatedPosts: BlogPost[]
    pagination: PaginationInfo
    error?: string
}

// Advanced Search Types
export interface SearchResult {
    _id: string
    slug: string
    title: string
    description: string
    tags: string[]
    external?: string
    isStarred: boolean
    createdAt: string
    snippet: string
    score: number
}

export interface SearchResponse {
    success: boolean
    results: SearchResult[]
    total: number
    elapsed: number
    page: number
    totalPages: number
    error?: string
}

export interface SearchSuggestion {
    titles: { title: string; slug: string }[]
    tags: string[]
}

export type SearchSortBy = 'relevance' | 'newest' | 'oldest'
