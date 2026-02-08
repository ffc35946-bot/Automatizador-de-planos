
import React from 'react';
import Card from './Card';

const Settings: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-text-primary">Configurações</h2>
      <Card title="Preferências de Notificação">
        <div className="space-y-4 text-text-secondary">
          <div className="flex items-center justify-between">
            <label htmlFor="email-notifications">Notificações por e-mail para ativações com falha</label>
            <input type="checkbox" id="email-notifications" className="toggle-checkbox" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="slack-notifications">Notificações via Slack para todas as ativações</label>
            <input type="checkbox" id="slack-notifications" className="toggle-checkbox" checked />
          </div>
        </div>
      </Card>
      <Card title="Informações da Conta">
        <p className="text-text-secondary">
            Configurações da conta e informações de faturamento estarão disponíveis aqui em uma futura atualização.
        </p>
      </Card>
    </div>
  );
};

export default Settings;
   