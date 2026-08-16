export interface User {
  id: string;
  email: string;
  display_name?: string;
  image_retention: 'keep_thumbnail' | 'delete_immediately';
  created_at: string;
}

export type CardCategory = 'shopping' | 'travel' | 'contact' | 'note' | 'task' | 'other';
export type CardStatus = 'processing' | 'ready' | 'failed';
export type CardState = 'active' | 'completed' | 'dismissed';

export interface ExtractedData {
  product_name?: string | null;
  price?: string | null;
  merchant?: string | null;
  url?: string | null;
  event_name?: string | null;
  date?: string | null;
  time?: string | null;
  location?: string | null;
  confirmation_number?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  note_text?: string | null;
  source?: string | null;
  task_description?: string | null;
  due_date?: string | null;
}

export interface Card {
  id: string;
  user_id: string;
  image_path?: string | null;
  thumbnail_path?: string | null;
  status: CardStatus;
  category?: CardCategory | null;
  title: string;
  extracted_data: ExtractedData;
  raw_text?: string | null;
  confidence?: number | null;
  is_sensitive: boolean;
  card_state: CardState;
  action_taken?: string | null;
  actioned_at?: string | null;
  created_at: string;
  updated_at: string;
}
