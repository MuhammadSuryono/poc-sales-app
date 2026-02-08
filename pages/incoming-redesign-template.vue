<template>
  <div class="incoming-page">
    <!-- Master-Detail Layout -->
    <div class="layout-container">
      <!-- Customer List (Master) -->
      <div 
        class="customer-list-panel"
        :class="{ 'hidden lg:block': showDetail, 'block': !showDetail }"
      >
        <!-- Search Bar -->
        <div class="search-container">
          <FormInput 
            v-model="search" 
            placeholder="Cari customer..." 
            class="w-full"
          >
            <template #icon>
              <MagnifyingGlassIcon class="h-4 w-4" />
            </template>
          </FormInput>
        </div>

        <!-- Customer Cards -->
        <div class="customer-list">
          <CustomerIncoming 
            v-for="(dt, i) in allTiket" 
            :tiketData="dt" 
            :key="i" 
            @detail="goToIncomingPageDetail"
            class="animate-slide-up"
          />
        </div>
      </div>

      <!-- Detail Panel -->
      <div 
        class="detail-panel"
        :class="{ 'block': showDetail, 'hidden lg:block': !showDetail }"
      >
        <!-- Empty State -->
        <div v-if="!showDetail" class="empty-state">
          <div class="empty-icon">
            <UserGroupIcon class="h-16 w-16 text-gray-300" />
          </div>
          <span class="text-lg font-semibold text-gray-400">Pilih customer untuk melihat detail</span>
        </div>

        <!-- Customer Detail -->
        <div v-else class="detail-content">
          <!-- Header -->
          <div class="detail-header glass-dark">
            <button 
              @click="showDetail = false" 
              class="lg:hidden back-button"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </button>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-white">{{ detailTiket?.customerName }}</h2>
              <p class="text-sm text-label-secondary">{{ detailTiket?.customerNo }}</p>
            </div>
            <div 
              class="status-badge"
              :class="{
                'status-danger': detailTiket?.status === 'MACET',
                'status-success': detailTiket?.status === 'LANCAR'
              }"
            >
              {{ detailTiket?.status }}
            </div>
          </div>

          <!-- Scrollable Content -->
          <div class="detail-scroll-area">
            <!-- Customer Info Card -->
            <div class="info-card">
              <div class="card-header">
                <UserIcon class="h-5 w-5 text-primary" />
                <h3>Informasi Pelanggan</h3>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Customer No.</span>
                  <span class="info-value">{{ detailTiket?.customerNo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">No. KTP/NPWP</span>
                  <span class="info-value">{{ detailTiket?.identityNumber ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Nama</span>
                  <span class="info-value">{{ detailTiket?.customerName ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Telepon</span>
                  <span class="info-value">{{ detailTiket?.customerPhone ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Badan Usaha</span>
                  <span class="info-value">{{ detailTiket?.badanUsaha ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Balance</span>
                  <span class="info-value text-primary font-semibold">
                    Rp. {{ numberFormatting.setNumberFormatWithSeparator(detailTiket?.balance) }}
                  </span>
                </div>
                <div class="info-item col-span-2">
                  <span class="info-label">Alamat 1</span>
                  <span class="info-value">{{ detailTiket?.alamat ?? '-' }}</span>
                </div>
                <div class="info-item col-span-2">
                  <span class="info-label">Alamat 2</span>
                  <span class="info-value">{{ detailTiket?.alamat2 ?? '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Activity Tabs -->
            <div class="activity-section">
              <h3 class="section-title">Aktivitas</h3>
              
              <!-- Tab Buttons -->
              <div class="tab-buttons">
                <button 
                  class="tab-button"
                  :class="{ 'tab-active': tabActive === 'visit' }"
                  @click="setTabActive('visit')"
                >
                  <ClockIcon class="h-4 w-4" />
                  <span>Histori Kunjungan</span>
                </button>
                <button 
                  class="tab-button"
                  :class="{ 'tab-active': tabActive === 'history' }"
                  @click="setTabActive('history')"
                >
                  <CurrencyDollarIcon class="h-4 w-4" />
                  <span>Balance</span>
                </button>
              </div>

              <!-- Visit History Tab -->
              <div v-if="tabActive === 'visit'" class="tab-content">
                <div 
                  v-for="(v, i) in historyVisit" 
                  :key="i"
                  class="visit-card hover-lift"
                  @click="setVisitHistorySelected(v)"
                >
                  <div class="visit-header">
                    <span class="visit-id">#salesID</span>
                    <span class="visit-date">{{ useString.setDateTimeFormat(new Date(v.visitDate)) }}</span>
                  </div>
                  <div class="visit-user">{{ v.userVisitName }}</div>
                  <div class="visit-note">{{ v.visitNote }}</div>
                </div>
              </div>

              <!-- Balance History Tab -->
              <div v-if="tabActive === 'history'" class="tab-content">
                <div class="balance-table">
                  <div class="table-header">
                    <div>#Invoice</div>
                    <div>Tanggal</div>
                    <div>Jenis</div>
                    <div>Debit</div>
                    <div>Kredit</div>
                  </div>
                  <div class="table-row" v-for="(h, i) in historyTransaction" :key="i">
                    <div>{{ h.invoiceNo }}</div>
                    <div>{{ useString.setDateFormat(new Date(h.date)) }}</div>
                    <div>{{ h.type }}</div>
                    <div>{{ h.debit }}</div>
                    <div>{{ h.credit }}</div>
                  </div>
                  <div class="table-footer">
                    <div class="col-span-4 text-right font-semibold">Grand Total:</div>
                    <div class="font-semibold">10.000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Footer -->
          <div 
            v-if="detailTiket?.visitStatus !== 'FINISH'" 
            class="action-footer"
          >
            <div class="action-container">
              <div class="action-info">
                <MapPinIcon class="h-5 w-5 text-java-green" />
                <div>
                  <div class="text-sm font-medium">{{ myAddress }}</div>
                  <div class="text-xs text-gray-500">{{ calculateDistance(detailTiket) }}</div>
                </div>
              </div>
              
              <div class="action-buttons">
                <ButtonPrimary 
                  v-if="detailTiket?.visitStatus === 'TODO'" 
                  text="Check In" 
                  @click="checkIn"
                  class="flex-1"
                />
                <ButtonDanger 
                  v-if="detailTiket?.visitStatus === 'INPROGRESS'" 
                  text="Check Out" 
                  @click="checkOut"
                  class="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visit Modal (keep existing modal logic) -->
    <PopUpModal v-model:show="showModal" header="Input Detail Kunjungan">
      <!-- Keep existing modal content -->
    </PopUpModal>
  </div>
</template>

<script setup lang="ts">
// Keep existing script setup
</script>

<style scoped>
.incoming-page {
  min-height: 100vh;
  background: var(--color-gray-50);
}

.layout-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  max-width: 1920px;
  margin: 0 auto;
  height: calc(100vh - 100px);
}

/* Customer List Panel */
.customer-list-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .customer-list-panel {
    width: 30%;
    border-right: 1px solid var(--color-gray-200);
    padding-right: 1rem;
  }
}

.search-container {
  flex-shrink: 0;
}

.customer-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem;
}

/* Detail Panel */
.detail-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .detail-panel {
    width: 70%;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}

.empty-icon {
  padding: 2rem;
  background: var(--color-gray-100);
  border-radius: 50%;
}

/* Detail Content */
.detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--gradient-java-hero);
}

.back-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: var(--transition-base);
  color: white;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-success {
  background: var(--color-success);
  color: white;
}

.status-danger {
  background: var(--color-danger);
  color: white;
}

/* Scroll Area */
.detail-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Info Card */
.info-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 1rem;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-gray-100);
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-800);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.col-span-2 {
  grid-column: span 2;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.875rem;
  color: var(--color-gray-900);
}

/* Activity Section */
.activity-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-800);
}

.tab-buttons {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: var(--color-gray-100);
  border-radius: 0.75rem;
  width: fit-content;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-600);
  transition: var(--transition-base);
  cursor: pointer;
  border: none;
  background: transparent;
}

.tab-button:hover {
  color: var(--color-gray-900);
}

.tab-button.tab-active {
  background: white;
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Visit Card */
.visit-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: var(--transition-base);
}

.visit-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.visit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.visit-id {
  font-size: 0.75rem;
  color: var(--color-gray-400);
}

.visit-date {
  font-size: 0.75rem;
  color: var(--color-danger);
  font-weight: 500;
  text-transform: uppercase;
}

.visit-user {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.visit-note {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Balance Table */
.balance-table {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  overflow: hidden;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.table-header,
.table-row,
.table-footer {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.table-header {
  background: var(--color-gray-50);
  font-weight: 600;
  border-bottom: 2px solid var(--color-gray-200);
}

.table-row {
  border-bottom: 1px solid var(--color-gray-100);
}

.table-row:hover {
  background: var(--color-gray-50);
}

.table-footer {
  background: var(--color-gray-50);
  border-top: 2px solid var(--color-gray-200);
}

.table-footer .col-span-4 {
  grid-column: span 4;
}

/* Action Footer */
.action-footer {
  flex-shrink: 0;
  background: white;
  border-top: 1px solid var(--color-gray-200);
  padding: 1rem 1.5rem;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}

.action-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .action-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.action-info {
  display: flex;
  align-items: start;
  gap: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}
</style>
