// src/types.ts

// --- grades possibles pour un collaborateur
export type CollaboratorGrade =
  | 'Partner'
  | 'Senior Manager'
  | 'Manager'
  | 'Senior'
  | 'Junior'
  | 'Stagiaire'

// --- profil d’un collaborateur (jointure sur profiles)
export interface Collaborator {
  id: string
  first_name: string
  last_name: string
  grade: CollaboratorGrade
  created_at: string
  updated_at: string
}

// --- lignes de service pour une mission
export type ServiceLine =
  | 'TLS'
  | 'GCS'
  | 'LT'
  | 'Advisory'

// --- statut générique d’une mission
export type MissionStatus =
  | 'pending'
  | 'in_progress'
  | 'done'
  | 'archived'

// --- étapes métier d’une mission
export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye'

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
  user_id: string
  created_at: string
  updated_at: string

  // <- ajoute cette ligne
  profile?: Collaborator
}

// --- statut d’une facture
export type InvoiceStatus =
  | 'envoyee'
  | 'partiellement_recouvree'
  | 'recouvree'

// --- facture
export interface Invoice {
  id: string
  mission_id: string
  amount: number
  issued_at: string
  status: InvoiceStatus
  created_at: string
}

// --- paiement
export interface Payment {
  id: string
  invoice_id: string
  paid_amount: number
  paid_at: string
  created_at: string
}
