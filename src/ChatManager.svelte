<script>
    import Icon from "@iconify/svelte";
    import ChatListItem from "./ChatListItem.svelte";
    import { onMount } from "svelte";
    import { currentConversation, conversationToDelete } from "./state.svelte";

    const urlPocketbaseConversation =
        "http://127.0.0.1:8090/api/collections/ochat_conversation/records";

    let addChat = $state(false);
    let openBurger = $state(false);
    let newTitle = $state();
    let conversations = $state([]);

    const { apiKey } = $props();

    $effect(() => {
        if (conversationToDelete.id) {
            fillConversations();
        }
    });

    async function addConversation(event) {
        event.preventDefault();

        let newConversation = {
            title: newTitle,
            user_token: apiKey,
        };
        const savedConversation = await saveConversation(newConversation);
        //If saving is complete we add the question formated by pocketbase else, we add the initial question to continue the chat even if the saving fail
        conversations = [
            savedConversation || newConversation,
            ...conversations,
        ];
        currentConversation.id = conversations[0].id;
        newTitle = "";
    }

    async function saveConversation(conversationToSave) {
        try {
            const response = await fetch(urlPocketbaseConversation, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(conversationToSave),
            });
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de l'enregistrement du message: ${response.status}`,
                );
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getConversations() {
        try {
            const filter = `(user_token='${apiKey}')`;
            const response = await fetch(
                `${urlPocketbaseConversation}?filter=${filter}`,
            );
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la récupération des conversations: ${response.status}`,
                );
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function fillConversations() {
        const data = await getConversations();
        if (data !== null) {
            conversations = data.items.reverse();
            if (conversations.length === 0) {
                currentConversation.id = "empty";
                console.log(currentConversation.id);
                console.log("tableau vide");
            }
        }
    }
    onMount(async () => {
        if (apiKey) {
            await fillConversations();
            if (conversations.length > 0) {
                currentConversation.id = conversations[0].id;
            }
        }
    });
</script>

<div class={openBurger ? "manager-container offset" : "manager-container"}>
    <button
        class="burger-btn"
        type="button"
        title="ouvrir le gestionnaire des conversations"
        aria-label="ouvrir le gestionnaire des conversations"
        onclick={() => {
            openBurger = !openBurger;
        }}
    >
        <div class="message__btn-icon">
            <Icon
                icon={openBurger
                    ? "mdi:hamburger-menu-back"
                    : "mdi:hamburger-close"}
                width="32"
                height="32"
                style="color: #474350"
            />
        </div>
    </button>
    <aside
        class={openBurger ? "chat-manager open" : "chat-manager"}
        aria-label="gestionnaire des conversations"
        aria-hidden={!openBurger}
    >
        <div>
            <h2>Historique</h2>
            <ul class="chat-list">
                <div class="conversation">
                    {#each conversations as conversation}
                        <ChatListItem {conversation} {conversations} />
                    {/each}
                </div>
            </ul>
        </div>
        <section class="add-section">
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <p
                class="add-chat"
                aria-label="Ajouter une nouvelle conversation"
                title="Ajouter une nouvelle conversation"
                onclick={() => (addChat = !addChat)}
            >
                <span class="chat-title">Nouveau chat</span>
                <button type="button">+</button>
            </p>
            {#if addChat}
                <form onsubmit={addConversation}>
                    <input
                        type="text"
                        placeholder="Saisissez un titre"
                        required
                        bind:value={newTitle}
                    />
                </form>
            {/if}
        </section>
    </aside>
</div>

<style>
    .manager-container {
        margin-left: 0;
        transition: margin-left 0.5s ease;
    }
    .manager-container.offset {
        margin-left: 25dvw;
    }
    .burger-btn {
        display: block;
        position: fixed;
        top: 1.5rem;
        z-index: 10;
        padding: 0;
        margin-left: 3px;
        transform: translateX(0);
        transition: transform 0.5s ease;
    }
    .chat-manager {
        height: 100dvh;
        position: fixed;
        z-index: 5;
        background-color: white;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 25dvw;
        justify-content: space-between;
        padding: 1.5rem 1rem;
        color: var(--primary-color);
        transition: all 0.5s ease;
        overflow: hidden;
        transform: translateX(-100%);
    }
    .chat-manager.open {
        transform: translateX(0);
    }
    aside ul {
        overflow-y: auto;
    }
    h2 {
        text-align: center;
        padding-bottom: 1.5rem;
    }
    h2::after {
        content: "";
        display: block;
        width: 25%;
        border-bottom: 3px solid var(--primary-color);
        margin: auto;
    }
    .conversation {
        border-right: 2px solid var(--primary-color);
        padding-right: 1rem;
    }
    .add-chat,
    aside form {
        margin: 1.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .add-chat {
        font-size: 1.5rem;
    }
    .add-chat:hover {
        cursor: pointer;
    }
    .add-chat:hover .chat-title {
        font-weight: bold;
    }
    aside button {
        height: 1.5rem;
        font-size: 1rem;
    }
    aside button:hover {
        background-color: var(--primary-color);
        color: white;
    }
    aside input {
        width: 100%;
    }
    @media (max-width: 930px) {
        .manager-container {
            max-width: 35dvw;
        }
        .manager-container.offset {
            margin-left: 0;
        }
        .manager-container.offset .burger-btn {
            transform: translateX(calc(35dvw - 4px));
        }
        .chat-manager {
            width: 35dvw;
        }
    }
    @media (max-width: 728px) {
        .manager-container {
            max-width: 80dvw;
        }
        .manager-container.offset .burger-btn {
            transform: translateX(calc(80dvw - 4px));
        }
        .chat-manager {
            width: 80dvw;
        }
    }
</style>
