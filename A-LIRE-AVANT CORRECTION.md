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
- mise en place des variables CSS

  ```bash
    npm install --save-dev @iconify/svelte
    npm install --save-dev svelte-exmarkdown
  ```

- creation d'un favicon avec favicon.io

### Intégration de l'UI - HTML

- Premier jet html pour la mise en forme
- test et réalisation de l'implémentation d'icone et du markdown (petit soucis sur les tableau qui je pense vient de la bibliotheque imposée)

Comme toujours, la sémantique et l'accessibilité me pose question sur le html: jamais sûr d'utiliser toutes les bonnes pratiques.
J'ai hésité pour l'organisation mais je suis partit de cette façon: faire une "croquis" html pour faire la mise en forme et rendre le site responsive, puis le découper en composants, et enfin ajouter le traitement js. 

### Intégration de l'UI - CSS

utilisation de :

- flexbox
- unité responsive
- positionnement en sticky pour le bandeau de gestionnaire des conversations et le formulaire d'envoie des questions

Je n'ai pas eu le temps de faire la version mobile/tablette ni le découpage en composants.
