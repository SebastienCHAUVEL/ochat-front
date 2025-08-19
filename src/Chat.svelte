<script>
    import Markdown from "svelte-exmarkdown";
    import ChatMsg from "./ChatMsg.svelte";

    const question = `Peux-tu me donner la réponse à la grande question sur la vie,
            l'Univers et le reste? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Enim magni quidem mollitia, dolorem, quas minima
            velit quis iste repudiandae, et autem consectetur soluta atque. Sit,
            veniam. Architecto unde itaque magnam?`;
    const answer = `
# La Grande Question sur la Vie, l’Univers et le Reste

## 1. La réponse "42" : une blague philosophique
Dans *Le Guide du voyageur galactique* de Douglas Adams, un super-ordinateur nommé *Pensée Profonde* calcule pendant 7,5 millions d’années pour répondre à la "Grande Question sur la Vie, l’Univers et le Reste". Sa réponse : **"42"**.

Cette réponse absurde souligne plusieurs idées :
- La quête de sens est parfois plus importante que la réponse elle-même.
- Les questions mal posées mènent à des réponses incompréhensibles.
- L’humour est un outil puissant pour aborder l’absurdité de l’existence.

---
## 2. Pourquoi "42" ?
Douglas Adams a choisi ce nombre de manière arbitraire, mais il est devenu un symbole :
- **Pour les scientifiques** : Clin d’œil à la complexité de l’Univers, où même les équations les plus poussées ne donnent pas toujours des réponses claires.
- **Pour les philosophes** : Rappel que le sens de la vie n’est pas une équation à résoudre, mais une expérience à vivre.
- **Pour les fans** : Métaphore de l’ironie cosmique : l’Univers pourrait avoir une réponse, mais elle serait incompréhensible sans le bon contexte.

---
## 4. La vraie question : et toi, qu’en penses-tu ?
La beauté de la question de Douglas Adams, c’est qu’elle nous renvoie à notre propre curiosité.
- **Qu’est-ce qui donne du sens à TA vie ?** (Famille, travail, passions, découvertes ?)
- **Si tu devais poser LA question ultime à l’Univers, quelle serait-elle ?**

---
### En résumé
"42" est une réponse parfaite… parce qu’elle ne répond rien. Elle nous invite à continuer de chercher, de rire, et de nous émerveiller.
`;
    let msgBtnHover = $state(false);
    let message = "";
    function handleSubmit(event) {
        message = event.detail;
        console.log(message);
    }
</script>

<div class="chat-view">
    <section class="question">
        <p>
            {question}
        </p>
    </section>
    <section class="answer">
        <div class="markdown-body">
            <Markdown md={answer} />
        </div>
    </section>
</div>
<section class="message">
    <ChatMsg on:submit={handleSubmit}/>
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
