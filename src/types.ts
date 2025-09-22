// src/types.ts

// 1. Lignes de service du cabinet
export type ServiceLine =
  | 'TLS'
  | 'GCS'
  | 'LT'
  | 'Advisory'

// 2. Statuts génériques d’une mission
export type MissionStatus =
  | 'pending'
  | 'in_progress'
  | 'done'
  | 'archived'

// 3. Étapes métier d’une mission
export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye'

// 4. Interface Mission enrichie
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

// 5. Statuts possibles d’une facture
export type InvoiceStatus =
  | 'envoyee'
  | 'partiellement_recouvree'
  | 'recouvree'

// 6. Interface Invoice
export interface Invoice {
  id: string
  mission_id: string
  amount: number
  issued_at: string
  status: InvoiceStatus
  created_at: string
}
