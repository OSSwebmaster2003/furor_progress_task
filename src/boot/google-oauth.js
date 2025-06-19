import { boot } from 'quasar/wrappers'
import GoogleLogin from 'vue3-google-login'

export default boot(({ app }) => {
  app.use(GoogleLogin, {
    clientId: '978241688763-f66j7vnau9csv4es9l926eivhflbpf71.apps.googleusercontent.com',
  })
})
