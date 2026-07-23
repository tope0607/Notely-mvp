import { SupportedShowId } from '../../shared/constants';

export interface ShowAdapter {
  /** Strips show-specific noise (episode numbers, prefixes) before
   *  generic fuzzy matching runs. */
  normalizeTitle: (rawTitle: string) => string;
}

const passthrough: ShowAdapter = {
  normalizeTitle: (t) => t,
};

export const SHOW_ADAPTERS: Record<SupportedShowId, ShowAdapter> = {
  'lex-fridman': passthrough, // TODO(TOP-25): replace with real adapter
  'huberman-lab': passthrough,
  'all-in': passthrough,
  'tim-ferriss': passthrough,
  'the-daily': passthrough,
};

export function getShowAdapter(showId: string): ShowAdapter {
  return (SHOW_ADAPTERS as Record<string, ShowAdapter>)[showId] ?? passthrough;
}





