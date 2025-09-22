// src/types.ts

// --- line de services
export type ServiceLine =
  | 'TLS'
  | 'GCS'
  | 'LT'
  | 'Advisory'

// --- statuts de mission
export type MissionStatus =
  | 'pending'
  | 'in_progress'
  | 'done'
  | 'archived'

// --- étapes métier
export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye'

// --- collaborateur interne
export type CollaboratorGrade =
  | 'Partner'
  | 'Senior Manager'
  | 'Manager'
  | 'Senior'
  | 'Junior'
  | 'Stagiaire'

export interface Collaborator {
  id: string
  first_name: string
  last_name: string
  grade: CollaboratorGrade
  email: string
  created_at: string
  updated_at: string
}

// --- mission enrichie
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
  collaborator_id: string | null
  created_at: string
  updated_at: string

  // jointure
  collaborator?: Collaborator
}

// --- facturation
export type InvoiceStatus =
  | 'envoyee'
  | 'partiellement_recouvree'
  | 'recouvree'

export interface Invoice {
  id: string
  mission_id: string
  amount: number
  issued_at: string
  status: InvoiceStatus
  created_at: string
}

// --- paiements
export interface Payment {
  id: string
  invoice_id: string
  paid_amount: number
  paid_at: string
  created_at: string
}
