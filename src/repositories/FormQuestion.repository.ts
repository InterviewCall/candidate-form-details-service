import FormQuestion from '../db/models/FormQuestion.model';
import BaseRepository from './Base.repository';

class FormQuestionRepository extends BaseRepository<FormQuestion> {
    constructor() {
        super(FormQuestion);
    }
}

export default FormQuestionRepository;