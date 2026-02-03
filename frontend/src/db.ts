import Dexie, { Table } from 'dexie';

export interface Question {
    id: number;
    problem: string;
    solution: string;
    source?: string;
    // Add other fields if present in raw_questions.json
}

export interface UserProgress {
    questionId: number;
    status: 'correct' | 'incorrect' | 'skipped';
    timestamp: number;
}

export class MathDatabase extends Dexie {
    questions!: Table<Question, number>;
    progress!: Table<UserProgress, number>;

    constructor() {
        super('MathPracticeDB');
        this.version(1).stores({
            questions: 'id, source',
            progress: 'questionId, status, timestamp'
        });
    }
}

export const db = new MathDatabase();
