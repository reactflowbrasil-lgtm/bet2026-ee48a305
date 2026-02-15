import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import IframeView from "@/components/IframeView";

const Index = () => {
  const [loading, setLoading] = useState(true);

  const handleFinish = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Preloader onFinish={handleFinish} />}
      <IframeView />
    </>
  );
};

export default Index;
