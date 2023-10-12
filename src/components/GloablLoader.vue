<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoaderStore } from '@/stores/main'

const store = useLoaderStore()
const { loader } = storeToRefs(store)
</script>

<template>
  <v-layout row justify-center>
    <v-dialog v-model="loader" persistent content content-class="centered-dialog">
      <v-container fill-height>
        <v-row>
          <v-layout column justify-center align-center>
            <v-progress-circular indeterminate :size="72" :width="8" color="light-blue" />
          </v-layout>
        </v-row>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<style>
.v-dialog div.centered-dialog {
  width: auto;
}
</style>
