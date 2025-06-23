// hooks/useProfitLossData.ts
import { useEffect, useState } from 'react';
import { IMessage } from '@stomp/stompjs';
import { awaitUntilConnected, getStompClient, onStompReconnect } from './stompClient';

interface ProfitLossData {
  pnl: number;
  total: number;
  [key: string]: any;
}

export const useProfitLoss = () => {
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [subRef, setSubRef] = useState<any>(null);

  const subscribe = async () => {
    const client = getStompClient();
    if (!client || !client.connected) return;

    client.publish({ destination: '/app/trade-live-profit-loss', body: '{}' });

    const subscription = client.subscribe('/user/queue/trade-live-profit-loss', (message: IMessage) => {
      const payload = JSON.parse(message.body);
    //   console.log(payload);
      
      setData(payload);
    });

    setSubRef(subscription);
  };

  useEffect(() => {
    let unsubscribeReconnect: () => void;

    const init = async () => {
      await awaitUntilConnected();
      await subscribe();
      unsubscribeReconnect = onStompReconnect(() => {
        subRef?.unsubscribe?.();
        subscribe();
      });
    };

    init();

    return () => {
      subRef?.unsubscribe?.();
      unsubscribeReconnect?.();
    };
  }, []);

  return data;
};
