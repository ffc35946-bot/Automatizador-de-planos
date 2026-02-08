
import { GoogleGenAI } from "@google/genai";
import type { LogEntry } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("A variável de ambiente API_KEY não está definida. Os recursos de IA serão desativados.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getTroubleshootingSteps = async (log: LogEntry): Promise<string> => {
  if (!API_KEY) {
    return "A solução de problemas por IA está desativada. Por favor, configure sua API_KEY.";
  }
  
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

    **Formato de Resposta Exemplo:**

    ### Entendendo o Erro "Usuário Não Encontrado"

    Este erro geralmente significa que, quando nosso sistema tentou ativar o plano, não conseguiu encontrar uma conta de usuário com o e-mail \`${log.userEmail}\` no banco de dados da sua aplicação SaaS.

    ### Passos Recomendados para Solução de Problemas

    1.  **Verifique a Conta do Usuário:**
        *   Faça login no painel de administração da sua aplicação SaaS.
        *   Procure por um usuário com o endereço de e-mail \`${log.userEmail}\`.
        *   **Se não for encontrado:** O usuário pode ter usado um e-mail diferente para o pagamento. Pode ser necessário contatá-lo para confirmar o e-mail da conta e ativar o plano manualmente.
        *   **Se for encontrado:** Verifique se há erros de digitação no endereço de e-mail entre a plataforma de checkout e seu banco de dados.

    2.  **Verifique o Endpoint da sua API SaaS:**
        *   Vá para a página de **Integrações** nesta ferramenta.
        *   Certifique-se de que a URL do "Endpoint da API para Ativação de Plano" está correta e que aponta para o endpoint de gerenciamento de usuários correto.

    3.  **Revise as Permissões da Chave de API:**
        *   Confirme que a chave de API que você forneceu tem as permissões necessárias para pesquisar e atualizar contas de usuário em seu SaaS.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || 'Não foi possível obter uma resposta do assistente de IA.';
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `Ocorreu um erro ao tentar contatar o assistente de IA. Por favor, verifique o console para mais detalhes. Erro: ${error.message}`;
  }
};
   