import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
});

// Removed PDF interface

export interface Question {
    id: number;
    source: string;
    external_id: string;
    problem: string;
    image_path?: string;
    solution?: string;
    answer?: string;
    topic?: string;
    difficulty?: string;
    options?: string[];
    correct_option_label?: string;
    is_active: boolean;
}

// Removed unused PDF functions

export const createSession = async (config: {
    limit: number;
    difficulty_min?: number;
    difficulty_max?: number;
    user_id?: number;
    mode?: 'practice' | 'challenge';
    source?: string;
}) => {
    const response = await api.post<Question[]>('/sessions', config);
    return response.data;
};

export const getQuestions = async (activeOnly: boolean = false) => {
    const params: any = { active_only: activeOnly };
    const response = await api.get<Question[]>('/questions', { params });
    return response.data;
};

export const fetchOlympiadQuestions = async (limit: number = 20, source?: string) => {
    const params: any = { limit };
    if (source) params.source = source;
    const response = await api.get<Question[]>('/questions/olympiad', { params });
    return response.data;
};
