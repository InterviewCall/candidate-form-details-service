import QualificationForm from '../db/models/QualificationForm.model';
import BaseRepository from './Base.repository';

class QualificationFormRepository extends BaseRepository<QualificationForm> {
    constructor() {
        super(QualificationForm);
    }
}

export default QualificationFormRepository;