<script setup lang="ts">
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import { useLoaderStore, useDailyMenuStore } from '@/stores/main'

import type { Item } from '@/models'

const { swapOn, swapOff } = useLoaderStore()

const dailyMenuStore = useDailyMenuStore()
const { items } = storeToRefs(dailyMenuStore)
const { setDailyMenu, editDailyMenu, addDailyMenu, deleteDailyMenu } = dailyMenuStore

const API_URL = 'http://localhost:8000/api/v1/daily-menu/'

const dialog = ref(false),
      dialogDelete = ref(false),
      headers = ref([
        { key: 'day', title: 'День недели' },
        { key: 'breakfast', title: 'Завтрак' },
        { key: 'elevenses', title: 'Второй завтрак' },
        { key: 'lunch', title: 'Обед' },
        { key: 'afternoon_tea', title: 'Полдник' },
        { key: 'dinner', title: 'Ужин' },
        { key: 'actions', title: 'Действия', sortable: false },
      ]),
      editedIndex = ref(-1),
      editedItem = ref({
        day: 1,
        breakfast: '',
        elevenses: '',
        lunch: '',
        afternoon_tea: '',
        dinner: '',
      }),
      defaultItem = ref({
        day: 1,
        breakfast: '',
        elevenses: '',
        lunch: '',
        afternoon_tea: '',
        dinner: '',
      })

const formTitle = computed(() => editedIndex.value === -1 ? 'Добавить' : 'Редактировать')

const methods = {
  editItem(item: Item) {
    editedIndex.value = items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialog.value = true
  },
  deleteItem(item: Item) {
    editedIndex.value = items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
  },
  async deleteItemConfirm() {
    swapOn()
    await axios.delete(API_URL + editedItem.value.day + '/').then((res) => {
      if (res.status === 204) {
        deleteDailyMenu(editedIndex.value)
      }
    }).finally(swapOff)
    methods.closeDelete()
  },
  close() {
    dialog.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem.value)
      editedIndex.value = -1
    })
  },
  closeDelete() {
    dialogDelete.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem.value)
      editedIndex.value = -1
    })
    methods.close()
  },
  async save() {
    if (editedIndex.value > -1) {
      swapOn()
      await axios.patch(API_URL + editedItem.value.day + '/', editedItem.value).then((res) => {
        if (res.status === 200) {
          editDailyMenu(editedIndex.value, editedItem.value)
        }
      }).finally(swapOff)
    } else {
      swapOn()
      await axios.post(API_URL, editedItem.value).then((res) => {
        if (res.status === 201) {
          addDailyMenu(editedItem.value)
        }
      }).finally(swapOff)
    }
    methods.close()
  }
}

watch(dialog, async v => (v || methods.close()))
watch(dialogDelete, async v => (v || methods.closeDelete()))

swapOn()
axios.get(API_URL).then((res) => {
  if (res.status === 200 && 'items' in res.data) {
    setDailyMenu(res.data.items)
  }
}).finally(swapOff)
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="[{ key: 'day', order: 'asc' }]"
    hide-no-data
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
        theme="dark"
      >
        <v-toolbar-title>Ежедневное меню</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="blue"
              class="mb-2"
              variant="flat"
              v-bind="props"
            >
              Добавить
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.day"
                      label="День недели"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.breakfast"
                      label="Завтрак"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.elevenses"
                      label="Второй завтрак"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.lunch"
                      label="Обед"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.afternoon_tea"
                      label="Полдник"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.dinner"
                      label="Ужин"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue"
                variant="flat"
                @click="methods.close"
              >
                Отмена
              </v-btn>
              <v-btn
                color="blue"
                variant="flat"
                @click="methods.save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Вы уверены, что хотите удалить?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue" variant="flat" @click="methods.closeDelete">Отмена</v-btn>
              <v-btn color="blue" variant="flat" @click="methods.deleteItemConfirm">Да</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        icon="fas fa-pencil"
        size="small"
        class="me-2"
        @click="methods.editItem(item)"
      />
      <v-icon
        icon="fas fa-remove"
        size="small"
        @click="methods.deleteItem(item)"
      />
    </template>
    <template v-slot:bottom />
  </v-data-table>
</template>
