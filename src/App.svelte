<script>
  import { onMount } from "svelte";
  import ChatManager from "./ChatManager.svelte";
  import Chat from "./Chat.svelte";
  import LoginForm from "./LoginForm.svelte";
  import Icon from "@iconify/svelte";
  import RegisterForm from "./RegisterForm.svelte";
  import {
    currentConversation,
    isModifying,
    conversationToDelete,
  } from "./state.svelte";

  const baseUrl = import.meta.env.VITE_BASE_URL;
  let user = $state({});
  let isLoggedIn = $state(false);
  let page = $state("");
  let loginError = $state();
  let registerError = $state();
  let username = $state();
  let password = $state();
  let passwordConfirmation = $state();
  let questions = $state([]);
  let answers = $state([]);
  let conversations = $state([]);
  let addChat = $state(false);
  let addTitle = $state();

  let openBurger = $state(true);
  let newTitle = $state();
  let msgBtnHover = $state(false);
  let displayAllConvButtonIsHover = $state(false);
  let displayAllConv = $state(false);

  async function addConversation() {
    let newConversation = { title: addTitle };
    let savedConversation;
    if (isLoggedIn) savedConversation = await saveConversation(newConversation);
    conversations = [savedConversation || newConversation, ...conversations];
    if (savedConversation) currentConversation.id = conversations[0].id;
    currentConversation.title = conversations[0].title;
    closeSideBar();
    addTitle = "";
    addChat = false;
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
    displayAllConvButtonIsHover = false;
  }
  async function saveConversation(conversationToSave) {
    try {
      const response = await fetch(`${baseUrl}/conversations`, {
        credentials: "include",
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(conversationToSave),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'enregistrement de la conversation: ${data.error}`,
          { cause: "server" }
        );
      }
      return data;
    } catch (error) {
      if (error.cause === "server") {
        console.error(error.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    const userLogin = {
      username,
      password,
    };
    const data = await login(userLogin);
    if (!data) {
      return;
    }
    loginError = null;
    user = data;
    isLoggedIn = true;
    page = "chat";
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    const userLogin = {
      username,
      password,
      passwordConfirmation,
    };
    const data = await register(userLogin);
    if (!data) {
      return;
    }
    registerError = null;
    user = data;
    isLoggedIn = true;
    page = "chat";
  }

  function handleRegisterClick() {
    page = "register";
  }

  function handleGuestModeClick() {
    page = "chat";
  }

  function handleLoginClick() {
    page = "login";
  }

  async function handleLogoutClick() {
    await logout();
    isLoggedIn = false;
  }

  async function login(userData) {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error, { cause: "server" });
      }
      return data;
    } catch (error) {
      if (error.cause === "server") {
        loginError = error;
      } else {
        loginError =
          "The database is temporarily unavailable. Please refresh the page or try again later.";
      }
      console.error(error);
      return null;
    }
  }

  async function register(userData) {
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error, { cause: "server" });
      }
      return data;
    } catch (error) {
      if (error.cause === "server") {
        registerError = error;
      } else {
        registerError =
          "The database is temporarily unavailable. Please refresh the page or try again later.";
      }
      console.error(error);
      return null;
    }
  }

  async function logout() {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "PUT",
        credentials: "include",
      });
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async function getUserInfo() {
    try {
      const response = await fetch(`${baseUrl}/users/me`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  onMount(async () => {
    user = await getUserInfo();
    if (user) {
      isLoggedIn = true;
      page = "chat";
    } else {
      page = "login";
    }
  });
</script>

<div class="container">
  {#if page === "login"}
    <div class="login-form">
      <LoginForm
        {loginError}
        bind:username
        bind:password
        onLoginSubmit={handleLoginSubmit}
        onGuestModeClick={handleGuestModeClick}
        onRegisterClick={handleRegisterClick}
      />
    </div>
  {:else if page === "register"}
    <div class="login-form">
      <RegisterForm
        {registerError}
        bind:passwordConfirmation
        bind:username
        bind:password
        onRegisterSubmit={handleRegisterSubmit}
        onGuestModeClick={handleGuestModeClick}
        onLoginClick={handleLoginClick}
      />
    </div>
  {:else if page === "chat"}
    <div class="login-nav">
      {#if isLoggedIn}
        <button type="button" id="logout-btn" onclick={handleLogoutClick}
          ><Icon
            icon="ic:baseline-logout"
            width="24"
            height="24"
            style="color: #474350"
          />Se deconnecter</button
        >
      {:else}
        <button type="button" id="login-btn" onclick={handleLoginClick}
          ><Icon
            icon="ic:baseline-login"
            width="24"
            height="24"
            style="color: #474350"
          />Se connecter</button
        >
        <button type="button" id="register-btn" onclick={handleRegisterClick}
          ><Icon
            icon="mdi:register-outline"
            width="24"
            height="24"
            style="color: #474350"
          />S'inscrire</button
        >
      {/if}
    </div>
    <ChatManager
      {baseUrl}
      {isLoggedIn}
      bind:addChat
      bind:addTitle
      bind:conversations
      bind:openBurger
      bind:newTitle
      bind:msgBtnHover
      bind:displayAllConv
      bind:displayAllConvButtonIsHover
      onAddTitleSubmit={addConversation}
      onCloseSideBar={closeSideBar}
    />
    <main>
      <Chat
        {baseUrl}
        {isLoggedIn}
        bind:questions
        bind:answers
        bind:addTitle
        onTitleGenerated={addConversation}
      />
    </main>
  {/if}
</div>

<style>
  .container {
    display: flex;
    width: 100dvw;
    min-height: 100dvh;
  }
  main {
    flex: 1;
    max-width: 920px;
    padding: 1.5rem 1rem;
    position: relative;
    margin: 0 auto;
    transition: all 0.5s ease-in-out;
  }
  .login-form {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    box-shadow: 1rem 1rem 35px 5px rgba(139, 138, 139, 0.2);
  }
  .login-nav {
    padding: 1rem;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 4;
    color: var(--primary-color);
  }
  .login-nav button {
    display: flex;
    gap: 0.5rem;
  }
  .login-nav button:hover {
    text-decoration: underline;
  }
</style>
