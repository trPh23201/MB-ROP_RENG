import { IoniconsName } from '../../../infrastructure/icons';

export interface UtilityItemData {
  id: string;
  label: string;
  icon: IoniconsName;
  route?: string;
  badge?: number;
}

export interface MenuItemData {
  id: string;
  label: string;
  icon: IoniconsName;
  isDestructive?: boolean;
  action?: () => void;
  route?: string;
}

export interface MenuSectionData {
  title?: string;
  items: MenuItemData[];
}