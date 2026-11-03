import { useMemo, useState } from 'react';
import { searchPersons, type SearchablePerson } from './search';
import { ROLE_LABEL, initialsOf, type AppRole } from '../auth/currentUser';

// Topnav enligt wireframe 01: sökruta till vänster, användarmeny till höger.
// Synlig på alla inloggade vyer. FEAT-004, FR-DSRCH-005.

interface Props {
  people: SearchablePerson[];
  email: string;
  role: AppRole | null;
  onOpenPerson: (id: string) => void;
  onSignOut: () => void;
}

export function TopNav({ people, email, role, onOpenPerson, onSignOut }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchPersons(people, query), [people, query]);
  const showResults = query.trim().length >= 2;

  return (
    <header className="topnav">
      <span role="status" className="topnav-env">Fiktiv testmiljö</span>
      <div className="topnav-search">
        <label className="topnav-search-field">
          <span className="sr-only">Sök person</span>
          <input
            type="search"
            placeholder="Sök person (namn, e-post, avdelning, chef…)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-controls="topnav-results"
            aria-expanded={showResults}
          />
        </label>
        {showResults && (
          <ul id="topnav-results" className="topnav-results" role="listbox" aria-label="Sökresultat">
            {results.length === 0 ? (
              <li className="topnav-empty">Inga personer matchar sökningen.</li>
            ) : (
              results.map((p) => (
                <li key={p.id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    className="topnav-result"
                    onClick={() => { setQuery(''); onOpenPerson(p.id); }}
                  >
                    <span className="topnav-result-name">{p.name}</span>
                    <span className="topnav-result-meta">{p.department}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="topnav-user">
        <button type="button" className="topnav-signout" onClick={onSignOut} aria-label="Logga ut">
          Logga ut
        </button>
        <button
          type="button"
          className="topnav-user-btn"
        >
          <span className="topnav-avatar" aria-hidden="true">{initialsOf(email)}</span>
          <span className="topnav-user-text">
            <span className="topnav-user-name">{email}</span>
            <span className="topnav-user-role">{role ? ROLE_LABEL[role] : 'Roll saknas'}</span>
          </span>
        </button>

      </div>
    </header>
  );
}
