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

import FormQuestion from './FormQuestion.model';
import QualificationForm from './QualificationForm.model';
import sequelize from './sequelize';

class FormStep extends Model<InferAttributes<FormStep>, InferCreationAttributes<FormStep>> {
    declare id: CreationOptional<number>;
    declare formId: ForeignKey<QualificationForm['id']>;
    declare stepNo: number;
    declare title: string;
    declare helperText: string;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    declare form?: NonAttribute<QualificationForm>;
    declare questions?: NonAttribute<FormQuestion[]>;

    // BelongsTo QualificationForm mixins
    declare getForm: BelongsToGetAssociationMixin<QualificationForm>;
    declare setForm: BelongsToSetAssociationMixin<QualificationForm, number>;
    declare createForm: BelongsToCreateAssociationMixin<QualificationForm>;

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
    declare createQuestion: HasManyCreateAssociationMixin<FormQuestion, 'stepId'>;

    declare static associations: {
        form: Association<FormStep, QualificationForm>;
        questions: Association<FormStep, FormQuestion>;
    };
}

FormStep.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
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
        allowNull: false
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    helperText: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    }
}, {
    tableName: 'form_steps',
    underscored: true,
    timestamps: true,
    sequelize
});

export default FormStep;