
<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
  nextTick
} from 'vue'

import { withBase } from 'vitepress'

// Editing tools are compiled into the local development build only.
// The public GitHub Pages build displays a read-only CAD explorer.
const isDevelopment = import.meta.env.DEV

// ==========================================
// TYPES
// ==========================================

type Category = 'Mechanical' | 'Electrical' | 'Control'
type Axis = 'x' | 'y' | 'z'
type RangeMode = 'fine' | 'medium' | 'wide' | 'maximum'

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
    position: '0.00075m 0.05187m -0.06642m',
    normal: '-1.00000m 0.00000m 0.00000m',
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
    position: '0.07126m 0.05116m -0.06931m',
    normal: '0.00000m 1.00000m 0.00000m',
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
    position: '0.00075m 0.03458m -0.00892m',
    normal: '-1.00000m 0.00000m 0.00000m',
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
const placementMode = ref(false)
const placementMessage = ref('Select a subsystem, then click its surface on the model.')
const hasUnsavedPlacement = ref(false)
const editingId = ref('chassis')

const manual = ref<Coordinates>({
  x: 0.00075,
  y: 0.05187,
  z: -0.06642
})

const saveMessage = ref('')
const exportMessage = ref('')

const STORAGE_KEY = 'window-cleaning-robot-hotspots-v2'
const LEGACY_STORAGE_KEY = 'window-cleaning-robot-hotspots-v1'
const newName = ref('')
const newCategory = ref<Category>('Mechanical')
const newDescription = ref('')
const newLink = ref('/design/mechanical')
const editorMessage = ref('')

// Slider ranges in metres. Maximum is 10,000x the original +/-0.15 m.
const rangeModes = {
  fine: { label: 'Fine (+/-0.15 m)', limit: 0.15, step: 0.001 },
  medium: { label: 'Medium (+/-1.5 m)', limit: 1.5, step: 0.005 },
  wide: { label: 'Wide (+/-15 m)', limit: 15, step: 0.05 },
  maximum: { label: '10,000x (+/-1,500 m)', limit: 1500, step: 0.1 }
} as const

const rangeMode = ref<RangeMode>('fine')
const activeRange = computed(() => rangeModes[rangeMode.value])

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
  return Math.max(-1500, Math.min(1500, value))
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
  if (!isDevelopment) return
  editMode.value = !editMode.value
  if (!editMode.value) placementMode.value = false

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
  if (!isDevelopment) return
  if (placementMode.value) placementMode.value = false
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
// CLICK-TO-PLACE ON THE 3D MODEL
// ==========================================

function togglePlacementMode() {
  if (!isDevelopment) return
  if (!editMode.value) {
    editMode.value = true
    category.value = 'All'
  }
  placementMode.value = !placementMode.value
  rotating.value = false
  placementMessage.value = placementMode.value
    ? 'Click a visible surface on the robot to position the selected hotspot.'
    : 'Placement mode disabled. Manual sliders remain available.'
}

async function placeHotspot(event: MouseEvent) {
  if (!isDevelopment || !placementMode.value) return
  const mv = viewer.value
  if (!mv || !modelReady.value) {
    placementMessage.value = 'The 3D model has not finished loading.'
    return
  }
  if (typeof mv.positionAndNormalFromPoint !== 'function') {
    placementMessage.value = 'Surface picking is unavailable in this model-viewer version.'
    return
  }

  // model-viewer's API uses browser viewport (client) coordinates.
  // Existing hotspot buttons are non-interactive during placement.
  try {
    const result = mv.positionAndNormalFromPoint(event.clientX, event.clientY)
    if (!result?.position || !result?.normal) {
      placementMessage.value = 'No surface found. Click a solid, visible part of the model.'
      return
    }
    const { position, normal } = result
    const valid = [position.x, position.y, position.z,
      normal.x, normal.y, normal.z].every(Number.isFinite)
    if (!valid) {
      placementMessage.value = 'The model returned invalid coordinates.'
      return
    }

    const part = editingPart.value
    if (!part) return
    part.position = formatPosition(position)
    part.normal = formatPosition(normal)
    manual.value = { x: position.x, y: position.y, z: position.z }
    selectedId.value = part.id
    hasUnsavedPlacement.value = true
    placementMessage.value = `${part.name} placed at ${part.position}. Click SAVE SELECTED POSITION to keep it.`
    await refreshAllHotspots()
  } catch (error) {
    console.error('Click-to-place error:', error)
    placementMessage.value = 'Placement failed. Check F12 Console for details.'
  }
}

async function savePlacedPosition() {
  const part = editingPart.value
  if (!part) return
  part.position = formatPosition(manual.value)
  await refreshAllHotspots()
  saveHotspots()
  hasUnsavedPlacement.value = false
  placementMessage.value = `${part.name} saved in this browser. Export coordinates for GitHub.`
}

// ==========================================
// WATCH EDITING TARGET
// ==========================================

watch(editingId, async () => {
  hasUnsavedPlacement.value = false
  loadEditingCoordinates()

  selectedId.value = editingId.value

  await refreshAllHotspots()
})

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveHotspots() {
  if (typeof window === 'undefined') return
  try {
    // Store the entire list, including user-created subsystem metadata.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parts.value))
    saveMessage.value = 'All hotspot positions and subsystem details saved in this browser.'
    hasUnsavedPlacement.value = false
  } catch (error) {
    console.error('Unable to save hotspots:', error)
    saveMessage.value = 'Saving failed. Check browser storage permissions.'
  }
}

async function loadHotspots() {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data: unknown = JSON.parse(stored)
      if (Array.isArray(data)) {
        const valid = data.filter((p): p is Part =>
          p && typeof p.id === 'string' && typeof p.name === 'string' &&
          typeof p.position === 'string' && typeof p.normal === 'string' &&
          ['Mechanical', 'Electrical', 'Control'].includes(p.category) &&
          typeof p.description === 'string' && Array.isArray(p.details) &&
          typeof p.link === 'string'
        )
        if (valid.length) parts.value = valid
      }
    } else {
      // Do not silently override newly calibrated defaults with old-scale data.
      // The previous storage key remains untouched for backup purposes.
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacy) console.info('Previous calibration backup found. New defaults are active.')
    }
    if (!parts.value.some(p => p.id === editingId.value)) {
      editingId.value = parts.value[0]?.id ?? ''
    }
    loadEditingCoordinates()
  } catch (error) {
    console.error('Unable to load hotspots:', error)
  }
  await refreshAllHotspots()
}

function addHotspot() {
  const name = newName.value.trim()
  if (!name) {
    editorMessage.value = 'Enter a name for the new hotspot.'
    return
  }
  const idBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'part'
  let id = idBase
  let n = 2
  while (parts.value.some(p => p.id === id)) id = `${idBase}-${n++}`
  const part: Part = {
    id,
    name,
    category: newCategory.value,
    position: '0.07575m 0.05400m -0.07575m',
    normal: '0m 1m 0m',
    description: newDescription.value.trim() || `Description of ${name} (edit as required).`,
    details: ['Subsystem under development'],
    link: newLink.value.startsWith('/') ? newLink.value : '/design/mechanical'
  }
  parts.value.push(part)
  editingId.value = id
  selectedId.value = id
  category.value = 'All'
  newName.value = ''
  newDescription.value = ''
  editorMessage.value = `${name} added. Click START CLICK PLACEMENT to position it.`
  void refreshAllHotspots()
  saveHotspots()
}

function deleteHotspot() {
  const part = editingPart.value
  if (!part) return
  if (typeof window !== 'undefined' && !window.confirm(`Delete hotspot "${part.name}"?`)) return
  parts.value = parts.value.filter(p => p.id !== part.id)
  editingId.value = parts.value[0]?.id ?? ''
  selectedId.value = parts.value[0]?.id ?? null
  placementMode.value = false
  loadEditingCoordinates()
  editorMessage.value = `${part.name} deleted.`
  saveHotspots()
  void refreshAllHotspots()
}

function updatePartDetails() {
  if (!editingPart.value) return
  editingPart.value.name = editingPart.value.name.trim() || editingPart.value.id
  saveHotspots()
  editorMessage.value = 'Subsystem information saved.'
}

// ==========================================
// SAVE SELECTED POSITION
// ==========================================

async function savePosition() {
  hasUnsavedPlacement.value = false
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
  hasUnsavedPlacement.value = false
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
  hasUnsavedPlacement.value = false
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
    'Original hotspots reset. Added hotspots are retained.'
}

// ==========================================
// EXPORT COORDINATES
// ==========================================

function generateExport(): string {
  // A complete valid TypeScript array, including newly added hotspots.
  return `const defaultParts: Part[] = ${JSON.stringify(parts.value, null, 2)}`
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

  if (isDevelopment) {
    await loadHotspots()
  }
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
            :camera-controls="!placementMode"
            :auto-rotate="rotating"
            shadow-intensity="0.8"
            exposure="0.9"
            environment-image="neutral"
            class="cad-model"
            :class="{ 'placing-hotspot': placementMode }"
            @click="placeHotspot"
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
              :disabled="placementMode"
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
              class="placement-toggle"
              v-if="isDevelopment"
              :class="{ active: placementMode }"
              @click="togglePlacementMode"
            >
              {{ placementMode ? 'EXIT PLACE MODE' : 'PLACE ON MODEL' }}
            </button>

            <button
              type="button"
              class="edit-button"
              v-if="isDevelopment"
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
    <div v-if="isDevelopment && editMode" class="hotspot-editor">

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

      <!-- ADD NEW SUBSYSTEM -->
      <details class="part-editor-box">
        <summary>+ ADD NEW HOTSPOT / SUBSYSTEM</summary>
        <div class="part-editor-fields">
          <label>Name <input v-model="newName" placeholder="e.g. Drive Motor" /></label>
          <label>Category
            <select v-model="newCategory">
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Control">Control</option>
            </select>
          </label>
          <label>Description <textarea v-model="newDescription" rows="2" placeholder="Describe the subsystem" /></label>
          <label>Documentation link <input v-model="newLink" placeholder="/design/mechanical" /></label>
          <button type="button" class="editor-primary" @click="addHotspot">ADD HOTSPOT</button>
        </div>
      </details>

      <!-- EDIT EXISTING SUBSYSTEM -->
      <details class="part-editor-box">
        <summary>EDIT SELECTED SUBSYSTEM DETAILS</summary>
        <div v-if="editingPart" class="part-editor-fields">
          <label>Name <input v-model="editingPart.name" /></label>
          <label>Category
            <select v-model="editingPart.category">
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Control">Control</option>
            </select>
          </label>
          <label>Description <textarea v-model="editingPart.description" rows="3" /></label>
          <label>Documentation link <input v-model="editingPart.link" /></label>
          <label>Technical details (one per line)
            <textarea
              :value="editingPart.details.join('\n')"
              rows="3"
              @change="editingPart.details = ($event.target as HTMLTextAreaElement).value.split('\n').map(v => v.trim()).filter(Boolean)"
            />
          </label>
          <div class="placement-actions">
            <button type="button" class="editor-primary" @click="updatePartDetails">SAVE DETAILS</button>
            <button type="button" @click="deleteHotspot">DELETE SELECTED HOTSPOT</button>
          </div>
        </div>
      </details>
      <p v-if="editorMessage" class="editor-message">{{ editorMessage }}</p>

      <!-- CLICK-TO-PLACE CONTROLS -->
      <div class="placement-panel">
        <strong>CLICK-TO-PLACE HOTSPOT</strong>
        <p>Choose the target subsystem above, then activate placement mode and click the actual GLB surface. The hotspot moves immediately. Save to retain the coordinates.</p>
        <div class="placement-actions">
          <button type="button" @click="togglePlacementMode">
            {{ placementMode ? 'EXIT PLACE MODE' : 'START CLICK PLACEMENT' }}
          </button>
          <button type="button" class="primary-action" @click="savePlacedPosition">
            SAVE SELECTED POSITION
          </button>
        </div>
        <p class="placement-status" role="status">{{ placementMessage }}</p>
        <small v-if="hasUnsavedPlacement">Unsaved position: save before refreshing the page.</small>
      </div>

      <!-- SLIDER RANGE SELECTION -->
      <div class="range-selector">
        <label for="range-mode">Slider movement range</label>
        <select id="range-mode" v-model="rangeMode">
          <option
            v-for="(mode, key) in rangeModes"
            :key="key"
            :value="key"
          >
            {{ mode.label }}
          </option>
        </select>
        <small>
          Use Fine to position points precisely. Large ranges can
          move hotspots far outside the visible model.
        </small>
      </div>

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
            :min="-activeRange.limit"
            :max="activeRange.limit"
            :step="activeRange.step"
            :value="manual[axis]"
            @input="updateAxis(
              axis,
              Number(($event.target as HTMLInputElement).value)
            )"
          />

          <input
            type="number"
            :min="-1500"
            :max="1500"
            :step="activeRange.step"
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
  /* The model-viewer 3D position is the centre of the gold dot. */
  position: relative;
  display: block;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  cursor: pointer;
  /* Do not translate the combined label and dot. */
}

.hotspot-dot {
  position: absolute;
  left: -9px;
  top: -9px;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border-radius: 50%;
  background: #d69d55;
  border: 3px solid white;
  box-shadow: 0 0 0 5px rgba(214, 157, 85, 0.25);
  pointer-events: none;
}

.hotspot.active .hotspot-dot {
  background: white;
  box-shadow: 0 0 0 6px rgba(214, 157, 85, 0.65);
}

.hotspot-label {
  position: absolute;
  left: 15px;
  top: -15px;
  padding: 6px 10px;
  border: 1px solid #64748b;
  border-radius: 6px;
  background: rgba(17, 24, 39, 0.95);
  color: white;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  pointer-events: none;
}

/* Expand the clickable area around the dot without moving its anchor. */
.hotspot::before {
  content: '';
  position: absolute;
  left: -12px;
  top: -12px;
  width: 24px;
  height: 24px;
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

.range-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.range-selector label {
  color: #f5c98d;
  font-size: 12px;
}

.range-selector select {
  width: 100%;
  padding: 10px;
  border: 1px solid #64748b;
  border-radius: 7px;
  background: #1e293b;
  color: #ffffff;
}

.range-selector small {
  color: #cbd5e1;
  line-height: 1.5;
}


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

/* CLICK-TO-PLACE */
.cad-model.placing-hotspot { cursor: crosshair; }
.cad-model.placing-hotspot .hotspot { pointer-events: none; }
.placement-toggle.active { border-color: #d69d55; background: #7c4a19; }
.placement-panel { margin-top: 18px; padding: 16px; border: 1px solid #475569; border-radius: 10px; background: #111e32; }
.placement-panel strong { color: #f5c98d; font-size: 12px; letter-spacing: 1px; }
.placement-panel p { color: #e2e8f0; font-size: 12px; line-height: 1.6; margin: 10px 0; }
.placement-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.placement-actions button { padding: 10px 13px; border: 1px solid #d69d55; border-radius: 7px; color: white; cursor: pointer; }
.placement-actions .primary-action { background: #925b23; }
.placement-panel .placement-status { color: #f5c98d; }
.placement-panel small { color: #f5c98d; }

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

/* Extensible subsystem editor */
.part-editor-box { margin-top: 16px; border: 1px solid #475569; border-radius: 10px; padding: 14px; background: #111e32; }
.part-editor-box summary { color: #f5c98d; cursor: pointer; font-size: 12px; font-weight: 700; }
.part-editor-fields { display: grid; gap: 12px; margin-top: 14px; }
.part-editor-fields label { display: grid; gap: 6px; color: #f5c98d; font-size: 12px; }
.part-editor-fields input, .part-editor-fields select, .part-editor-fields textarea { width: 100%; min-width: 0; padding: 9px; border: 1px solid #64748b; border-radius: 6px; background: #1e293b; color: white; font: inherit; }
.part-editor-fields button { width: fit-content; padding: 10px 13px; border: 1px solid #d69d55; border-radius: 7px; color: white; cursor: pointer; }
.part-editor-fields .editor-primary { background: #925b23; }
</style>
