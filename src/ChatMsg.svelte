<script>
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    const apiKey = "tqwuIojx5T7o3r8ToMZ1JzFicfG2J34V";
    const url = "https://api.mistral.ai/v1/chat/completions";
    const dispatch = createEventDispatcher();

    let msgBtnHover = $state(false);
    let message = $state(null);

    async function sendMessage(event) {
        event.preventDefault();
        dispatch("submit", message);
        message = "";
    }
</script>

<form onsubmit={sendMessage}>
    <textarea
        autofocus
        id="message__input"
        placeholder="Posez votre question"
        required
        bind:value={message}
    ></textarea>
    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
    <button
        type="submit"
        title="Envoyez votre question à Mistral AI"
        aria-label="Envoyez votre question à Mistral AI"
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
                    ? "majesticons:send"
                    : "majesticons:send-line"}
                width="24"
                height="24"
                style="color: #474350"
            />
        </div>
    </button>
</form>

<style>
    form {
        display: flex;
        justify-content: center;
    }
    textarea {
        width: 60%;
        margin-right: 1.5rem;
    }
</style>
