<script lang="ts">
  import type { Note } from '$lib/stores/notes';

  export let note: Note;
  export let selected = false;
</script>

<article class="note-card" class:selected>
  <div class="meta">
    <span class="folder">{note.folder}</span>
    <button class="pin" type="button" aria-label="Toggle pin">{note.pinned ? 'Pinned' : 'Pin'}</button>
  </div>

  <h3>{note.title}</h3>
  <p>{note.body}</p>

  <div class="footer">
    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
    <span>{note.pinned ? 'Pinned' : 'Draft'}</span>
  </div>
</article>

<style>
  .note-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-5);
    min-height: 180px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-1);
    transition: box-shadow var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease), transform var(--duration-fast) var(--ease);
  }

  .note-card:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }

  .note-card.selected {
    border-color: var(--select);
    box-shadow: 0 0 0 1px var(--select);
  }

  .meta,
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    font-size: 0.75rem;
    color: var(--text-soft);
  }

  .folder {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 999px;
    background: var(--card-muted);
    border: 1px solid var(--line);
    font-weight: 700;
  }

  .pin {
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 4px 8px;
    background: transparent;
    cursor: pointer;
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: var(--text-soft);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
