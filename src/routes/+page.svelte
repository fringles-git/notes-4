<script lang="ts">
  import '$lib/styles/base.css';
  import Button from '$lib/components/Button.svelte';
  import Dock from '$lib/components/Dock.svelte';
  import NoteCard from '$lib/components/NoteCard.svelte';
  import { addNote, createNote, deleteNote, notes, sortNotes, togglePin, updateNote, type Note } from '$lib/stores/notes';

  let selectedId: string | null = 'note-1';

  function makeFreshNote(): void {
    const created = addNote({
      title: 'New note',
      body: 'Single system. Shared primitives. Cleaner state.',
      folder: 'Inbox'
    });
    selectedId = created.id;
  }

  function updateSelectedNote(field: 'title' | 'body', value: string): void {
    if (!selectedId) return;
    const current = $notes.find((note) => note.id === selectedId);
    if (!current) return;
    updateNote(selectedId, { [field]: value });
  }

  $: orderedNotes = sortNotes($notes);
  $: selectedNote = orderedNotes.find((note) => note.id === selectedId) ?? orderedNotes[0] ?? null;

  function selectNote(note: Note): void {
    selectedId = note.id;
  }
</script>

<svelte:head>
  <title>Notes 4</title>
</svelte:head>

<div class="app-shell">
  <header class="topbar">
    <div>
      <p class="eyebrow">Notes 4</p>
      <h1>Unified notes</h1>
    </div>
    <Button variant="primary" on:click={makeFreshNote}>New note</Button>
  </header>

  <main class="layout">
    <section class="list-panel">
      <div class="panel-head">
        <span>Today</span>
        <span>{orderedNotes.length} notes</span>
      </div>

      <div class="notes-grid">
        {#each orderedNotes as note}
          <button class="card-button" type="button" on:click={() => selectNote(note)}>
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
              {selectedNote.pinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button variant="danger" compact on:click={() => deleteNote(selectedNote.id)}>Delete</Button>
          </div>
        </div>

        <input
          class="title-input"
          value={selectedNote.title}
          aria-label="Note title"
          on:input={(event) => updateSelectedNote('title', event.currentTarget.value)}
        />

        <textarea
          class="body-input"
          aria-label="Note body"
          value={selectedNote.body}
          on:input={(event) => updateSelectedNote('body', event.currentTarget.value)}
        ></textarea>
      {/if}
    </aside>
  </main>

  <Dock active="notes" />
</div>

<style>
  .app-shell {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px 120px;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }

  .eyebrow {
    margin: 0 0 4px;
    color: var(--text-soft);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.7rem;
    font-weight: 800;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.05em;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    gap: 24px;
  }

  .list-panel,
  .editor-panel {
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(16px);
  }

  .list-panel {
    padding: 20px;
  }

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 0.85rem;
    color: var(--text-soft);
    font-weight: 700;
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
    padding: 20px;
    min-height: 520px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .editor-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .folder-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid var(--line);
    padding: 6px 10px;
    font-size: 0.8rem;
    color: var(--text-soft);
    background: var(--card-muted);
  }

  .inline-actions {
    display: flex;
    gap: 8px;
  }

  .title-input,
  .body-input {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.72);
    padding: 14px 16px;
    color: var(--text);
  }

  .title-input {
    font-size: clamp(1.5rem, 2vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  .body-input {
    flex: 1;
    min-height: 320px;
    resize: vertical;
    line-height: 1.6;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
