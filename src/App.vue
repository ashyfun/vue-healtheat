<script setup lang="ts">
import { RouterView } from 'vue-router'
import GlobalLoader from '@/components/GloablLoader.vue'
</script>

<template>
  <v-layout>
    <v-app-bar theme="dark">
      <v-app-bar-title>Healtheat</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <RouterView />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
  <GlobalLoader />
</template>
