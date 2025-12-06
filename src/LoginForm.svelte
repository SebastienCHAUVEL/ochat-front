<script>
  import Icon from "@iconify/svelte";

  let {
    loginError,
    onLoginSubmit,
    onGuestModeClick,
    onRegisterClick,
    username = $bindable(),
    password = $bindable(),
  } = $props();
  let submitBtnHover = $state(false);
</script>

<div>
  <h1>Se connecter</h1>
  <form onsubmit={onLoginSubmit}>
    <div class="container">
      <label for="username">
        {#if loginError}
          <span>{loginError}</span>
        {/if}
        Nom d'utilisateur
      </label>
      <input
        id="username"
        type="text"
        autofocus
        required
        bind:value={username}
      />
      <label for="password">Mot de passe</label>
      <input id="password" type="password" required bind:value={password} />
      <!-- svelte-ignore a11y_mouse_events_have_key_events -->
      <div class="submit-container">
        <button
          type="submit"
          title="valider"
          aria-label="valider"
          onmouseover={() => {
            submitBtnHover = true;
          }}
          onmouseleave={() => {
            submitBtnHover = false;
          }}
        >
          <div class="message__btn-icon">
            <Icon
              icon={submitBtnHover ? "el:ok-sign" : "el:ok-circle"}
              width="32"
              height="32"
              style="color: #474350"
            />
          </div>
        </button>
        <button class="link" type="button" onclick={onRegisterClick}
          >Créer un compte</button
        >
      </div>
    </div>
  </form>
  <button class="link primary-link" type="button" onclick={onGuestModeClick}
    ><span>Continuer en tant qu'invité</span></button
  >
</div>

<style>
  form {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    padding: 2rem;
    margin: auto;
    align-items: center;
  }
  h1 {
    color: var(--primary-color);
    width: fit-content;
    margin: auto;
    padding-top: 1rem;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    gap: 2rem;
  }
  label {
    align-self: flex-start;
    width: 60dvw;
    max-width: 280px;
    color: var(--primary-color);
  }
  label span {
    color: red;
    font-weight: 300;
    font-size: 0.8rem;
    display: flex;
    margin-bottom: 1rem;
  }
  input {
    padding: 1rem;
    font-size: 1.5rem;
    outline: 1px solid var(--primary-color);
    width: 60dvw;
    max-width: 280px;
  }
  input:focus {
    border: 1px solid var(--primary-color);
  }
  .submit-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  button {
    border: none;
    align-self: flex-start;
    background-color: white;
  }
  button:hover {
    cursor: pointer;
  }
  button.link {
    color: var(--primary-color);
    align-self: inherit;
    font-size: 1rem;
  }
  button.link:hover {
    text-decoration: underline;
  }
  .message__btn-icon {
    width: 48px;
    height: 48px;
  }
  .primary-link {
    display: flex;
    width: calc(100% - 4rem);
    margin: 1rem 2rem 2rem 2rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--light-color);
    font-weight: bold;
  }
  .primary-link span {
    background-color: var(--light-color);
    margin: auto;
  }
</style>
