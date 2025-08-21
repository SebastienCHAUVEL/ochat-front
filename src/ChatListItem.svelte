<script>
    import { currentConversation, conversationToDelete } from "./state.svelte";

    const { conversation , conversations} = $props();

    const urlPocketbaseConversation =
        "http://127.0.0.1:8090/api/collections/ochat_conversation/records";

    function handleConversationSelected(event) {
        event.preventDefault();
        currentConversation.id = conversation.id;
    }
    async function handleDelete() {
        const isDeleted = await deleteConversation(conversation.id);
        if (isDeleted) {
            conversationToDelete.id = conversation.id;
            if(conversationToDelete.id === currentConversation.id) {
                currentConversation.id = conversations[0].id;
            }
        }// //!TODO!\\ else
    }

    async function deleteConversation(id) {
        try {
            const response = await fetch(`${urlPocketbaseConversation}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la suppression de la conversation: ${response.status}`,
                );
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<div
    class=" class={currentConversation.id === conversation.id
        ? ' container selected'
        : ' container'}"
>
    <li>
        <a
            href=""
            class="chat-title"
            aria-label="accedez à la conversation"
            title="accedez à la conversation"
            onclick={handleConversationSelected}>{conversation.title}</a
        >
        <button
            type="button"
            class="remove-chat"
            aria-label="supprimez cette conversation"
            title="supprimez cette conversation"
            onclick={handleDelete}>x</button
        >
    </li>
    <div class="underline" aria-hidden="true"></div>
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
    .selected .underline {
        width: 80%;
    }
    .container:hover .underline {
        width: 100%;
    }
</style>
