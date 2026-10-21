import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QuizResultHistory } from '../types';

const STORAGE_KEY = 'naijalearn_quiz_history';
const SUPABASE_CONFIG_KEY = 'naijalearn_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };
}

export function setStoredSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (config.url && config.anonKey) {
    if (!supabaseInstance) {
      try {
        supabaseInstance = createClient(config.url, config.anonKey);
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        return null;
      }
    }
    return supabaseInstance;
  }
  return null;
}

export async function saveQuizResult(entry: Omit<QuizResultHistory, 'id' | 'date'> & { id?: string; date?: string }): Promise<QuizResultHistory> {
  const record: QuizResultHistory = {
    id: entry.id || `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: entry.date || new Date().toISOString(),
    curriculum_standard: entry.curriculum_standard || 'WAEC',
    class_level: entry.class_level,
    subject: entry.subject,
    topic: entry.topic || 'General Practice',
    score: entry.score,
    totalQuestions: entry.totalQuestions,
    percentage: entry.percentage,
  };

  // Always save to localStorage for offline reliability and zero-crash demo
  try {
    const existing = getLocalHistory();
    const updated = [record, ...existing.filter((item) => item.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Local storage save failed:', err);
  }

  // If Supabase is connected, attempt sync to 'quiz_attempts' table
  const client = getSupabase();
  if (client) {
    try {
      await client.from('quiz_attempts').insert([
        {
          id: record.id,
          curriculum_standard: record.curriculum_standard,
          class_level: record.class_level,
          subject: record.subject,
          topic: record.topic,
          score: record.score,
          total_questions: record.totalQuestions,
          percentage: record.percentage,
          created_at: record.date,
        },
      ]);
    } catch (err) {
      console.warn('Supabase sync skipped/failed (will continue with local storage):', err);
    }
  }

  return record;
}

export function getLocalHistory(): QuizResultHistory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // fallback
  }
  return [];
}

export async function fetchQuizHistory(): Promise<QuizResultHistory[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('quiz_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          date: d.created_at,
          curriculum_standard: d.curriculum_standard || 'WAEC',
          class_level: d.class_level,
          subject: d.subject,
          topic: d.topic,
          score: d.score,
          totalQuestions: d.total_questions,
          percentage: d.percentage,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local history:', err);
    }
  }
  return getLocalHistory();
}
