// Vänstermeny. FEAT-004, FEAT-002. Wireframe 01: Dashboard, Personer, Profiltyper & mallar,
// Dokument, Rapporter, Inställningar, längst ned Hjälp & support.
// Vyer som inte är byggda än är synliga men markerade, i stället för att vara döda länkar.

export type NavView = 'dashboard' | 'personer' | 'profiltyper' | 'dokument' | 'rapporter' | 'installningar';

export interface NavItem {
  id: NavView;
  label: string;
  /** Om vyn finns i appen än. Övriga visar "Kommer i en senare version". */
  available: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', available: true },
  { id: 'personer', label: 'Personer', available: true },
  { id: 'profiltyper', label: 'Profiltyper & mallar', available: false },
  { id: 'dokument', label: 'Dokument', available: false },
  { id: 'rapporter', label: 'Rapporter', available: false },
  { id: 'installningar', label: 'Inställningar', available: false },
];

interface Props {
  active: NavView;
  onSelect: (view: NavView) => void;
}

export function SideNav({ active, onSelect }: Props) {
  return (
    <nav className="sidenav" aria-label="Huvudmeny">
      <div className="sidenav-brand">
        <span className="sidenav-logo" aria-hidden="true">HR</span>
        <span className="sidenav-title">HR Journey</span>
      </div>

      <ul className="sidenav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`sidenav-item${active === item.id ? ' is-active' : ''}${item.available ? '' : ' is-soon'}`}
              aria-current={active === item.id ? 'page' : undefined}
              aria-disabled={item.available ? undefined : true}
              title={item.available ? undefined : 'Kommer i en senare version'}
              onClick={() => { if (item.available) onSelect(item.id); }}
            >
              <span className="sidenav-label">{item.label}</span>
              {!item.available && <span className="sidenav-soon">Snart</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="sidenav-foot">
        <span className="sidenav-help">Hjälp &amp; support</span>
      </div>
    </nav>
  );
}
