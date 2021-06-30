import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { GATrackingCode } from '../config';

const useGoogleAnalytics = () => {
  const history = useHistory();
  useLayoutEffect(() => {
    if (!GATrackingCode) {
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GATrackingCode}`;
    script.async = true;
    document.body.appendChild(script);
    window.gtag('config', GATrackingCode);
  }, []);

  useEffect(() => {
    return history?.listen((location) => {
      window?.gtag('set', 'page', location.pathname + location.search);
      window?.gtag('send', 'pageview');
    });
  }, [history]);
};

export default useGoogleAnalytics;

export const useGaEvent = (eventName: string) => {
  return useCallback(
    (args?: Record<string, any>) => {
      window.gtag('event', eventName, args);
    },
    [eventName],
  );
};
