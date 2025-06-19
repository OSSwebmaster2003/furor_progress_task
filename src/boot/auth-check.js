import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/auth'

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    auth.checkTokenAndLogoutIfExpired()
    next()
  })
})
