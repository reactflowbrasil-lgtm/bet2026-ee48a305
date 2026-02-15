import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://lmwz0k.com/?pid=4187742570";

const IframeView = () => {
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";

    supabase.from("access_logs").insert({
      user_agent: navigator.userAgent.slice(0, 500),
      device_type: deviceType,
      referrer: document.referrer || null,
    }).then(() => {});
  }, []);

  return (
    <iframe
      src={SITE_URL}
      className="fixed inset-0 h-full w-full border-0"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      loading="lazy"
      title="Plataforma Pagante"
      allow="fullscreen"
    />
  );
};

export default IframeView;
