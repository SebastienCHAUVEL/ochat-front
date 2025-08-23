<script>
    import Icon from "@iconify/svelte";
    import ChatListItem from "./ChatListItem.svelte";
    import { onMount } from "svelte";
    import {
        currentConversation,
        conversationToDelete,
        isModifying,
    } from "./state.svelte";

    const urlPocketbaseConversation =
        "http://127.0.0.1:8090/api/collections/ochat_conversation/records";

    let addChat = $state(false);
    let openBurger = $state(true);
    let addTitle = $state();
    let newTitle = $state();
    let conversations = $state([]);
    let msgBtnHover = $state(false);
    let displayAllConvButtonIsHover = $state(false);
    let displayAllConv = $state(true);

    const { apiKey } = $props();

    $effect(() => {
        if (conversationToDelete.status === false && conversationToDelete.id) {
            fillConversations();
        }
    });

    async function addConversation(event) {
        event.preventDefault();

        let newConversation = {
            title: addTitle,
            user_token: apiKey,
        };
        const savedConversation = await saveConversation(newConversation);
        //If saving is complete we add the question formated by pocketbase else, we add the initial question to continue the chat even if the saving fail
        conversations = [
            savedConversation || newConversation,
            ...conversations,
        ];
        currentConversation.id = conversations[0].id;
        addTitle = "";
        addChat = false;
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

    async function updateConversation(conversationToUpdate) {
        try {
            const response = await fetch(
                `${urlPocketbaseConversation}/${conversationToUpdate.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(conversationToUpdate),
                },
            );
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

    async function fillConversations() {
        const data = await getConversations();
        if (data !== null) {
            conversations = data.items.reverse();
            if (conversations.length === 0) {
                currentConversation.id = "empty";
            }
        }
        if (
            conversationToDelete.id &&
            conversationToDelete.id === currentConversation.id
        ) {
            currentConversation.id = conversations[0].id;
        }
    }
    async function handleModifyConversation(event) {
        event.preventDefault();
        const index = conversations.findIndex(
            (conversation) => conversation.id === isModifying.id,
        );
        const conversationToUpdate = conversations.find(
            (conversation) => conversation.id === isModifying.id,
        );
        let newConversation = conversationToUpdate;
        newConversation.title = newTitle;

        const updatedConversation = await updateConversation(newConversation);
        conversations.splice(index, 1, updatedConversation || newConversation);
        isModifying.status = false;
    }
    function openSideBar() {
        openBurger = true;
    }
    function closeSideBar() {
        openBurger = false;
        addChat = false;
        conversationToDelete.status = false;
        isModifying.status = false;
        addTitle = "";
        newTitle = "";
        msgBtnHover = false;
        displayAllConv = false;
    }
    function openAllConv() {
        displayAllConv = true;
        displayAllConvButtonIsHover = false;
        conversationToDelete.status = false;
        isModifying.status = false;
    }
    function closeAllConv() {
        if (
            isModifying.id !== currentConversation.id &&
            conversationToDelete.id !== currentConversation.id
        ) {
            conversationToDelete.status = false;
            isModifying.status = false;
        }
        displayAllConv = false;
        displayAllConvButtonIsHover = false;
    }
    onMount(async () => {
        if (apiKey) {
            await fillConversations();
        }
    });
</script>

<div class={openBurger ? "manager-container offset" : "manager-container"}>
    <button
        class="burger-btn"
        type="button"
        title="ouvrir le gestionnaire des conversations"
        aria-label="ouvrir le gestionnaire des conversations"
        onclick={openBurger ? closeSideBar : openSideBar}
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
                {#each conversations as conversation}
                    {#if displayAllConv || currentConversation.id === conversation.id || (!currentConversation.id && conversation === conversations[0])}
                        <ChatListItem
                            {conversation}
                            bind:newTitle
                            onSubmit={handleModifyConversation}
                            onSelect={closeSideBar}
                        />
                    {/if}
                {/each}
                {#if conversations.length > 1}
                    <div class="display-all">
                        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                        <button
                            type="button"
                            aria-label={displayAllConv
                                ? "masquer les anciennes conversations"
                                : "afficher toutes les conversation"}
                            title={displayAllConv
                                ? "masquer les anciennes conversations"
                                : "afficher toutes les conversation"}
                            onclick={displayAllConv
                                ? closeAllConv
                                : openAllConv}
                            onmouseover={() =>
                                (displayAllConvButtonIsHover = true)}
                            onmouseleave={() =>
                                (displayAllConvButtonIsHover = false)}
                        >
                            {#if displayAllConv}
                                <Icon
                                    icon={displayAllConvButtonIsHover
                                        ? "majesticons:arrow-down-circle"
                                        : "majesticons:arrow-down-circle-line"}
                                    width="32"
                                    height="32"
                                    style="color: #474350"
                                />
                            {:else}
                                <Icon
                                    icon={displayAllConvButtonIsHover
                                        ? "majesticons:arrow-left-circle"
                                        : "majesticons:arrow-left-circle-line"}
                                    width="32"
                                    height="32"
                                    style="color: #474350"
                                />
                            {/if}
                        </button>
                    </div>
                {/if}
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
                <button type="button">{addChat ? "-" : "+"}</button>
            </p>
            {#if addChat}
                <form onsubmit={addConversation}>
                    <input
                        type="text"
                        placeholder="Saisissez un titre"
                        required
                        bind:value={addTitle}
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
        box-shadow: 2rem 2rem 35px 5px rgba(139, 138, 139, 0.4);
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
        padding-left: 1rem;
    }
    .display-all {
        padding: 1.5rem 0;
    }
    .display-all button {
        padding: 0;
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
        font-size: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
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
        .manager-container.offset button.burger-btn {
            transform: translateX(calc(35dvw - 36px));
        }
        aside.chat-manager {
            width: 35dvw;
        }
    }
    @media (max-width: 728px) {
        .manager-container.offset button.burger-btn {
            transform: translateX(calc(80dvw - 36px));
        }
        aside.chat-manager {
            width: 80dvw;
        }
    }
</style>
