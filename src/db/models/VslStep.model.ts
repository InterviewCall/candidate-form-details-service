
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from 'sequelize';

import { VslStepChannel } from '../../utils/enums/VslStepChannel';
import { VslStepKey } from '../../utils/enums/VslStepKey';
import { VslStepStatus } from '../../utils/enums/VslStepStatus';

import VslRun from './VslRun.model';
import sequelize from './sequelize';

class VslStep extends Model<
    InferAttributes<VslStep>,
    InferCreationAttributes<VslStep>
> {
    declare id: CreationOptional<number>;

    declare runId: ForeignKey<VslRun['id']>;

    // Identifies which email step this is, for example Day 1 or Day 3.
    declare stepKey: VslStepKey;

    // Day number counted from the VSL run's anchor date.
    declare dayNumber: number;

    // The channel used to contact the candidate.
    declare channel: VslStepChannel;

    // When this step becomes eligible to be processed.
    declare dueAt: Date;

    // Tracks the current state of this scheduled step.
    declare status: CreationOptional<VslStepStatus>;

    // Number of attempts made to process this step.
    declare attemptCount: CreationOptional<number>;

    // When the sweeper claimed this step for processing.
    declare claimedAt: CreationOptional<Date | null>;

    // When this step finished processing.
    declare processedAt: CreationOptional<Date | null>;

    // Stores the latest processing error, if any.
    declare lastError: CreationOptional<string | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // The VSL run to which this step belongs.
    declare run?: NonAttribute<VslRun>;
}

VslStep.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        runId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: VslRun,
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },

        stepKey: {
            type: DataTypes.ENUM(
                'VSL_D1_EMAIL',
                'VSL_D3_EMAIL',
                'VSL_D7_EMAIL'
            ),
            allowNull: false,
        },

        dayNumber: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },

        channel: {
            type: DataTypes.ENUM('email'),
            allowNull: false,
        },

        dueAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                'pending',
                'processing',
                'sent',
                'skipped',
                'cancelled',
                'failed'
            ),
            allowNull: false,
            defaultValue: VslStepStatus.PENDING,
        },

        attemptCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },

        claimedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },

        processedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },

        lastError: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'vsl_steps',
        underscored: true,
        timestamps: true,
        sequelize,
    }
);

export default VslStep;
