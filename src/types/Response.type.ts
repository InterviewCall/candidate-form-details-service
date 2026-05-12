export interface SuccessResponse<T> {
    success: boolean
    message: string
    data: T
    error: object
}

export type CreateQualificationFormResponse = {
    formId: number
    slug: string
}

export type AddQuestionToFormResponse = {
    formId: number
    questionId: number
}

export type Option = {
    id: number;
    optionLabel: string;
    optionValue: string;
    sortOrder: number;
}

export type Question = {
    id: number;
    questionKey: string;
    questionText: string;
    placeholder: string | null;
    questionType: string;
    isRequired: boolean;
    sortOrder: number;
    validationRules: object | null;
    options: Option[]
}

export type Step = {
    id: number;
    stepNo: number;
    title: string;
    helperText: string;
    questions: Question[]
}

export type GetQualificationFormForCandidateResponse = {
    id: number;
    name: string;
    slug: string;
    segmentKey: string;
    steps: Step[]
};