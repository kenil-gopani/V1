import React, { useState } from 'react';
import { generateQuizFromText, generateSummary } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Wand2, FileText, CheckCircle2, AlertCircle, Loader2, Play } from 'lucide-react';

type Mode = 'quiz' | 'summary';

const SmartGen: React.FC = () => {
  const [mode, setMode] = useState<Mode>('quiz');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizQuestion[] | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setQuizResult(null);
    setSummaryResult(null);

    try {
      if (mode === 'quiz') {
        const questions = await generateQuizFromText(inputText);
        setQuizResult(questions);
      } else {
        const summary = await generateSummary(inputText);
        setSummaryResult(summary);
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Content Generator</h1>
          <p className="text-slate-500 mt-1">Transform your notes into quizzes or summaries instantly with AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
           <div className="flex p-1 bg-white border border-slate-200 rounded-xl w-fit">
             <button
               onClick={() => setMode('quiz')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                 mode === 'quiz' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
               }`}
             >
               Generate Quiz
             </button>
             <button
               onClick={() => setMode('summary')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                 mode === 'summary' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
               }`}
             >
               Generate Summary
             </button>
           </div>

           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <label className="block text-sm font-medium text-slate-700 mb-2">
               Paste your study notes or article text here
             </label>
             <textarea
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
               placeholder="Biology is the scientific study of life. It is a natural science with a broad scope but has several unifying themes that tie it together as a single, coherent field..."
             ></textarea>
             <div className="mt-4 flex justify-end">
               <button
                 onClick={handleGenerate}
                 disabled={isLoading || !inputText.trim()}
                 className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
               >
                 {isLoading ? (
                   <>
                     <Loader2 size={18} className="animate-spin" />
                     Processing...
                   </>
                 ) : (
                   <>
                     <Wand2 size={18} />
                     Generate {mode === 'quiz' ? 'Quiz' : 'Summary'}
                   </>
                 )}
               </button>
             </div>
           </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between h-11">
             <h2 className="font-bold text-slate-900">Result</h2>
          </div>

          {/* Empty State */}
          {!quizResult && !summaryResult && !isLoading && (
            <div className="h-64 md:h-[calc(100%-3rem)] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <FileText size={48} className="mb-4 opacity-50" />
              <p>Content will appear here after generation.</p>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
             <div className="space-y-4 animate-pulse">
               <div className="h-32 bg-slate-200 rounded-xl"></div>
               <div className="h-32 bg-slate-200 rounded-xl"></div>
             </div>
          )}

          {/* Quiz Output */}
          {quizResult && mode === 'quiz' && (
            <div className="space-y-4">
              {quizResult.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="font-medium text-slate-900">{q.question}</h3>
                  </div>
                  <div className="space-y-2 ml-9">
                    {q.options.map((opt, optIdx) => (
                      <div 
                        key={optIdx} 
                        className={`p-3 rounded-lg border text-sm transition-colors ${
                          optIdx === q.correctAnswerIndex 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-white border-slate-100 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                           {optIdx === q.correctAnswerIndex && <CheckCircle2 size={16} />}
                           {opt}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 ml-9 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5" />
                    <p>{q.explanation}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-4">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all">
                  <Play size={18} />
                  Start Interactive Mode
                </button>
              </div>
            </div>
          )}

          {/* Summary Output */}
          {summaryResult && mode === 'summary' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                Summary
              </h3>
              <div className="prose prose-slate prose-sm max-w-none">
                {summaryResult.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartGen;