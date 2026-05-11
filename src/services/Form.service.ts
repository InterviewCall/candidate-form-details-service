import { Transaction } from 'sequelize';

import logger from '../configs/logger.config';
import FormQuestion from '../db/models/FormQuestion.model';
import QualificationForm from '../db/models/QualificationForm.model';
import sequelize from '../db/models/sequelize';
import { AddQuestionToFormDto, CreateQualificationFormDto } from '../dtos/Form.dto';
import FormQuestionRepository from '../repositories/FormQuestion.repository';
import FormQuestionOptionRepository from '../repositories/FormQuestionOption.repository';
import QualificationFormRepository from '../repositories/QualificationForm.repository';
import { AddQuestionToFormResponse, QualificationFormResponse } from '../types/Response.type';
import { ConflictError, InternalServerError, NotFoundError } from '../utils/errors/app.error';

class FormService {
    private qualificationFormRepository: QualificationFormRepository;
    private formQuestionRepository: FormQuestionRepository;
    private formQuestionOptionRepository: FormQuestionOptionRepository;

    constructor(qualificationFormRepository: QualificationFormRepository, formQuestionRepository: FormQuestionRepository, formQuestionOptionRepository: FormQuestionOptionRepository) {
        this.qualificationFormRepository = qualificationFormRepository;
        this.formQuestionRepository = formQuestionRepository;
        this.formQuestionOptionRepository = formQuestionOptionRepository;
    }

    async createQualificationForm(payload: CreateQualificationFormDto): Promise<QualificationFormResponse> {
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

            const { options, ...questionPayload } = payload;

            const question: FormQuestion = await this.formQuestionRepository.create(
                {
                    formId,
                    stepNo: questionPayload.stepNo,
                    questionKey: questionPayload.questionKey,
                    questionText: questionPayload.questionText,
                    helperText: questionPayload.helperText ?? null,
                    questionType: questionPayload.questionType,
                    isRequired: questionPayload.isRequired ?? true,
                    sortOrder: questionPayload.sortOrder ?? 1,
                    validationRules: questionPayload.validationRules ?? null,
                    isActive: questionPayload.isActive ?? true,
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
}

export default FormService;