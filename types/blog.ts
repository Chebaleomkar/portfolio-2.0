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
