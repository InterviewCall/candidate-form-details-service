import { QuestionType } from '../utils/enums/QuestionType';

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
    questionType: QuestionType;
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
    title: string;
    subTitle: string;
    steps: Step[]
};

export type CreateCandidateResponse = {
    candidateId: string,
    submissionId: string
}

export type CreateSubmissionResponse = {
    submissionId: string,
};

export type GetCandidateSubmissionAnswerResponse = {
    questionKey: string;
    questionText: string;
    answerText: string | null;
    optionScore: number | null;
}

export type GetCandidateSubmissionStepResponse = {
    stepNo: number;
    title: string;
    answers: GetCandidateSubmissionAnswerResponse[];
}

export type GetCandidateSubmissionResponse = {
    publicId: string;

    candidateId: number;
    candidatePublicId: string;

    candidate: {
        fullName: string;
        email: string;
        phone: string;
    };

    formSlug: string;
    formName: string;

    status: string;

    leadScore: number | null;
    leadTemperature: string | null;

    submittedAt: string | null;

    steps: GetCandidateSubmissionStepResponse[];
}

export type GetCandidateResponse = {
    id: number,
    fullName: string,
    email: string,
    phone: string
}