import FormQuestionOption from '../db/models/FormQuestionOption.model';
import BaseRepository from './Base.repository';

class FormQuestionOptionRepository extends BaseRepository<FormQuestionOption> {
    constructor() {
        super(FormQuestionOption);
    }
}

export default FormQuestionOptionRepository;