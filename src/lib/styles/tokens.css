<script lang="ts">
  export let variant: 'primary' | 'ghost' | 'danger' = 'primary';
  export let type: 'button' | 'submit' = 'button';
  export let compact = false;
</script>

<button class="button {variant}" class:compact {type} on:click>
  <slot />
</button>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    min-height: 42px;
    padding: 0 16px;
    border-radius: 16px;
    font-weight: 700;
    transition: transform var(--duration-fast) var(--ease), background var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
    cursor: pointer;
  }

  .button:hover {
    transform: translateY(-1px);
  }

  .button:active {
    transform: translateY(0);
  }

  .button.primary {
    background: var(--accent);
    color: var(--accent-ink);
    box-shadow: var(--shadow-1);
  }

  .button.ghost {
    background: rgba(255, 255, 255, 0.46);
    color: var(--text);
    border: 1px solid var(--line);
  }

  .button.danger {
    background: rgba(217, 45, 32, 0.08);
    color: var(--danger);
  }

  .button.compact {
    min-height: 34px;
    padding: 0 12px;
    font-size: 0.88rem;
  }
</style>
