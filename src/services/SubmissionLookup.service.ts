import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import { SubmissionLookupItem } from '../types/SubmissionLookup.type';
import { resolveAnswerLabel } from '../utils/helpers/answerLabel.helper';

class SubmissionLookupService {
    constructor(
        private readonly candidateSubmissionRepository: CandidateSubmissionRepository,
        private readonly candidateAnswerRepository: CandidateAnswerRepository
    ) {}

    /**
     * Candidate, score and the requested answers for each submission. Unknown or deleted submissions are simply left out,
     * so the caller can tell which of its ids have no match.
     */
    async lookupByPublicIds(submissionIds: string[], answerKeys: string[] = []): Promise<SubmissionLookupItem[]> {
        const uniqueIds = [...new Set(submissionIds)];
        const submissions = await this.candidateSubmissionRepository.findAdminSubmissionsByPublicIds(uniqueIds);

        if (submissions.length === 0) {
            return [];
        }

        const answers = await this.candidateAnswerRepository.findForSubmissionsByQuestionKeys(
            submissions.map((submission) => submission.id),
            [...new Set(answerKeys)]
        );

        const answersBySubmission = new Map<number, Record<string, string>>();
        for (const answer of answers) {
            const label = resolveAnswerLabel(answer, answer.question!.questionType, answer.question!.options ?? []);
            if (label === null) {
                continue;
            }

            const submissionAnswers = answersBySubmission.get(answer.submissionId) ?? {};
            submissionAnswers[answer.questionKey] = label;
            answersBySubmission.set(answer.submissionId, submissionAnswers);
        }

        return submissions.map((submission) => ({
            submissionId: submission.publicId,
            status: submission.status,
            formSlug: submission.formSlug,
            formName: submission.form?.name ?? '',
            leadScore: submission.leadScore,
            leadTemperature: submission.leadTemperature,
            candidate: {
                fullName: submission.candidate?.fullName ?? '',
                email: submission.candidate?.email ?? '',
                phone: submission.candidate?.phone ?? '',
            },
            answers: answersBySubmission.get(submission.id) ?? {},
        }));
    }
}

export default SubmissionLookupService;
