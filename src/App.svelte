<script>
    import Markdown from "svelte-exmarkdown";
    import ChatManager from "./ChatManager.svelte";
    import Chat from "./Chat.svelte";
    let apiKey = $state();


</script>

<div class="container">
    
    <ChatManager />
    <main>
        <Chat />
    </main>
</div>

<style>
    .container {
        display: flex;
    }
    main {
        flex: 1;
        max-width: 1000px;
        padding: 1.5rem 1rem;
        padding-left: 4rem;
        position: relative;
        margin: auto;
    }
</style>
