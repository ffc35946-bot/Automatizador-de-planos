
import { GoogleGenAI } from "@google/genai";
import type { LogEntry } from '../types';

export const getTroubleshootingSteps = async (log: LogEntry): Promise<string> => {
  // Inicialização segura conforme diretrizes do desenvolvedor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Você é um engenheiro de suporte especialista para uma plataforma de automação SaaS (Plan Automator).
    O proprietário de um micro-SaaS encontrou uma falha na ativação de um plano. Sua tarefa é fornecer etapas claras e acionáveis para a solução de problemas.

    **Detalhes do Problema:**
    - **Plataforma de Checkout:** ${log.platform}
    - **E-mail do Usuário:** ${log.userEmail}
    - **Plano SaaS:** ${log.plan}
    - **Data/Hora:** ${log.timestamp.toLocaleString('pt-BR')}
    - **Mensagem de Erro Técnica:** "${log.error || 'Nenhum erro específico detalhado'}"

    **Instruções de Resposta:**
    1.  Analise o contexto e forneça uma explicação breve da causa provável (ex: erro de autenticação, timeout, mapeamento de plano incorreto).
    2.  Forneça uma lista de 3 a 5 passos práticos para o dono do SaaS resolver o problema.
    3.  Formate a saída em Markdown limpo (use títulos ## e listas).
    4.  Mantenha o tom profissional e focado em soluções.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || 'O assistente de IA processou a solicitação, mas não retornou conteúdo. Verifique os parâmetros.';
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message?.includes("API key not valid")) {
      return "Erro: Chave de API não configurada ou inválida. Por favor, verifique as variáveis de ambiente.";
    }
    return `Ocorreu um erro ao tentar contatar o assistente de IA: ${error.message}`;
  }
};
