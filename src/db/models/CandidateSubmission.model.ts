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

import { CandidateSubmissionStatus } from '../../utils/enums/CandidateSubmissionStatus';
import { LeadTemperature } from '../../utils/enums/LeadTemperature';
import Candidate from './Candidate.model';
import CandidateAnswer from './CandidateAnswer.model';
import QualificationForm from './QualificationForm.model';
import sequelize from './sequelize';

class CandidateSubmission extends Model<InferAttributes<CandidateSubmission>, InferCreationAttributes<CandidateSubmission>> {
    declare id: CreationOptional<string>;
    declare candidateId: ForeignKey<Candidate['id']>;
    declare formId: ForeignKey<QualificationForm['id']>;
    declare source: CreationOptional<string | null>;
    declare landingPage: CreationOptional<string | null>;

    declare utmSource: CreationOptional<string | null>;
    declare utmMedium: CreationOptional<string | null>;
    declare utmCampaign: CreationOptional<string | null>;
    declare utmContent: CreationOptional<string | null>;
    declare utmTerm: CreationOptional<string | null>;

    declare status: CreationOptional<CandidateSubmissionStatus>;
    declare leadScore: CreationOptional<number | null>;
    declare leadTemperature: CreationOptional<LeadTemperature | null>;
    declare submittedAt: CreationOptional<Date>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    declare candidate?: NonAttribute<Candidate>;
    declare form?: NonAttribute<QualificationForm>;
    declare answers?: NonAttribute<CandidateAnswer[]>;

    // BelongsTo Candidate mixins
    declare getCandidate: BelongsToGetAssociationMixin<Candidate>;
    declare setCandidate: BelongsToSetAssociationMixin<Candidate, number>;
    declare createCandidate: BelongsToCreateAssociationMixin<Candidate>;

    // BelongsTo QualificationForm mixins
    declare getForm: BelongsToGetAssociationMixin<QualificationForm>;
    declare setForm: BelongsToSetAssociationMixin<QualificationForm, number>;
    declare createForm: BelongsToCreateAssociationMixin<QualificationForm>;

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
    declare createAnswer: HasManyCreateAssociationMixin<CandidateAnswer, 'submissionId'>;

    declare static associations: {
        candidate: Association<CandidateSubmission, Candidate>;
        form: Association<CandidateSubmission, QualificationForm>;
        answers: Association<CandidateSubmission, CandidateAnswer>;
    };
}

CandidateSubmission.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    candidateId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: Candidate,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    formId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: QualificationForm,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    source: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },

    landingPage: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },

    utmSource: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },

    utmMedium: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },

    utmCampaign: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
    },

    utmContent: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
    },

    utmTerm: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
    },

    status: {
        type: DataTypes.ENUM(...Object.values(CandidateSubmissionStatus)),
        allowNull: false,
        defaultValue: CandidateSubmissionStatus.BOOKING_PENDING,
    },

    leadScore: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
    },

    leadTemperature: {
        type: DataTypes.ENUM(...Object.values(LeadTemperature)),
        allowNull: true,
        defaultValue: null,
    },

    submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
    tableName: 'candidate_submissions',
    underscored: true,
    timestamps: true,
    sequelize
});

export default CandidateSubmission;