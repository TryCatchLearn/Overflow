export type Question = {
    id: string
    title: string
    content: string
    askerId: string
    askerDisplayName: string
    createdAt: string
    updatedAt?: string
    viewCount: number
    tagSlugs: string[]
    hasAcceptedAnswer: boolean
    votes: number
    answerCount: number
    answers: Answer[]
}

export type Answer = {
    id: string
    content: string
    userId: string
    userDisplayName: string
    createdAt: string
    updatedAt?: string
    accepted: boolean
    questionId: string
}
