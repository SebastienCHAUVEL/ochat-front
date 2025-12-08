<script>
  import Icon from "@iconify/svelte";

  let {
    registerError,
    onRegisterSubmit,
    onGuestModeClick,
    onLoginClick,
    username = $bindable(),
    password = $bindable(),
    passwordConfirmation = $bindable(),
  } = $props();
  let submitBtnHover = $state(false);
  let constrainClass = $state({
    maj: "red",
    min: "red",
    nbChar: "red",
    specialChar: "red",
    digit: "red",
  });

  $effect(() => {
    if (password) {
      constrainClass.nbChar = password.length >= 8 ? "ok" : "red";
      constrainClass.maj = /[A-Z]/.test(password) ? "ok" : "red";
      constrainClass.min = /[a-z]/.test(password) ? "ok" : "red";
      constrainClass.digit = /[0-9]/.test(password) ? "ok" : "red";
      constrainClass.specialChar = /[\W_]/.test(password) ? "ok" : "red";
    }
    if (password === "") {
      for (let property in constrainClass) {
        constrainClass[property] = "red";
      }
    }
  });
</script>

<div>
  <h1>S'inscrire</h1>
  <form onsubmit={onRegisterSubmit}>
    <div class="container">
      <label for="username">
        {#if registerError}
          <span class="error">{registerError}</span>
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
      <label for="password" id="password-label">
        <span class="label-part password-part">Mot de passe</span>
      </label>
      <input
        id="password"
        type="password"
        autofocus
        required
        bind:value={password}
      />
      <span class="password-constrain">
        <span class={constrainClass.nbChar}>8 caracteres</span>
        <span class={constrainClass.specialChar}>1 caractere spécial</span>
        <span class={constrainClass.maj}>1 Majuscule</span>
        <span class={constrainClass.min}>1 Minuscule</span>
        <span class={constrainClass.digit}>1 chiffre</span>
      </span>
      <label for="passwordConfirmation">Confirmez votre mot de passe</label>
      <input
        id="passwordConfirmation"
        type="password"
        autofocus
        required
        bind:value={passwordConfirmation}
      />
      <button class="link simple-link" type="button" onclick={onLoginClick}
        >Déjà inscrit ?</button
      >
      <div class="button-section">
        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
        <button
          onmouseover={() => {
            submitBtnHover = true;
          }}
          onmouseleave={() => {
            submitBtnHover = false;
          }}
          class="link primary-link"
          type="submit"
        >
          <Icon
            icon={submitBtnHover ? "el:ok-sign" : "el:ok-circle"}
            width="24"
            height="24"
            style="color: #474350; background-color:#d9dbc6 "
          />
          <span>Valider</span></button
        >
        <button
          class="link primary-link"
          type="button"
          onclick={onGuestModeClick}>Continuer en tant qu'invité</button
        >
      </div>
    </div>
  </form>
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
    gap: 1rem;
  }
  label {
    width: 60dvw;
    max-width: 280px;
    color: var(--primary-color);
  }
  label .error {
    color: red;
    font-weight: 300;
    font-size: 0.8rem;
    display: flex;
    margin-bottom: 1rem;
    white-space: pre-line;
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
    font-size: 1rem;
  }
  button.link:hover {
    text-decoration: underline;
  }
  .primary-link {
    display: flex;
    width: calc(100% - 4rem);
    margin: 1rem 2rem 2rem 2rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--light-color);
    font-weight: bold;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .primary-link span {
    background-color: var(--light-color);
  }
  button.simple-link {
    align-self: flex-end;
  }
  #password-label {
    display: flex;
  }
  .label-part {
    width: 50%;
  }
  .password-part {
    align-self: flex-end;
  }
  .password-constrain {
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    width: 60dvw;
    max-width: 280px;
  }
  .red {
    color: rgba(255, 0, 0, 0.616);
  }
  .ok {
    color: #09423e;
  }
</style>
