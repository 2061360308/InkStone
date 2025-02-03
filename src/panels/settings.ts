import { Component } from 'vue'
import { Panel, PanelIconPosition } from './base'

export class SettingsPanel implements Panel {
  id = 'settings'
  name = '设置'
  icon = 'gear'
  position = PanelIconPosition.bottom
  index = 1

  async component(): Promise<Component> {
    const m = await import('@/components/SettingsPanel.vue')
    return m.default as Component
  }

  onActive(): void {
    console.log('AboutPanel onActive')
  }
}
