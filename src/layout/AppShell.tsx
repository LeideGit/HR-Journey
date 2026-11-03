import type { ReactNode } from 'react';
import { SideNav, type NavView } from './SideNav';
import { TopNav } from './TopNav';
import type { SearchablePerson } from './search';
import type { AppRole } from '../auth/currentUser';
import './layout.css';

// Persistent layout: topnav och vänstermeny syns på alla inloggade vyer. Wireframe 01.
interface Props {
  active: NavView;
  onSelect: (view: NavView) => void;
  people: SearchablePerson[];
  email: string;
  role: AppRole | null;
  onOpenPerson: (id: string) => void;
  onSignOut: () => void;
  children: ReactNode;
}

export function AppShell({ active, onSelect, people, email, role, onOpenPerson, onSignOut, children }: Props) {
  return (
    <div className="shell">
      <SideNav active={active} onSelect={onSelect} />
      <div className="shell-main">
        <TopNav people={people} email={email} role={role} onOpenPerson={onOpenPerson} onSignOut={onSignOut} />
        <div className="shell-content">{children}</div>
      </div>
    </div>
  );
}
