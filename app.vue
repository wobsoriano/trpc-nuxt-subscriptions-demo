<script setup lang="ts">
const { $client } = useNuxtApp()

const currentMessage = ref('')

$client.onMessage.subscribe(undefined, {
  onData(message) {
    currentMessage.value = message
  },
})

function sendMessage() {
  $client.sendMessage.query({ text: Date.now().toString() })
}
</script>

<template>
  <div>
    <p>Message: {{ currentMessage }}</p>
    <button @click="sendMessage">Send message</button>
  </div>
</template>
