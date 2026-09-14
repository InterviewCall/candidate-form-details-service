import { Transaction } from 'sequelize';

import FormQuestion from '../models/FormQuestion.model';
import FormQuestionOption from '../models/FormQuestionOption.model';
import FormStep from '../models/FormStep.model';
import QualificationForm from '../models/QualificationForm.model';
import sequelize from '../models/sequelize';
import { QuestionType } from '../../utils/enums/QuestionType';

const FORM_SLUG = 'ai-era-engineering-value-check';

const formData = {
    name: 'AI-Era Engineering Value Check',
    slug: FORM_SLUG,
    segmentKey: 'salary_stagnation',
    title:
        'Let’s check what may be limiting your salary, role growth, or market value.',
    subTitle:
        'Answer a few questions so our team can understand your current growth stage, engineering value gaps, and whether the AI-Proof Engineer Program is the right fit for you.',
    description: null,
    version: 1,
    isActive: true,
};

type SeedQuestion = {
    questionKey: string;
    questionText: string;
    placeholder?: string | null;
    questionType: QuestionType;
    isRequired?: boolean;
    sortOrder: number;
    validationRules?: Record<string, unknown> | null;
    options?: Array<{
        optionLabel: string;
        optionValue: string;
        score?: number | null;
        sortOrder: number;
    }>;
};

type SeedStep = {
    stepNo: number;
    title: string;
    helperText: string;
    questions: SeedQuestion[];
};

const steps: SeedStep[] = [
    {
        stepNo: 1,
        title: 'First, tell us your basic details.',
        helperText:
            'Our team will use this to contact you for your market value strategy call.',
        questions: [
            {
                questionKey: 'fullName',
                questionText: 'Full Name *',
                placeholder: 'Enter your full name',
                questionType: QuestionType.TEXT,
                isRequired: true,
                sortOrder: 1,
            },
            {
                questionKey: 'phone',
                questionText: 'WhatsApp Number *',
                placeholder: 'Enter your WhatsApp number',
                questionType: QuestionType.PHONE,
                isRequired: true,
                sortOrder: 2,
            },
            {
                questionKey: 'email',
                questionText: 'Email Address *',
                placeholder: 'Enter your email address',
                questionType: QuestionType.EMAIL,
                isRequired: true,
                sortOrder: 3,
            },
        ],
    },
    {
        stepNo: 2,
        title: 'Where are you currently in your engineering career?',
        helperText:
            'This helps us understand your current role and experience level.',
        questions: [
            {
                questionKey: 'company',
                questionText: 'Current Company *',
                placeholder: 'Example: TCS, Accenture, Wipro, Startup',
                questionType: QuestionType.TEXT,
                isRequired: true,
                sortOrder: 1,
            },
            {
                questionKey: 'role',
                questionText: 'Current Role *',
                placeholder: 'Example: Software Engineer, Backend Developer',
                questionType: QuestionType.TEXT,
                isRequired: true,
                sortOrder: 2,
            },
            {
                questionKey: 'yoe',
                questionText: 'Years of Experience *',
                placeholder: 'Select your experience',
                questionType: QuestionType.SELECT,
                isRequired: true,
                sortOrder: 3,
                options: [
                    { optionLabel: '0–1 years', optionValue: '0-1', score: 5, sortOrder: 1 },
                    { optionLabel: '1–2 years', optionValue: '1-2', score: 8, sortOrder: 2 },
                    { optionLabel: '2–4 years', optionValue: '2-4', score: 18, sortOrder: 3 },
                    { optionLabel: '4–7 years', optionValue: '4-7', score: 22, sortOrder: 4 },
                    { optionLabel: '7+ years', optionValue: '7-plus', score: 18, sortOrder: 5 },
                ],
            },
        ],
    },
    {
        stepNo: 3,
        title: 'What best describes your current growth situation?',
        helperText:
            'Choose the option closest to your current career stage.',
        questions: [
            {
                questionKey: 'growthSituation',
                questionText:
                    'What best describes your current growth situation?',
                questionType: QuestionType.RADIO,
                isRequired: true,
                sortOrder: 1,
                options: [
                    {
                        optionLabel: 'My salary has not grown meaningfully',
                        optionValue: 'my-salary-has-not-grown-meaningfully',
                        score: 20,
                        sortOrder: 1,
                    },
                    {
                        optionLabel: 'My role has not changed much',
                        optionValue: 'my-role-has-not-changed-much',
                        score: 16,
                        sortOrder: 2,
                    },
                    {
                        optionLabel: 'I feel behind compared to my peers',
                        optionValue: 'i-feel-behind-compared-to-my-peers',
                        score: 18,
                        sortOrder: 3,
                    },
                    {
                        optionLabel:
                            'I want to move to a higher-paying product role',
                        optionValue:
                            'i-want-to-move-to-a-higher-paying-product-role',
                        score: 20,
                        sortOrder: 4,
                    },
                    {
                        optionLabel:
                            'I want to increase my value before switching',
                        optionValue:
                            'i-want-to-increase-my-value-before-switching',
                        score: 16,
                        sortOrder: 5,
                    },
                ],
            },
        ],
    },
    {
        stepNo: 4,
        title: 'What is your current and target CTC?',
        helperText:
            'This helps us understand your current value band and growth target.',
        questions: [
            {
                questionKey: 'currentCtc',
                questionText: 'Current CTC *',
                placeholder: 'Select current CTC',
                questionType: QuestionType.SELECT,
                isRequired: true,
                sortOrder: 1,
                options: [
                    {
                        optionLabel: 'Less than ₹5 LPA',
                        optionValue: 'less-than-5-lpa',
                        score: 5,
                        sortOrder: 1,
                    },
                    {
                        optionLabel: '₹5–10 LPA',
                        optionValue: '5-10-lpa',
                        score: 15,
                        sortOrder: 2,
                    },
                    {
                        optionLabel: '₹10–20 LPA',
                        optionValue: '10-20-lpa',
                        score: 20,
                        sortOrder: 3,
                    },
                    {
                        optionLabel: '₹20 LPA+',
                        optionValue: '20-plus-lpa',
                        score: 20,
                        sortOrder: 4,
                    },
                ],
            },
            {
                questionKey: 'targetCtc',
                questionText: 'Target CTC *',
                placeholder: 'Select target CTC',
                questionType: QuestionType.SELECT,
                isRequired: true,
                sortOrder: 2,
                options: [
                    {
                        optionLabel: '₹10–20 LPA',
                        optionValue: '10-20-lpa',
                        score: 5,
                        sortOrder: 1,
                    },
                    {
                        optionLabel: '₹20–30 LPA',
                        optionValue: '20-30-lpa',
                        score: 10,
                        sortOrder: 2,
                    },
                    {
                        optionLabel: '₹30–50 LPA',
                        optionValue: '30-50-lpa',
                        score: 15,
                        sortOrder: 3,
                    },
                    {
                        optionLabel: '₹50 LPA+',
                        optionValue: '50-plus-lpa',
                        score: 20,
                        sortOrder: 4,
                    },
                ],
            },
        ],
    },
    {
        stepNo: 5,
        title: 'What do you feel is limiting your market value the most?',
        helperText:
            'This helps us identify which capability gap may be holding back your growth.',
        questions: [
            {
                questionKey: 'mainGap',
                questionText:
                    'What do you feel is limiting your market value the most?',
                questionType: QuestionType.RADIO,
                isRequired: true,
                sortOrder: 1,
                options: [
                    {
                        optionLabel: 'System design and architecture',
                        optionValue: 'system-design-and-architecture',
                        score: 18,
                        sortOrder: 1,
                    },
                    {
                        optionLabel: 'Product thinking and ownership',
                        optionValue: 'product-thinking-and-ownership',
                        score: 16,
                        sortOrder: 2,
                    },
                    {
                        optionLabel: 'DSA and problem solving',
                        optionValue: 'dsa-and-problem-solving',
                        score: 15,
                        sortOrder: 3,
                    },
                    {
                        optionLabel: 'AI-assisted engineering skills',
                        optionValue: 'ai-assisted-engineering-skills',
                        score: 14,
                        sortOrder: 4,
                    },
                    {
                        optionLabel:
                            'Interview positioning and communication',
                        optionValue:
                            'interview-positioning-and-communication',
                        score: 14,
                        sortOrder: 5,
                    },
                    {
                        optionLabel: 'Project depth and proof of skill',
                        optionValue: 'project-depth-and-proof-of-skill',
                        score: 14,
                        sortOrder: 6,
                    },
                ],
            },
        ],
    },
    {
        stepNo: 6,
        title: 'What kind of growth are you targeting next?',
        helperText:
            'This helps us understand the direction you want to move toward.',
        questions: [
            {
                questionKey: 'growthTarget',
                questionText: 'What kind of growth are you targeting next?',
                questionType: QuestionType.RADIO,
                isRequired: true,
                sortOrder: 1,
                options: [
                    {
                        optionLabel:
                            'Higher salary in a better software engineering role',
                        optionValue:
                            'higher-salary-in-a-better-software-engineering-role',
                        score: 16,
                        sortOrder: 1,
                    },
                    {
                        optionLabel:
                            'Move from service company to product company',
                        optionValue:
                            'move-from-service-company-to-product-company',
                        score: 18,
                        sortOrder: 2,
                    },
                    {
                        optionLabel:
                            'Become stronger in system design and senior-level skills',
                        optionValue:
                            'become-stronger-in-system-design-and-senior-level-skills',
                        score: 16,
                        sortOrder: 3,
                    },
                    {
                        optionLabel:
                            'Become more AI-ready and future-proof',
                        optionValue:
                            'become-more-ai-ready-and-future-proof',
                        score: 14,
                        sortOrder: 4,
                    },
                    {
                        optionLabel: 'I am not sure yet',
                        optionValue: 'not-sure-yet',
                        score: 4,
                        sortOrder: 5,
                    },
                ],
            },
        ],
    },
    {
        stepNo: 7,
        title: 'How soon do you want to seriously work on your growth?',
        helperText:
            'This helps us prioritize serious candidates for strategy calls.',
        questions: [
            {
                questionKey: 'urgency',
                questionText:
                    'How soon do you want to seriously work on your growth?',
                questionType: QuestionType.RADIO,
                isRequired: true,
                sortOrder: 1,
                options: [
                    {
                        optionLabel: 'Immediately, within 1–2 months',
                        optionValue: 'immediately-within-1-2-months',
                        score: 20,
                        sortOrder: 1,
                    },
                    {
                        optionLabel: 'Within 3–6 months',
                        optionValue: 'within-3-6-months',
                        score: 15,
                        sortOrder: 2,
                    },
                    {
                        optionLabel: 'Within 6–12 months',
                        optionValue: 'within-6-12-months',
                        score: 8,
                        sortOrder: 3,
                    },
                    {
                        optionLabel: 'Just exploring right now',
                        optionValue: 'just-exploring',
                        score: 0,
                        sortOrder: 4,
                    },
                ],
            },
        ],
    },
    {
        stepNo: 8,
        title:
            'Can you invest in a structured career program if it is the right fit?',
        helperText:
            'The program requires time, effort, and financial commitment.',
        questions: [
            {
                questionKey: 'investmentReadiness',
                questionText:
                    'Can you invest in a structured career program if it is the right fit?',
                questionType: QuestionType.RADIO,
                isRequired: true,
                sortOrder: 1,
                options: [
                    {
                        optionLabel:
                            'Yes, I can invest if the program is right for me',
                        optionValue: 'yes-can-invest-if-right-fit',
                        score: 20,
                        sortOrder: 1,
                    },
                    {
                        optionLabel: 'I would need EMI options',
                        optionValue: 'would-need-emi-options',
                        score: 15,
                        sortOrder: 2,
                    },
                    {
                        optionLabel: 'Not sure yet',
                        optionValue: 'not-sure-yet',
                        score: 5,
                        sortOrder: 3,
                    },
                    {
                        optionLabel: 'No, I cannot invest right now',
                        optionValue: 'cannot-invest-right-now',
                        score: 0,
                        sortOrder: 4,
                    },
                ],
            },
            {
                questionKey: 'notes',
                questionText: 'Anything else we should know?',
                placeholder:
                    'Example: I have 5 years of experience but my salary has not grown much. I feel stuck and want to move to a better product role...',
                questionType: QuestionType.TEXTAREA,
                isRequired: false,
                sortOrder: 2,
            },
        ],
    },
];

const now = new Date();

export default {
    async up(): Promise<void> {
        const transaction: Transaction = await sequelize.transaction();

        try {
            const [form] = await QualificationForm.findOrCreate({
                where: { slug: FORM_SLUG },
                defaults: {
                    ...formData,
                    createdAt: now,
                    updatedAt: now,
                },
                transaction,
            });

            for (const stepData of steps) {
                const [step] = await FormStep.findOrCreate({
                    where: {
                        formId: form.id,
                        stepNo: stepData.stepNo,
                    },
                    defaults: {
                        formId: form.id,
                        stepNo: stepData.stepNo,
                        title: stepData.title,
                        helperText: stepData.helperText,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    transaction,
                });

                for (const questionData of stepData.questions) {
                    const [question] = await FormQuestion.findOrCreate({
                        where: {
                            formId: form.id,
                            questionKey: questionData.questionKey,
                        },
                        defaults: {
                            formId: form.id,
                            stepId: step.id,
                            questionKey: questionData.questionKey,
                            questionText: questionData.questionText,
                            placeholder: questionData.placeholder ?? null,
                            questionType: questionData.questionType,
                            isRequired: questionData.isRequired ?? true,
                            sortOrder: questionData.sortOrder,
                            validationRules:
                                questionData.validationRules ?? null,
                            isActive: true,
                            createdAt: now,
                            updatedAt: now,
                        },
                        transaction,
                    });

                    if (questionData.options?.length) {
                        for (const optionData of questionData.options) {
                            await FormQuestionOption.findOrCreate({
                                where: {
                                    questionId: question.id,
                                    optionValue: optionData.optionValue,
                                },
                                defaults: {
                                    questionId: question.id,
                                    optionLabel: optionData.optionLabel,
                                    optionValue: optionData.optionValue,
                                    score: optionData.score ?? null,
                                    sortOrder: optionData.sortOrder,
                                    isActive: true,
                                    createdAt: now,
                                    updatedAt: now,
                                },
                                transaction,
                            });
                        }
                    }
                }
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(): Promise<void> {
        const transaction: Transaction = await sequelize.transaction();

        try {
            const form = await QualificationForm.findOne({
                where: { slug: FORM_SLUG },
                transaction,
            });

            if (form) {
                await form.destroy({ transaction });
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
