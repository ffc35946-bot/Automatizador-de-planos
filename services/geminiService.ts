
import { GoogleGenAI } from "@google/genai";
import type { LogEntry } from '../types';

export const getTroubleshootingSteps = async (log: LogEntry): Promise<string> => {
  // Acesso seguro ao process.env para evitar erros de deploy em ambientes sem global process
  const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

  if (!API_KEY) {
    return "A solução de problemas por IA está desativada. Por favor, configure sua API_KEY no ambiente.";
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Você é um engenheiro de suporte especialista para uma plataforma de automação SaaS.
    O proprietário de um micro-SaaS encontrou uma falha na ativação de um plano. Sua tarefa é fornecer etapas claras e acionáveis para a solução de problemas.

    **Detalhes do Problema:**
    - **Plataforma de Checkout:** ${log.platform}
    - **E-mail do Usuário:** ${log.userEmail}
    - **Plano SaaS:** ${log.plan}
    - **Data/Hora:** ${log.timestamp.toISOString()}
    - **Mensagem de Erro:** "${log.error}"

    **Instruções:**
    1.  Analise a mensagem de erro e o contexto.
    2.  Forneça uma explicação breve e fácil de entender da causa provável.
    3.  Ofereça uma lista de 3 a 5 soluções concretas, passo a passo, que o proprietário do SaaS deve seguir para resolver o problema.
    4.  Formate a saída em Markdown limpo. Use títulos, texto em negrito e listas para melhorar a legibilidade.
    5.  Mantenha um tom prestativo e encorajador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || 'Não foi possível obter uma resposta do assistente de IA.';
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return `Ocorreu um erro ao tentar contatar o assistente de IA. Erro: ${error.message}`;
  }
};
