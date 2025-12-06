<script>
  import { createEventDispatcher } from "svelte";
  import Markdown from "svelte-exmarkdown";
  import { tick } from "svelte";
  import { currentConversation } from "./state.svelte";
  import "./ChatMsg.svelte";

  const dispatch = createEventDispatcher();

  let {
    baseUrl,
    isLoggedIn,
    questions = $bindable(),
    answers = $bindable(),
    addTitle = $bindable(),
    onTitleGenerated = $bindable(),
  } = $props();

  let responseIsLoading = $state([]);
  let answerElement = $state();

  $effect(() => {
    if (currentConversation.id || currentConversation.id === null) {
      fillChat();
    }
  });

  async function scrollToMessage() {
    await tick(); //Wait for the dom to load the last change
    if (answerElement) answerElement.scrollIntoView({ behavior: "smooth" });
  }

  function getMessagesToSend() {
    let messagesToSend = [];
    for (let i = 0; i < questions.length; i++) {
      if (questions[i]) {
        const question = {
          role: "user",
          content: questions[i].content,
        };
        messagesToSend = [...messagesToSend, question];
      }
      if (answers.length > 0 && i < questions.length - 1) {
        const answer = {
          role: "assistant",
          content: answers[i].content,
        };
        messagesToSend = [...messagesToSend, answer];
      }
    }
    messagesToSend = [
      {
        role: "system",
        content:
          "Réponds à tous les prochains messages dans la même langue que les messages qui ont pour rôle 'user'. " +
          "Si tu ne peux pas déterminer la langue, réponds en français. " +
          "Fais moi une réponse la plus complete possible" +
          "Ne réponds pas à ce message, mais applique ces règles aux messages suivants.",
      },
      ...messagesToSend,
    ];

    return messagesToSend;
  }

  async function sendToMistral(messages) {
    try {
      const response = await fetch(`${baseUrl}/prompt/mistral`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error, { cause: "server" });
      }
      return data;
    } catch (error) {
      console.error(error);
      let content;
      if (error.cause === "server") content = error.message;
      else
        content =
          "The database is temporarily unavailable. Please refresh the page or try again later.";
      return { content, error: true };
    }
  }

  async function sendMessage(event) {
    let question = {
      content: event.detail,
      isAiResponse: false,
    };
    responseIsLoading = [...responseIsLoading, true];
    questions = [...questions, question];

    await scrollToMessage();

    if (!currentConversation.title) {
      await generateConversation(event.detail);
    }

    question.conversationId = currentConversation.id;

    //We start the loading process to display loader
    const messagesToSend = getMessagesToSend();
    const data = await sendToMistral(messagesToSend);
    let answer = {
      content: data.content,
      isAiResponse: true,
      conversationId: currentConversation.id,
    };
    responseIsLoading[responseIsLoading.length - 1] = false;
    answers = [...answers, answer];
    await scrollToMessage();
    if (data.error) answer.content = "";
    if (isLoggedIn) {
      await saveMessage(question);
      await saveMessage({ ...answer, content: data.error ? "" : data.content });
    }
  }

  async function generateConversation(context) {
    try {
      const response = await fetch(`${baseUrl}/prompt/mistral`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Génère un titre de conversation en une phrase, sans émojis ni guillemets, uniquement le titre. " +
                "Analyse la langue de la question fournie par l'utilisateur : " +
                "1. Si la question est en français, réponds en français. " +
                "2. Si la question est dans une autre langue, réponds dans la même langue. " +
                "3. Si la langue ne peut pas être déterminée, réponds en français. " +
                "Ne réponds jamais à ce message système : il sert uniquement de directive pour le titre.",
            },
            {
              role: "user",
              content: `Génère un titre à partir de cette question(miser entre ###) : ###${context}###`,
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Erreur de communication avec mistral: ${response.status}`
        );
      }
      const data = await response.json();
      addTitle = data.content;
    } catch (error) {
      console.error(error);
      if (isLoggedIn) {
        addTitle = "Indiquez un titre";
      } else {
        addTitle = "Server error";
      }
    } finally {
      await onTitleGenerated();
    }
  }

  async function saveMessage(message) {
    try {
      const response = await fetch(
        `${baseUrl}/conversations/${currentConversation.id}/messages`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(message),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'enregistrement du message: ${data.error}`,
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

  async function getMessages() {
    try {
      const response = await fetch(
        `${baseUrl}/conversations/${currentConversation.id}/messages`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des message: ${response.status}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function fillChat() {
    if (!isLoggedIn) return;
    if (currentConversation.id) {
      const messages = await getMessages();
      if (messages !== null) {
        questions = messages.filter((message) => !message.isAiResponse);
        answers = messages.filter((message) => message.isAiResponse);
        responseIsLoading = new Array(answers.length).fill(false);
        scrollToMessage();
      }
    } else {
      questions = [];
      answers = [];
      responseIsLoading = [];
    }
  }
</script>

<h2>
  {currentConversation.title ?? "Discutez avec Mistral AI !"}
</h2>
{#each questions as question, i}
  <div class="chat-view">
    <section class="question">
      <p>
        {question.content}
      </p>
    </section>
    <section class="answer" bind:this={answerElement}>
      {#if responseIsLoading[i] === true}
        <div class="loader">
          <span class="loader__element"></span>
          <span class="loader__element"></span>
          <span class="loader__element"></span>
        </div>
      {:else}
        <div class="markdown-body">
          <Markdown md={answers[i].content} />
        </div>
      {/if}
    </section>
  </div>
{/each}
<section class="message">
  <chat-msg onsend={sendMessage} {responseIsLoading}></chat-msg>
</section>

<style>
  .question {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
  }
  .question p {
    padding: 1.5rem 1rem;
    border-radius: 1rem;
    background-color: var(--light-color);
    color: var(--secondary-color);
    font-style: italic;
    max-width: 80%;
  }
  .message {
    background-color: white;
    padding: 1rem 0;
  }
  h2 {
    text-align: center;
    margin-bottom: 4rem;
    margin-top: 4rem;
  }
  .answer {
    min-height: 10dvh;
    min-width: 10vw;
  }
  .loader {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    z-index: 100000;
  }

  .loader__element {
    border-radius: 100%;
    border: 5px solid var(--primary-color);
    margin: 10px;
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
  @media (min-width: 732px) {
    .message {
      position: sticky;
      bottom: 0;
    }
  }
</style>
