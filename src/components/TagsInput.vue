<script setup>
import { ref } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:tags'])

const input = ref('')

const addTag = () => {
  const value = input.value.trim()
  if (value !== '' && !props.tags.includes(value)) {
    emit('update:tags', [...props.tags, value])
  }
  input.value = ''
}

const removeTag = (index) => {
  const newTags = [...props.tags]
  newTags.splice(index, 1)
  emit('update:tags', newTags)
}
</script>

<template>
  <div class="q-pa-sm rounded-borders" style="background-color: #1e2538">
    <div class="row items-center q-gutter-sm">
      <!-- Existing Tags -->
      <q-chip
        v-for="(tag, index) in tags"
        :key="index"
        color="primary"
        text-color="white"
        removable
        @remove="removeTag(index)"
        class="text-sm"
      >
        {{ tag }}
      </q-chip>

      <!-- Input for new tags -->
      <q-input
        v-model="input"
        @keyup.enter="addTag"
        placeholder="Press Enter to add tags"
        dense
        borderless
        style="background-color: #1e2538"
        input-class="text-white"
      />
    </div>
  </div>
</template>

<style scoped>
.text-textColor {
  color: #333;
}
.bg-grey-2 {
  background-color: #f0f0f0;
}
</style>
