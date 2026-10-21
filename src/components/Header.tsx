import React from 'react';
import { BookOpen, Sparkles, Database, Code2, Award, Flame } from 'lucide-react';
import { getStoredSupabaseConfig } from '../lib/supabase';

interface HeaderProps {
  quizCount: number;
  accuracy: number;
  onOpenSupabase: () => void;
  onOpenGuide: () => void;
  onResetToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  quizCount,
  accuracy,
  onOpenSupabase,
  onOpenGuide,
  onResetToHome,
}) => {
  const supabaseConfig = getStoredSupabaseConfig();
  const isSupabaseConnected = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

  return (
    <header className="sticky top-0 z-30 bg-emerald-900/95 backdrop-blur-md text-white border-b border-emerald-700/60 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Branding */}
          <button
            onClick={onResetToHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Return to Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 flex items-center justify-center shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center">
                  Bridge<span className="text-amber-400">Learn</span>
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                  WAEC · JAMB · IGCSE · SAT
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 hidden sm:block">
                AI Curriculum Tutor · Local Foundation to Global Opportunities
              </p>
            </div>
          </button>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {quizCount > 0 && (
              <div className="hidden md:flex items-center gap-3 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/50 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{quizCount} Quiz{quizCount > 1 ? 'zes' : ''}</span>
                </div>
                <div className="w-px h-3 bg-emerald-700" />
                <div className="flex items-center gap-1 text-emerald-300 font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{accuracy}% Avg</span>
                </div>
              </div>
            )}

            {/* Supabase Status Pill */}
            <button
              onClick={onOpenSupabase}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isSupabaseConnected
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30'
                  : 'bg-emerald-800/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-800/60'
              }`}
              title="Configure Supabase Database"
            >
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">
                {isSupabaseConnected ? 'Supabase Synced' : 'Supabase (Optional)'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* Hackathon Guide Modal Button */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-emerald-950 transition-colors shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="font-bold">MVP Code & Setup</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
