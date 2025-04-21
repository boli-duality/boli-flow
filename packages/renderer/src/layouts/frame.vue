<script setup lang="ts">
const [terminalShow, terminalToggle] = useToggle(false)
const { ctrl_j, shift, alt } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (ctrl_j.value && !shift.value && !alt.value) e.preventDefault()
  },
})

whenever(
  () => ctrl_j.value && !shift.value && !alt.value,
  () => terminalToggle()
)
</script>

<template>
  <RouterView />
  <BaseTerminal :show="terminalShow" />
</template>

<style scoped>
.boli-terminal {
  position: fixed;
  inset: 50vh 0 0 0;
}
</style>
