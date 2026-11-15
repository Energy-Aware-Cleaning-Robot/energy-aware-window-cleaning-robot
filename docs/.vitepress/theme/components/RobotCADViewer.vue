
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

const model = ref<any>(null)
const selected = ref('chassis')
const autoRotate = ref(false)

const subsystems = [
  {
    id: 'chassis',
    name: 'Chassis & Structure',
    description:
      'Lightweight 3D-printed PLA structure supporting the robot components and integrated suction chamber.',
    specs: [
      'Dimensions: 200 × 200 × 80 mm',
      'Material: PLA',
      'Target robot mass: 1.5 kg',
      'Manufacturing: FDM 3D printing'
    ]
  },
  {
    id: 'locomotion',
    name: 'Locomotion System',
    description:
      'Motor-driven wheel system designed to provide controlled movement across vertical glass surfaces.',
    specs: [
      'Motor selection: Under development',
      'Wheel configuration: To be finalised',
      'Movement: Upward, downward and horizontal',
      'Design priority: Traction and energy efficiency'
    ]
  },
  {
    id: 'suction',
    name: 'Suction Adhesion',
    description:
      'A single negative-pressure chamber generates adhesion force to keep the robot attached to glass.',
    specs: [
      'Adhesion: Negative pressure',
      'Configuration: Single suction chamber',
      'Preliminary suction area: 0.06283 m²',
      'Fan and seal: Under evaluation'
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics & Control',
    description:
      'Power, sensing and control subsystem supporting locomotion, suction monitoring and trajectory tracking.',
    specs: [
      'Controller: To be selected',
      'Motor drivers: To be selected',
      'Sensors: Pressure and motion sensing planned',
      'Power architecture: Under development'
    ]
  }
]

const active = computed(
  () => subsystems.find(s => s.id === selected.value)!
)

const modelUrl = withBase(
  '/models/lightweight-cleaning-robot.glb'
)

onMounted(() => {
  import('@google/model-viewer')
})

function resetCamera() {
  if (!model.value) return
  model.value.cameraOrbit = '45deg 65deg auto'
  model.value.cameraTarget = 'auto auto auto'
  model.value.fieldOfView = 'auto'
  model.value.jumpCameraToGoal?.()
}
</script>

<template>
  <div class="robot-cad">
    <div class="cad-toolbar">
      <div>
        <strong>Robot CAD Explorer</strong>
        <small>Preliminary mechanical design</small>
      </div>

      <div class="cad-actions">
        <button @click="resetCamera">
          Reset View
        </button>
        <button @click="autoRotate = !autoRotate">
          {{ autoRotate ? 'Stop Rotation' : 'Auto Rotate' }}
        </button>
      </div>
    </div>

    <ClientOnly>
      <model-viewer
        ref="model"
        :src="modelUrl"
        alt="Interactive CAD model of the window-cleaning robot"
        camera-controls
        :auto-rotate="autoRotate"
        shadow-intensity="0.8"
        exposure="0.85"
        environment-image="neutral"
        tone-mapping="commerce"
        class="cad-model"
      />
    </ClientOnly>

    <div class="cad-controls">
      <label for="subsystem">Select Subsystem</label>

      <select id="subsystem" v-model="selected">
        <option
          v-for="system in subsystems"
          :key="system.id"
          :value="system.id"
        >
          {{ system.name }}
        </option>
      </select>
    </div>

    <div class="cad-description">
      <h3>{{ active.name }}</h3>
      <p>{{ active.description }}</p>

      <h4>Technical Specifications</h4>

      <ul>
        <li
          v-for="spec in active.specs"
          :key="spec"
        >
          {{ spec }}
        </li>
      </ul>
    </div>

    <div class="cad-footer">
      Drag to rotate · Scroll to zoom · Right-drag to pan
    </div>
  </div>
</template>

<style scoped>
.robot-cad {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  margin: 24px 0;
}

.cad-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
}

.cad-toolbar strong {
  display: block;
  font-size: 16px;
}

.cad-toolbar small {
  color: var(--vp-c-text-2);
}

.cad-actions {
  display: flex;
  gap: 8px;
}

button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  padding: 7px 12px;
  background: var(--vp-c-bg);
  font-size: 13px;
  cursor: pointer;
}

button:hover {
  border-color: var(--vp-c-brand-1);
}

.cad-model {
  display: block;
  width: 100%;
  height: 480px;
  background: linear-gradient(135deg, #334155, #0f172a);
}

.cad-controls {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cad-controls label {
  font-weight: 600;
  font-size: 14px;
}

.cad-controls select {
  width: 100%;
  padding: 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.cad-description {
  padding: 0 18px 20px;
}

.cad-description h3 {
  margin-top: 10px;
}

.cad-description h4 {
  font-size: 14px;
}

.cad-description p,
.cad-description li {
  font-size: 14px;
  line-height: 1.7;
}

.cad-footer {
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}
</style>
