import { useRef, useState } from 'react';
import { DetailsPane } from './components/DetailsPane';
import { TreeNode } from './components/TreeNode';
import { directoryFromInput, pickDirectory, supportsDirectoryPicker } from './lib/picker';
import type { DirectoryEntry, FsEntry } from './lib/types';

export function App() {
  const [root, setRoot] = useState<DirectoryEntry | null>(null);
  const [selected, setSelected] = useState<FsEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fallbackInput = useRef<HTMLInputElement>(null);

  const open = (entry: DirectoryEntry | null) => {
    if (!entry) return;
    setRoot(entry);
    setSelected(entry);
    setError(null);
  };

  const choose = async () => {
    if (!supportsDirectoryPicker()) {
      fallbackInput.current?.click();
      return;
    }
    try {
      open(await pickDirectory());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open the folder.');
    }
  };

  return (
    <div className="app">
      <header className="toolbar">
        <button type="button" className="button" onClick={choose}>
          Choose folder…
        </button>
        <span className="toolbar-note">Read-only: nothing is changed, saved or uploaded.</span>
        <input
          ref={fallbackInput}
          type="file"
          className="visually-hidden"
          // Non-standard attribute used by browsers without showDirectoryPicker.
          {...{ webkitdirectory: '' }}
          onChange={(event) => {
            open(directoryFromInput(event.target.files));
            event.target.value = '';
          }}
        />
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <main className="panes">
        <nav className="sidebar" aria-label="Folders and files">
          {root ? (
            <ul className="tree" role="tree">
              <TreeNode
                entry={root}
                selectedPath={selected?.path ?? null}
                onSelect={setSelected}
                defaultExpanded
              />
            </ul>
          ) : (
            <p className="empty">Choose a folder to start browsing.</p>
          )}
        </nav>
        <section className="details" aria-label="Details">
          {selected ? (
            <DetailsPane key={selected.path} entry={selected} />
          ) : (
            <p className="empty">Select a file or folder to see its details.</p>
          )}
        </section>
      </main>
    </div>
  );
}
