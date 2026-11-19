<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'

const researcher = {
  name: 'Tan You Min',
  role: 'FYP Researcher · Robotics and Energy-Aware CPP',
  course: 'ME4101A Dissertation Project',
  institution: 'National University of Singapore · College of Design and Engineering',
  image: withBase('/images/researcher-portrait.jpg'),
  focus: 'Energy-efficient path planning and control for a low-cost suction-based window-cleaning robot.',
  contributions: [
    'Research into wall-climbing robots and adhesion technologies',
    'Literature review of conventional and energy-aware coverage path planning',
    'Development of a direction-dependent energy model',
    'Python simulation of horizontal, vertical and spiral coverage strategies',
    'Mechanical design and suction-system development',
    'Planning of energy characterisation and experimental validation'
  ],
  scope: [
    'Low-cost suction-based robot for vertical glass surfaces',
    'Locomotion, adhesion, turning and cleaning energy',
    'Complete coverage with reduced predicted energy consumption'
  ],
  semesterOne: [
    'Research problem definition and literature review',
    'Preliminary robot CAD and suction-chamber design',
    'Initial energy model and Python simulation framework'
  ],
  nextSteps: [
    'Measure energy per metre for upward, downward and horizontal movement',
    'Characterise suction and turning energy',
    'Compare conventional CPP with energy-aware CPP',
    'Validate the model using physical experiments'
  ]
}

const open = ref(false)
const photoAvailable = ref(true)
const expanded = ref<string | null>(null)
const modal = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

function showProfile() {
  previousFocus = document.activeElement as HTMLElement
  open.value = true
  document.body.style.overflow = 'hidden'
  requestAnimationFrame(() => modal.value?.focus())
}
function closeProfile() {
  open.value = false
  document.body.style.overflow = ''
  requestAnimationFrame(() => previousFocus?.focus())
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) closeProfile()
}
function toggleSection(name: string) {
  expanded.value = expanded.value === name ? null : name
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section class="researcher-experience" aria-label="Meet the researcher">
    <div class="intro">
      <p class="eyebrow">ME4101A · FINAL YEAR PROJECT</p>
      <h1>MEET THE RESEARCHER</h1>
      <p>One researcher. One robotics project. Explore the work behind the energy-aware window-cleaning robot.</p>
    </div>

    <div class="portrait-stage">
      <button class="portrait-card" type="button" @click="showProfile" aria-label="Read more about the researcher">
        <img v-if="photoAvailable" :src="researcher.image" alt="Researcher portrait" @error="photoAvailable = false" />
        <div v-else class="portrait-placeholder" aria-hidden="true"><span>TYM</span><small>ADD YOUR PORTRAIT</small></div>
        <div class="portrait-shade"></div>
        <div class="portrait-copy">
          <span class="card-eyebrow">PROJECT RESEARCHER</span>
          <h2>{{ researcher.name }}</h2>
          <p>{{ researcher.role }}</p>
          <strong>CLICK HERE FOR MORE ↗</strong>
        </div>
      </button>
      <p class="stage-caption">CLICK THE PORTRAIT TO EXPLORE THE RESEARCHER'S WORK</p>
    </div>

    <div v-if="open" class="modal-backdrop" @click.self="closeProfile">
      <div ref="modal" class="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" tabindex="-1">
        <div class="modal-photo">
          <img v-if="photoAvailable" :src="researcher.image" alt="Researcher portrait" @error="photoAvailable = false" />
          <div v-else class="portrait-placeholder large" aria-hidden="true"><span>TYM</span><small>RESEARCHER PORTRAIT</small></div>
        </div>
        <div class="modal-info">
          <button class="close-button" type="button" @click="closeProfile" aria-label="Close profile">×</button>
          <p class="eyebrow">{{ researcher.role }}</p>
          <h2 id="profile-title">{{ researcher.name }}</h2>
          <p class="subtitle">{{ researcher.course }} · {{ researcher.institution }}</p>
          <p class="focus">{{ researcher.focus }}</p>

          <h3>RESEARCH CONTRIBUTIONS</h3>
          <ul class="contributions"><li v-for="item in researcher.contributions" :key="item">{{ item }}</li></ul>

          <div class="accordion">
            <div v-for="section in [
              { id: 'scope', title: 'INDIVIDUAL SCOPE', items: researcher.scope },
              { id: 'semester', title: 'SEMESTER 1 WORK', items: researcher.semesterOne },
              { id: 'future', title: 'PLANNED NEXT STEPS', items: researcher.nextSteps }
            ]" :key="section.id" class="accordion-item">
              <button type="button" :aria-expanded="expanded === section.id" @click="toggleSection(section.id)">
                {{ section.title }} <span>{{ expanded === section.id ? '−' : '+' }}</span>
              </button>
              <ul v-if="expanded === section.id"><li v-for="item in section.items" :key="item">{{ item }}</li></ul>
            </div>
          </div>
          <a :href="withBase('/research/')" class="research-link">EXPLORE THE RESEARCH ↗</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.researcher-experience{background:#ffffff;color:#1f2937;border-radius:18px;min-height:720px;padding:50px 22px 30px;overflow:hidden;font-family:Inter,Arial,sans-serif}
.intro{text-align:center;max-width:740px;margin:auto}.eyebrow{color:#a66a2c;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase}.intro h1{color:#172238;font-size:clamp(30px,5vw,58px);letter-spacing:.09em;font-weight:400;margin:18px 0}.intro>p:last-child{color:#4b5563;font-size:14px;line-height:1.7}
.portrait-stage{display:flex;flex-direction:column;align-items:center;justify-content:center;margin:48px auto 0}.portrait-card{width:min(330px,100%);height:440px;border:1px solid #b77e39;border-radius:18px;position:relative;overflow:hidden;background:#131a25;box-shadow:0 0 55px #a969291c;cursor:pointer;padding:0;text-align:left;transition:transform .25s,border-color .25s}.portrait-card:hover,.portrait-card:focus-visible{transform:translateY(-7px);border-color:#ffc57a}.portrait-card>img{height:100%;width:100%;object-fit:cover}.portrait-shade{position:absolute;inset:0;background:linear-gradient(transparent 30%,#030305e8 100%)}.portrait-copy{position:absolute;bottom:24px;left:22px;right:22px}.card-eyebrow{font-size:10px;letter-spacing:2px;color:#dfa65c}.portrait-copy h2{font-family:Georgia,serif;font-size:34px;font-weight:400;color:#fff;margin:10px 0 4px}.portrait-copy p{color:#d4d1ce;font-size:12px;line-height:1.5}.portrait-copy strong{display:block;margin-top:24px;font-size:11px;letter-spacing:2px;color:#e8aa60}.stage-caption{text-align:center;color:#64748b;letter-spacing:3px;font-size:10px;margin:30px 0 0}
.portrait-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;background:linear-gradient(135deg,#1a2b40,#344761)}.portrait-placeholder span{font:normal 76px Georgia,serif;color:#c9d5e4}.portrait-placeholder small{font-size:10px;letter-spacing:2px;color:#d3dce7}
.modal-backdrop{position:fixed;inset:0;z-index:9999;background:#000d;display:flex;align-items:center;justify-content:center;padding:18px}.profile-modal{display:grid;grid-template-columns:minmax(250px,40%) 1fr;width:min(1100px,100%);height:min(780px,94vh);background:#0d0d11;color:#eae6e2;border:1px solid #3b2c1c;overflow:hidden;outline:none}.modal-photo{min-height:0;background:#172238}.modal-photo img{height:100%;width:100%;object-fit:cover}.modal-info{position:relative;overflow-y:auto;padding:48px 48px 36px}.close-button{position:absolute;right:25px;top:20px;background:transparent;border:1px solid #555;color:white;border-radius:50%;font-size:25px;width:40px;height:40px;cursor:pointer}.modal-info h2{font:normal clamp(32px,4vw,54px) Georgia,serif;color:#fff;margin:16px 0}.subtitle{color:#aaa7aa;font-size:13px;line-height:1.6}.focus{border-left:2px solid #d99c52;padding-left:13px;color:#d5d0cc;font-size:14px;line-height:1.7;margin:24px 0 28px}.modal-info h3{font-size:11px;letter-spacing:2px;color:#a9a4a2}.contributions{padding-left:18px;color:#d0cbca;font-size:13px;line-height:1.9}.contributions li::marker,.accordion li::marker{color:#d99c52}.accordion{margin-top:28px;border-top:1px solid #333}.accordion-item{border-bottom:1px solid #333}.accordion-item>button{width:100%;padding:20px 0;background:transparent;border:0;color:#eee;display:flex;justify-content:space-between;align-items:center;letter-spacing:2px;font-size:11px;font-weight:700;text-align:left;cursor:pointer}.accordion-item>button span{font-size:22px}.accordion-item ul{font-size:13px;color:#c8c4c1;line-height:1.9;padding-left:18px;margin:0 0 20px}.research-link{display:inline-block;margin-top:26px;padding:12px 16px;border:1px solid #bd8747;border-radius:24px;color:#f4c68a;text-decoration:none;font-size:11px;letter-spacing:1px}.research-link:hover{background:#49331b}
@media(max-width:720px){.researcher-experience{padding:40px 12px}.profile-modal{display:block;overflow-y:auto;height:94vh}.modal-photo{height:260px}.modal-info{overflow:visible;padding:28px 22px}.close-button{top:12px;right:12px;background:#0009}.portrait-card{height:420px}}
</style>
