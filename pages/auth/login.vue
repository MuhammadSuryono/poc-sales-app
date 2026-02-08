<template>
  <div class="min-h-screen flex items-center sm:items-start sm:pt-30 px-3 sm:px-0 justify-center bg-java-dark">
    <div class="bg-white p-8 rounded-sm shadow-xl w-[400px]">
      <div class="text-3xl text-center">
        <NuxtImg src="/images/logo.png" alt="logo" class="w-24 h-24 mx-auto" />
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
import { TABLE_USER } from '~/types/table'
import { sampleUserLogin, type User } from '~/types/user'

definePageMeta({
    layout: 'auth'
})

const userStore = useUserStore()
const loading = useLoadingState()
const notif = useNotificationStore()
const storage = useStorage()
const allUser = ref<User[]>(sampleUserLogin)
const { $supabase } = useNuxtApp()

const userId = ref<string>('')
const password = ref<string>('')

async function login() {
  loading.setLoading('Sedang masuk...')
  const { data: user, error: err } = await $supabase
    .from(TABLE_USER)
    .select('*')
    .eq('user_id', userId.value)
    .single()
  if (err) {
    setTimeout(() => {
      loading.disLoading()
      notif.toggle('Gagal masuk, periksa kembali user dan password anda!')
    }, 3000)
    return
  }

  if (user.password !== password.value) {
    setTimeout(() => {
      loading.disLoading()
      notif.toggle('Gagal masuk, periksa kembali user dan password anda!')
    }, 3000)
    return
  }

  storage.saveDataAsString('token', `${Date.now()}`)
  userStore.login(user)
  setTimeout(() => {
    loading.disLoading()
    notif.toggle('Berhasil masuk')
    navigateTo('/')
  }, 3000)
}
</script>

<style>

</style>