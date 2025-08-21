# Carnet de bord

## J1

### Lecture du cachier des charges

J'ai pris connaissance du cachier des charge et des étapes pour les prochains jours. J'ai eu du mal à comprendre la notion de token/clé API, j'ai donc passé du temps à étudier les concepts et fouiller dans la doc de l'api MISTRAL pour un peu mieux comprendre mais certains points reste flous(à regardé quand j'y serais):

- la syntaxe exact pour récuperer un token
- la syntaxe pour poser une question a mistral via l'api

### Creation du wireframe avec figma

- utilisation de coolors.co pour génerer une palette de couleur
- utilisation de la bibliotheque iconify(compatible avec svelte) pour l'icone d'envoie des message

J'ai eu du mal à me décider sur quel design partir ce qui m'a fait perdre beaucoup de temps. J'ai opté pour un style simple et épuré ce qui me permettra par la suite de gagner du temps sur le css pour me concentrer sur l'essenciel.
Si j'avais plus de temps j'aurais fais une autre maquette pour la version mobile et pour les élements interactifs(ex: le formulaire de saisie de token qui ne s'affiche qu'une fois)

### Mise en place svelte

- installation de la font
- installation d'un fichier css pour la mise en forme du markdown
- installation d'un fichier reset.css (josh comeau)
- installation des bibliothèques exmarkdown et iconify

  ```bash
    npm install --save-dev @iconify/svelte
    npm install --save-dev svelte-exmarkdown
  ```

- creation d'un favicon avec favicon.io
- mise en place des variables CSS

### Intégration de l'UI - HTML

- Premier jet html pour la mise en forme
- test et réalisation de l'implémentation d'icone et du markdown (petit soucis sur les tableau qui je pense vient de la bibliotheque imposée)

Comme toujours, la sémantique et l'accessibilité me pose question sur le html: jamais sûr d'utiliser toutes les bonnes pratiques.
J'ai hésité pour l'organisation mais je suis partit de cette façon: faire une "croquis" html pour pouvoir faire la mise en forme et rendre le site responsive, puis le découper en composants, et enfin ajouter le traitement js.

### Intégration de l'UI - CSS

utilisation de :

- flexbox
- unité responsive
- positionnement en sticky pour le bandeau de gestionnaire des conversations et le formulaire d'envoie des questions

Je n'ai pas eu le temps de faire la version mobile/tablette ni le découpage en composants.

## J2

### Finalisation de l'intégration de l'UI

- mise en place d'un "burger menu" sur la sidebar gestionnaire des conversations qui ne s'affiche que lorsqu'on l'ouvre
- ajout d'une animation sur la liste des conversation dans la sidebar: au survol, le titre de la conversation se souligne progressivement de la gauche vers la droite
- L'input pour la saisie d'un titre pour une nouvelle conversation est maintenant caché et vient s'afficher lorsqu'on clique sur "nouveau chat"
- mise en place du responsive pour toutes les versions. Le site s'adapte déjà bien sur chaque version grâce à l'utilisation d'unité responsive. Les élements qui posent problème: en dessous de certains breakpoints, la sidebar devient illisible et le formulaire d'envoie de question gene une lecture confortable de la conversation, j'ai donc testé les différents breakpoints à l'aide de l'outil device toolbar integré à chromium:
  - en dessous de 930px, la sidebar s'elargit(25% de l'ecran --> 35%) et vient se positionné par dessus le flux de la page(position: fixed)
  - en dessous de 732px, le formulaire d'envoie des question n'est plus sticky mais vient se positionner à la suite de la conversation pour ne pas gener
  - en dessous de 728px, la sidebar vient prendre 80% de la taille de l'ecran

Remarque:

- J'ai perdu beaucoup de temps sur la mise en forme pour essayer de rendre le site professionnel mais j'ai accumulé du retard par rapport à la progression du challenge. J'ai remarqué dans la correction d'hier que la sidebar n'était pas encore présente et qu'elle sera à faire le jour 4, j'ai donc pris de l'avance sur ce point.

Si j'avais plus de temps:

- J'ajouterais une animation pour un affichage progressif sur la sidebar et sur l'input de saisie du titre d'une nouvelle conversation.
- J'ajouterais une icone pour la suppression des conversation

### Découpage en composants

J'ai décider de découper mon projet en composants:

- **App.svelte**
  - **ChatManager.svelte** *la sidebar de gestion des conversations*
    - **ChatListItems.svelte** *élement de la liste des conversations*
  - **Chat.svelte** *le chat avec mistral*
    - **ChatMsg.svelte** *le formulaire d'envoie des messages*

Objectif:

- rendre le code plus propre et lisible
- meilleur organisation
- élements indépendants et réutilisables
- s'habituer aux bonnes pratiques

Inconveniants:

- Plus de travail
- **Les remontés de variables et d'evenements entre les composants.** Pour remonter des actions de clique,d'envoie de formulaire,... ou encore des valeur de champs de saisie vers un composant parent, j'ai utilisé
  - des élements customisés
  - un dispatcher d'évenement:

    ```svelte
      $host().dispatchEvent(  //Dispatcher d'evenement vers l'element host
          new CustomEvent("NOM_DE_L_EVENEMENT A REMONTER", {
              detail: variableARemonter,
              bubbles: true, // Permet à l'événement de "remonter" dans le DOM
              composed: true, // Permet à l'événement de traverser les limites des shadow DOM
          }),
      );
    ```

  - un écouteur d'évenement sur notre élement customisés:
  
    ```svelte
    <nom-du-custom-element onNOM_DE_L_EVENEMENT A REMONTER={handler}></nom-du-custom-element>
    ```

    On pourra ensuite accéder à la variable que l'on souhaite remonter dans notre handler d'évenement avec "event.detail"

### Lier l'application à Mistral AI

- création de ma clé API sur la console mistral
- mise en place du traitement du message de l'utilisateur:
  - utilisation d'un tableau pour les question et un tableau pour les réponse que nous renvoie Mistral
  - utilisation de fetch pour envoyer les questions à mistral
  - gestion d'erreur
  - ajout d'une variable "responseIsLoading" pour la mise en place d'un loader en html/CSS (sur le bouton d'envoie de message et sur la réponse) qui s'affiche losque la requête est en cours de chargement

Difficulté:

- J'ai eu du mal à trouver la synthaxe à utiliser pour la requête à l'API.

Si j'avais eu plus de temps:

- J'implémenterais la désactivation du bouton d'envoie de message au chargement comme vu dans la correction
- J'ajouterais un timestamp comme vu dans la correction
- J'ajouterai un nettoyage et une meilleur gestion d'erreur pour la réponse de mistral comme vu dans la correction

### Sécurisation du token Mistral

- Mise en place d'un formulaire pour la saisie de token au sein d'un composant "token-form" (si aucun token n'est renseigné, on ne peut pas accéder au site)
- stockage du token dans le localStorage à la saisie du formulaire
- récupération du token dans le localStorage si déjà renseigné

Difficulté:

- J'ai eu du mal à comprendre ce qu'était un token mistral, je pensais qu'on parlait ici d'un Access Token géneré à la saisie d'un pseudo par l'utilisateur jusqu'à ce que je comprenne que l'on devait simplement renseigner notre clé API.

Si j'avais eu plus de temps:

- J'ajouterais un bouton pour changer de token à la navigation sur le site
- Je changerais la mise en forme pour afficher le formulaire au premier plan du site tout en bloquand l'accès au reste et en ajoutant un effet du flou plutot que de l'afficher à la place du site

## J3

### Mise en place d'un backend Pocketbase

- installation de pocketbase: dans le répertoire où l'on souhaite l'installer utiliser la commande

  ```bash
    npx pocketbase-installer
  ```

- lancer le serveur: utiliser la commande suivante dans le dossier de pocketbase

  ```bash
    ./pocketbase serve
  ```

- ajouter une collection au format demandé (un champ content et un champ is_ai_response)

### Mise en place des requêtes d'enregistrement

- Au démarrage, on charge l'historique des message depuis pocketbase en gérant les erreurs --> fonction getMessage()
- quand un utilisateur envoie un message(dans la fonction sendMessage() déjà existante) on sauvegarde le message en gerrant les erreurs --> fonction saveMessage().
- Quand mistral nous répond, (encore une fois dans la fonction sendMessage()), on sauvegarde la réponse -->  fonction saveMessage()
- J'ai décidé de stocker la valeur de la clé API de l'utilisateur dans ses messages pour conserver l'origine de chaque message --> ajout d'un champ api_key à la collection et modification du traitement des messages dans sendMessage() pour ajouter une propriété apiKey à l'objet qui contient le message

### Amelioration de l'UX

- Ajout d'un scroll automatique vers la section "answer" à l'envoie d'un message:
  
    ```svele
      //Using $effect() to look on "answerElement" change --> for example when a new section is mounted
      $effect(() => {
          //Check if the element is mounted
          if (answerElement) {
              //Scroll to element
              answerElement.scrollIntoView({ behavior: "smooth" });
          }
      });
    ```

    ```svelte
      <section class="answer" bind:this={answerElement}>
    ```

## J4

### Mise en place d'un système de conversations

- Ajout d'une collection à pocketbase pour stocker des conversation: un champ titre et un champs user_token afin de renseigner l'origine des conversation qui remplacera la champs apiKey de la collection message
- modification sur la collection message: ajout d'un champ relation vers la collection conversation: chaque message fait partie d'une conversation

### Ajout des fonctionnalités de gestion des conversation dans sur la sidebar

- Mise en place de l'ajout d'une nouvelle conversation(fonction addConversation()) et de sa sauvegarde dans pocketbase(fonction saveConversation())
- Possibilité de selectionner une conversation dans la sidebar (fonction handleConversationSelected):
  - utilisation d'état partagé entre mes composants dans une variable "currentConversation" qui stock l'id de la conversation selectionné
  - exploitation de la réactivité de svelte (avec $effect) pour mettre le chat à jour: si currentConversation.id est modifié, on récupere les message qui sont lié à cette conversation pour les afficher
- Ajout de la suppression au clique sur le bouton
  - sur le site(fonction handleDelete()) et dans pocketbase(deleteConversation())
  - selectionne la premiere conversation si on supprime la conversation courante(currentConversation.id prends la valeur de la premiere conversation stockée)

### Autres

- Changement de métode pour l'affichage de la sidebar pour un effet progressif, à la place de display:none pour la cacher on a maintenant:
  
  ```CSS
    .chat-manager {
        /* ... */
        transition: all 0.5s ease-in-out;
        overflow: hidden;
    }
    .chat-manager.hidden {
        transform: translateX(-100%);
        position: absolute;
    }
    .chat-manager.open {
        transform: translateX(0);
    }
  ```

  En essayant de rester accssible pour les lecteurs d'ecran:

  ```html
    <aside
        class={openBurger ? "chat-manager open" : "chat-manager hidden"}
        aria-label="gestionnaire des conversations"
        aria-hidden={!openBurger}
    >
  ```

- Ajout d'une mise en forme sur la conversation selectionnée (soulignée à 80%)

### Si j'avais plus de temps

- Implémentations
  - j'ajouterais un affichage progressif de l'input qui s'ouvre à l'ajout d'une conversation
  - j'ajouterais un bouton pour remonter en haut de la page
  - j'ameliorerais mon système de scroll automatique
  - j'ajouterais des commentaire à mon code
  - j'ajouterais un bouton valider à mon formulaire de saisie d'un nouveau titre
  - Je metterais en place des test plus avancés pour corriger les éventuels bug

- Debugguage restant:
  - Parfois la transition de la sidebar s'opere sur l'ouverture mais pas la fermeture
