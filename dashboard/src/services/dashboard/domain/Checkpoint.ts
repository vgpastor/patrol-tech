export interface Checkpoint {
  id: string;
  identifier?: string;
  name: string;
  latitude?: number;
  longitude?: number;
  category: string;
  tags: string[];
}
