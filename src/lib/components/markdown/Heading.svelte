<script lang="ts">
  import { getContext, type Snippet } from "svelte";

  interface Props {
    depth: number;
    raw: string;
    text: string;
    children?: Snippet;
  }

  const { depth, raw, text, children }: Props = $props();

  const { slug, getOptions } = getContext({}) ?? {};
  const options = getOptions?.() ?? {};

  const id = $derived(options.headerIds ? options.headerPrefix + slug(text) : undefined);
</script>

{#if depth === 1}
  <h1 {id}>{@render children?.()}</h1>
{:else if depth === 2}
  <h2 {id}>{@render children?.()}</h2>
{:else if depth === 3}
  <h3 {id}>{@render children?.()}</h3>
{:else if depth === 4}
  <h4 {id}>{@render children?.()}</h4>
{:else if depth === 5}
  <h5 {id}>{@render children?.()}</h5>
{:else if depth === 6}
  <h6 {id}>{@render children?.()}</h6>
{:else}
  {raw}
{/if}
