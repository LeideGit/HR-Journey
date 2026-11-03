import type { ReactNode } from 'react';
import { SideNav, type NavView } from './SideNav';
import './layout.css';

// Persistent layout: vänstermeny alltid synlig, innehållet byts till höger. FEAT-004, FEAT-002.
interface Props {
  active: NavView;
  onSelect: (view: NavView) => void;
  children: ReactNode;
}

export function AppShell({ active, onSelect, children }: Props) {
  return (
    <div className="shell">
      <SideNav active={active} onSelect={onSelect} />
      <div className="shell-content">{children}</div>
    </div>
  );
}
