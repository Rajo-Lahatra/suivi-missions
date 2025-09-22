// src/components/PaymentsList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Payment } from '../types';

interface PaymentsListProps {
  invoiceId: string;
}

export function PaymentsList({ invoiceId }: PaymentsListProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState<number>(0);

  // Charger les paiements
  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('paid_at', { ascending: false });

    if (error) setError(error.message);
    else       setPayments(data as Payment[]);

    setLoading(false);
  };

  useEffect(() => {
    if (invoiceId) fetchPayments();
  }, [invoiceId]);

  // Créer un paiement
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount <= 0) return;
    setLoading(true);

    const { error } = await supabase
      .from('payments')
      .insert({ invoice_id: invoiceId, paid_amount: newAmount });

    if (error) setError(error.message);
    else {
      setNewAmount(0);
      await fetchPayments();
    }

    setLoading(false);
  };

  if (loading) return <p>Chargement des paiements…</p>;
  if (error)   return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div style={{ marginLeft: 16 }}>
      <h4>Paiements</h4>

      <form onSubmit={handleCreate} style={{ marginBottom: 8 }}>
        <input
          type="number"
          step="0.01"
          value={newAmount}
          onChange={(e) => setNewAmount(parseFloat(e.target.value))}
          placeholder="Montant payé"
          disabled={loading}
        />
        <button type="submit" disabled={loading || newAmount <= 0}>
          Ajouter paiement
        </button>
      </form>

      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {payments.map((p) => (
          <li key={p.id}>
            {p.paid_amount.toFixed(2)} € –{' '}
            {new Date(p.paid_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
