import { useNavigate } from 'react-router-dom';
import { Clock, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import type { Difficulty } from '../types';

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-600',
};

// 목업 데이터
const EXAMS = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  round: i + 1,
  title: `SQLD 모의고사 ${i + 1}회`,
  problemCount: 50,
  avgDifficulty: (['easy', 'medium', 'hard', 'medium', 'hard', 'medium'] as Difficulty[])[i],
  timeLimit: 90,
  isSolved: i < 3,
  bestScore: i < 3 ? [78, 54, 82][i] : null,
}));

export default function ExamListPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-sqld-navy mb-1">모의고사</h1>
        <p className="text-slate-500 text-sm mb-8">
          실제 SQLD 시험 형식의 모의고사로 실력을 점검하세요.
        </p>

        <div className="grid gap-4">
          {EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              onClick={() => navigate(`/exams/${exam.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{exam.round}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-sqld-navy">{exam.title}</h2>
                    {exam.isSolved && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {exam.problemCount}문항
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.timeLimit}분
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${DIFFICULTY_COLOR[exam.avgDifficulty]}`}
                    >
                      {DIFFICULTY_LABEL[exam.avgDifficulty]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {exam.isSolved && exam.bestScore !== null && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400">최고 점수</p>
                    <p
                      className={`font-bold text-lg ${exam.bestScore >= 60 ? 'text-emerald-600' : 'text-red-500'}`}
                    >
                      {exam.bestScore}점
                    </p>
                  </div>
                )}
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
