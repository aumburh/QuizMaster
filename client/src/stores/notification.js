import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  let notificationId = 0

  const show = ({ message, type = 'info', duration = 5000 }) => {
    const id = ++notificationId
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    }

    notifications.value.push(notification)

// Automātiski noņemt paziņojumu pēc laika beigām
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

// Ērtības metodes
  const success = (message, duration) => show({ message, type: 'success', duration })
  const error = (message, duration) => show({ message, type: 'error', duration })
  const warning = (message, duration) => show({ message, type: 'warning', duration })
  const info = (message, duration) => show({ message, type: 'info', duration })

  return {
    notifications,
    show,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
})

