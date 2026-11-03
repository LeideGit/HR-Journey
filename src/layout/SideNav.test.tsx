import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SideNav, NAV_ITEMS } from './SideNav';

// Wireframe 01 (vänstermeny), FEAT-004, FEAT-002.

afterEach(() => cleanup());

describe('SideNav', () => {
  it('visar alla sex menypunkter från wireframe 01 i rätt ordning', () => {
    render(<SideNav active="dashboard" onSelect={() => {}} />);
    const labels = screen.getAllByRole('button').map((b) => b.textContent?.replace('Snart', '').trim());
    expect(labels).toEqual(['Dashboard', 'Personer', 'Mallar', 'Dokument', 'Rapporter', 'Inställningar']);
  });

  it('markerar aktiv vy med aria-current', () => {
    render(<SideNav active="personer" onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /Personer/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Dashboard/ })).not.toHaveAttribute('aria-current');
  });

  it('byggda vyer kan väljas', () => {
    const onSelect = vi.fn();
    render(<SideNav active="dashboard" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /Personer/ }));
    expect(onSelect).toHaveBeenCalledWith('personer');
  });

  it('ej byggda vyer är markerade som snart och väljs inte (ingen döda länkar)', () => {
    const onSelect = vi.fn();
    render(<SideNav active="dashboard" onSelect={onSelect} />);
    const soon = screen.getByRole('button', { name: /Rapporter/ });
    expect(soon).toHaveAttribute('aria-disabled', 'true');
    expect(soon).toHaveAttribute('title', 'Kommer i en senare version');
    fireEvent.click(soon);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('Dashboard, Personer och Dokument är byggda', () => {
    expect(NAV_ITEMS.filter((i) => i.available).map((i) => i.id)).toEqual(['dashboard', 'personer', 'dokument']);
  });
});
