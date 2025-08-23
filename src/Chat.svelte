<script>
    import Markdown from "svelte-exmarkdown";
    import { onMount } from "svelte";
    import { tick } from "svelte";
    import { currentConversation, conversationToDelete } from "./state.svelte";
    import "./ChatMsg.svelte";

    const { apiKey } = $props();

    const urlMistral = "https://api.mistral.ai/v1/chat/completions";
    const urlPocketbase =
        "http://127.0.0.1:8090/api/collections/ochat_message/records";

    let questions = $state([]);
    let answers = $state([]);
    let responseIsLoading = $state([]);
    let answerElement = $state();

    $effect(() => {
        if (currentConversation.id) {
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
                if (!answers[i].error) {
                    const answer = {
                        role: "assistant",
                        content: answers[i].content,
                    };
                    messagesToSend = [...messagesToSend, answer];
                }
            }
        }
        console.log(messagesToSend);
        return messagesToSend;
    }
    async function sendMessage(event) {
        const question = {
            content: event.detail,
            is_ai_response: false,
            id_conversation: currentConversation.id,
        };
        const savedQuestion = await saveMessage(question);
        //We start the loading process to display loader
        responseIsLoading = [...responseIsLoading, true];
        //If saving is complete we add the question formated by pocketbase else, we add the initial question to continue the chat even if the saving fail
        questions = [...questions, savedQuestion || question];
        const messagesToSend = getMessagesToSend();
        await scrollToMessage();
        try {
            const response = await fetch(urlMistral, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: messagesToSend,
                    model: "mistral-small-latest",
                }),
            });
            if (!response.ok) {
                throw new Error(
                    `Erreur de communication avec mistral: ${response.status}`,
                );
            }
            const data = await response.json();

            const answer = {
                content: data.choices[0].message.content,
                is_ai_response: true,
                error: false,
                id_conversation: currentConversation.id,
            };
            const savedAnswer = await saveMessage(answer);

            answers = [...answers, savedAnswer || answer];

            //Changing the actual state of responseIsLoading(at the last index)
            responseIsLoading = [...responseIsLoading.slice(0, -1), false];
            await scrollToMessage();
        } catch (error) {
            console.error(error);
            answers = [
                ...answers,
                {
                    content: "Erreur de communication avec l'API de mistral",
                    is_ai_response: true,
                    error: true,
                    id_conversation: currentConversation.id,
                },
            ];
            responseIsLoading = [...responseIsLoading.slice(0, -1), false];
        }
    }

    async function saveMessage(message) {
        try {
            const response = await fetch(urlPocketbase, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(message),
            });
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de l'enregistrement du message: ${response.status}`,
                );
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getMessages() {
        try {
            const filter = `(id_conversation='${currentConversation.id}')`;
            const response = await fetch(`${urlPocketbase}?filter=${filter}`);
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la récupération des message: ${response.status}`,
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
        const data = await getMessages();
        if (data !== null) {
            const messages = data.items;
            questions = messages.filter((message) => !message.is_ai_response);
            answers = messages.filter((message) => message.is_ai_response);
            responseIsLoading = new Array(answers.length).fill(false);
            scrollToMessage();
        }
    }

    onMount(() => {
        if (currentConversation.id) {
            fillChat();
        }
    });
</script>

{#each questions as question, i}
    <div class="chat-view">
        <section class="question">
            <p>
                {question.content}
            </p>
        </section>
        <section class="answer" bind:this={answerElement}>
            {#if responseIsLoading[i]}
                <div class="loader">
                    <span class="loader__element"></span>
                    <span class="loader__element"></span>
                    <span class="loader__element"></span>
                </div>
            {:else if answers[i]}
                <div class="markdown-body">
                    <Markdown md={answers[i].content} />
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
