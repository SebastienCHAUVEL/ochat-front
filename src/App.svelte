<script>
    import { onMount } from "svelte";
    import ChatManager from "./ChatManager.svelte";
    import Chat from "./Chat.svelte";
    import "./TokenForm.svelte";

    let apiKey = $state();
    let isLoading = $state(false);

    function getApiKey() {
        try {
            // - Récupérer le panier depuis localStorage
            // - Utiliser JSON.parse() pour convertir
            const data = localStorage.getItem("apiKey");
            // - Gérer le cas vide : tableau vide
            if (data === null) {
                throw new Error("Aucune clé sauvegardée !");
            }
            return data;
        } catch (error) {
            // Si localStorage ou JSON échoue
            console.error("Erreur lors du chargement des données: ", error);
            return null;
        }
    }
    function addApiKey(event) {
        isLoading = true;
        apiKey = event.detail;
        try {
            localStorage.setItem("apiKey", apiKey);
        } catch (error) {
            // Si une erreur se produit (ex: quota dépassé)
            if (error.name === "QuotaExceededError") {
                alert("L'espace de stockage est plein. Supprimez des données.");
            } else {
                console.error("Erreur: " + error);
            }
        } finally { 
            isLoading = false;
        }
    }
    onMount(async () => {
        apiKey = await getApiKey();
    });
</script>

<div class="container">
    {#if apiKey === null}
        <token-form ontokenSubmit={addApiKey}></token-form>
    {:else if !isLoading && apiKey !== undefined}
        <ChatManager {apiKey}/>
        <main>
            <Chat {apiKey}/>
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
        max-width: 1000px;
        padding: 1.5rem 1rem;
        position: relative;
        margin: 0 auto;
        transition: all 0.5s ease-in-out;
    }
    token-form {
        height: 100dvh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
