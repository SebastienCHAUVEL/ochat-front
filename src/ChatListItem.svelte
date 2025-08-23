<script>
    import {
        currentConversation,
        conversationToDelete,
        isModifying,
    } from "./state.svelte";
    import Icon from "@iconify/svelte";

    let { conversation, newTitle = $bindable(), onSubmit, onSelect} = $props();

    const urlPocketbaseConversation =
        "http://127.0.0.1:8090/api/collections/ochat_conversation/records";
    let modifyButtonHover = $state(false);
    let removeButtonHover = $state(false);
    let submitButtonHover = $state(false);
    let cancelButtonHover = $state(false);

    function handleConversationSelected(event) {
        event.preventDefault();
        currentConversation.id = conversation.id;
        currentConversation.title = conversation.title;

        onSelect();
    }
    async function handleDelete() {
        const isDeleted = await deleteConversation(conversation.id);
        if (isDeleted) {
            conversationToDelete.status = false;
        }
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
    class={currentConversation.id === conversation.id
        ? " container selected"
        : " container"}
>
    {#if isModifying.status && isModifying.id === conversation.id}
        <form onsubmit={onSubmit}>
            <input type="text" bind:value={newTitle} autofocus />
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <button
                type="button"
                title="annuler"
                aria-label="annuler"
                onclick={() => {
                    isModifying.status = false;
                }}
                onmouseover={() => {
                    cancelButtonHover = true;
                }}
                onmouseleave={() => {
                    cancelButtonHover = false;
                }}
            >
                <Icon
                    icon={cancelButtonHover
                        ? "clarity:remove-solid"
                        : "clarity:remove-line"}
                    width="24"
                    height="24"
                    style="color: #474350"
                />
            </button>
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <button
                type="submit"
                title="valider"
                aria-label="valider"
                onmouseover={() => {
                    submitButtonHover = true;
                }}
                onmouseleave={() => {
                    submitButtonHover = false;
                }}
            >
                <Icon
                    icon={submitButtonHover ? "el:ok-sign" : "el:ok-circle"}
                    width="24"
                    height="24"
                    style="color: #474350"
                />
            </button>
        </form>
    {:else}
        <li>
            {#if conversationToDelete.status && conversationToDelete.id === conversation.id}
                <span>Êtes-vous sûr ?</span>
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <button
                    type="button"
                    title="annuler"
                    aria-label="annuler"
                    onclick={() => {
                        conversationToDelete.status = false;
                    }}
                    onmouseover={() => {
                        cancelButtonHover = true;
                    }}
                    onmouseleave={() => {
                        cancelButtonHover = false;
                    }}
                >
                    <Icon
                        icon={cancelButtonHover
                            ? "clarity:remove-solid"
                            : "clarity:remove-line"}
                        width="24"
                        height="24"
                        style="color: #474350"
                    />
                </button>
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <button
                    type="button"
                    title="Supprimez définitivement cette conversation"
                    aria-label="Supprimez définitivement cette conversation"
                    onmouseover={() => {
                        submitButtonHover = true;
                    }}
                    onmouseleave={() => {
                        submitButtonHover = false;
                    }}
                    onclick={handleDelete}
                >
                    <Icon
                        icon={submitButtonHover ? "el:ok-sign" : "el:ok-circle"}
                        width="24"
                        height="24"
                        style="color: #474350"
                    />
                </button>
            {:else}
                <a
                    href=""
                    class="chat-title"
                    aria-label="accedez à la conversation"
                    title="accedez à la conversation"
                    onclick={handleConversationSelected}>{conversation.title}</a
                >
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <button
                    type="button"
                    aria-label="modifier le titre"
                    title="modifier le titre"
                    onclick={() => {
                        isModifying.status = true;
                        isModifying.id = conversation.id;
                        newTitle = conversation.title;
                    }}
                    onmouseover={() => {
                        modifyButtonHover = true;
                    }}
                    onmouseleave={() => {
                        modifyButtonHover = false;
                    }}
                >
                    <Icon
                        icon={modifyButtonHover
                            ? "fluent:pen-dismiss-20-filled"
                            : "fluent:pen-dismiss-20-regular"}
                        width="24"
                        height="24"
                        style="color: #474350"
                    />
                </button>
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <button
                    type="button"
                    class="remove-chat"
                    aria-label="supprimez cette conversation"
                    title="supprimez cette conversation"
                    onclick={() => {
                        conversationToDelete.status = true;
                        conversationToDelete.id = conversation.id;
                    }}
                    onmouseover={() => {
                        removeButtonHover = true;
                    }}
                    onmouseleave={() => {
                        removeButtonHover = false;
                    }}
                >
                    <Icon
                        icon={removeButtonHover
                            ? "mdi:chat-remove"
                            : "mdi:chat-remove-outline"}
                        width="24"
                        height="24"
                        style="color: #474350"
                    />
                </button>
            {/if}
        </li>
    {/if}
    <div
        class={(isModifying.status && isModifying.id === conversation.id) ||
        (conversationToDelete.status &&
            conversationToDelete.id === conversation.id)
            ? "leave-underline"
            : "underline"}
        aria-hidden="true"
    ></div>
</div>

<style>
    li {
        font-size: 1rem;
        padding-top: 1.5rem;
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
    li span {
        flex: 1;
        white-space: nowrap;
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .selected li a {
        font-weight: 600;
    }
    .selected li a:hover {
        font-weight: bold;
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
    form {
        font-size: 1rem;
        padding-top: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    form input {
        flex: 1;
        white-space: nowrap;
        width: 60%;
    }
</style>
