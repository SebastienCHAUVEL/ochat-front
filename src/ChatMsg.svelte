<script>
    import Icon from "@iconify/svelte";
    let msgBtnHover = $state(false);
</script>

<form>
    <textarea
        autofocus
        id="message__input"
        placeholder="Posez votre question"
        required
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
