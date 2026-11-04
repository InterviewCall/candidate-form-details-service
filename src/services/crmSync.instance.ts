import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import CrmOutboxRepository from '../repositories/CrmOutbox.repository';
import CrmSyncService from './CrmSync.service';

// One sender for the whole process: the controllers queue into it, server.ts starts its retry loop.
const crmSync = new CrmSyncService(new CrmOutboxRepository(), new CandidateSubmissionRepository(), new CandidateAnswerRepository());

export default crmSync;
