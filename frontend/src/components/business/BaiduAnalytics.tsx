import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    _hmt?: Array<unknown>;
  }
}

const BaiduAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window._hmt !== "undefined" && Array.isArray(window._hmt)) {
      window._hmt.push(["_trackPageview", location.pathname + location.search + location.hash]);
    }
  }, [location]);

  return null;
};

export default BaiduAnalytics;
