import { useEffect, useState } from "react";
import {
  getBranches,
  updateBranch,
  deactivateBranch,
  createBranch,
} from "../services/branches.service";

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getBranches();
    setBranches(data);
    setLoading(false);
  }

  async function editBranch(id: string, payload: any) {
    await updateBranch(id, payload);
    await load();
  }

  async function cancelBranch(id: string) {
    await deactivateBranch(id);
    await load();
  }

  async function addBranch(payload: any) {
    await createBranch(payload);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return {
    branches,
    loading,
    editBranch,
    cancelBranch,
    addBranch,
    reload: load,   
  };
}