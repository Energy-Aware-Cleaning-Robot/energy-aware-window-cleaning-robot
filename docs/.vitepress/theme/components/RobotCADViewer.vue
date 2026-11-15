
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

type Category = 'Mechanical' | 'Electrical' | 'Control'

interface Part {
  id: string
  name: string
  category: Category
  position: string
  normal: string
  description: string
  details: string[]
  link: string
}

const parts: Part[] = [
  {
    id: 'chassis',
    name: 'Chassis',
    category: 'Mechanical',
    position: '-0.07m 0.015m 0.07m',
    normal: '0m 1m 0m',
    description:
      'Lightweight PLA structural frame supporting the robot components.',
    details: [
      'Preliminary dimensions: 200 × 200 × 80 mm',
      'Material: PLA',
      'Manufacturing: FDM 3D printing'
    ],
    link: '/design/mechanical'
  },
  {
    id: 'chamber',
    name: 'Suction Chamber',
    category: 'Mechanical',
    position: '0m 0.025m 0m',
    normal: '0m 1m 0m',
    description:
      'Integrated negative-pressure chamber used to maintain adhesion to vertical glass.',
    details: [
      'Single suction chamber',
      'Effective suction area to be verified',
      'Sealing performance under evaluation'
    ],
    link: '/design/suction'
  },
  {
    id: 'frame',
    name: 'Structural Supports',
    category: 'Mechanical',
    position: '0.075m 0.015m -0.07m',
    normal: '0m 1m 0m',
    description:
      'Structural members that connect the chassis and provide component mounting locations.',
    details: [
      'Material: PLA',
      'Weight optimisation in progress',
      'Mounting geometry under development'
    ],
    link: '/design/mechanical'
  }
]

const selectedId = ref<string | null>('chassis')
const category = ref('All')
const rotating = ref(false)
const viewer = ref<any>(null)
const modelReady = ref(false)

const modelUrl = withBase(
  '/models/lightweight-cleaning-robot.glb'
)

const selected = computed(() =>
  parts.find(p => p.id === selectedId.value) ?? null
)

const visibleParts = computed(() =>
  category.value === 'All'
    ? parts
    : parts.filter(p => p.category === category.value)
)

function selectPart(id: string) {
  selectedId.value = id
}

function setCategory(value: string) {
  category.value = value
}

function resetView() {
  if (!viewer.value) return

  viewer.value.cameraOrbit = '45deg 65deg auto'
  viewer.value.cameraTarget = 'auto auto auto'
  viewer.value.fieldOfView = 'auto'
  viewer.value.jumpCameraToGoal?.()
}

function zoom(factor: number) {
  if (!viewer.value) return

  const orbit = viewer.value.getCameraOrbit()
  viewer.value.cameraOrbit =
    `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * factor}m`
}

onMounted(async () => {
  await import('@google/model-viewer')
})
</script>

<template>
  <div class="cad-explorer">

    <div class="cad-layout">

      <!-- 3D MODEL -->
      <div class="cad-stage">

        <div class="stage-label">
          <small>SYSTEM LEVEL</small>
          <strong>Window Cleaning Robot</strong>
        </div>

        <ClientOnly>
          <model-viewer
            ref="viewer"
            :src="modelUrl"
            camera-controls
            :auto-rotate="rotating"
            shadow-intensity="0.8"
            exposure="0.9"
            environment-image="neutral"
            class="cad-model"
            @load="modelReady = true"
          >

            <!-- 3D HOTSPOTS -->
            <button
              v-for="part in visibleParts"
              :key="part.id"
              :slot="`hotspot-${part.id}`"
              :data-position="part.position"
              :data-normal="part.normal"
              class="hotspot"
              :class="{ active: selectedId === part.id }"
              @click="selectPart(part.id)"
            >
              <span class="hotspot-dot"></span>
              <span class="hotspot-label">
                {{ part.name }}
              </span>
            </button>

          </model-viewer>
        </ClientOnly>

        <div class="viewer-controls">
          <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>

          <div>
            <button @click="zoom(0.8)">+</button>
            <button @click="zoom(1.25)">−</button>
            <button @click="resetView">RESET</button>
            <button @click="rotating = !rotating">
              {{ rotating ? 'STOP' : 'ROTATE' }}
            </button>
          </div>
        </div>

      </div>

      <!-- DESCRIPTION PANEL -->
      <div class="cad-info">

        <template v-if="selected">
          <div class="info-header">
            <span>{{ selected.category.toUpperCase() }} SYSTEM</span>
            <button @click="selectedId = null">×</button>
          </div>

          <h2>{{ selected.name }}</h2>

          <p>{{ selected.description }}</p>

          <h3>TECHNICAL INFORMATION</h3>

          <ul>
            <li
              v-for="item in selected.details"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>

          <a :href="withBase(selected.link)" class="more-button">
            FIND OUT MORE ↗
          </a>
        </template>

        <template v-else>
          <span class="info-category">ROBOT ASSEMBLY</span>
          <h2>Explore the Robot</h2>
          <p>Select a hotspot on the model to explore its subsystem.</p>
        </template>

      </div>
    </div>

    <!-- FILTER BUTTONS -->
    <div class="category-buttons">
      <button
        v-for="item in ['All', 'Mechanical', 'Electrical', 'Control']"
        :key="item"
        :class="{ active: category === item }"
        @click="setCategory(item)"
      >
        {{ item.toUpperCase() }}
      </button>
    </div>

    <!-- COMPONENT CARDS -->
    <div class="component-grid">
      <button
        v-for="part in visibleParts"
        :key="part.id"
        class="component-card"
        :class="{ active: selectedId === part.id }"
        @click="selectPart(part.id)"
      >
        <small>{{ part.category.toUpperCase() }}</small>
        <strong>{{ part.name }}</strong>
      </button>
    </div>

  </div>
</template>


<style scoped>

/* ==========================================
   MAIN CAD EXPLORER
   ========================================== */

.cad-explorer {
  background: #ffffff;
  color: #1f2937;
  border-radius: 18px;
  padding: 18px;
  margin: 24px 0;
  border: 1px solid #e5e7eb;
}

/* ==========================================
   CAD LAYOUT
   ========================================== */

.cad-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
  gap: 18px;
}

/* ==========================================
   3D MODEL AREA - KEEP DARK BLUE
   ========================================== */

.cad-stage {
  height: 480px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    #304666 0%,
    #172238 55%,
    #111827 100%
  );
}

.cad-model {
  display: block;
  width: 100%;
  height: 100%;

  background: transparent;
}

/* ==========================================
   SYSTEM LEVEL LABEL
   ========================================== */

.stage-label {
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 16px;
  padding: 12px;

  border: 1px dashed #8195ae;
  border-radius: 10px;

  background: rgba(16, 24, 39, 0.9);
  pointer-events: none;
}

.stage-label small {
  display: block;
  font-size: 10px;
  letter-spacing: 1.4px;
  color: #b3d4e8;
}

.stage-label strong {
  display: block;
  font-size: 12px;
  margin-top: 6px;
  color: #ffffff;
}

/* ==========================================
   INTERACTIVE HOTSPOTS
   ========================================== */

.hotspot {
  display: flex;
  align-items: center;
  gap: 6px;

  background: transparent;
  border: 0;
  cursor: pointer;

  transform: translate(-50%, -50%);
}

.hotspot-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;

  background: #d69d55;
  border: 3px solid #ffffff;

  box-shadow: 0 0 0 5px rgba(214, 157, 85, 0.25);
}

.hotspot.active .hotspot-dot {
  background: #ffffff;
  box-shadow: 0 0 0 6px rgba(214, 157, 85, 0.65);
}

.hotspot-label {
  background: rgba(17, 24, 39, 0.92);
  border: 1px solid #64748b;
  border-radius: 6px;

  padding: 5px 8px;

  font-size: 11px;
  color: #ffffff;
  white-space: nowrap;
}

/* ==========================================
   CAD VIEWER CONTROLS
   ========================================== */

.viewer-controls {
  position: absolute;
  z-index: 3;

  bottom: 12px;
  left: 14px;
  right: 14px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  pointer-events: none;
}

.viewer-controls span {
  font-size: 10px;
  color: #cbd5e1;
}

.viewer-controls div {
  display: flex;
  gap: 5px;
  pointer-events: auto;
}

.viewer-controls button {
  background: #111827;
  border: 1px solid #43516a;
  border-radius: 7px;

  padding: 8px 10px;

  color: #ffffff;
  font-size: 11px;
  cursor: pointer;
}

.viewer-controls button:hover {
  background: #253550;
  border-color: #d69d55;
}

/* ==========================================
   SUBSYSTEM INFORMATION PANEL - WHITE
   ========================================== */

.cad-info {
  background: #ffffff;
  border: 1px solid #d6a25d;
  border-radius: 16px;
  padding: 24px;

  color: #1f2937;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 11px;
  letter-spacing: 1.5px;
  color: #a66a2c;
}

.info-header button {
  border: 1px solid #d1d5db;
  border-radius: 7px;

  padding: 4px 10px;

  color: #374151;
  background: #ffffff;
  cursor: pointer;
}

.info-header button:hover {
  background: #f3f4f6;
}

.info-category {
  font-size: 11px;
  letter-spacing: 1.5px;
  color: #a66a2c;
}

.cad-info h2 {
  color: #111827;
  font-size: 25px;

  margin: 28px 0 18px;
  padding-left: 12px;

  border-left: 3px solid #d69d55;
}

.cad-info p {
  color: #4b5563;
  line-height: 1.8;
  font-size: 14px;
}

.cad-info h3 {
  margin-top: 24px;
  color: #a66a2c;
  font-size: 12px;
  letter-spacing: 1px;
}

.cad-info ul {
  padding-left: 18px;
}

.cad-info li {
  color: #4b5563;
  font-size: 13px;
  margin: 8px 0;
}

/* ==========================================
   FIND OUT MORE BUTTON
   ========================================== */

.more-button {
  display: inline-block;
  margin-top: 22px;

  border: 1px solid #d69d55;
  border-radius: 25px;

  padding: 12px 16px;

  color: #925b23;
  background: #ffffff;

  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

.more-button:hover {
  background: #fff7ed;
  color: #784513;
}

/* ==========================================
   CATEGORY FILTER BUTTONS
   ========================================== */

.category-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 22px 0 12px;
}

.category-buttons button {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 25px;

  padding: 10px 15px;

  font-size: 11px;
  color: #374151;

  cursor: pointer;
}

.category-buttons button:hover {
  border-color: #d69d55;
}

.category-buttons button.active {
  border-color: #d69d55;
  background: #fff7ed;
  color: #925b23;
}

/* ==========================================
   COMPONENT CARDS - WHITE
   ========================================== */

.component-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.component-card {
  text-align: left;

  border: 1px solid #e5e7eb;
  border-radius: 10px;

  padding: 14px;
  background: #ffffff;

  cursor: pointer;
  transition: all 0.2s ease;
}

.component-card:hover {
  border-color: #d69d55;
  background: #fffaf4;
}

.component-card.active {
  border-color: #d69d55;
  background: #fff7ed;
}

.component-card small {
  display: block;

  color: #6b7280;
  font-size: 10px;
  letter-spacing: 1px;

  margin-bottom: 8px;
}

.component-card strong {
  color: #111827;
  font-size: 13px;
}

/* ==========================================
   RESPONSIVE DESIGN
   ========================================== */

@media (max-width: 900px) {

  .cad-layout {
    grid-template-columns: 1fr;
  }

  .cad-stage {
    height: 380px;
  }

  .component-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}

@media (max-width: 500px) {

  .cad-explorer {
    padding: 10px;
  }

  .component-grid {
    grid-template-columns: 1fr;
  }

  .viewer-controls {
    flex-direction: column;
    align-items: flex-start;
  }

}

</style>

