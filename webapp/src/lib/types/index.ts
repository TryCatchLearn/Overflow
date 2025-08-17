export type PaginatedResult<T> = {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export type QuestionParams = {
    tag?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
}

export type Question = {
    id: string
    title: string
    content: string
    askerId: string
    author?: Profile
    createdAt: string
    updatedAt?: string
    viewCount: number
    tagSlugs: string[]
    hasAcceptedAnswer: boolean
    votes: number
    answerCount: number
    answers: Answer[]
    userVoted: number
}

export type Answer = {
    id: string
    content: string
    userId: string
    author?: Profile
    createdAt: string
    updatedAt?: string
    accepted: boolean
    questionId: string
    votes: number
    userVoted: number
}

export type Tag = {
    id: string
    name: string
    slug: string
    description: string
    usageCount: number
}

export type TrendingTag = {
    tag: string
    count: number
}

export type Profile = {
    userId: string
    displayName: string
    description?: string
    reputation: number
}

export type FetchResponse<T> = {
    data: T | null
    error?: {message: string, status: number}
}

export type VoteRecord = {
    targetId: string
    targetType: 'Question' | 'Answer'
    voteValue: number
}

export type Vote = {
    targetId: string
    targetType: 'Question' | 'Answer'
    targetUserId: string
    questionId: string
    voteValue: 1 | -1
}

export type TopUser = {
    userId: string
    delta: number
}

export type TopUserWithProfile = TopUser & {profile: Profile}