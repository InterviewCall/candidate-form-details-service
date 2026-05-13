import FormQuestion from '../db/models/FormQuestion.model';
import FormQuestionOption from '../db/models/FormQuestionOption.model';
import FormStep from '../db/models/FormStep.model';
import QualificationForm from '../db/models/QualificationForm.model';
import BaseRepository from './Base.repository';

class QualificationFormRepository extends BaseRepository<QualificationForm> {
    constructor() {
        super(QualificationForm);
    }

    async findQualificationFormWithQuestionsAndOptions(slug: string): Promise<QualificationForm | null> {
        const form = await this.model.findOne({
            where: {
                slug,
                isActive: true,
            },
            attributes: ['id', 'name', 'slug', 'segmentKey', 'title', 'subTitle'],
            include: [
                {
                    model: FormStep,
                    as: 'steps',
                    where: {
                        isActive: true
                    },
                    attributes: ['id', 'stepNo', 'title', 'helperText'],
                    required: false,
                    include: [
                        {
                            model: FormQuestion,
                            as: 'questions',
                            where: {
                                isActive: true
                            },
                            attributes: ['id', 'questionKey', 'questionText', 'placeholder', 'questionType', 'isRequired', 'sortOrder', 'validationRules'],
                            required: false,
                            include: [
                                {
                                    model: FormQuestionOption,
                                    as: 'options',
                                    where: {
                                        isActive: true
                                    },
                                    required: false,
                                    attributes: ['id', 'optionLabel', 'optionValue', 'sortOrder']
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [
                [{ model: FormStep, as: 'steps' }, 'stepNo', 'ASC'],
                [
                    { model: FormStep, as: 'steps' },
                    { model: FormQuestion, as: 'questions' },
                    'sortOrder',
                    'ASC'
                ],
                [
                    { model: FormStep, as: 'steps' },
                    { model: FormQuestion, as: 'questions'},
                    { model: FormQuestionOption, as: 'options' },
                    'sortOrder',
                    'ASC'
                ]
            ]
        });

        return form;
    }
}

export default QualificationFormRepository;