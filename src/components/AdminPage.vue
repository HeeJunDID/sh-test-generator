<script setup>
import { ref, onMounted } from 'vue'
import { getUsersApi, approveUserApi, rejectUserApi } from '../api/admin.js'

const users = ref([])
const isLoading = ref(false)
const actionLoading = ref(null)
const error = ref(null)

async function loadUsers() {
  isLoading.value = true
  error.value = null
  try {
    users.value = await getUsersApi()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

async function approve(id) {
  actionLoading.value = id
  try {
    await approveUserApi(id)
    await loadUsers()
  } catch (e) {
    error.value = e.message
  } finally {
    actionLoading.value = null
  }
}

async function reject(id) {
  actionLoading.value = id
  try {
    await rejectUserApi(id)
    await loadUsers()
  } catch (e) {
    error.value = e.message
  } finally {
    actionLoading.value = null
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const statusLabel = { PENDING: '승인 대기', APPROVED: '승인', REJECTED: '거절' }
const statusClass = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' }

const pendingCount = () => users.value.filter(u => u.status === 'PENDING').length

onMounted(loadUsers)
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">사용자 관리</h2>
        <span v-if="pendingCount() > 0" class="pending-badge">{{ pendingCount() }}명 대기 중</span>
      </div>
      <button class="refresh-btn" @click="loadUsers" :disabled="isLoading" title="새로고침">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ spinning: isLoading }">
          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      </button>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>

    <div class="table-wrap">
      <div class="table-head">
        <div class="col-name">이름</div>
        <div class="col-id">아이디</div>
        <div class="col-team">소속팀</div>
        <div class="col-date">가입 신청일</div>
        <div class="col-status">상태</div>
        <div class="col-action">관리</div>
      </div>

      <div v-if="isLoading" class="table-body">
        <div v-for="n in 4" :key="n" class="table-row skeleton-row">
          <div class="col-name"><span class="skel skel-line" style="width:80px" /></div>
          <div class="col-id"><span class="skel skel-line" style="width:70px" /></div>
          <div class="col-team"><span class="skel skel-line" style="width:60px" /></div>
          <div class="col-date"><span class="skel skel-line" style="width:110px" /></div>
          <div class="col-status"><span class="skel skel-line" style="width:56px;border-radius:20px;height:20px" /></div>
          <div class="col-action"><span class="skel skel-line" style="width:120px;border-radius:6px;height:28px" /></div>
        </div>
      </div>

      <div v-else-if="users.length === 0" class="empty-state">
        <p>가입 신청한 사용자가 없습니다.</p>
      </div>

      <div v-else class="table-body">
        <div v-for="u in users" :key="u.id" class="table-row">
          <div class="col-name">
            <span class="user-name">{{ u.displayName }}</span>
          </div>
          <div class="col-id">
            <span class="user-id">{{ u.username }}</span>
          </div>
          <div class="col-team">{{ u.team || '-' }}</div>
          <div class="col-date">{{ formatDate(u.createdAt) }}</div>
          <div class="col-status">
            <span class="badge" :class="statusClass[u.status] || 'badge-pending'">
              {{ statusLabel[u.status] || u.status }}
            </span>
          </div>
          <div class="col-action">
            <template v-if="u.status === 'PENDING'">
              <button
                class="action-btn approve"
                :disabled="actionLoading === u.id"
                @click="approve(u.id)"
              >승인</button>
              <button
                class="action-btn reject"
                :disabled="actionLoading === u.id"
                @click="reject(u.id)"
              >거절</button>
            </template>
            <template v-else-if="u.status === 'APPROVED'">
              <button
                class="action-btn reject"
                :disabled="actionLoading === u.id"
                @click="reject(u.id)"
              >승인 취소</button>
            </template>
            <template v-else>
              <button
                class="action-btn approve"
                :disabled="actionLoading === u.id"
                @click="approve(u.id)"
              >재승인</button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.pending-badge {
  background: #fef3c7;
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid #fde68a;
}

.refresh-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.refresh-btn:hover { background: var(--gray-100); color: var(--gray-700); }
.refresh-btn:disabled { cursor: not-allowed; opacity: 0.5; }

.spinning { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.error-msg {
  font-size: 12px;
  color: #ef4444;
  background: #fef2f2;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 12px;
}

.table-wrap {
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table-head {
  display: grid;
  grid-template-columns: 100px 120px 120px 1fr 90px 160px;
  background: var(--blue-navy);
  color: rgba(255,255,255,0.85);
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.table-body { overflow-y: auto; max-height: calc(100vh - 220px); }

.table-row {
  display: grid;
  grid-template-columns: 100px 120px 120px 1fr 90px 160px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-100);
  align-items: center;
}
.table-row:last-child { border-bottom: none; }

.skeleton-row { cursor: default; }

.user-name { font-size: 13px; font-weight: 600; color: var(--gray-800); }
.user-id { font-size: 12px; color: var(--gray-500); font-family: 'SF Mono', monospace; }

.col-team { font-size: 12px; color: var(--gray-600); }
.col-date { font-size: 12px; color: var(--gray-500); font-family: 'SF Mono', monospace; }

.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.badge-pending { background: #fef3c7; color: #92400e; }
.badge-approved { background: #d1fae5; color: #065f46; }
.badge-rejected { background: #fee2e2; color: #991b1b; }

.col-action { display: flex; gap: 6px; align-items: center; }

.action-btn {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: all 0.15s;
}
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn.approve { background: #d1fae5; color: #065f46; }
.action-btn.approve:hover:not(:disabled) { background: #a7f3d0; }
.action-btn.reject { background: #fee2e2; color: #991b1b; }
.action-btn.reject:hover:not(:disabled) { background: #fecaca; }

.empty-state {
  padding: 48px;
  text-align: center;
  font-size: 13px;
  color: var(--gray-400);
}

.skel {
  display: block;
  background: linear-gradient(90deg, var(--gray-100) 25%, #e8ecf0 50%, var(--gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 4px;
  height: 13px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
