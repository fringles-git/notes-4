<script lang="ts">
  import '#lib/styles/base.css';
  import { onMount } from 'svelte';
  import Button from '#lib/components/Button.svelte';
  import Dock from '#lib/components/Dock.svelte';
  import NoteCard from '#lib/components/NoteCard.svelte';
  import { addNote, deleteNote, notes, sortNotes, togglePin, updateNote, type Note } from '#lib/stores/notes.js';

  type View = 'notes' | 'library' | 'search' | 'settings';

  let activeView: View = 'notes';
  let selectedId: string | null = 'note-1';
  let search = '';
  let darkMode = false;
  let selectedNote: Note | null = null;
  let libraryFolders: string[] = [];
  let filteredNotes: Note[] = [];

  function applyTheme(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('notes-theme', darkMode ? 'dark' : 'light');
  }

  onMount(() => {
    const saved = localStorage.getItem('notes-theme');
    darkMode = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme();
  });

  $: if (typeof document !== 'undefined') {
    applyTheme();
  }

  function makeFreshNote(): void {
    const created = addNote({
      title: 'Nouvelle note',
      body: 'Le système est unique. Les composants partagent les mêmes primitives.',
      folder: 'Boîte de réception'
    });
    selectedId = created.id;
    activeView = 'notes';
  }

  function updateSelectedNote(field: 'title' | 'body', value: string): void {
    if (!selectedId) return;
    updateNote(selectedId, { [field]: value });
  }

  $: orderedNotes = sortNotes($notes);
  $: if (selectedId && !orderedNotes.some((note) => note.id === selectedId)) {
    selectedId = orderedNotes[0]?.id ?? null;
  }
  $: selectedNote = orderedNotes.find((note) => note.id === selectedId) ?? orderedNotes[0] ?? null;
  $: filteredNotes = orderedNotes.filter((note) => {
    const haystack = `${note.title} ${note.body} ${note.folder}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });
  $: libraryFolders = Array.from(new Set(orderedNotes.map((note) => note.folder)));
</script>

<svelte:head>
  <title>Notes</title>
</svelte:head>

<div class="app-shell">
  <header class="topbar">
    <div>
      <p class="eyebrow">Notes</p>
      <h1>Notes</h1>
    </div>

    <div class="header-actions">
      <Button variant="ghost" compact on:click={() => (darkMode = !darkMode)}>
        {darkMode ? 'Clair' : 'Sombre'}
      </Button>
      <Button variant="primary" on:click={makeFreshNote}>Nouveau</Button>
    </div>
  </header>

  <main class="layout">
    {#if activeView === 'notes'}
      <section class="list-panel">
        <div class="panel-head">
          <span>Aujourd’hui</span>
          <span>{orderedNotes.length} notes</span>
        </div>

        <div class="notes-grid">
          {#each orderedNotes as note}
            <button class="card-button" type="button" on:click={() => (selectedId = note.id)}>
              <NoteCard note={note} selected={selectedNote?.id === note.id} />
            </button>
          {/each}
        </div>
      </section>

      <aside class="editor-panel">
        {#if selectedNote}
          <div class="editor-head">
            <span class="folder-badge">{selectedNote.folder}</span>
            <div class="inline-actions">
              <Button variant="ghost" compact on:click={() => togglePin(selectedNote.id)}>
                {selectedNote.pinned ? 'Désépingler' : 'Épingler'}
              </Button>
              <Button variant="danger" compact on:click={() => deleteNote(selectedNote.id)}>Supprimer</Button>
            </div>
          </div>

          <input
            class="title-input"
            value={selectedNote.title}
            aria-label="Titre de la note"
            on:input={(event) => updateSelectedNote('title', event.currentTarget.value)}
          />

          <textarea
            class="body-input"
            aria-label="Contenu de la note"
            value={selectedNote.body}
            on:input={(event) => updateSelectedNote('body', event.currentTarget.value)}
          ></textarea>
        {/if}
      </aside>
    {:else if activeView === 'library'}
      <section class="list-panel full-panel">
        <div class="panel-head">
          <span>Bibliothèque</span>
          <span>{libraryFolders.length} dossiers</span>
        </div>

        <div class="folder-grid">
          {#each libraryFolders as folder}
            <div class="folder-card">
              <span class="folder-dot"></span>
              <div>
                <strong>{folder}</strong>
                <small>{orderedNotes.filter((note) => note.folder === folder).length} notes</small>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {:else if activeView === 'search'}
      <section class="list-panel full-panel">
        <div class="panel-head search-row">
          <span>Recherche</span>
          <span>{filteredNotes.length} résultats</span>
        </div>

        <label class="search-box">
          <span>Rechercher</span>
          <input bind:value={search} placeholder="Rechercher dans Notes" />
        </label>

        <div class="search-results">
          {#each filteredNotes as note}
            <button type="button" class="search-result" on:click={() => { selectedId = note.id; activeView = 'notes'; }}>
              <strong>{note.title}</strong>
              <small>{note.folder}</small>
            </button>
          {/each}
        </div>
      </section>
    {:else}
      <section class="settings-panel full-panel">
        <div class="panel-head">
          <span>Réglages</span>
          <span>App</span>
        </div>

        <div class="settings-list">
          <button type="button" class="settings-item" on:click={() => (darkMode = !darkMode)}>
            <span>Thème</span>
            <strong>{darkMode ? 'Sombre' : 'Clair'}</strong>
          </button>

          <div class="settings-item disabled">
            <span>Langue</span>
            <strong>Français</strong>
          </div>

          <div class="settings-item disabled">
            <span>Version</span>
            <strong>26.10.19.8</strong>
          </div>
        </div>
      </section>
    {/if}
  </main>

  <Dock active={activeView} on:select={(event) => (activeView = event.detail.id)} on:create={makeFreshNote} />
</div>

<style>
  .app-shell {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px 120px;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .eyebrow {
    margin: 0 0 6px;
    color: var(--text-soft);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.7rem;
    font-weight: 800;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 6vw, 3.5rem);
    letter-spacing: -0.05em;
    font-weight: 800;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .list-panel,
  .editor-panel,
  .settings-panel {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 28px;
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(18px);
  }

  .list-panel,
  .settings-panel {
    padding: 18px;
  }

  .full-panel {
    min-height: 420px;
  }

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    font-size: 0.82rem;
    color: var(--text-soft);
    font-weight: 700;
  }

  .search-row {
    margin-bottom: 12px;
  }

  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .card-button {
    width: 100%;
    text-align: left;
    cursor: pointer;
    border: 0;
    background: transparent;
    padding: 0;
  }

  .editor-panel {
    padding: 18px;
    min-height: 480px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .editor-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .folder-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid var(--line);
    padding: 6px 12px;
    font-size: 0.8rem;
    color: var(--text-soft);
    background: rgba(255, 255, 255, 0.25);
  }

  .inline-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .title-input,
  .body-input,
  .search-box input {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.42);
    color: var(--text);
    padding: 14px 16px;
  }

  .title-input {
    font-size: clamp(1.5rem, 4vw, 2.6rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.04em;
  }

  .body-input {
    flex: 1;
    min-height: 300px;
    resize: vertical;
    line-height: 1.6;
  }

  .folder-grid,
  .settings-list,
  .search-results {
    display: grid;
    gap: 12px;
  }

  .folder-card,
  .settings-item,
  .search-result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: rgba(255, 255, 255, 0.26);
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 12px 14px;
    color: var(--text);
  }

  .folder-card {
    justify-content: flex-start;
  }

  .folder-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 6px rgba(244, 197, 66, 0.2);
  }

  .folder-card strong,
  .search-result strong,
  .settings-item strong {
    display: block;
    font-size: 0.96rem;
  }

  .folder-card small,
  .search-result small {
    display: block;
    color: var(--text-soft);
  }

  .search-box {
    display: grid;
    gap: 8px;
    margin-bottom: 14px;
    color: var(--text-soft);
    font-size: 0.85rem;
    font-weight: 700;
  }

  .search-result {
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .settings-item {
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .settings-item.disabled {
    opacity: 0.7;
    cursor: default;
  }

  @media (min-width: 900px) {
    .app-shell {
      padding-top: 32px;
    }

    .layout {
      grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
      gap: 20px;
    }

    .full-panel {
      grid-column: 1 / -1;
    }
  }
</style>
