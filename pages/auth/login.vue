<template>
  <div class="min-h-screen flex items-center sm:items-start sm:pt-30 px-3 sm:px-0 justify-center bg-[url('https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/wac.92a80da2.svg')] bg-no-repeat bg-center bg-cover">
    <div class="bg-white p-8 rounded-sm shadow-xl w-[400px]">
      <div class="text-3xl text-center">
        <span class="text-primary-hover font-bold">KJ</span><span class="text-success">S</span>
      </div>
      <h2 class="text-sm text-gray-500 mb-6 text-center">Login to continue</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <FormInput v-model="userId" label="Username" placeholder="Username" />
        </div>
        <div class="mb-6">
          <FormInput v-model="password" label="Password" type="password" placeholder="password" />
        </div>
        <ButtonPrimary text="Login" class="w-full" @click="login" />
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingState } from '~/stores/loading'
import { useNotificationStore } from '~/stores/notification'
import { useUserStore } from '~/stores/user'
import { sampleUserLogin, type User } from '~/types/user'

definePageMeta({
    layout: 'auth'
})

const userStore = useUserStore()
const loading = useLoadingState()
const notif = useNotificationStore()
const storage = useStorage()
const allUser = ref<User[]>(sampleUserLogin)

const userId = ref<string>('')
const password = ref<string>('')

function login() {
  loading.setLoading('Sedang masuk...')
  const user = allUser.value?.find(u => u.userId === userId.value)
  if (user) {
    storage.saveDataAsString('token', `${Date.now()}`)
    userStore.login(user)
    setTimeout(() => {
      loading.disLoading()
      notif.toggle('Berhasil masuk')
      navigateTo('/')
    }, 3000)
    return
  }

  setTimeout(() => {
    loading.disLoading()
    notif.toggle('Gagal masuk, periksa kembali user dan password anda!')
  }, 3000)
}
</script>

<style>

</style>