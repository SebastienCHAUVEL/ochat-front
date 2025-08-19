<script>
    import Markdown from "svelte-exmarkdown";
    import { onMount } from "svelte";
    import "./ChatMsg.svelte";

    const apiKey = "tqwuIojx5T7o3r8ToMZ1JzFicfG2J34V";
    const url = "https://api.mistral.ai/v1/chat/completions";

    let msgBtnHover = $state(false);
    let questions = $state([]);
    let answers = $state([]);

    async function sendMessage(event) {
        questions = [...questions, event.detail];

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer tqwuIojx5T7o3r8ToMZ1JzFicfG2J34V`,
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
        } catch (error) {
            console.error(error);
            answers = [
                ...answers,
                "Erreur de communication avec l'API de mistral",
            ];
        }
    }
</script>

{#each questions as question, i}
    <div class="chat-view">
        <section class="question">
            <p>
                {question}
            </p>
        </section>
        <section class="answer">
            <div class="markdown-body">
                <Markdown md={answers[i]} />
            </div>
        </section>
    </div>
{/each}
<section class="message">
    <chat-msg onsend={sendMessage}></chat-msg>
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

    @media (min-width: 732px) {
        .message {
            position: sticky;
            bottom: 0;
        }
    }
</style>
