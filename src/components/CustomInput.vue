<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: String,
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text',
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  half: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)

const localValue = ref(props.modelValue)
const showPasswordToggle = computed(() => props.name === 'password')

const emitUpdate = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div :class="half ? 'col-6' : 'col-12'">
    <label>
      {{ label }}
    </label>
    <div class="relative w-full" style="margin-top: 10px; color: white">
      <q-input
        v-model="localValue"
        :type="showPasswordToggle ? (showPassword ? 'text' : 'password') : type"
        :name="name"
        :autofocus="autoFocus"
        :placeholder="label"
        outlined
        dense
        borderless
        @update:model-value="emitUpdate"
        input-class="text-white placeholder-white"
        label-color="white"
        color="white"
        style="background-color: #1e2538"
      >
        <!-- Password visibility toggle -->
        <template v-if="showPasswordToggle" v-slot:append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer text-textColor"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<style scoped>
.bg-bgColor {
  background-color: #1e2538;
}
.text-textColor {
  color: #fff;
}
.text-placeholderColor {
  color: #ccc;
}
</style>
