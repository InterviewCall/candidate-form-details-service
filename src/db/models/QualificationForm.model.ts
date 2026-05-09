import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './sequelize';

class QualificationForm extends Model<InferAttributes<QualificationForm>, InferCreationAttributes<QualificationForm>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare slug: string;
    declare segmentKey: string;
    declare description: CreationOptional<string | null>;
    declare version: CreationOptional<number>;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
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