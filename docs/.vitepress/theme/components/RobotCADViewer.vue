
<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
  nextTick
} from 'vue'

import { withBase } from 'vitepress'

// ==========================================
// TYPES
// ==========================================

type Category = 'Mechanical' | 'Electrical' | 'Control'
type Axis = 'x' | 'y' | 'z'

interface Coordinates {
  x: number
  y: number
  z: number
}

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

interface SavedHotspot {
  position: string
  normal: string
}

// ==========================================
// DEFAULT SUBSYSTEMS
// ==========================================

const defaultParts: Part[] = [
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
      'Structural supports connecting the chassis and providing component mounting locations.',
    details: [
      'Material: PLA',
      'Weight optimisation in progress',
      'Mounting geometry under development'
    ],
    link: '/design/mechanical'
  }
]

const parts = ref<Part[]>(
  defaultParts.map(part => ({
    ...part,
    details: [...part.details]
  }))
)

// ==========================================
// REACTIVE STATE
// ==========================================

const viewer = ref<any>(null)

const modelReady = ref(false)
const modelError = ref('')

const selectedId = ref<string | null>('chassis')
const category = ref('All')
const rotating = ref(false)

const editMode = ref(false)
const editingId = ref('chassis')

const manual = ref<Coordinates>({
  x: -0.07,
  y: 0.015,
  z: 0.07
})

const saveMessage = ref('')
const exportMessage = ref('')

const STORAGE_KEY = 'window-cleaning-robot-hotspots-v1'

const modelUrl = withBase(
  '/models/lightweight-cleaning-robot.glb'
)

// ==========================================
// COMPUTED PROPERTIES
// ==========================================

const selected = computed(() =>
  parts.value.find(
    part => part.id === selectedId.value
  ) ?? null
)

const editingPart = computed(() =>
  parts.value.find(
    part => part.id === editingId.value
  ) ?? null
)

const visibleParts = computed(() => {
  if (category.value === 'All') {
    return parts.value
  }

  return parts.value.filter(
    part => part.category === category.value
  )
})

// ==========================================
// COORDINATE HELPERS
// ==========================================

function parsePosition(position: string): Coordinates {
  const values = position
    .split(/\s+/)
    .map(value => Number.parseFloat(value))

  return {
    x: Number.isFinite(values[0]) ? values[0] : 0,
    y: Number.isFinite(values[1]) ? values[1] : 0,
    z: Number.isFinite(values[2]) ? values[2] : 0
  }
}

function formatPosition(coords: Coordinates): string {
  return (
    `${coords.x.toFixed(5)}m ` +
    `${coords.y.toFixed(5)}m ` +
    `${coords.z.toFixed(5)}m`
  )
}

function clamp(value: number): number {
  return Math.max(-0.5, Math.min(0.5, value))
}

// ==========================================
// HOTSPOT SYNCHRONISATION
// ==========================================

async function refreshAllHotspots() {
  await nextTick()

  const mv = viewer.value

  if (
    !mv ||
    !modelReady.value ||
    typeof mv.updateHotspot !== 'function'
  ) {
    return
  }

  for (const part of parts.value) {
    const slotName = `hotspot-${part.id}`

    const hotspot = Array.from(
      mv.querySelectorAll('[slot]')
    ).find(
      (element: Element) =>
        element.getAttribute('slot') === slotName
    ) as HTMLElement | undefined

    if (!hotspot) continue

    // Update HTML attributes
    hotspot.setAttribute(
      'data-position',
      part.position
    )

    hotspot.setAttribute(
      'data-normal',
      part.normal
    )

    // Update model-viewer's internal hotspot position
    mv.updateHotspot({
      name: slotName,
      position: part.position,
      normal: part.normal
    })
  }
}

// ==========================================
// SUBSYSTEM SELECTION
// ==========================================

function selectPart(id: string) {
  selectedId.value = id

  if (editMode.value) {
    editingId.value = id
  }
}

function setCategory(value: string) {
  category.value = value

  if (
    selected.value &&
    value !== 'All' &&
    selected.value.category !== value
  ) {
    selectedId.value = null
  }
}

// ==========================================
// CAMERA CONTROLS
// ==========================================

function resetView() {
  if (!viewer.value) return

  viewer.value.cameraOrbit = '45deg 65deg auto'
  viewer.value.cameraTarget = 'auto auto auto'
  viewer.value.fieldOfView = 'auto'

  viewer.value.jumpCameraToGoal?.()
}

function zoom(factor: number) {
  if (!viewer.value || !modelReady.value) return

  const orbit = viewer.value.getCameraOrbit()

  viewer.value.cameraOrbit =
    `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * factor}m`
}

// ==========================================
// MODEL STATUS
// ==========================================

async function handleModelLoad() {
  modelReady.value = true
  modelError.value = ''

  await refreshAllHotspots()
}

function handleModelError(event: Event) {
  modelReady.value = false

  modelError.value =
    'Unable to load the GLB model.'

  console.error('Model loading error:', event)
}

// ==========================================
// MANUAL HOTSPOT EDITOR
// ==========================================

function loadEditingCoordinates() {
  if (!editingPart.value) return

  manual.value = parsePosition(
    editingPart.value.position
  )
}

function toggleEditMode() {
  editMode.value = !editMode.value

  if (editMode.value) {
    rotating.value = false
    category.value = 'All'

    editingId.value =
      selectedId.value ?? 'chassis'

    loadEditingCoordinates()

    saveMessage.value =
      'Edit mode enabled. Adjust X, Y and Z to move the hotspot.'
  } else {
    saveMessage.value = ''
  }
}

// ==========================================
// LIVE XYZ SLIDER UPDATE
// ==========================================

async function updateAxis(axis: Axis, value: number) {
  if (!Number.isFinite(value)) return

  manual.value = {
    ...manual.value,
    [axis]: clamp(value)
  }

  const part = editingPart.value

  if (!part) return

  part.position = formatPosition(manual.value)

  selectedId.value = part.id

  // Synchronise with model-viewer
  await refreshAllHotspots()

  saveMessage.value =
    `${part.name}: ${part.position}`
}

// ==========================================
// WATCH EDITING TARGET
// ==========================================

watch(editingId, async () => {
  loadEditingCoordinates()

  selectedId.value = editingId.value

  await refreshAllHotspots()
})

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveHotspots() {
  if (typeof window === 'undefined') return

  const data: Record<string, SavedHotspot> = {}

  for (const part of parts.value) {
    data[part.id] = {
      position: part.position,
      normal: part.normal
    }
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )

    saveMessage.value =
      'Hotspot positions saved in this browser.'
  } catch (error) {
    console.error(
      'Unable to save hotspot positions:',
      error
    )

    saveMessage.value =
      'Saving failed. Check browser storage permissions.'
  }
}

async function loadHotspots() {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return

    const data = JSON.parse(stored) as Record<
      string,
      SavedHotspot
    >

    for (const part of parts.value) {
      const saved = data[part.id]

      if (!saved) continue

      part.position = saved.position
      part.normal = saved.normal
    }

    loadEditingCoordinates()

  } catch (error) {
    console.error(
      'Unable to load hotspot positions:',
      error
    )
  }

  await refreshAllHotspots()
}

// ==========================================
// SAVE SELECTED POSITION
// ==========================================

async function savePosition() {
  if (!editingPart.value) return

  editingPart.value.position =
    formatPosition(manual.value)

  await refreshAllHotspots()

  saveHotspots()
}

// ==========================================
// RESET SELECTED POSITION
// ==========================================

async function resetPosition() {
  const original = defaultParts.find(
    part => part.id === editingId.value
  )

  const current = editingPart.value

  if (!original || !current) return

  current.position = original.position
  current.normal = original.normal

  loadEditingCoordinates()

  await refreshAllHotspots()

  saveHotspots()

  saveMessage.value =
    `${current.name} reset to its original coordinates.`
}

// ==========================================
// RESET ALL POSITIONS
// ==========================================

async function resetAllPositions() {
  for (const part of parts.value) {
    const original = defaultParts.find(
      item => item.id === part.id
    )

    if (!original) continue

    part.position = original.position
    part.normal = original.normal
  }

  loadEditingCoordinates()

  await refreshAllHotspots()

  saveHotspots()

  saveMessage.value =
    'All hotspot positions reset to defaults.'
}

// ==========================================
// EXPORT COORDINATES
// ==========================================

function generateExport(): string {
  return parts.value.map(part => {
    return [
      `// ${part.name}`,
      `id: '${part.id}',`,
      `position: '${part.position}',`,
      `normal: '${part.normal}',`
    ].join('\n')
  }).join('\n\n')
}

async function exportCoordinates() {
  const output = generateExport()

  try {
    await navigator.clipboard.writeText(output)

    exportMessage.value =
      'All coordinates copied. Paste them into the defaultParts array.'
  } catch (error) {
    console.error('Export failed:', error)

    exportMessage.value =
      'Clipboard unavailable. Copy the coordinates from the preview.'
  }
}

// ==========================================
// INITIALISATION
// ==========================================

onMounted(async () => {
  await import('@google/model-viewer')

  await nextTick()

  await loadHotspots()
})
</script>

<template>
  <div class="cad-explorer">

    <!-- MAIN CAD LAYOUT -->
    <div class="cad-layout">

      <!-- 3D CAD VIEWER -->
      <div class="cad-stage">

        <div class="stage-label">
          <small>SYSTEM LEVEL</small>
          <strong>Window Cleaning Robot</strong>
        </div>

        <ClientOnly>
          <model-viewer
            ref="viewer"
            :src="modelUrl"
            alt="Interactive 3D CAD model of the window-cleaning robot"
            camera-controls
            :auto-rotate="rotating"
            shadow-intensity="0.8"
            exposure="0.9"
            environment-image="neutral"
            class="cad-model"
            @load="handleModelLoad"
            @error="handleModelError"
          >

            <!-- INTERACTIVE HOTSPOTS -->
            <button
              v-for="part in visibleParts"
              :key="part.id"
              :slot="`hotspot-${part.id}`"
              :data-position="part.position"
              :data-normal="part.normal"
              class="hotspot"
              :class="{ active: selectedId === part.id }"
              @click.stop="selectPart(part.id)"
            >
              <span class="hotspot-dot"></span>

              <span class="hotspot-label">
                {{ part.name }}
              </span>
            </button>

          </model-viewer>
        </ClientOnly>

        <div v-if="modelError" class="model-error">
          {{ modelError }}
        </div>

        <!-- CAMERA CONTROLS -->
        <div class="viewer-controls">
          <span>
            DRAG TO ROTATE · SCROLL TO ZOOM
          </span>

          <div class="viewer-buttons">

            <button type="button" @click="zoom(0.8)">
              +
            </button>

            <button type="button" @click="zoom(1.25)">
              −
            </button>

            <button type="button" @click="resetView">
              RESET
            </button>

            <button
              type="button"
              @click="rotating = !rotating"
            >
              {{ rotating ? 'STOP' : 'ROTATE' }}
            </button>

            <button
              type="button"
              class="edit-button"
              :class="{ active: editMode }"
              @click="toggleEditMode"
            >
              {{ editMode ? 'EXIT EDITOR' : 'EDIT HOTSPOTS' }}
            </button>

          </div>
        </div>

      </div>

      <!-- SUBSYSTEM INFORMATION PANEL -->
      <div class="cad-info">

        <template v-if="selected">
          <div class="info-header">
            <span>
              {{ selected.category.toUpperCase() }} SYSTEM
            </span>

            <button
              type="button"
              @click="selectedId = null"
            >
              ×
            </button>
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

          <a
            :href="withBase(selected.link)"
            class="more-button"
          >
            FIND OUT MORE ↗
          </a>
        </template>

        <template v-else>
          <span class="info-category">
            ROBOT ASSEMBLY
          </span>

          <h2>Explore the Robot</h2>

          <p>
            Select a hotspot or component card
            to explore its engineering description.
          </p>
        </template>

      </div>

    </div>

    <!-- MANUAL XYZ HOTSPOT EDITOR -->
    <div v-if="editMode" class="hotspot-editor">

      <div class="editor-header">
        <div>
          <strong>MANUAL HOTSPOT CALIBRATION</strong>
          <p>
            Adjust the X, Y and Z coordinates
            to move the selected hotspot.
          </p>
        </div>

        <button
          type="button"
          @click="toggleEditMode"
        >
          ×
        </button>
      </div>

      <label for="editing-target">
        Target Subsystem
      </label>

      <select
        id="editing-target"
        v-model="editingId"
      >
        <option
          v-for="part in parts"
          :key="part.id"
          :value="part.id"
        >
          {{ part.name }}
        </option>
      </select>

      <!-- XYZ SLIDERS -->
      <div class="axis-grid">

        <div
          v-for="axis in (['x', 'y', 'z'] as Axis[])"
          :key="axis"
          class="axis-control"
        >
          <div class="axis-heading">
            <strong>
              {{ axis.toUpperCase() }} Position
            </strong>

            <span>
              {{ manual[axis].toFixed(4) }} m
            </span>
          </div>

          <input
            type="range"
            :min="-0.15"
            :max="0.15"
            :step="0.001"
            :value="manual[axis]"
            @input="updateAxis(
              axis,
              Number(($event.target as HTMLInputElement).value)
            )"
          />

          <input
            type="number"
            :min="-0.5"
            :max="0.5"
            :step="0.001"
            :value="manual[axis]"
            @change="updateAxis(
              axis,
              Number(($event.target as HTMLInputElement).value)
            )"
          />
        </div>

      </div>

      <!-- CURRENT COORDINATES -->
      <div class="coordinate-preview">
        <strong>Current Hotspot Position</strong>

        <code>
          {{ formatPosition(manual) }}
        </code>

        <small>
          Normal: {{ editingPart?.normal }}
        </small>
      </div>

      <!-- SAVE CONTROLS -->
      <div class="editor-actions">

        <button
          type="button"
          class="primary-action"
          @click="savePosition"
        >
          SAVE POSITION
        </button>

        <button
          type="button"
          @click="saveHotspots"
        >
          SAVE ALL
        </button>

        <button
          type="button"
          @click="exportCoordinates"
        >
          EXPORT COORDINATES
        </button>

        <button
          type="button"
          @click="resetPosition"
        >
          RESET SELECTED
        </button>

        <button
          type="button"
          @click="resetAllPositions"
        >
          RESET ALL
        </button>

      </div>

      <p v-if="saveMessage" class="editor-message">
        {{ saveMessage }}
      </p>

      <p v-if="exportMessage" class="editor-message">
        {{ exportMessage }}
      </p>

      <details class="export-preview">
        <summary>View all hotspot coordinates</summary>
        <pre>{{ generateExport() }}</pre>
      </details>

      <small class="editor-note">
        Saved positions remain in this browser.
        Export the coordinates and update the
        source code to make them permanent for
        all website visitors.
      </small>

    </div>

    <!-- CATEGORY FILTERS -->
    <div class="category-buttons">
      <button
        v-for="item in ['All', 'Mechanical', 'Electrical', 'Control']"
        :key="item"
        type="button"
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
        type="button"
        class="component-card"
        :class="{ active: selectedId === part.id }"
        @click="selectPart(part.id)"
      >
        <small>
          {{ part.category.toUpperCase() }}
        </small>

        <strong>
          {{ part.name }}
        </strong>
      </button>
    </div>

  </div>
</template>

<style scoped>
/* ==========================================
   WHITE CAD EXPLORER
   ========================================== */

.cad-explorer {
  background: #ffffff;
  color: #1f2937;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 18px;
  margin: 24px 0;
}

.cad-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
  gap: 18px;
}

/* ==========================================
   DARK BLUE CAD MODEL AREA
   ========================================== */

.cad-stage {
  position: relative;
  height: 480px;
  border-radius: 16px;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    #304666,
    #172238 55%,
    #111827
  );
}

.cad-model {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent;
}

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
  margin-top: 6px;
  font-size: 12px;
  color: white;
}

/* ==========================================
   HOTSPOTS
   ========================================== */

.hotspot {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.hotspot-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #d69d55;
  border: 3px solid white;
  box-shadow: 0 0 0 5px rgba(214, 157, 85, 0.25);
}

.hotspot.active .hotspot-dot {
  background: white;
  box-shadow: 0 0 0 6px rgba(214, 157, 85, 0.65);
}

.hotspot-label {
  padding: 5px 8px;
  border: 1px solid #64748b;
  border-radius: 6px;
  background: rgba(17, 24, 39, 0.92);
  color: white;
  font-size: 11px;
  white-space: nowrap;
}

/* ==========================================
   CAMERA CONTROLS
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

.viewer-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  pointer-events: auto;
}

.viewer-buttons button {
  padding: 8px 10px;
  border: 1px solid #43516a;
  border-radius: 7px;
  background: #111827;
  color: white;
  font-size: 11px;
  cursor: pointer;
}

.viewer-buttons button:hover {
  border-color: #d69d55;
  background: #253550;
}

.edit-button.active {
  border-color: #d69d55;
  background: #7c4a19;
}

.model-error {
  position: absolute;
  top: 120px;
  left: 16px;
  right: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #7f1d1d;
  color: #fecaca;
}

/* ==========================================
   WHITE INFORMATION PANEL
   ========================================== */

.cad-info {
  padding: 24px;
  border: 1px solid #d6a25d;
  border-radius: 16px;
  background: white;
  color: #1f2937;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #a66a2c;
  font-size: 11px;
  letter-spacing: 1.5px;
}

.info-header button {
  padding: 4px 10px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  background: white;
  color: #374151;
  cursor: pointer;
}

.info-category {
  color: #a66a2c;
  font-size: 11px;
  letter-spacing: 1.5px;
}

.cad-info h2 {
  margin: 28px 0 18px;
  padding-left: 12px;
  border-left: 3px solid #d69d55;
  color: #111827;
  font-size: 25px;
}

.cad-info p {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.8;
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
  margin: 8px 0;
  color: #4b5563;
  font-size: 13px;
}

.more-button {
  display: inline-block;
  margin-top: 22px;
  padding: 12px 16px;
  border: 1px solid #d69d55;
  border-radius: 25px;
  background: white;
  color: #925b23;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

/* ==========================================
   MANUAL HOTSPOT EDITOR
   ========================================== */

.hotspot-editor {
  margin-top: 18px;
  padding: 20px;
  border: 1px solid #d69d55;
  border-radius: 12px;
  background: #0f172a;
  color: white;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.editor-header strong {
  color: #f5c98d;
  font-size: 13px;
  letter-spacing: 1px;
}

.editor-header p {
  margin-top: 8px;
  color: #cbd5e1;
  font-size: 12px;
}

.editor-header button {
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.hotspot-editor > label {
  display: block;
  margin: 18px 0 8px;
  color: #f5c98d;
  font-size: 12px;
}

.hotspot-editor > select {
  width: 100%;
  padding: 10px;
  border: 1px solid #64748b;
  border-radius: 7px;
  background: #1e293b;
  color: white;
}

.axis-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.axis-control {
  padding: 14px;
  border: 1px solid #334155;
  border-radius: 10px;
  background: #111e32;
}

.axis-heading {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.axis-heading strong {
  color: #f5c98d;
  font-size: 12px;
}

.axis-heading span {
  color: #e2e8f0;
  font-size: 12px;
}

.axis-control input[type="range"] {
  width: 100%;
  accent-color: #d69d55;
}

.axis-control input[type="number"] {
  width: 100%;
  margin-top: 12px;
  padding: 9px;
  border: 1px solid #64748b;
  border-radius: 6px;
  background: #020617;
  color: white;
}

.coordinate-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
  padding: 14px;
  border-radius: 8px;
  background: #020617;
}

.coordinate-preview strong {
  color: #f5c98d;
  font-size: 12px;
}

.coordinate-preview code {
  color: #dbeafe;
  font-size: 13px;
}

.coordinate-preview small {
  color: #cbd5e1;
}

.editor-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.editor-actions button {
  padding: 10px 13px;
  border: 1px solid #d69d55;
  border-radius: 7px;
  color: white;
  font-size: 11px;
  cursor: pointer;
}

.editor-actions button:hover {
  background: #3a2a19;
}

.editor-actions .primary-action {
  background: #925b23;
}

.editor-message {
  margin-top: 12px;
  color: #f5c98d;
  font-size: 12px;
}

.export-preview {
  margin-top: 16px;
  color: #e2e8f0;
}

.export-preview summary {
  cursor: pointer;
}

.export-preview pre {
  overflow-x: auto;
  margin-top: 10px;
  padding: 14px;
  border-radius: 7px;
  background: #020617;
  color: #dbeafe;
  font-size: 12px;
}

.editor-note {
  display: block;
  margin-top: 16px;
  color: #cbd5e1;
  font-size: 11px;
  line-height: 1.6;
}

/* ==========================================
   CATEGORY FILTERS
   ========================================== */

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 12px;
}

.category-buttons button {
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  background: white;
  color: #374151;
  font-size: 11px;
  cursor: pointer;
}

.category-buttons button.active {
  border-color: #d69d55;
  background: #fff7ed;
  color: #925b23;
}

/* ==========================================
   COMPONENT CARDS
   ========================================== */

.component-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.component-card {
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  text-align: left;
  cursor: pointer;
}

.component-card:hover,
.component-card.active {
  border-color: #d69d55;
  background: #fff7ed;
}

.component-card small {
  display: block;
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 10px;
  letter-spacing: 1px;
}

.component-card strong {
  color: #111827;
  font-size: 13px;
}

/* ==========================================
   RESPONSIVE LAYOUT
   ========================================== */

@media (max-width: 900px) {
  .cad-layout {
    grid-template-columns: 1fr;
  }

  .cad-stage {
    height: 430px;
  }

  .axis-grid {
    grid-template-columns: 1fr;
  }

  .component-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .cad-explorer {
    padding: 10px;
  }

  .cad-stage {
    height: 400px;
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
