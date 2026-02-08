<template>
  <div class="min-h-screen bg-gray-50">
    <CardNavbarBack title="Reimbursement General"/>
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div class="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h1 class="text-lg sm:text-xl font-bold text-gray-900">Reimbursement (General)</h1>
            <p class="text-xs text-gray-500">Ajukan biaya operasional harian</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-6">
        <!-- Form -->
        <div class="lg:col-span-4">
          <div class="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
            <h2 class="text-sm font-bold text-gray-700">Form Pengajuan</h2>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Tanggal</label>
                <input v-model="form.date" type="date" class="w-full rounded-xl border-gray-200 shadow-sm focus:ring-0 focus:border-gray-300 text-sm p-2" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
                <select v-model="form.category" class="w-full rounded-xl border-gray-200 shadow-sm focus:ring-0 focus:border-gray-300 text-sm p-2">
                  <option disabled value="">Pilih kategori</option>
                  <option value="TRANSPORT">Transportasi</option>
                  <option value="MEAL">Makan/Minum</option>
                  <option value="PARKING">Parkir</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Nominal (Rp)</label>
                <input v-model.number="form.amount" type="number" min="0" class="w-full rounded-xl border-gray-200 shadow-sm focus:ring-0 focus:border-gray-300 text-sm p-2" placeholder="cth: 25000" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Catatan</label>
                <textarea v-model="form.note" rows="3" class="w-full rounded-xl border-gray-200 shadow-sm focus:ring-0 focus:border-gray-300 text-sm p-2" placeholder="Tambahkan keterangan singkat"></textarea>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition" @click="resetForm">Reset</button>
              <button class="px-4 py-2 rounded-xl bg-java-teal text-white text-sm font-bold hover:opacity-90 active:scale-95 transition disabled:opacity-50" :disabled="!canSubmit" @click="submit">Ajukan</button>
            </div>
          </div>
        </div>

        <!-- List -->
        <div class="lg:col-span-6">
          <div class="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
              <button v-for="t in tabs" :key="t.key" class="px-3 py-1.5 rounded-xl text-xs font-bold border transition"
                      :class="activeTab === t.key ? 'bg-java-teal text-white border-java-teal' : 'bg-gray-50 text-gray-700 border-gray-200'"
                      @click="activeTab = t.key">
                {{ t.label }}
              </button>
            </div>

            <div v-if="filtered.length === 0" class="text-sm text-gray-500">Belum ada pengajuan.</div>
            <div v-else class="space-y-3">
              <div v-for="(r, i) in filtered" :key="i" class="rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ labelCategory(r.category) }} • Rp {{ formatNumber(r.amount) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ r.date }} • {{ r.note || 'Tanpa catatan' }}
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        :class="statusClass(r.status)">
                    {{ labelStatus(r.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const currentUserId = computed(() => (userStore.user?.user_id))
const reimbursements = computed(() => userStore.reimbursementsGeneral)

type ReimbursementStatus = 'WAITING' | 'APPROVED' | 'REJECTED'
type ReimbursementCategory = 'TRANSPORT' | 'MEAL' | 'PARKING' | 'OTHER'

const tabs = [
  { key: 'ALL', label: 'Semua' },
  { key: 'WAITING', label: 'Pengajuan' },
  { key: 'APPROVED', label: 'Disetujui' },
  { key: 'REJECTED', label: 'Ditolak' },
]
const activeTab = ref<string>('ALL')

const form = reactive<{
  date: string
  category: ReimbursementCategory | ''
  amount: number | null
  note: string
}>({
  date: new Date().toISOString().slice(0, 10),
  category: '',
  amount: null,
  note: ''
})

const canSubmit = computed(() => !!form.date && !!form.category && !!form.amount && form.amount > 0)

const resetForm = () => {
  form.date = new Date().toISOString().slice(0, 10)
  form.category = ''
  form.amount = null
  form.note = ''
}

const filtered = computed(() => {
  if (activeTab.value === 'ALL') return reimbursements.value
  return reimbursements.value.filter(r => r.status === activeTab.value)
})

const labelCategory = (c: ReimbursementCategory) => {
  switch (c) {
    case 'TRANSPORT': return 'Transportasi'
    case 'MEAL': return 'Makan/Minum'
    case 'PARKING': return 'Parkir'
    default: return 'Lainnya'
  }
}
const labelStatus = (s: ReimbursementStatus) => {
  switch (s) {
    case 'WAITING': return 'Pengajuan'
    case 'APPROVED': return 'Disetujui'
    case 'REJECTED': return 'Ditolak'
  }
}
const statusClass = (s: ReimbursementStatus) => {
  switch (s) {
    case 'WAITING': return 'bg-yellow-50 text-yellow-700 border border-yellow-100'
    case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    case 'REJECTED': return 'bg-rose-50 text-rose-700 border border-rose-100'
  }
}
const formatNumber = (n: number) => new Intl.NumberFormat('id-ID').format(n)

const submit = () => {
  if (!canSubmit.value) return
  userStore.addGeneralReimbursement(currentUserId.value, {
    date: form.date,
    category: form.category as ReimbursementCategory,
    amount: form.amount as number,
    note: form.note,
    status: 'WAITING'
  })
  resetForm()
}

onMounted(async () => {
  await userStore.fetchReimbursementsGeneral(currentUserId.value)
})
</script>

<style scoped>
</style>