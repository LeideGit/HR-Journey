// Inloggad användare och roll för topnav. FEAT-001-B2, B4.
// Rollen läses ur user_roles. RLS släpper bara igenom användarens egen rad (migration 20261029110000).
export type AppRole = 'hr' | 'hr_admin';

export interface CurrentUser {
  email: string;
  role: AppRole | null;
}

export const ROLE_LABEL: Record<AppRole, string> = {
  hr: 'HR',
  hr_admin: 'HR-administratör',
};

export function initialsOf(email: string): string {
  const local = email.split('@')[0] ?? '';
  const parts = local.split(/[._-]+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

/** Hämtar den inloggades roll. RLS returnerar bara användarens egen rad, så ingen id behövs. */
export async function fetchRole(
  client: { from: (t: string) => { select: (c: string) => { maybeSingle: () => PromiseLike<{ data: unknown; error: { message: string } | null }> } } },
): Promise<AppRole | null> {
  const res = await client.from('user_roles').select('role').maybeSingle();
  const data = res.data as { role?: AppRole } | null;
  return res.error ? null : (data?.role ?? null);
}
