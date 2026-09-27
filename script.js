const researchTypes = {
  into: {
    title: "Research into Design",
    chinese: "对设计的研究",
    summary: "把设计作为被观察和解释的对象，回答设计是什么、为什么会这样。",
    role: "设计是研究对象。知识贡献通常是历史解释、分类体系、理论模型或批判性认识。",
    paper: "实例：公共部门设计成果如何从想法走向实施。"
  },
  for: {
    title: "Research for Design",
    chinese: "为设计的研究",
    summary: "为具体设计任务提供信息和依据，回答为了把设计做好，需要知道什么。",
    role: "设计是被支持的实践。知识贡献通常是需求、原则、工具或可执行框架。",
    paper: "实例：把儿童对气味媒介的反应转化为嗅觉故事设计原则。"
  },
  through: {
    title: "Research through Design",
    chinese: "通过设计的研究",
    summary: "通过制作、部署和反思设计物生成知识，回答实际设计让我们发现了什么。",
    role: "设计是研究方法和知识媒介。知识贡献来自原型、使用过程和实践反思。",
    paper: "实例：通过 AnimaTo 的设计与家庭部署研究动态纺织体验。"
  }
};

const nodes = [...document.querySelectorAll(".research-node")];
const panel = document.querySelector("#relation-panel");

function selectType(type) {
  const item = researchTypes[type];
  if (!item || !panel) return;
  panel.dataset.type = type;
  nodes.forEach((node) => {
    const active = node.dataset.type === type;
    node.classList.toggle("is-active", active);
    node.setAttribute("aria-pressed", String(active));
  });
  panel.innerHTML = `
    <p class="relation-panel__label">当前选择</p>
    <h3><span>${item.title}</span><span>${item.chinese}</span></h3>
    <p>${item.summary}</p>
    <p><strong>设计的角色：</strong>${item.role}</p>
    <p>${item.paper}</p>
  `;
}

nodes.forEach((node) => node.addEventListener("click", () => selectType(node.dataset.type)));
selectType("into");

const compare = document.querySelector("#comparison");
document.querySelectorAll(".compare-button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.compare;
    document.querySelectorAll(".compare-button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    compare.classList.toggle("is-focus", target !== "all");
    compare.querySelectorAll(".comparison__cell").forEach((cell) => cell.classList.toggle("is-selected", target === "all" || cell.dataset.type === target));
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".mast-nav a")];
function updateNavigation() {
  const offset = document.querySelector('.nav-mast').getBoundingClientRect().height + 60;
  const visible = sections.filter(section => section.getBoundingClientRect().top <= offset).at(-1);
  navLinks.forEach((link) => {
    if (visible && link.getAttribute("href") === `#${visible.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
let navigationFrame = false;
window.addEventListener('scroll', () => {
  if (navigationFrame) return;
  navigationFrame = true;
  requestAnimationFrame(() => { updateNavigation(); navigationFrame = false; });
}, { passive: true });
updateNavigation();
new ResizeObserver(([entry]) => {
  document.documentElement.style.setProperty('--mast-height', `${entry.target.getBoundingClientRect().height}px`);
  updateNavigation();
}).observe(document.querySelector('.nav-mast'));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const orientationContent = {
  through: {
    title: "设计实践生成核心知识",
    summary: "通过持续的共创、原型、平台开发与反思形成模型。设计实践不是结果展示，而是论文主要的知识生成机制。",
    role: "研究方法与知识媒介",
    evidence: "Abstract、Figure 12 与 Figure 13"
  },
  into: {
    title: "参与机制成为研究对象",
    summary: "研究团队编码工作坊记录与反馈，理解不同参与者如何协作，以及能力、情境与权力条件如何影响参与质量。",
    role: "被观察与解释的设计过程",
    evidence: "Co-design Workshops 与 Analysis"
  },
  for: {
    title: "研究结果反哺未来实践",
    summary: "整合式共创模型、平台与参与策略，为后续项目提供流程、方法和决策支持，让研究知识进入真实设计工作。",
    role: "被证据支持的设计实践",
    evidence: "Integrated Co-design Model 与 Conclusion"
  }
};

const orientationTabs = [...document.querySelectorAll(".orientation-tab")];
const orientationReading = document.querySelector("#orientation-reading");
const orientationFields = {
  title: document.querySelector("#orientation-reading-title"),
  summary: document.querySelector("#orientation-reading-summary"),
  role: document.querySelector("#orientation-reading-role"),
  evidence: document.querySelector("#orientation-reading-evidence")
};

function selectOrientation(type, moveFocus = false) {
  const content = orientationContent[type];
  const activeTab = orientationTabs.find((tab) => tab.dataset.orientation === type);
  if (!content || !activeTab || !orientationReading) return;

  orientationTabs.forEach((tab) => {
    const active = tab === activeTab;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  orientationReading.dataset.active = type;
  orientationReading.setAttribute("aria-labelledby", activeTab.id);
  Object.entries(orientationFields).forEach(([key, element]) => {
    if (element) element.textContent = content[key];
  });

  if (!reduceMotion && orientationReading.animate) {
    orientationReading.animate(
      [{ opacity: 0.45, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
      { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }
  if (moveFocus) activeTab.focus();
}

orientationTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectOrientation(tab.dataset.orientation));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % orientationTabs.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + orientationTabs.length) % orientationTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = orientationTabs.length - 1;
    selectOrientation(orientationTabs[nextIndex].dataset.orientation, true);
  });
});

const imageDialog = document.querySelector("#image-dialog");
const dialogImage = imageDialog.querySelector("img");
const dialogCaption = imageDialog.querySelector("p");
const dialogClose = imageDialog.querySelector(".image-dialog__close");
let imageTrigger;
document.querySelectorAll(".figure-button").forEach((button) => {
  button.addEventListener("click", () => {
    imageTrigger = button;
    dialogImage.src = button.dataset.full;
    dialogImage.alt = button.querySelector("img").alt;
    dialogCaption.textContent = button.dataset.caption;
    imageDialog.showModal();
    document.body.classList.add('dialog-open');
    dialogClose.focus();
  });
});
dialogClose.addEventListener("click", () => imageDialog.close());
imageDialog.addEventListener("click", (event) => {
  const rect = imageDialog.getBoundingClientRect();
  if (event.target === imageDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) imageDialog.close();
});
imageDialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  imageTrigger?.focus({ preventScroll: true });
});

// Teaching scenarios are constructed examples, not reported research findings.
const exercises = [
  { title: '座椅为什么被移动？', scene: '研究者观察已有自习室，访谈学生为何挪椅子、拼桌和用物品占座。他们不改造座椅，目标是解释座位使用、空间秩序与设计之间的关系。', answer: 'into', reason: '核心任务是理解既有设计及其使用。座椅和空间是被研究的对象，贡献是对使用行为的解释。', boundary: '观察和访谈也可以服务 For；这里的关键是解释现象，而非为某款新座椅确定需求。' },
  { title: '什么样的杯柄更适合握持？', scene: '团队准备为校园咖啡店设计新杯子，调查握持需求、测量相关尺寸，并比较现有杯柄。研究最终交付尺寸范围、使用约束和设计规格，供产品开发选用。', answer: 'for', reason: '目标是为下一步设计提供可执行的决策依据。设计是被支持的实践，知识产出是需求与规格。', boundary: '即使做了样件或测试，也不能仅凭存在原型判为 Through；要看测试是否承担了探索新认识的任务。' },
  { title: '会变化的导视能带来什么？', scene: '研究者设计几种可以随人流改变提示的校园导视，反复部署、修改并记录使用过程。他们想借这种尚不存在的设计情境，探究人如何在不确定提示下理解空间，形成可讨论的设计洞见。', answer: 'through', reason: '设计介入创造了原先难以观察的情境。制作、部署和反思共同生成关于空间理解的知识。', boundary: '若仅比较两套成熟标识的辨识率，为采购选出更好的一套，则更接近 For。' },
  { title: '临时座椅既探索行为，又指导改造', scene: '团队在社区搭建可重组的临时座椅，迭代布置并反思陌生人如何开始协作。他们同时把介入中获得的认识整理成公共空间改造原则，交给后续设计团队。', answer: 'cross', reason: 'Through 体现在介入和反思生成协作认识；For 体现在把证据转化为后续改造原则。两种取向有明确而不同的依据。', boundary: '如果论文主要论证设计介入产生的新认识，可判 Through 为主；如果主要验证原则能否支持改造决策，可判 For 为主。不能只数用了几种方法。' },
  { title: '老标识既被解释，又启发新系统', scene: '研究者分析医院旧导视的图形与使用历史，解释患者如何理解这些符号；又结合访谈，将有证据支持的识别困难转化为新导视系统的需求清单。两类知识都作为核心成果报告。', answer: 'cross', reason: '解释旧设计的文化与使用意义属于 Into；为新系统提供需求属于 For。研究对象相同，但两个目标和产出不同。', boundary: '若新系统建议只是论文结尾的简短展望，没有独立证据支撑，通常仍以 Into 为主；“提出建议”本身不够。' },
  { title: '做了三个原型，就算 Through 吗？', scene: '一段项目简介只说：“我们制作了三个椅子原型，邀请学生试坐并访谈。”没有说明研究目的，也没有说明最终知识贡献。你能据此分类吗？', answer: 'unknown', reason: '目前只知道研究方法，不知道原型在知识生成中的作用。同样的试坐和访谈，可能支持 For，也可能支持 Through。', boundary: '需要补充：为何制作原型？只是检验既定要求，还是用介入探索新的体验认识？结果是选型规格，还是可交流的新知识？', extra: '补充信息：三个原型只是现成方案的样件。团队依据已确定的舒适性指标比较它们，最终为学校采购确定尺寸与支撑规格，没有以设计迭代探索新的体验问题。', extraAnswer: 'for', extraReason: '补充信息明确了研究目的和产出：为采购与后续配置提供规格依据。因此以 For 为主；制作样件本身不会使它自动成为 Through。' }
];
const choiceNames = { into: 'Into', for: 'For', through: 'Through', cross: '交叉取向', unknown: '信息不足' };
const practiceApp = document.querySelector('#practice-app');
const exerciseNav = document.querySelector('#practice-nav');
const exerciseForm = document.querySelector('#practice-form');
const feedback = document.querySelector('#practice-feedback');
const more = document.querySelector('#practice-more');
const previous = document.querySelector('#practice-prev');
const next = document.querySelector('#practice-next');
let exerciseIndex = 0;
let exerciseStates = exercises.map(() => ({ choice: '', submitted: false, extra: false }));
exerciseNav.innerHTML = exercises.map((q, i) => `<button type="button" class="practice-nav__item" data-exercise="${i}" aria-pressed="false"><span>0${i + 1}</span><span>${q.title}</span><small></small></button>`).join('');
document.querySelector('#practice-options').innerHTML = Object.entries(choiceNames).map(([value, label]) => `<label><input type="radio" name="judgment" value="${value}" required><span>${label}</span></label>`).join('');

function renderPractice(moveFocus = false) {
  const q = exercises[exerciseIndex], state = exerciseStates[exerciseIndex];
  document.querySelector('#practice-number').textContent = `教学情境 · 0${exerciseIndex + 1}`;
  document.querySelector('#practice-question').textContent = q.title;
  document.querySelector('#practice-scenario').textContent = q.scene;
  document.querySelector('#practice-extra').hidden = !state.extra;
  document.querySelector('#practice-extra').textContent = state.extra ? q.extra : '';
  exerciseForm.querySelectorAll('input').forEach(input => { input.checked = input.value === state.choice; });
  const answer = state.extra ? q.extraAnswer : q.answer;
  feedback.hidden = !state.submitted;
  feedback.innerHTML = state.submitted ? `<p class="practice-feedback__label">你的判断：${choiceNames[state.choice]} · 参考判断：${choiceNames[answer]}</p><p><strong>判断依据：</strong>${state.extra ? q.extraReason : q.reason}</p><p><strong>边界与条件：</strong>${q.boundary}</p>` : '';
  more.hidden = !(q.extra && state.submitted && !state.extra);
  previous.disabled = exerciseIndex === 0;
  next.disabled = exerciseIndex === exercises.length - 1;
  document.querySelector('#practice-position').textContent = `${exerciseIndex + 1} / ${exercises.length}`;
  document.querySelector('#practice-progress').textContent = `已完成 ${exerciseStates.filter(s => s.submitted).length} / ${exercises.length}`;
  exerciseNav.querySelectorAll('button').forEach((button, i) => {
    button.setAttribute('aria-pressed', String(i === exerciseIndex));
    button.querySelector('small').textContent = exerciseStates[i].submitted ? '已判断' : '待判断';
  });
  if (moveFocus) {
    const question = document.querySelector('#practice-question');
    question.focus({ preventScroll: true });
    question.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
}
exerciseNav.addEventListener('click', event => {
  const button = event.target.closest('[data-exercise]');
  if (!button) return;
  exerciseIndex = Number(button.dataset.exercise);
  renderPractice(window.matchMedia('(max-width: 47.99rem)').matches);
});
exerciseForm.addEventListener('change', event => {
  exerciseStates[exerciseIndex].choice = event.target.value;
  exerciseStates[exerciseIndex].submitted = false;
  renderPractice();
});
exerciseForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!exerciseStates[exerciseIndex].choice) return;
  exerciseStates[exerciseIndex].submitted = true;
  renderPractice();
  feedback.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'instant' : 'smooth' });
});
previous.addEventListener('click', () => { if (exerciseIndex > 0) { exerciseIndex--; renderPractice(true); } });
next.addEventListener('click', () => { if (exerciseIndex < exercises.length - 1) { exerciseIndex++; renderPractice(true); } });
more.addEventListener('click', () => {
  exerciseStates[exerciseIndex] = { choice: '', submitted: false, extra: true };
  renderPractice(true);
});
document.querySelector('#practice-reset').addEventListener('click', () => {
  exerciseStates = exercises.map(() => ({ choice: '', submitted: false, extra: false }));
  exerciseIndex = 0;
  renderPractice(true);
});
renderPractice();
practiceApp.hidden = false;

// Animate on first entry without leaving off-screen content hidden.
// This also keeps anchor jumps, printing and browsers without observers readable.
const revealTargets = [...document.querySelectorAll(
  '.section__head, .relation-layout, .type-block, .paper__identity, .paper__figure, .paper__main > div, .paper__aside, .compare-controls, .comparison, .practice-guide, .practice-toolbar, .practice-layout, .debate-study__identity, .debate-intro__claim, .debate-intro__body > section, .debate-media, .debate-orientations, .debate-verdict, .debate-evidence > section, .references'
)];
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scroll-reveal');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0 });
  revealTargets.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
    revealObserver.observe(element);
  });
}
