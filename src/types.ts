// src/types.ts

// 1. Services & workflow
export type ServiceLine =
  | 'TLS'
  | 'GCS'
  | 'LT'
  | 'Advisory';

export type MissionStatus =
  | 'pending'
  | 'in_progress'
  | 'done'
  | 'archived';

export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye';

// 2. Collaborateurs
export type CollaboratorGrade =
  | 'Partner'
  | 'Senior Manager'
  | 'Manager'
  | 'Senior'
  | 'Junior'
  | 'Stagiaire';

export interface Collaborator {
  id: string;
  first_name: string;
  last_name: string;
  grade: CollaboratorGrade;
  email: string;
  created_at: string;
  updated_at: string;
}

// 3. Missions enrichies
export interface Mission {
  id: string;
  title: string;
  client_name: string;
  description: string | null;
  service: ServiceLine;
  stage: MissionStage;
  situation_state: string;
  situation_actions: string;
  honoraires: number;
  status: MissionStatus;
  due_date: string | null;
  partner_id: string | null;
  created_at: string;
  updated_at: string;

  // embed 1-to-1 via partner_id
  partner?: Collaborator;

  // embed many-to-many via mission_collaborators table
  mission_collaborators?: Array<{
    collaborator: Collaborator;
  }>;
}

// 4. Factures & paiements
export type InvoiceStatus =
  | 'envoyee'
  | 'partiellement_recouvree'
  | 'recouvree';

export interface Invoice {
  id: string;
  mission_id: string;
  amount: number;
  issued_at: string;
  status: InvoiceStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  paid_amount: number;
  paid_at: string;
  created_at: string;
}
