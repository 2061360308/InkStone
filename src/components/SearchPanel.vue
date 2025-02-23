<script setup lang="ts">
import { Ref, ref, computed, defineEmits, defineExpose } from 'vue'
import api from '@/utils/api'
import { openRemoteFile } from '@/utils/filePanelOperation'
import { watch } from 'vue'

const emit = defineEmits(['change:loading', 'change:tipLoad'])
const loading = ref(false)
const tipLoad = computed(() => !api.ready)

watch(
  () => loading.value,
  (value) => {
    emit('change:loading', value)
  },
  {
    immediate: true,
  },
)

watch(
  () => tipLoad.value,
  (value) => {
    emit('change:tipLoad', value)
  },
  {
    immediate: true,
  },
)

const repo = computed(() => api.repo as string)
const branch = computed(() => api.branch as string)

const keywords = ref('')

const searchResults: Ref<Array<{ name: string; path: string }>> = ref([])

const refresh = async () => {
  if (!keywords.value) {
    return
  }
  loading.value = true

  searchResults.value = await api.searchFiles(keywords.value)

  // 定时1秒后取消loading
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

defineExpose({
  refresh,
})
</script>
<template>
  <div class="search-panel">
    <el-empty description="离线模式无法搜索远程文件" v-if="tipLoad" />
    <div v-else>
      <el-input
        v-model="keywords"
        style="width: 100%"
        clearable
        :autosize="{ minRows: 1, maxRows: 5 }"
        placeholder="搜索"
        @change="refresh"
      />
      <div class="inner-box" v-loading="loading">
        <div v-if="searchResults.length > 0">
          <div
            class="result-item"
            v-for="node in searchResults"
            @click="openRemoteFile(node.path, repo, branch)"
            :key="node.path"
          >
            <el-tooltip effect="dark" :content="node.path" placement="right-start">
              <span>
                <span class="title">{{ node.name }}</span>
                <div class="path">{{ node.path }}</div>
              </span>
            </el-tooltip>
          </div>
        </div>
        <div v-else>
          <el-empty description="无搜索结果" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result-item {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  gap: 10px; /* 子元素之间的间距 */
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: var(--el-border-color) 1px solid;

  &:hover {
    color: var(--el-color-primary);
  }

  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 10px;
  }

  .path {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
