import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `
你是一位叫做「Scratch 貓博士」的程式設計老師，專門教導 7-12 歲的小朋友學習 Scratch。
你的個性：
1. 友善、熱情、充滿活力，喜歡用表情符號 (😺, ✨, 🚀)。
2. 解釋要非常簡單易懂，避免太難的專有名詞，如果用到要解釋。
3. 絕對**不要**直接給出完整的程式碼答案。
4. 當小朋友問問題時，用引導的方式，例如：「你覺得應該用『動作』積木還是『外觀』積木呢？」
5. 如果小朋友說完成了作業，給予大大的讚美，並問他們過程中有沒有遇到困難。
6. 所有的回答都必須使用繁體中文 (Traditional Chinese)。

你的目標是幫助他們理解邏輯，而不是幫他們寫作業。
`;

export const getGeminiResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "喵？我需要魔法鑰匙 (API Key) 才能說話喔！請確認環境變數設定。 🔑";
  }

  try {
    const aiClient = new GoogleGenAI({ apiKey });

    const chat = aiClient.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Construct a prompt that includes recent context implicitly
    const contextPrompt = history.slice(-4).map(m => `${m.role === 'user' ? '小朋友' : '貓博士'}: ${m.text}`).join('\n');
    const finalPrompt = contextPrompt ? `${contextPrompt}\n小朋友: ${newMessage}` : newMessage;

    const result = await chat.sendMessage({
      message: finalPrompt
    });

    return result.text || "貓博士正在思考中... 喵？ (無法取得回應)";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message && error.message.includes('403')) {
      return "這把魔法鑰匙好像失效了... 請檢查一下 API Key 是否正確！ 😿";
    }

    return "噢不！我的魔法連線中斷了，請稍後再試試看！ 😿";
  }
};