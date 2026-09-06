import en from './en.json';
import gu from './gu.json';

export type Language = 'en' | 'gu';
export type Messages = typeof en;

export const catalogs: Record<Language, Messages> = { en, gu };
