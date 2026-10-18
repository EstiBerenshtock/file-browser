import { useState } from 'react';
import type { FsEntry } from '../lib/types';

interface TreeNodeProps {
  entry: FsEntry;
  selectedPath: string | null;
  onSelect: (entry: FsEntry) => void;
  defaultExpanded?: boolean;
}

type Children = { status: 'idle' } | { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; items: FsEntry[] };

export function TreeNode({ entry, selectedPath, onSelect, defaultExpanded = false }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<Children>({ status: 'idle' });
  const [autoOpened, setAutoOpened] = useState(false);

  const load = async () => {
    if (entry.kind !== 'directory') return;
    setChildren({ status: 'loading' });
    try {
      setChildren({ status: 'ready', items: await entry.getChildren() });
    } catch (e) {
      setChildren({ status: 'error', message: e instanceof Error ? e.message : 'Could not read this folder.' });
    }
  };

  // Open the root folder once, the first time it is shown.
  if (defaultExpanded && !autoOpened) {
    setAutoOpened(true);
    setExpanded(true);
    void load();
  }

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && children.status === 'idle') void load();
  };

  const isDirectory = entry.kind === 'directory';
  const selected = selectedPath === entry.path;

  return (
    <li role="none">
      <div
        className={selected ? 'row row-selected' : 'row'}
        role="treeitem"
        aria-selected={selected}
        aria-expanded={isDirectory ? expanded : undefined}
      >
        {isDirectory ? (
          <button
            type="button"
            className="disclosure"
            aria-label={expanded ? `Collapse ${entry.name}` : `Expand ${entry.name}`}
            onClick={toggle}
          >
            {expanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className="disclosure disclosure-empty" aria-hidden="true" />
        )}
        <button type="button" className="row-label" onClick={() => onSelect(entry)}>
          <span className="row-icon" aria-hidden="true">
            {isDirectory ? '📁' : '📄'}
          </span>
          <span className="row-name">{entry.name || '(unnamed)'}</span>
        </button>
      </div>

      {isDirectory && expanded && (
        <>
          {children.status === 'loading' && <p className="tree-note">Loading…</p>}
          {children.status === 'error' && <p className="tree-note error">{children.message}</p>}
          {children.status === 'ready' && (
            <ul className="tree tree-nested" role="group">
              {children.items.length === 0 && <li className="tree-note">Empty folder</li>}
              {children.items.map((child) => (
                <TreeNode key={child.path} entry={child} selectedPath={selectedPath} onSelect={onSelect} />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
}
