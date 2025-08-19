<script>
    import Markdown from "svelte-exmarkdown";
    import ChatMsg from "./ChatMsg.svelte";

    const apiKey = "tqwuIojx5T7o3r8ToMZ1JzFicfG2J34V";
    const url = "https://api.mistral.ai/v1/chat/completions";

    let msgBtnHover = $state(false);
    let questions = $state([]);
    let answers = $state([]);

    async function sendMessage(event) {
        questions.push(event.detail);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer tqwuIojx5T7o3r8ToMZ1JzFicfG2J34V`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistral-tiny",
                messages: [
                    { role: "user", content: questions[questions.length - 1] },
                ],
            }),
        });
        const data = await response.json();
        console.log(data);

        answers.push(data.choices[0].message.content);
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
    <ChatMsg on:submit={sendMessage} />
</section>

<style>
    .question {
        display: flex;
        justify-content: flex-end;
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
