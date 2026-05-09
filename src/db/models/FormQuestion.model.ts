import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import { QuestionType } from '../../enums/QuestionType';
import QualificationForm from './QualificationForm.model';
import sequelize from './sequelize';

class FormQuestion extends Model<InferAttributes<FormQuestion>, InferCreationAttributes<FormQuestion>> {
    declare id: CreationOptional<number>;
    declare formId: ForeignKey<QualificationForm['id']>;
    declare stepNo: number;
    declare questionKey: string;
    declare questionText: string;
    declare helperText: string;
    declare questionType: QuestionType;
    declare isRequired: CreationOptional<boolean>;
    declare sortOrder: CreationOptional<number>;
    declare validationRules: CreationOptional<object | null>;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
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