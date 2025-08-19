<script>
    import Icon from "@iconify/svelte";
    import ChatListItem from "./ChatListItem.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let addChat = $state(false);
    let openBurger = $state(false);
    const chatTitle = [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi quidem tempore odio, eligendi itaque, veniam perspiciatis aperiam nobis voluptatibus neque tempora laboriosam saepe natus fuga blanditiis error quod quisquam officiis?",
        "Chat title",
        "Chat title",
        "Chat title",
        "Chat title",
        "Chat title",
        "Chat title",
    ];
</script>

<div class="manager-container">
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
        class={openBurger ? "chat-manager" : "hidden"}
        aria-label="gestionnaire des conversations"
    >
        <ul class="chat-list">
            <h2>Historique</h2>
            {#each chatTitle as title}
                <ChatListItem {title} />
            {/each}
        </ul>
        <section class="add-section">
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <p class="add-chat" aria-label="Ajouter une nouvelle conversation"
            onclick={() =>
                addChat = !addChat
            }>
                <span class="chat-title">Nouveau chat</span>
                <button type="button">+</button>
            </p>
            {#if addChat}
                <form>
                    <input type="text" placeholder="Saisissez un titre" required />
                </form>
            {/if}
        </section>
    </aside>
</div>

<style>
    .manager-container {
        max-width: 25%;
    }
    .burger-btn {
        display: block;
        position: fixed;
        top: 1.5rem;
        z-index: 10;
    }
    .chat-manager {
        height: 100dvh;
        position: sticky;
        z-index: 5;
        background-color: white;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: space-between;
        padding: 1.5rem 1rem;
        color: var(--primary-color);
    }
    aside ul {
        height: 100%;
        overflow: auto;
    }
    aside h2 {
        font-weight: 600;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 1.5rem;
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
            max-width: 35%;
        }
        .chat-manager {
            position: fixed;
            max-width: 35%;
        }
    }
    @media (max-width: 728px) {
        .manager-container {
            max-width: 80%;
        }
        .chat-manager {
            max-width: 80%;
        }
    }
</style>
