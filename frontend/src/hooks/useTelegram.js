import { useEffect, useState } from 'react';

const tg = window.Telegram?.WebApp;

export function useTelegram() {
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      setIsExpanded(tg.isExpanded);
      
      const initDataUnsafe = tg.initDataUnsafe;
      if (initDataUnsafe?.user) {
        setUser(initDataUnsafe.user);
      }

      tg.onEvent('viewportChanged', () => {
        setIsExpanded(tg.isExpanded);
      });
    }
  }, []);

  const close = () => {
    if (tg) {
      tg.close();
    }
  };

  const showMainButton = (text, onClick) => {
    if (tg?.MainButton) {
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (tg?.MainButton) {
      tg.MainButton.hide();
      tg.MainButton.offClick();
    }
  };

  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback);
    } else {
      const result = window.confirm(message);
      callback(result);
    }
  };

  const hapticFeedback = (type = 'impact') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  const showPopup = (params) => {
    if (tg) {
      tg.showPopup(params);
    }
  };

  const sendData = (data) => {
    if (tg) {
      tg.sendData(JSON.stringify(data));
    }
  };

  return {
    tg,
    user,
    isExpanded,
    close,
    showMainButton,
    hideMainButton,
    showAlert,
    showConfirm,
    hapticFeedback,
    showPopup,
    sendData,
    initData: tg?.initData || '',
    themeParams: tg?.themeParams || {},
    isReady: !!tg
  };
}