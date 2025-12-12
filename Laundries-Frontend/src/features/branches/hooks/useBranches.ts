import { useEffect, useState } from "react";
import {
  getBranches,
  updateBranch,
  deactivateBranch,
  createBranch,
} from "../services/branches.service";

type Branch = {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: boolean;
};

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
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
    const newBranch = await createBranch(payload);

    setBranches((prev) => [...prev, newBranch]); 
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