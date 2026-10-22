import { useDeferredValue, useState } from 'react';

interface NameFilterProps {
  names: string[];
}

/** Filters a list of file names as you type. Typing stays instant while the list updates in the background. */
export function NameFilter({ names }: NameFilterProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const needle = deferredQuery.trim().toLowerCase();
  const matches = names.filter((name) => name.toLowerCase().includes(needle));

  return (
    <div className="name-filter">
      <label>
        Filter by name
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <ul className={isStale ? 'name-filter-list name-filter-stale' : 'name-filter-list'}>
        {matches.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      {matches.length === 0 && <p className="empty">No matching files.</p>}
    </div>
  );
}
