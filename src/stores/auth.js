// stores/auth.js
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import * as api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('profile')),
    isLoading: false,
    error: null,
    profile: null,
  }),

  actions: {
    async signin(form, router) {
      this.isLoading = true
      try {
        const { data } = await api.signin(form)
        this.user = data
        localStorage.setItem('profile', JSON.stringify(data))
        this.error = null
        router.push('/')
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
      } finally {
        this.isLoading = false
      }
    },

    async signup(form, router) {
      this.isLoading = true
      try {
        const { data } = await api.signup(form)
        this.user = data
        localStorage.setItem('profile', JSON.stringify(data))
        this.error = null
        router.push('/')
      } catch (err) {
        this.error = err.response?.data?.message || 'Signup failed'
      } finally {
        this.isLoading = false
      }
    },

    logout(router) {
      this.user = null
      localStorage.removeItem('profile')
      router.push('/')
    },

    checkTokenAndLogoutIfExpired() {
      const token = this.user?.token
      if (token) {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 < Date.now()) {
          this.logout()
        }
      }
    },

    async visitProfile(username) {
      this.isLoading = true
      try {
        const { data } = await api.visitProfile(username)
        this.profile = data
      } catch (err) {
        this.error = err
      } finally {
        this.isLoading = false
      }
    },

    async saveProfileInfo(form, username) {
      this.isLoading = true
      try {
        const { data } = await api.saveProfileInfo(username, form)
        this.user = data
        localStorage.setItem('profile', JSON.stringify(data))
        this.profile = data
        useRouter().push(`/${data?.result?.username}`)
      } catch (err) {
        this.error = err
      } finally {
        this.isLoading = false
      }
    },
  },
})
