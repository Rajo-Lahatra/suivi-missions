// src/components/InvoicesList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Invoice } from '../types';

interface InvoicesListProps {
  missionId: string;
}

export function InvoicesList({ missionId }: InvoicesListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);
  const [error, setError]         = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState<number>(0);

  // 1. Charger les factures
  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('mission_id', missionId)
      .order('issued_at', { ascending: false });

    if (error) setError(error.message);
    else       setInvoices(data as Invoice[]);
    setLoading(false);
  };

  useEffect(() => {
    if (missionId) fetchInvoices();
  }, [missionId]);

  // 2. Créer une nouvelle facture
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount <= 0) return;
    setLoading(true);

    const { error } = await supabase
      .from('invoices')
      .insert({ mission_id: missionId, amount: newAmount });

    if (error) setError(error.message);
    else {
      setNewAmount(0);
      await fetchInvoices();
    }

    setLoading(false);
  };

  // 3. Supprimer une facture
  const handleDelete = async (id: string) => {
    setLoading(true);

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) setError(error.message);
    else       await fetchInvoices();

    setLoading(false);
  };

  if (loading) return <p>Chargement des factures…</p>;
  if (error)   return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div>
      <h2>Factures</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input
          type="number"
          step="0.01"
          value={newAmount}
          onChange={(e) => setNewAmount(parseFloat(e.target.value))}
          placeholder="Montant (€)"
          disabled={loading}
        />
        <button type="submit" disabled={loading || newAmount <= 0}>
          Créer facture
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {invoices.map((inv) => (
          <li key={inv.id} style={{ marginBottom: 8 }}>
            {inv.amount.toFixed(2)} € – {inv.status} –{' '}
            {new Date(inv.issued_at).toLocaleDateString()}
            <button
              onClick={() => handleDelete(inv.id)}
              disabled={loading}
              style={{ marginLeft: 8 }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
