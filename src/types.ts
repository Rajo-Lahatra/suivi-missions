// src/types.ts

// Représente une mission
export interface Mission {
  id: string
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'done' | 'archived'
  due_date: string | null
  user_id: string
  created_at: string
  updated_at: string
}

// Etat possible d’une facture
export type InvoiceStatus =
  | 'envoyee'
  | 'partiellement_recouvree'
  | 'recouvree'

// Représente une facture liée à une mission
export interface Invoice {
  id: string           // Identifiant de la facture
  mission_id: string   // Clé étrangère vers la mission
  amount: number       // Montant facturé
  issued_at: string    // Date d’émission (YYYY-MM-DD)
  status: InvoiceStatus
  created_at: string   // Timestamp de création
}
