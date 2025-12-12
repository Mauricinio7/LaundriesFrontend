import { useState } from "react";
import { makeCashCut, CashRequest } from "../services/cash.service";

export function useCash() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function generateCut(data: CashRequest) {
    setLoading(true);
    try {
      const res = await makeCashCut(data);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  return { loading, result, generateCut };
}