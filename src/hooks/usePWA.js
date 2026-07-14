import { useState, useEffect } from 'react';

// PWA Install hook
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // iOS tekshirish
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.navigator.standalone;
    setIsIOS(ios);
    if (ios && !standalone) setIsInstalled(false);
    if (standalone) setIsInstalled(true);

    // Android install prompt
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (isIOS) { setShowIOSGuide(true); return; }
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setInstallPrompt(null);
  };

  return { installPrompt, isInstalled, isIOS, install, showIOSGuide, setShowIOSGuide };
}

// Push notification hook
export function usePushNotification() {
  const [permission, setPermission] = useState(Notification?.permission || 'default');

  const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const sendLocalNotification = (title, body, url = '/') => {
    if (permission !== 'granted') return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          data: { url },
        });
      });
    } else {
      new Notification(title, { body, icon: '/icon-192.png' });
    }
  };

  return { permission, requestPermission, sendLocalNotification };
}
