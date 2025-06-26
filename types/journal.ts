export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'DAILY' | 'FREEFORM' | 'REVIEW';
  date: string;
  mood: 'HAPPY' | 'SAD' | 'NEUTRAL' | 'ANGRY' | 'EXCITED' | null;
  tags: string[];
  templateUsed: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartialJournalEntry {
  id: string;
  title: string;
  date: string;
  type: 'DAILY' | 'FREEFORM' | 'REVIEW';
  mood: 'HAPPY' | 'SAD' | 'NEUTRAL' | 'ANGRY' | 'EXCITED' | null;
  createdAt: string;
}

export interface JournalEntryForm {
  title: string;
  content: string;
  type: 'DAILY' | 'FREEFORM' | 'REVIEW';
  date: string;
  mood: 'HAPPY' | 'SAD' | 'NEUTRAL' | 'ANGRY' | 'EXCITED' | null;
  tags: string[];
} 