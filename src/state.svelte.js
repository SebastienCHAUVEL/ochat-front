export let currentConversation = $state({id: undefined, title: undefined});
export let conversationToDelete = $state({status: false, id: undefined});
export let isModifying = $state({status: false, id: undefined});
export let generatedConversation = $state({title: undefined, detail: undefined, done: undefined});