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
    let msgBtnHover = $state(false);
    let displayAllConv = $state(false);

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
        <div class="chat-list">
            <h2>Historique</h2>
            <ul>
                {#each conversations as conversation, i}
                    {#if i < 1 || displayAllConv}
                        <ChatListItem {conversation} {conversations} />
                    {/if}
                {/each}
                <div class="display-all">
                    <button
                        type="button"
                        aria-label={displayAllConv
                            ? "masquer les anciennes conversations"
                            : "afficher toutes les conversation"}
                        title={displayAllConv
                            ? "masquer les anciennes conversations"
                            : "afficher toutes les conversation"}
                        onclick={() => (displayAllConv = !displayAllConv)}
                        >{displayAllConv
                            ? "-"
                            : "+"}</button
                    >
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
                <button type="button">{addChat? "-" : "+"}</button>
            </p>
            {#if addChat}
                <form onsubmit={addConversation}>
                    <input
                        type="text"
                        placeholder="Saisissez un titre"
                        required
                        bind:value={newTitle}
                    />
                    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                    <button
                        type="submit"
                        title="valider"
                        aria-label="valider"
                        onmouseover={() => {
                            msgBtnHover = true;
                        }}
                        onmouseleave={() => {
                            msgBtnHover = false;
                        }}
                    >
                        <div class="message__btn-icon">
                            <Icon
                                icon={msgBtnHover
                                    ? "el:ok-sign"
                                    : "el:ok-circle"}
                                width="24"
                                height="24"
                                style="color: #474350"
                            />
                        </div>
                    </button>
                </form>
            {/if}
        </section>
    </aside>
</div>

<style>
    .manager-container {
        margin-left: 0;
        transition: margin-left 0.5s ease;
        position: relative;
    }
    .manager-container.offset {
        margin-left: 25dvw;
    }
    button.burger-btn {
        display: block;
        position: fixed;
        top: 1.5rem;
        z-index: 10;
        padding: 0;
        transform: translateX(0);
        transition: transform 0.5s ease;
    }
    .manager-container.offset button.burger-btn {
        transform: translateX(-36px);
    }
    aside.chat-manager {
        height: 100dvh;
        position: fixed;
        z-index: 5;
        background-color: white;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 25dvw;
        padding: 1.5rem 1rem;
        color: var(--primary-color);
        transition: all 0.5s ease;
        overflow: hidden;
        transform: translateX(-100%);
    }
    .chat-manager.open {
        transform: translateX(0);
        box-shadow: 2rem 2rem 35px 5px rgba(139,138,139,0.4);
    }
    aside .chat-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
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
    aside .chat-list ul {
        overflow-y: auto;
        flex: 1;
        padding: 0 1rem;
    }
    .display-all {
        padding: 1.5rem 0;
    }
    .display-all button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        color: var(--primary-color);
        font-size: 1.5rem;
    }
    .display-all button:hover {
        color: white;
        background-color: var(--primary-color);
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
    .add-chat button {
        height: 1.5rem;
        font-size: 1rem;
    }
    .add-chat button:hover {
        background-color: var(--primary-color);
        color: white;
    }
    aside input {
        width: 100%;
    }
    @media (max-width: 930px) {
        .manager-container.offset {
            margin-left: 0;
        }
        .manager-container.offset .burger-btn {
            transform: translateX(calc(35dvw - 32px));
        }
        aside.chat-manager {
            width: 35dvw;
        }
    }
    @media (max-width: 728px) {
        .manager-container.offset .burger-btn {
            transform: translateX(calc(80dvw - 32px));
        }
        aside.chat-manager {
            width: 80dvw;
        }
    }
</style>
