import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from 'sequelize';

import CandidateSubmission from './CandidateSubmission.model';
import FormQuestion from './FormQuestion.model';
import FormQuestionOption from './FormQuestionOption.model';
import sequelize from './sequelize';

class CandidateAnswer extends Model<InferAttributes<CandidateAnswer>, InferCreationAttributes<CandidateAnswer>> {
    declare id: CreationOptional<number>;

    declare submissionId: ForeignKey<CandidateSubmission['id']>;
    declare questionId: ForeignKey<FormQuestion['id']>;

    declare questionKey: string;

    declare answerText: CreationOptional<string | null>;
    declare answerNumber: CreationOptional<number | null>;
    declare answerJson: CreationOptional<object | null>;

    declare selectedOptionId: CreationOptional<ForeignKey<FormQuestionOption['id']> | null>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    declare submission?: NonAttribute<CandidateSubmission>;
    declare question?: NonAttribute<FormQuestion>;
    declare selectedOption?: NonAttribute<FormQuestionOption | null>;

    // BelongsTo CandidateSubmission mixins
    declare getSubmission: BelongsToGetAssociationMixin<CandidateSubmission>;
    declare setSubmission: BelongsToSetAssociationMixin<CandidateSubmission, string>;
    declare createSubmission: BelongsToCreateAssociationMixin<CandidateSubmission>;

    // BelongsTo FormQuestion mixins
    declare getQuestion: BelongsToGetAssociationMixin<FormQuestion>;
    declare setQuestion: BelongsToSetAssociationMixin<FormQuestion, number>;
    declare createQuestion: BelongsToCreateAssociationMixin<FormQuestion>;

    // BelongsTo FormQuestionOption mixins
    declare getSelectedOption: BelongsToGetAssociationMixin<FormQuestionOption>;
    declare setSelectedOption: BelongsToSetAssociationMixin<FormQuestionOption, number>;
    declare createSelectedOption: BelongsToCreateAssociationMixin<FormQuestionOption>;

    declare static associations: {
        submission: Association<CandidateAnswer, CandidateSubmission>;
        question: Association<CandidateAnswer, FormQuestion>;
        selectedOption: Association<CandidateAnswer, FormQuestionOption>;
    };
}

CandidateAnswer.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    submissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: CandidateSubmission,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    questionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: FormQuestion,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    questionKey: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    answerText: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },

    answerNumber: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: null,
        get() {
            const value = this.getDataValue('answerNumber');

            if (value === null || value === undefined) {
                return null;
            }

            return Number(value);
        },
    },

    answerJson: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
    },

    selectedOptionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: {
            model: FormQuestionOption,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    tableName: 'candidate_answers',
    underscored: true,
    timestamps: true,
    sequelize
});

export default CandidateAnswer;