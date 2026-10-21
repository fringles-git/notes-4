<script lang="ts">
  export let active: 'notes' | 'library' | 'search' | 'settings' = 'notes';

  const items = [
    { id: 'notes', label: 'Notes' },
    { id: 'library', label: 'Library' },
    { id: 'search', label: 'Search' },
    { id: 'settings', label: 'Settings' }
  ] as const;
</script>

<nav class="dock" aria-label="Main navigation">
  <div class="dock-shell">
    {#each items as item}
      <button class:active={active === item.id} class="dock-item" type="button">
        <span>{item.label}</span>
      </button>
    {/each}
  </div>
  <button class="fab" type="button" aria-label="Create note">+</button>
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
    border-radius: var(--radius-lg);
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid var(--line);
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(18px);
  }

  .dock-item {
    flex: 1 1 0;
    min-width: 0;
    height: var(--dock-height);
    border-radius: var(--radius-sm);
    color: var(--text-soft);
    font-weight: 700;
    background: transparent;
    transition: background var(--duration-base) var(--ease), color var(--duration-base) var(--ease);
    cursor: pointer;
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
    border-radius: var(--radius-lg);
    background: var(--accent);
    color: var(--accent-ink);
    font-size: 2rem;
    font-weight: 700;
    box-shadow: var(--shadow-2);
    cursor: pointer;
  }
</style>
