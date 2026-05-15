import QualificationForm from '../../db/models/QualificationForm.model';
import { GetQualificationFormForCandidateResponse, SuccessResponse } from '../../types/Response.type';

export function buildSuccessResponse<T>(message: string, data: T): SuccessResponse<T> {
    return {
        success: true,
        message,
        data,
        error: {}
    };
}

export function mapQualificationFormForCandidate(form: QualificationForm): GetQualificationFormForCandidateResponse {
    return {
        id: form.id,
        name: form.name,
        slug: form.slug,
        segmentKey: form.segmentKey,
        title: form.title,
        subTitle: form.subTitle,
        steps: form.steps?.map((step) => ({
            id: step.id,
            stepNo: step.stepNo,
            title: step.title,
            helperText: step.helperText,
            questions: step.questions?.map((question) => ({
                id: question.id,
                questionKey: question.questionKey,
                questionText: question.questionText,
                placeholder: question.placeholder,
                questionType: question.questionType,
                isRequired: question.isRequired,
                sortOrder: question.sortOrder,
                validationRules: question.validationRules,
                options: question.options?.map((option) => ({
                    id: option.id,
                    optionLabel: option.optionLabel,
                    optionValue: option.optionValue,
                    sortOrder: option.sortOrder
                })) ?? []
            })) ?? []
        })) ?? []
    };
}