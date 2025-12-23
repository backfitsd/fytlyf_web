export const GA_EVENT = (action: string, params: any = {}) => {
  if (typeof window === "undefined") return;
  if (!(window as any).gtag) return;

  (window as any).gtag("event", action, params);
};
