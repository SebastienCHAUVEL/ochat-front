<script>
    import Markdown from "svelte-exmarkdown";
    import Icon from "@iconify/svelte";

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
    let msgHover = false;
</script>

<div class="container">
    <aside class="chat-manager" aria-label="gestionnaire des conversations">
        <ul class="chat-list">
            <h2>Historique</h2>
            <!-- svelte-ignore a11y_invalid_attribute -->
            <li>
                <a
                    href=""
                    class="chat-title"
                    aria-label="accedez à la conversation">Chat title</a
                >
                <button
                    type="button"
                    class="remove-chat"
                    aria-label="supprimez cette conversation">x</button
                >
            </li>
            <!-- svelte-ignore a11y_invalid_attribute -->
            <li>
                <a
                    href=""
                    class="chat-title"
                    aria-label="accedez à la conversation">Chat title</a
                >
                <button
                    type="button"
                    class="remove-chat"
                    aria-label="supprimez cette conversation">x</button
                >
            </li>
            <!-- svelte-ignore a11y_invalid_attribute -->
            <li>
                <a
                    href=""
                    class="chat-title"
                    aria-label="accedez à la conversation">Chat title</a
                >
                <button
                    type="button"
                    class="remove-chat"
                    aria-label="supprimez cette conversation">x</button
                >
            </li>
        </ul>
        <section class="add-section">
            <p class="add-chat" aria-label="Ajouter une nouvelle conversation">
                <span class="chat-title">Nouveau chat</span>
                <button type="button">+</button>
            </p>
            <form>
                <input type="text" placeholder="Saisissez le titre" required/>
            </form>
        </section>
    </aside>

    <main>
        <div class="chat">
            <section class="question">
                <p>
                    Peux-tu me donner la réponse à la grande question sur la vie,
                    l'Univers et le reste?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim magni quidem mollitia, dolorem, quas minima velit quis iste repudiandae, et autem consectetur soluta atque. Sit, veniam. Architecto unde itaque magnam?
                </p>
            </section>
            <section class="answer">
                <div class="markdown-body">
                    <Markdown md={answer} />
                </div>
            </section>
        </div>
        <section class="message">
            <form>
                <textarea autofocus id="message__input" placeholder="Posez votre question" required
                ></textarea>
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <button
                    type="submit"
                    onmouseover={() => {
                        msgHover = true;
                    }}
                    onmouseleave={() => {
                        msgHover = false;
                    }}
                >
                    <div class="message__btn-icon">
                        <Icon
                            icon={msgHover
                                ? "majesticons:send"
                                : "majesticons:send-line"}
                            width="24"
                            height="24"
                            style="color: #474350"
                        />
                    </div>
                </button>
            </form>
        </section>
    </main>
</div>

<style>
    .container {
        display: flex;
    }
    aside {
        width: 25%;
        height: 100dvh;
        position: sticky;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1.5rem 1rem;
        color: var(--primary-color);
    }
    aside h2 {
        font-weight: 600;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    aside li,
    aside section {
        font-size: 1.5rem;
    }
    aside li,
    .add-chat,
    aside form {
        margin: 1.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .add-chat:hover {
        cursor: pointer;
    }
    .add-chat:hover .chat-title {
        font-weight: bold;
    }
    aside button {
        height: 1.5rem;
        font-size: 1rem;
    }
    aside button:hover {
        background-color: var(--primary-color);
        color: white;
    }
    aside input {
        width: 100%;
    }
    aside input:focus {
        outline-color: var(--primary-color);
    }
    main {
        width: 75%;
        padding: 1.5rem 1rem;
        padding-left: 4rem;
        position: relative;
    }
    main section {
        margin: 1.5rem 0;
    }
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
        position: sticky;
        bottom: 0;
        background-color: white;
        padding: 1rem 0;
    }
    .message textarea{
        width: 60%;
        margin-right: 1.5rem;
    }
</style>
