<script>

    let {title} = $props();

</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<li>
    <a href="" class="chat-title" aria-label="accedez à la conversation"
        >{title}</a
    >
    <button
        type="button"
        class="remove-chat"
        aria-label="supprimez cette conversation">x</button
    >
</li>

<style>
    li {
        font-size: 1rem;
        margin: 1.5rem 0;
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
</style>
