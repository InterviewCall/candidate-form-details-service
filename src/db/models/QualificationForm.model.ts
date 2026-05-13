import {
    Association,
    CreationOptional,
    DataTypes,
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

import CandidateSubmission from './CandidateSubmission.model';
import FormQuestion from './FormQuestion.model';
import FormStep from './FormStep.model';
import sequelize from './sequelize';

class QualificationForm extends Model<InferAttributes<QualificationForm>, InferCreationAttributes<QualificationForm>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare slug: string;
    declare segmentKey: string;
    declare title: string;
    declare subTitle: string;
    declare description: CreationOptional<string | null>;
    declare version: CreationOptional<number>;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    declare steps?: NonAttribute<FormStep[]>;
    declare questions?: NonAttribute<FormQuestion[]>;
    declare submissions?: NonAttribute<CandidateSubmission[]>;

    // HasMany FormStep mixins
    declare getSteps: HasManyGetAssociationsMixin<FormStep>;
    declare countSteps: HasManyCountAssociationsMixin;
    declare hasStep: HasManyHasAssociationMixin<FormStep, number>;
    declare hasSteps: HasManyHasAssociationsMixin<FormStep, number>;
    declare addStep: HasManyAddAssociationMixin<FormStep, number>;
    declare addSteps: HasManyAddAssociationsMixin<FormStep, number>;
    declare setSteps: HasManySetAssociationsMixin<FormStep, number>;
    declare removeStep: HasManyRemoveAssociationMixin<FormStep, number>;
    declare removeSteps: HasManyRemoveAssociationsMixin<FormStep, number>;
    declare createStep: HasManyCreateAssociationMixin<FormStep, 'formId'>;

    // HasMany FormQuestion mixins
    declare getQuestions: HasManyGetAssociationsMixin<FormQuestion>;
    declare countQuestions: HasManyCountAssociationsMixin;
    declare hasQuestion: HasManyHasAssociationMixin<FormQuestion, number>;
    declare hasQuestions: HasManyHasAssociationsMixin<FormQuestion, number>;
    declare addQuestion: HasManyAddAssociationMixin<FormQuestion, number>;
    declare addQuestions: HasManyAddAssociationsMixin<FormQuestion, number>;
    declare setQuestions: HasManySetAssociationsMixin<FormQuestion, number>;
    declare removeQuestion: HasManyRemoveAssociationMixin<FormQuestion, number>;
    declare removeQuestions: HasManyRemoveAssociationsMixin<FormQuestion, number>;
    declare createQuestion: HasManyCreateAssociationMixin<FormQuestion, 'formId'>;

    // HasMany CandidateSubmission mixins
    declare getSubmissions: HasManyGetAssociationsMixin<CandidateSubmission>;
    declare countSubmissions: HasManyCountAssociationsMixin;
    declare hasSubmission: HasManyHasAssociationMixin<CandidateSubmission, string>;
    declare hasSubmissions: HasManyHasAssociationsMixin<CandidateSubmission, string>;
    declare addSubmission: HasManyAddAssociationMixin<CandidateSubmission, string>;
    declare addSubmissions: HasManyAddAssociationsMixin<CandidateSubmission, string>;
    declare setSubmissions: HasManySetAssociationsMixin<CandidateSubmission, string>;
    declare removeSubmission: HasManyRemoveAssociationMixin<CandidateSubmission, string>;
    declare removeSubmissions: HasManyRemoveAssociationsMixin<CandidateSubmission, string>;
    declare createSubmission: HasManyCreateAssociationMixin<CandidateSubmission,'formId'>;

    declare static associations: {
        steps: Association<QualificationForm, FormStep>;
        questions: Association<QualificationForm, FormQuestion>;
        submissions: Association<QualificationForm, CandidateSubmission>;
    };
}

QualificationForm.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    slug: {
        type: DataTypes.STRING(150),
        unique: true,
        allowNull: false
    },

    segmentKey: {
        type: DataTypes.STRING(80),
        allowNull: false
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    subTitle: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },

    version: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },

    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },

    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
}, {
    tableName: 'qualification_forms',
    underscored: true,
    timestamps: true,
    sequelize
});

export default QualificationForm;