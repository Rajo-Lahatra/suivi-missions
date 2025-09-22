// src/types.ts
export interface Mission {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'done' | 'archived';
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}
