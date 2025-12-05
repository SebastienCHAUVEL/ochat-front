<svelte:options customElement="chat-msg" />

<script>
  import Icon from "@iconify/svelte";

  let msgBtnHover = $state(false);
  let message = $state(null);
  let { responseIsLoading } = $props();

  $effect(() => {
    if (responseIsLoading[responseIsLoading.length - 1] === true)
      msgBtnHover = false;
  });

  function handleSubmit(event) {
    event.preventDefault();
    $host().dispatchEvent(
      new CustomEvent("send", {
        detail: message,
        bubbles: true, // Permet à l'événement de "remonter" dans le DOM
        composed: true, // Permet à l'événement de traverser les limites des shadow DOM
      })
    );
    message = "";
  }
</script>

<form onsubmit={handleSubmit}>
  <textarea
    autofocus
    id="message__input"
    placeholder="Posez votre question"
    required
    rows="3"
    disabled={responseIsLoading[responseIsLoading.length - 1]}
    bind:value={message}
  ></textarea>
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <button
    type="submit"
    title="Envoyez votre question à Mistral AI"
    aria-label="Envoyez votre question à Mistral AI"
    disabled={responseIsLoading[responseIsLoading.length - 1]}
    onmouseover={() => {
      msgBtnHover = true;
    }}
    onmouseleave={() => {
      msgBtnHover = false;
    }}
  >
    <div class="message__btn-icon">
      {#if responseIsLoading[responseIsLoading.length - 1] === true}
        <div class="loader">
          <span class="loader__element"></span>
          <span class="loader__element"></span>
          <span class="loader__element"></span>
        </div>
      {:else}
        <Icon
          icon={msgBtnHover ? "majesticons:send" : "majesticons:send-line"}
          width="48"
          height="48"
          style="color: #474350"
        />
      {/if}
    </div>
  </button>
</form>

<style>
  form {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
  textarea {
    width: 60%;
    border: none;
    outline: 1px solid var(--primary-color);
    padding: 1rem;
    border-radius: 1rem;
  }
  textarea:focus {
    border: 1px solid var(--primary-color);
  }
  button {
    border: none;
    background-color: white;
  }
  button:hover {
    cursor: pointer;
  }
  .message__btn-icon {
    width: 48px;
    height: 48px;
  }
  .loader {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    z-index: 100000;
  }

  .loader__element {
    border-radius: 100%;
    border: 1px solid var(--primary-color);
  }

  .loader__element:nth-child(1) {
    animation: preloader 0.6s ease-in-out alternate infinite;
  }
  .loader__element:nth-child(2) {
    animation: preloader 0.6s ease-in-out alternate 0.2s infinite;
  }

  .loader__element:nth-child(3) {
    animation: preloader 0.6s ease-in-out alternate 0.4s infinite;
  }

  @keyframes preloader {
    100% {
      transform: scale(2);
    }
  }

  @media (max-width: 728px) {
    textarea {
      width: 80%;
    }
  }
</style>
