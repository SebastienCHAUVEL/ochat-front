<svelte:options customElement="token-form" />

<script>
    import Icon from "@iconify/svelte";

    let token = $state();
    let msgBtnHover = $state(false);

    function handleSubmit(event) {
        event.preventDefault();
        $host().dispatchEvent(
            new CustomEvent("tokenSubmit", {
                detail: token,
                bubbles: true, // Permet à l'événement de "remonter" dans le DOM
                composed: true, // Permet à l'événement de traverser les limites des shadow DOM
            }),
        );
    }
</script>

<form onsubmit={handleSubmit}>
    <input
        type="text"
        placeholder="Veuillez entrer votre token mistral"
        autofocus
        required
        bind:value={token}
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
                width="48"
                height="48"
                style="color: #474350"
            />
        </div>
    </button>
</form>

<style>
    form{
        width: 400px;
        height: 250px;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    input {
        margin-right: 2.5rem;
        padding: 1rem;
        font-size: 1.5rem;
        outline-color: var(--primary-color);
    }
    button {
        border: none;
    }
    button:hover {
        cursor: pointer;
    }
</style>
