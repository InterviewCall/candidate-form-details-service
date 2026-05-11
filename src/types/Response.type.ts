export interface SuccessResponse<T> {
    success: boolean
    message: string
    data: T
    error: object
}

export type QualificationFormResponse = {
    formId: number
    slug: string
}

export type AddQuestionToFormResponse = {
    formId: number
    questionId: number
}