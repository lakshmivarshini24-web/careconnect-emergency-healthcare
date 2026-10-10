import { useState, useEffect } from 'react';
import { NotificationItem } from '../types';
import { dataService } from '../services/dataService';

export function useNotifications() {
  const [toasts, setToasts] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const unsub = dataService.subscribeToNotifications((notif: NotificationItem) => {
      if (notif) {
        setToasts(prev => [notif, ...prev.slice(0, 4)]); // Keep last 5 active toasts

        // Auto remove toast after 5 seconds
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== notif.id));
        }, 5000);
      }
    });

    return () => unsub();
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, dismissToast };
}
