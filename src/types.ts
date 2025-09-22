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

// src/types.ts

export type ServiceLine = 'TLS' | 'GCS' | 'LT' | 'Advisory';

export type MissionStatus = 'pending' | 'in_progress' | 'done' | 'archived';

export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye';

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
  created_at: string;
  updated_at: string;
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
