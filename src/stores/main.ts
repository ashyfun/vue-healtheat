import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Item } from '@/models'

export const useLoaderStore = defineStore('loader', () => {
  const loader = ref(false)
  function swapOn() {
    loader.value = true
  }

  function swapOff() {
    setTimeout(() => {
      loader.value = false
    }, 500);
  }

  return { loader, swapOn, swapOff }
})

export const useDailyMenuStore = defineStore('dailyMenu', () => {
  const items = ref(Array<Item>())

  function setDailyMenu(data: Array<Item>) {
    items.value = data
  }

  function editDailyMenu(index: number, value: Item) {
    Object.assign(items.value[index], value)
  }

  function addDailyMenu(value: Item) {
    items.value.push(value)
  }

  function deleteDailyMenu(index: number) {
    items.value.splice(index, 1)
  }

  return { items, setDailyMenu, editDailyMenu, addDailyMenu, deleteDailyMenu }
})
