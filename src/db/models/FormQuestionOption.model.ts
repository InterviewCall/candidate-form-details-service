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

import CandidateAnswer from './CandidateAnswer.model';
import FormQuestion from './FormQuestion.model';
import sequelize from './sequelize';

class FormQuestionOption extends Model<InferAttributes<FormQuestionOption>, InferCreationAttributes<FormQuestionOption>> {
    declare id: CreationOptional<number>;
    declare questionId: ForeignKey<FormQuestion['id']>;
    declare optionLabel: string;
    declare optionValue: string;
    declare score: CreationOptional<number | null>;
    declare sortOrder: CreationOptional<number>;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    declare question?: NonAttribute<FormQuestion>;
    declare answers?: NonAttribute<CandidateAnswer[]>;

    // BelongsTo FormQuestion mixins
    declare getQuestion: BelongsToGetAssociationMixin<FormQuestion>;
    declare setQuestion: BelongsToSetAssociationMixin<FormQuestion, number>;
    declare createQuestion: BelongsToCreateAssociationMixin<FormQuestion>;

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
    declare createAnswer: HasManyCreateAssociationMixin<CandidateAnswer, 'selectedOptionId'>;

    declare static associations: {
        question: Association<FormQuestionOption, FormQuestion>;
        answers: Association<FormQuestionOption, CandidateAnswer>;
    };
}

FormQuestionOption.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    questionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: FormQuestion,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },

    optionLabel: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },

    optionValue: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },

    score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },

    sortOrder: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
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
    tableName: 'form_question_options',
    underscored: true,
    timestamps: true,
    sequelize
});

export default FormQuestionOption;