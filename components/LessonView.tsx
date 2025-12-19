import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle, ExternalLink, BookOpen, PenTool, Check, ArrowRight, Trophy } from 'lucide-react';
import { Lesson } from '../types';
import { Button } from './Button';
import { ChatBot } from './ChatBot';

interface LessonViewProps {
  lesson: Lesson;
  difficultyColor: string;
  onBack: () => void;
  onComplete: (lessonId: string) => void;
  onNextLesson?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, difficultyColor, onBack, onComplete, onNextLesson }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'ai'>('learn');
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  // Reset checklist when lesson changes
  useEffect(() => {
    setCheckedItems(new Array(lesson.assignment.checklist.length).fill(false));
    setActiveTab('learn'); // Reset tab to learn when entering a new lesson
  }, [lesson]);

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  const allChecked = checkedItems.length > 0 && checkedItems.every(Boolean);

  // Trigger completion when all items are checked
  useEffect(() => {
    if (allChecked) {
      onComplete(lesson.id);
    }
  }, [allChecked, lesson.id, onComplete]);

  // Generate random particles for celebration
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      emoji: ['⭐', '🎉', '🏆', '✨', '🎈', '🐱'][Math.floor(Math.random() * 6)],
      size: 1 + Math.random() * 1.5
    }));
  }, []);

  // Helper to parse inline bolding **text**
  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Improved Markdown parser
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-slate-800">{line.replace('### ', '')}</h3>;
      }
      
      // Standalone Bold Headers (e.g. **Title**)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return <strong key={i} className="block mt-4 mb-2 text-slate-900 text-lg">{trimmedLine.replace(/\*\*/g, '')}</strong>;
      }

      // Numbered List Items (matches "1. Content")
      const listMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/);
      if (listMatch) {
        const [, num, content] = listMatch;
        return (
          <div key={i} className="flex items-start gap-3 mb-2 ml-2">
            <span className="font-bold text-yellow-600 min-w-[20px] text-right shrink-0">{num}.</span>
            <div className="text-slate-600 leading-relaxed">
              {parseInlineMarkdown(content)}
            </div>
          </div>
        );
      }

      // Empty lines
      if (!trimmedLine) return <div key={i} className="h-2" />;

      // Standard Paragraphs
      return (
        <p key={i} className="mb-2 text-slate-600 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderActionButtons = () => {
    if (allChecked) {
      if (onNextLesson) {
        return (
          <Button 
            variant="primary" 
            className="w-full transition-all duration-500 scale-105 shadow-xl ring-4 ring-yellow-200 bg-yellow-400 hover:bg-yellow-300"
            onClick={onNextLesson}
          >
            太棒了！前往下一課 <ArrowRight size={20} />
          </Button>
        );
      } else {
        return (
           <Button 
            variant="primary" 
            className="w-full transition-all duration-500 scale-105 shadow-xl ring-4 ring-yellow-200"
            onClick={onBack}
          >
            恭喜完成所有課程！回到列表 <Trophy size={20} />
          </Button>
        );
      }
    }

    return (
      <a 
        href="https://scratch.mit.edu/projects/editor/" 
        target="_blank" 
        rel="noreferrer"
        className="flex-1 w-full"
      >
        <Button 
          variant="secondary" 
          className="w-full"
        >
          去 Scratch 做作業 <ExternalLink size={18} />
        </Button>
      </a>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20">
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-500px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <Button variant="outline" size="sm" onClick={onBack} className="mb-6 !rounded-full border-dashed">
        <ArrowLeft size={16} /> 回到課程列表
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-8 rounded-3xl ${difficultyColor} bg-opacity-20 border-2 border-${difficultyColor.split('-')[1]}-200`}>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{lesson.title}</h1>
            <p className="text-slate-600 text-lg">{lesson.description}</p>
          </div>

          {/* Custom Tabs */}
          <div className="flex gap-2 p-1 bg-slate-200 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'learn' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen size={18} /> 學習
            </button>
            <button 
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'practice' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <PenTool size={18} /> 作業
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'ai' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'} lg:hidden`}
            >
              <CheckCircle size={18} /> 問老師
            </button>
          </div>

          {activeTab === 'learn' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="prose prose-lg text-slate-600 max-w-none">
                {renderContent(lesson.content)}
              </div>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 border-l-8 transition-all duration-500 relative overflow-hidden ${allChecked ? 'border-l-yellow-400 ring-4 ring-yellow-100' : 'border-l-green-400'}`}>
              
              {/* Celebration Particles */}
              {allChecked && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      className="absolute bottom-0 text-2xl md:text-4xl"
                      style={{
                        left: `${p.left}%`,
                        animation: `float-up ${p.duration}s linear infinite`,
                        animationDelay: `${p.delay}s`,
                        fontSize: `${p.size}rem`,
                        opacity: 0
                      }}
                    >
                      {p.emoji}
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay"></div>
                </div>
              )}

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className={`${allChecked ? 'bg-yellow-400 text-white scale-125 rotate-12 shadow-lg' : 'bg-green-100 text-green-600'} p-2 rounded-lg transition-all duration-500`}>
                    {allChecked ? '🏆' : '🎨'}
                  </span>
                  {allChecked ? '恭喜完成作業！' : `本課作業：${lesson.assignment.title}`}
                </h2>
                <p className="text-lg text-slate-700 mb-6">{lesson.assignment.description}</p>
                
                <div className="bg-slate-50 p-6 rounded-2xl mb-8">
                  <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4">
                    {allChecked ? '挑戰成功！' : '挑戰清單 (點擊勾選)'}
                  </h3>
                  <ul className="space-y-3">
                    {lesson.assignment.checklist.map((item, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => toggleCheck(idx)}
                        className={`flex items-start gap-3 cursor-pointer p-2 rounded-lg transition-all select-none ${checkedItems[idx] ? 'bg-green-50' : 'hover:bg-slate-100'}`}
                      >
                        <div className={`mt-1 min-w-[24px] h-6 rounded-full border-2 flex items-center justify-center transition-all ${checkedItems[idx] ? 'bg-green-500 border-green-500 scale-110' : 'border-slate-300 bg-white'}`}>
                          {checkedItems[idx] && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-slate-700 ${checkedItems[idx] ? 'line-through text-slate-400' : ''}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {renderActionButtons()}
                </div>
                <p className="text-center text-slate-400 text-sm mt-4 transition-opacity duration-500">
                  {allChecked ? '別忘了給爸媽看看你的傑作喔！ ✨' : '完成後記得回來勾選上面的項目喔！'}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'ai' && (
             <div className="lg:hidden">
               <ChatBot />
             </div>
          )}
        </div>

        {/* Sidebar - Always visible on Desktop */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="sticky top-6">
            <h3 className="font-bold text-slate-500 mb-4 px-2">隨時求助</h3>
            <ChatBot />
            
            <div className="mt-6 bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2">小提示 💡</h4>
              <p className="text-indigo-700 text-sm">
                如果你不知道某個積木在哪裡，可以直接問貓博士：「『重複無限次』在哪裡？」
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};