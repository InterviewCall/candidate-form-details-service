import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    CreationOptional,
    DataTypes,
    ForeignKey,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from 'sequelize';

import { QuestionType } from '../../utils/enums/QuestionType';
import CandidateAnswer from './CandidateAnswer.model';
import FormQuestionOption from './FormQuestionOption.model';
import QualificationForm from './QualificationForm.model';
import sequelize from './sequelize';

class FormQuestion extends Model<InferAttributes<FormQuestion>, InferCreationAttributes<FormQuestion>> {
    declare id: CreationOptional<number>;
    declare formId: ForeignKey<QualificationForm['id']>;
    declare stepNo: number;
    declare questionKey: string;
    declare questionText: string;
    declare helperText: string | null;
    declare questionType: QuestionType;
    declare isRequired: CreationOptional<boolean>;
    declare sortOrder: CreationOptional<number>;
    declare validationRules: CreationOptional<object | null>;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    declare form?: NonAttribute<QualificationForm>;
    declare options?: NonAttribute<FormQuestionOption[]>;
    declare answers?: NonAttribute<CandidateAnswer[]>;

    // BelongsTo QualificationForm mixins
    declare getForm: BelongsToGetAssociationMixin<QualificationForm>;
    declare setForm: BelongsToSetAssociationMixin<QualificationForm, number>;
    declare createForm: BelongsToCreateAssociationMixin<QualificationForm>;

    // HasMany FormQuestionOption mixins
    declare getOptions: HasManyGetAssociationsMixin<FormQuestionOption>;
    declare countOptions: HasManyCountAssociationsMixin;
    declare hasOption: HasManyHasAssociationMixin<FormQuestionOption, number>;
    declare hasOptions: HasManyHasAssociationsMixin<FormQuestionOption, number>;
    declare addOption: HasManyAddAssociationMixin<FormQuestionOption, number>;
    declare addOptions: HasManyAddAssociationsMixin<FormQuestionOption, number>;
    declare setOptions: HasManySetAssociationsMixin<FormQuestionOption, number>;
    declare removeOption: HasManyRemoveAssociationMixin<FormQuestionOption, number>;
    declare removeOptions: HasManyRemoveAssociationsMixin<FormQuestionOption, number>;
    declare createOption: HasManyCreateAssociationMixin<FormQuestionOption, 'questionId'>;

    // HasMany CandidateAnswer mixins
    declare getAnswers: HasManyGetAssociationsMixin<CandidateAnswer>;
    declare countAnswers: HasManyCountAssociationsMixin;
    declare hasAnswer: HasManyHasAssociationMixin<CandidateAnswer, number>;
    declare hasAnswers: HasManyHasAssociationsMixin<CandidateAnswer, number>;
    declare addAnswer: HasManyAddAssociationMixin<CandidateAnswer, number>;
    declare addAnswers: HasManyAddAssociationsMixin<CandidateAnswer, number>;
    declare setAnswers: HasManySetAssociationsMixin<CandidateAnswer, number>;
    declare removeAnswer: HasManyRemoveAssociationMixin<CandidateAnswer, number>;
    declare removeAnswers: HasManyRemoveAssociationsMixin<CandidateAnswer, number>;
    declare createAnswer: HasManyCreateAssociationMixin<CandidateAnswer, 'questionId'>;

    declare static associations: {
        form: Association<FormQuestion, QualificationForm>;
        options: Association<FormQuestion, FormQuestionOption>;
        answers: Association<FormQuestion, CandidateAnswer>;
    };
}

FormQuestion.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    formId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: QualificationForm,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },

    stepNo: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },

    questionKey: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    questionText: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    helperText: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },

    questionType: {
        type: DataTypes.ENUM(...Object.values(QuestionType)),
        allowNull: false,
    },

    isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

    sortOrder: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
    },

    validationRules: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'form_questions',
    underscored: true,
    timestamps: true,
    sequelize
});

export default FormQuestion;