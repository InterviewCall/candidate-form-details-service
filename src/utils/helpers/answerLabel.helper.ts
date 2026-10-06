import CandidateAnswer from '../../db/models/CandidateAnswer.model';
import FormQuestionOption from '../../db/models/FormQuestionOption.model';
import { QuestionType } from '../enums/QuestionType';

/**
 * The text a person should read for one answer. The database keeps the option VALUE ("3-5-years") in answer_text;
 * the label ("3-5 years") is on the option row, so for choice questions the label is looked up and shown instead.
 */
export function resolveAnswerLabel(answer: CandidateAnswer, questionType: QuestionType, options: FormQuestionOption[]): string | null {
    const isChoice = [QuestionType.SELECT, QuestionType.RADIO, QuestionType.CHECKBOX].includes(questionType);

    if (isChoice) {
        // The option the candidate picked, by id (exact). Falls back to matching the stored value against the question's options.
        const picked = answer.selectedOption ?? options.find((option) => option.optionValue === answer.answerText);
        if (picked) {
            return picked.optionLabel;
        }

        // Checkbox answers keep a list of values in answer_json, e.g. { "values": ["a", "b"] }.
        const values = (answer.answerJson as { values?: unknown } | null)?.values;
        if (Array.isArray(values) && values.length > 0) {
            const labelByValue = new Map(options.map((option) => [option.optionValue, option.optionLabel]));
            return values.map((value) => labelByValue.get(String(value)) ?? String(value)).join(', ');
        }
    }

    if (answer.answerText) {
        return answer.answerText;
    }

    if (answer.answerNumber !== null && answer.answerNumber !== undefined) {
        return String(answer.answerNumber);
    }

    return null;
}
