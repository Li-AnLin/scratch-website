import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import { Button } from './Button';
import { useApiKey } from '../contexts/ApiKeyContext';

export const ChatBot: React.FC = () => {
  const { hasKey } = useApiKey();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好！我是 Scratch 貓博士 😺。你在寫程式時遇到困難了嗎？還是想要一些酷點子？隨時問我喔！', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, hasKey]); 

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!hasKey) {
        const errorMsg: ChatMessage = { role: 'model', text: '喵！請先設定環境變數 API Key 我才能幫你喔！', timestamp: Date.now() };
        setMessages(prev => [...prev, errorMsg]);
        return;
    }

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getGeminiResponse(messages, input);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl border-4 border-yellow-200 overflow-hidden shadow-xl">
      <div className="bg-yellow-100 p-4 flex items-center gap-3 border-b-2 border-yellow-200">
        <div className="bg-white p-2 rounded-full border-2 border-yellow-400">
          <Bot size={24} className="text-yellow-600" />
        </div>
        <div>
          <h3 className="font-bold text-yellow-800">Scratch 貓博士</h3>
          <p className="text-xs text-yellow-600">你的 AI 程式設計導師</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-700 border-2 border-slate-100 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-slate-100 shadow-sm flex items-center gap-2">
              <Sparkles className="animate-spin text-yellow-500" size={16} />
              <span className="text-slate-400 text-sm">思考中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            placeholder={hasKey ? "輸入你的問題..." : "請先設定 API Key"}
            className="flex-1 bg-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-slate-700 disabled:opacity-50"
          />
          <Button onClick={handleSend} disabled={isLoading} size="sm" className="!rounded-xl !px-4 disabled:opacity-50 disabled:shadow-none">
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};