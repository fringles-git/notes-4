<script lang="ts">
  import '$lib/styles/base.css';
  import Button from '$lib/components/Button.svelte';
  import Dock from '$lib/components/Dock.svelte';
  import NoteCard from '$lib/components/NoteCard.svelte';
  import { addNote, deleteNote, notes, sortNotes, togglePin, updateNote, type Note } from '$lib/stores/notes';

  let selectedId: string | null = 'note-1';

  function makeFreshNote(): void {
    const created = addNote({
      title: 'Nouvelle note',
      body: 'Le système est unique. Les composants partagent les mêmes primitives.',
      folder: 'Boîte de réception'
    });
    selectedId = created.id;
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

  function selectNote(note: Note): void {
    selectedId = note.id;
  }
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
    <Button variant="primary" on:click={makeFreshNote}>Nouveau</Button>
  </header>

  <main class="layout">
    <section class="list-panel">
      <div class="panel-head">
        <span>Aujourd’hui</span>
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
  </main>

  <Dock active="notes" />
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
  .editor-panel {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 28px;
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(18px);
  }

  .list-panel {
    padding: 18px;
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
  .body-input {
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

  @media (min-width: 900px) {
    .app-shell {
      padding-top: 32px;
    }

    .layout {
      grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
      gap: 20px;
    }
  }
</style>
