<script>
    import Markdown from "svelte-exmarkdown";
    import ChatManager from "./ChatManager.svelte";
    import Chat from "./Chat.svelte";
    
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
        padding: 1.5rem 1rem;
        padding-left: 4rem;
        position: relative;
    }
</style>
