import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './sequelize';

class Candidate extends Model<InferAttributes<Candidate>, InferCreationAttributes<Candidate>> {
    declare id: CreationOptional<number>;
    declare fullName: string;
    declare email: string;
    declare phone: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Candidate.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },

    fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING(30),
        allowNull: false
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
    tableName: 'candidates',
    underscored: true,
    timestamps: true,
    sequelize
});

export default Candidate;