<script>
    import Markdown from "svelte-exmarkdown";
    import { onMount } from "svelte";
    import "./ChatMsg.svelte";

    const { apiKey } = $props();
    const urlMistral = "https://api.mistral.ai/v1/chat/completions";
    const urlPocketbase =
        "http://127.0.0.1:8090/api/collections/ochat_message/records";

    let questions = $state([]);
    let answers = $state([]);
    let responseIsLoading = $state([]);

    async function sendMessage(event) {
        questions = [...questions, event.detail];
        responseIsLoading = [...responseIsLoading, true];

        try {
            const response = await fetch(urlMistral, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "mistral-tiny",
                    messages: [
                        {
                            role: "user",
                            content: questions[questions.length - 1],
                        },
                    ],
                }),
            });
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            answers = [...answers, data.choices[0].message.content];
            responseIsLoading.splice(responseIsLoading.length - 1, 1, false);
        } catch (error) {
            console.error(error);
            answers = [
                ...answers,
                "Erreur de communication avec l'API de mistral",
            ];
        }
    }

    async function getMessages() {
        try {
            // - Utiliser JSON.parse() pour convertir
            const response = await fetch(urlPocketbase);
            const data = await response.json();
            // - Gérer le cas vide : tableau vide
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des message`);
            }
            return data;
        } catch (error) {
            // Si localStorage ou JSON échoue
            console.error(error);
            return null;
        }
    }

    onMount(async () => {
        const data = await getMessages();
        if (data !== null) {
            const messages = data.items;
            questions = messages.filter((message) => !message.is_ai_response);
            answers = messages.filter((message) => message.is_ai_response);
        }
    });
</script>

{#each questions as question, i}
    <div class="chat-view">
        <section class="question">
            <p>
                {question}
            </p>
        </section>
        <section class="answer">
            {#if responseIsLoading[i]}
                <div class="loader">
                    <span class="loader__element"></span>
                    <span class="loader__element"></span>
                    <span class="loader__element"></span>
                </div>
            {:else}
                <div class="markdown-body">
                    <Markdown md={answers[i]} />
                </div>
            {/if}
        </section>
    </div>
{:else}
    <h2>Discutez avec Mistral AI !</h2>
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
