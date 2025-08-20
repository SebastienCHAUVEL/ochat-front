<script>
    let { title } = $props();
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<div class="container">
    <li>
        <a
            href=""
            class="chat-title"
            aria-label="accedez à la conversation"
            title="accedez à la conversation">{title}</a
        >
        <button
            type="button"
            class="remove-chat"
            aria-label="supprimez cette conversation"
            title="supprimez cette conversation">x</button
        >
    </li>
    <div class="underline"></div>
</div>

<style>
    li {
        font-size: 1rem;
        padding: 1.5rem 0 0.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    li a {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    button:hover {
        background-color: var(--primary-color);
        color: white;
    }
    .underline {
        border-bottom: 1px solid var(--primary-color);
        margin: 0;
        align-self: flex-start;
        width: 0;
        transition: width 500ms;
    }
    .container:hover .underline {
        width: 100%;
    }
</style>
