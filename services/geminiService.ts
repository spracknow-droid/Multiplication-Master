
import { GoogleGenAI, Type } from "@google/genai";
import { GameResult, AIAnalysis } from "../types";

export const getGameAnalysis = async (result: GameResult): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    8세 어린이가 구구단 게임을 마쳤습니다. 다음 결과를 분석해서 다정하고 귀여운 한국어 피드백을 주세요.
    점수: ${result.score}
    맞힌 개수: ${result.correctCount}
    최고 연속 정복(콤보): ${result.maxCombo}
    틀린 문제: ${result.mistakes.length > 0 ? result.mistakes.join(', ') : '없음'}

    다음 3가지를 포함해 주세요 (반드시 한국어로 작성):
    1. title: 아이의 실력을 칭찬하는 귀여운 칭호 (예: 구구단 요정, 계산 천재 등)
    2. summary: 아이의 강점을 칭찬하는 따뜻한 격려 (이모지 포함)
    3. advice: 앞으로 더 잘하기 위한 아주 쉽고 친절한 꿀팁 하나
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["title", "summary", "advice"],
          propertyOrdering: ["title", "summary", "advice"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error) {
    console.error("AI 분석 실패:", error);
  }

  return {
    title: "구구단 꿈나무",
    summary: "우와! 정말 열심히 노력했네요. 다음엔 더 멋진 기록을 세울 수 있을 거예요! ✨",
    advice: "자주 틀리는 구구단은 노래로 불러보면 더 잘 외워져요!"
  };
};
