import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './constants';
import { CourseLevel, Lesson, Difficulty } from './types';
import { Button } from './components/Button';
import { LessonView } from './components/LessonView';
import { Play, Star, CheckCircle, Key, LogOut, X } from 'lucide-react';
import { useApiKey } from './contexts/ApiKeyContext';

const App: React.FC = () => {
  const [selectedLevelId, setSelectedLevelId] = useState<Difficulty | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { hasKey, setApiKey } = useApiKey();
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState('');
  
  // Track completed lessons using localStorage
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completedLessons');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Calculate Level: Base level 1 + number of completed lessons
  const playerLevel = 1 + completedLessons.length;

  const currentLevel = CURRICULUM.find(l => l.id === selectedLevelId);

  // Calculate next lesson logic
  const currentLessonIndex = currentLevel?.lessons.findIndex(l => l.id === selectedLesson?.id) ?? -1;
  const hasNextLesson = currentLevel && currentLessonIndex !== -1 && currentLessonIndex < currentLevel.lessons.length - 1;

  const handleLevelSelect = (id: Difficulty) => {
    setSelectedLevelId(id);
    setSelectedLesson(null);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setSelectedLevelId(null);
    setSelectedLesson(null);
  };

  const goBackToLevel = () => {
    setSelectedLesson(null);
  };

  const handleNextLesson = () => {
    if (hasNextLesson && currentLevel) {
      const nextLesson = currentLevel.lessons[currentLessonIndex + 1];
      setSelectedLesson(nextLesson);
      window.scrollTo(0, 0);
    } else {
      // If no next lesson (end of level), go back to list
      goBackToLevel();
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
    }
  };

  const handleSetKey = () => {
    setIsKeyModalOpen(true);
    setTempKey('');
  };

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      setApiKey(tempKey.trim());
      setIsKeyModalOpen(false);
    }
  };

  const handleClearKey = () => {
    // Directly clear the key
    setApiKey('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[Fredoka]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={goHome}
          >
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl shadow-[0_3px_0_rgb(180,83,9)] group-hover:scale-105 transition-transform">
              😺
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight group-hover:text-yellow-600 transition-colors">
              Scratch 魔法學院
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border-2 border-slate-200">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              <span className="font-bold text-slate-700">LV. {playerLevel}</span>
            </div>

            {hasKey ? (
              <button 
                onClick={handleClearKey}
                className="flex items-center gap-2 bg-green-100 hover:bg-red-100 hover:text-red-600 text-green-700 px-3 py-2 rounded-full transition-all group"
                title="點擊以斷開連線"
              >
                <Key size={18} className="group-hover:hidden" />
                <LogOut size={18} className="hidden group-hover:block" />
                <span className="hidden sm:inline font-bold text-sm group-hover:hidden">已連線</span>
                <span className="hidden font-bold text-sm sm:group-hover:inline">斷開連線</span>
              </button>
            ) : (
              <button 
                onClick={handleSetKey}
                className="flex items-center gap-2 bg-slate-100 hover:bg-yellow-100 hover:text-yellow-700 text-slate-500 px-3 py-2 rounded-full transition-colors"
                title="設定 API Key"
              >
                <Key size={18} />
                <span className="hidden sm:inline font-bold text-sm">設定 Key</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-8">
        {/* API Key Modal */}
        {isKeyModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-[scale-in_0.2s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Key className="text-yellow-500" />
                  設定 API Key
                </h3>
                <button 
                  onClick={() => setIsKeyModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-600">
                  請輸入你的 Gemini API Key 以啟用 AI 助教功能。
                  <span className="block text-sm text-slate-400 mt-2">
                    為了安全起見，Key 僅會保存在你的瀏覽器記憶體中，重新整理網頁後需再次輸入。
                  </span>
                </p>
                
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="貼上你的 API Key..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-slate-700"
                  autoFocus
                />
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsKeyModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveKey}
                    disabled={!tempKey.trim()}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-yellow-200"
                  >
                    確認儲存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: HOME (Level Selection) */}
        {!selectedLevelId && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">選擇你的魔法等級</h2>
              <p className="text-lg text-slate-500">你是初學者還是大師？選擇適合你的課程！</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-20">
              {CURRICULUM.map((level) => (
                <div 
                  key={level.id}
                  onClick={() => handleLevelSelect(level.id)}
                  className="group relative bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-yellow-200 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-2 ${level.color}`}></div>
                  <div className={`w-20 h-20 ${level.color} rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner`}>
                    {level.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-yellow-600 transition-colors">{level.name}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8">{level.description}</p>
                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="bg-slate-900 text-white rounded-full p-3">
                       <Play size={24} fill="white" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: COURSE LIST */}
        {selectedLevelId && !selectedLesson && currentLevel && (
          <div className="max-w-6xl mx-auto px-4 pb-20">
            <div className="mb-8">
              <Button variant="outline" size="sm" onClick={goHome} className="mb-4 !rounded-full border-dashed">
                ← 選擇其他等級
              </Button>
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 ${currentLevel.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                    {currentLevel.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">{currentLevel.name}</h2>
                    <p className="text-slate-500">共 {currentLevel.lessons.length} 堂課</p>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLevel.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                return (
                  <div 
                    key={lesson.id} 
                    className={`bg-white rounded-3xl overflow-hidden shadow-lg border flex flex-col hover:shadow-xl transition-all cursor-pointer group ${isCompleted ? 'border-green-400 ring-2 ring-green-100' : 'border-slate-100'}`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                      <img 
                        src={lesson.thumbnailUrl} 
                        alt={lesson.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm z-10">
                        第 {index + 1} 課
                      </div>
                      {isCompleted && (
                        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="bg-white text-green-600 rounded-full p-2 shadow-lg scale-110">
                             <CheckCircle size={32} fill="#DCFCE7" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors flex items-start justify-between gap-2">
                        {lesson.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{lesson.description}</p>
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {isCompleted ? '已完成' : '作業挑戰'}
                        </span>
                        {isCompleted ? (
                          <span className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700 font-bold flex items-center gap-1">
                            Done <CheckCircle size={12} />
                          </span>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded-lg ${currentLevel.color} bg-opacity-30 text-slate-800 font-bold`}>
                            Start
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW: LESSON DETAIL */}
        {selectedLesson && currentLevel && (
          <LessonView 
            lesson={selectedLesson} 
            difficultyColor={currentLevel.color}
            onBack={goBackToLevel} 
            onComplete={handleLessonComplete}
            onNextLesson={hasNextLesson ? handleNextLesson : undefined}
          />
        )}
      </main>
    </div>
  );
};

export default App;