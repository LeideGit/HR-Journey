import { useEffect, useState } from 'react';
import type { QueueItem } from './queue';
import { fetchQueue } from './dataSource';
import { supabase, authConfigured } from '../auth/supabase';

// Hook för arbetskön. Hämtar från Supabase med användarens session (RLS avgör innehållet).
// Om auth inte är konfigurerad returneras status 'unconfigured' och inga fiktiva rader döljs som riktiga.
export type QueueState =
  | { status: 'loading' }
  | { status: 'ready'; items: QueueItem[] }
  | { status: 'error'; message: string }
  | { status: 'unconfigured' };

export function useQueue(): QueueState {
  const [state, setState] = useState<QueueState>(
    authConfigured ? { status: 'loading' } : { status: 'unconfigured' },
  );

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    fetchQueue(supabase as unknown as Parameters<typeof fetchQueue>[0]).then(({ items, error }) => {
      if (!active) return;
      setState(error ? { status: 'error', message: error } : { status: 'ready', items });
    });
    return () => { active = false; };
  }, []);

  return state;
}
