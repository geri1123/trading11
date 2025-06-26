import { useEffect, useRef, useState } from 'react';
import { IMessage } from '@stomp/stompjs';
import { awaitUntilConnected, getStompClient, onStompReconnect } from './stompClient';

interface TopWidgetData {
  // Adjust these fields to match the actual payload shape
  username: string;
  balance: number;
  trades: number;
  [key: string]: any;
}

export const useTopWidgetData = () => {
  const [data, setData] = useState<TopWidgetData | null>(null);
  const subRef = useRef<any>(null);
  const isMounted = useRef(true);

  const subscribe = async () => {
    await awaitUntilConnected();

    const client = getStompClient();
    if (!client?.connected) return;

    client.publish({
      destination: '/app/user-live-top-widget', // Optional if your backend requires trigger
      body: '{}',
    });

    subRef.current = client.subscribe('/user/queue/user-live-top-widget', (message: IMessage) => {
      if (!isMounted.current) return;
      const payload = JSON.parse(message.body);
      setData(payload);
    });
  };

  useEffect(() => {
    isMounted.current = true;
    let unsubscribeReconnect: () => void;

    const init = async () => {
      await awaitUntilConnected();
      await subscribe();

      unsubscribeReconnect = onStompReconnect(() => {
        subRef.current?.unsubscribe?.();
        subscribe();
      });
    };

    init();

    return () => {
      isMounted.current = false;
      subRef.current?.unsubscribe?.();
      unsubscribeReconnect?.();
    };
  }, []);

  return data;
};
