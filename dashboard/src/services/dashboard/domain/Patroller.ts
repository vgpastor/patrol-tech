import { v4 as uuidv4 } from 'uuid';
import {v4} from "uuid";

export interface Patroller {
  id: string;
  name: string;
  identifier?: string | null;
  email?: string | null;
  phone?: string | null;
}
