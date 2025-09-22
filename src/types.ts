// src/types.ts

// Lignes de service du cabinet
export type ServiceLine =
  | 'TLS'
  | 'GCS'
  | 'LT'
  | 'Advisory'

// Statuts génériques d’une mission
export type MissionStatus =
  | 'pending'
  | 'in_progress'
  | 'done'
  | 'archived'

// Étapes métier d’une mission
export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye'

// Mission enrichie
export interface Mission {
  id: string
  title: string
  description: string | null
  service: ServiceLine
  stage: MissionStage
  situation: string
  honoraires: number
  status: MissionStatus
  due_date: string | null
  user_id: string
  created_at: string
  updated_at: string
}

// Statuts possibles d’une facture
export type InvoiceStatus =
  | 'envoyee'
  | 'partiellement_recouvree'
  | 'recouvree'

// Facture liée à une mission
export interface Invoice {
  id: string
  mission_id: string
  amount: number
  issued_at: string
  status: InvoiceStatus
  created_at: string
}

// Paiement rattaché à une facture
export interface Payment {
  id: string
  invoice_id: string
  paid_amount: number
  paid_at: string
  created_at: string
}
