<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let active: 'notes' | 'library' | 'search' | 'settings' = 'notes';

  const dispatch = createEventDispatcher();

  const items = [
    { id: 'notes', label: 'Notes' },
    { id: 'library', label: 'Bibliothèque' },
    { id: 'search', label: 'Recherche' },
    { id: 'settings', label: 'Réglages' }
  ] as const;

  function handleSelect(itemId: (typeof items)[number]['id']): void {
    dispatch('select', { id: itemId });
  }

  function handleCreate(): void {
    dispatch('create');
  }
</script>

<nav class="dock" aria-label="Navigation principale">
  <div class="dock-shell">
    {#each items as item}
      <button
        class:active={active === item.id}
        class="dock-item"
        type="button"
        aria-current={active === item.id ? 'page' : undefined}
        on:click={() => handleSelect(item.id)}
      >
        <span>{item.label}</span>
      </button>
    {/each}
  </div>
  <button class="fab" type="button" aria-label="Créer une note" on:click={handleCreate}>+</button>
</nav>

<style>
  .dock {
    position: fixed;
    left: 50%;
    bottom: max(16px, env(safe-area-inset-bottom));
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 12px;
    width: min(92vw, 560px);
    pointer-events: none;
  }

  .dock-shell,
  .fab {
    pointer-events: auto;
  }

  .dock-shell {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    padding: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.62);
    border: 1px solid var(--line);
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(18px);
  }

  .dock-item {
    flex: 1 1 0;
    min-width: 0;
    height: var(--dock-height);
    border-radius: 16px;
    color: var(--text-soft);
    font-weight: 700;
    background: transparent;
    transition: background var(--duration-base) var(--ease), color var(--duration-base) var(--ease), transform var(--duration-fast) var(--ease);
    cursor: pointer;
    font-size: 0.78rem;
  }

  .dock-item.active {
    background: var(--bg-elevated);
    color: var(--text);
    box-shadow: var(--shadow-1);
  }

  .fab {
    display: grid;
    place-items: center;
    width: var(--fab-size);
    height: var(--fab-size);
    border-radius: 20px;
    background: var(--accent);
    color: var(--accent-ink);
    font-size: 2rem;
    font-weight: 700;
    box-shadow: var(--shadow-2);
    cursor: pointer;
  }
</style>
