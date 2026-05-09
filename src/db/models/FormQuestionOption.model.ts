import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

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