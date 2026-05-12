import Redis from 'ioredis';
import { Transaction } from 'sequelize';

import logger from '../configs/logger.config';
import { getRedisClient } from '../configs/redis.config';
import { QUALIFICATION_FORM_CACHE_TTL_IN_SECONDS } from '../constants/ttl';
import FormQuestion from '../db/models/FormQuestion.model';
import QualificationForm from '../db/models/QualificationForm.model';
import sequelize from '../db/models/sequelize';
import { AddQuestionToFormDto, CreateQualificationFormDto } from '../dtos/Form.dto';
import FormQuestionRepository from '../repositories/FormQuestion.repository';
import FormQuestionOptionRepository from '../repositories/FormQuestionOption.repository';
import FormStepRepository from '../repositories/FormStep.repository';
import QualificationFormRepository from '../repositories/QualificationForm.repository';
import { AddQuestionToFormResponse, CreateQualificationFormResponse, GetQualificationFormForCandidateResponse } from '../types/Response.type';
import { ConflictError, InternalServerError, NotFoundError } from '../utils/errors/app.error';

class FormService {
    private qualificationFormRepository: QualificationFormRepository;
    private formStepRepository: FormStepRepository;
    private formQuestionRepository: FormQuestionRepository;
    private formQuestionOptionRepository: FormQuestionOptionRepository;

    constructor(qualificationFormRepository: QualificationFormRepository, formQuestionRepository: FormQuestionRepository, formQuestionOptionRepository: FormQuestionOptionRepository, formStepRepository: FormStepRepository) {
        this.qualificationFormRepository = qualificationFormRepository;
        this.formQuestionRepository = formQuestionRepository;
        this.formQuestionOptionRepository = formQuestionOptionRepository;
        this.formStepRepository = formStepRepository;
    }

    async createQualificationForm(payload: CreateQualificationFormDto): Promise<CreateQualificationFormResponse> {
        try {
            const existingForm = await this.qualificationFormRepository.findOne({ slug: payload.slug });
            if(existingForm) {
                return {
                    formId: existingForm.id,
                    slug: existingForm.slug
                };
            }

            const form: QualificationForm = await this.qualificationFormRepository.create({
                name: payload.name,
                slug: payload.slug,
                segmentKey: payload.segmentKey,
                description: payload.description ?? null,
                version: payload.version ?? 1,
                isActive: payload.isActive ?? true
            });

            return {
                formId: form.id,
                slug: form.slug
            };
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Something went wrong, try again');
        }
    }

    async addQuestionOptionsToForm(formId: number, payload: AddQuestionToFormDto): Promise<AddQuestionToFormResponse> {
        const form: QualificationForm | null = await this.qualificationFormRepository.findById(formId);
        if(!form) {
            throw new NotFoundError(`Qualification form not found for the given form-id: ${formId}`);
        }

        const transaction: Transaction = await sequelize.transaction();
        try {
            const existingQuestion: FormQuestion | null = await this.formQuestionRepository.findOneQuestionByFormIdAndQuestionKey(formId, payload.questionKey, transaction);
            if(existingQuestion) {
                throw new ConflictError(`Question key ${payload.questionKey} is already associated with a question in the given form-id ${formId}`);
            }

            const { options, ...addQuestionToFormPayload } = payload;

            let formStep = await this.formStepRepository.findOne({
                formId,
                stepNo: addQuestionToFormPayload.stepNo
            });

            if(!formStep) {
                formStep = await this.formStepRepository.create({
                    formId,
                    stepNo: addQuestionToFormPayload.stepNo,
                    title: addQuestionToFormPayload.stepTitle,
                    helperText: addQuestionToFormPayload.stepHelperText,
                    isActive: addQuestionToFormPayload.stepIsActive ?? true
                }, transaction);
            }

            const question: FormQuestion = await this.formQuestionRepository.create(
                {
                    formId,
                    stepId: formStep.id,
                    questionKey: addQuestionToFormPayload.questionKey,
                    questionText: addQuestionToFormPayload.questionText,
                    placeholder: addQuestionToFormPayload.placeholder,
                    questionType: addQuestionToFormPayload.questionType,
                    isRequired: addQuestionToFormPayload.isRequired ?? true,
                    sortOrder: addQuestionToFormPayload.sortOrder ?? 1,
                    validationRules: addQuestionToFormPayload.validationRules ?? null,
                    isActive: addQuestionToFormPayload.questionIsActive ?? true
                },
                transaction
            );

            if(options.length > 0) {
                await this.formQuestionOptionRepository.createBulk(
                    options.map((option, index) => ({
                        questionId: question.id,
                        optionLabel: option.optionLabel,
                        optionValue: option.optionValue,
                        score: option.score ?? null,
                        sortOrder: option.sortOrder ?? index + 1,
                        isActive: option.isActive ?? true
                    })),
                    transaction
                );
            }

            await transaction.commit();

            return {
                formId: Number(formId),
                questionId: question.id
            };
        } catch (error) {
            await transaction.rollback();

            logger.error(error);

            if(error instanceof NotFoundError || error instanceof ConflictError) {
                throw error;
            }

            throw new InternalServerError('Something went wrong, try again');
        }
    }

    async getQualificationFormForCandidate(slug: string): Promise<GetQualificationFormForCandidateResponse> {
        const cacheKey = `qualification_form:slug:${slug}`;

        try {
            const redis: Redis = getRedisClient();

            const cachedForm: string | null = await redis.get(cacheKey);

            if(cachedForm) {
                logger.info('Qualification form served from Redis cache', {
                    slug,
                    cacheKey
                });

                return JSON.parse(cachedForm) as GetQualificationFormForCandidateResponse;
            }

            const form: QualificationForm | null = await this.qualificationFormRepository.findQualificationFormWithQuestionsAndOptions(slug);

            if(!form) {
                throw new NotFoundError(`Form is not found with the slug: ${slug}`);
            }

            if(!form.steps || form.steps.length == 0) {
                throw new ConflictError('Qualification form is not ready yet');
            }

            const qualificationForm: GetQualificationFormForCandidateResponse = this.mapQualificationFormForCandidate(form);

            await redis.set(
                cacheKey,
                JSON.stringify(qualificationForm),
                'EX',
                QUALIFICATION_FORM_CACHE_TTL_IN_SECONDS
            );

            logger.info('Qualification form stored in Redis cache', {
                slug,
                cacheKey,
                ttl: QUALIFICATION_FORM_CACHE_TTL_IN_SECONDS,
            });

            return qualificationForm;
        } catch (error) {
            logger.error(error);

            if(error instanceof NotFoundError || error instanceof ConflictError) {
                throw error;
            }

            throw new InternalServerError('Something went wrong');
        }
    }

    private mapQualificationFormForCandidate(form: QualificationForm): GetQualificationFormForCandidateResponse {
        return {
            id: form.id,
            name: form.name,
            slug: form.slug,
            segmentKey: form.segmentKey,
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
}

export default FormService;