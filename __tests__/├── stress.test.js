jest.mock('axios', () => {
    return {
      post: jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          // Aqui definimos o delay (por exemplo, 1.5s)
          setTimeout(() => {
            resolve({ data: { token: 'mockToken', resposta: 'mockada' } });
          }, 1500);
        });
      }),
    };
  });

const mockClient = {
    sendMessage: jest.fn().mockResolvedValue()
  };

const { handleClientMessage } = require('../src/services/messaging');

console.log = jest.fn(); // Desativa logs para o teste
jest.setTimeout(300000); // Timeout maior

describe('Stress test (mockando sendMessageWithToken)', () => {
    it('deve iniciar o bot com !start e processar várias mensagens concorrentes', async () => {
      // 1. Primeira mensagem: "!start"
      await handleClientMessage({
        from: '5511999999000@fake',
        body: '!start',
        type: 'chat'
      }, mockClient);
  
      const MESSAGES_COUNT = 500000;
    
    const fakeMessages = Array.from({ length: MESSAGES_COUNT }, (_, i) => ({
      from: `5511999999${i}@fake`,
      body: `Mensagem de teste ${i}`,
      type: 'chat'
    }));

    const startTime = Date.now();

    await Promise.all(fakeMessages.map(msg => handleClientMessage(msg, mockClient)));

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log(`Processou ${MESSAGES_COUNT} mensagens em ${totalTime} ms.`);
    console.log(`Média de ${totalTime / MESSAGES_COUNT} ms por mensagem.`);

    expect(mockClient.sendMessage).toHaveBeenCalled();

    expect(mockClient.sendMessage).toHaveBeenCalledTimes(MESSAGES_COUNT+1);
  });
});