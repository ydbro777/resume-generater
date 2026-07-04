const form = document.querySelector("#resumeForm");
const preview = document.querySelector("#resumePreview");
const statusText = document.querySelector("#statusText");
const generateButton = document.querySelector("#generateButton");
const downloadButton = document.querySelector("#downloadButton");
const printButton = document.querySelector("#printButton");
const loadExampleButton = document.querySelector("#loadExampleButton");
const languageButtons = document.querySelectorAll("[data-lang]");

let currentLang = "zh";
let hasGenerated = false;

const copy = {
  zh: {
    appTitle: "简历生成器",
    loadExample: "填入示例",
    generate: "生成简历",
    editorTitle: "填写信息",
    editorHelp: "选择模板，补充基本信息和经历，生成后可下载。",
    templateLegend: "模板",
    targetRole: "目标岗位",
    fullName: "姓名",
    location: "城市",
    phone: "电话",
    email: "邮箱",
    education: "教育经历",
    experience: "实习或项目经历",
    skills: "技能与工具",
    awards: "证书、奖项或其他亮点",
    previewTitle: "简历预览",
    previewHelp: "生成后可保存为 HTML，或打印为 PDF。",
    downloadHtml: "下载 HTML",
    savePdf: "保存 PDF",
    waiting: "等待填写",
    changed: "已更新，待生成",
    generated: "已生成",
    downloaded: "已下载 HTML",
    emptyTitle: "从左侧填写信息开始",
    emptyHelp: "选择一个模板，再点击“生成简历”。",
    summaryTitle: "个人概览",
    educationTitle: "教育经历",
    experienceTitle: "经历与成果",
    skillsTitle: "技能",
    awardsTitle: "证书与其他",
    highlightsTitle: "亮点",
    htmlTitleSuffix: "的简历",
    fileSuffix: "简历",
    fallbackPrefix: "围绕目标岗位完成：",
    targetRolePlaceholder: "例如：数据分析实习生",
    fullNamePlaceholder: "例如：林嘉宁",
    locationPlaceholder: "例如：上海",
    educationPlaceholder: "学校 / 专业 / 学历 / 时间 / 亮点课程或成绩",
    experiencePlaceholder: "每段经历可以写：公司或项目、角色、时间、做了什么、结果如何。",
    skillsPlaceholder: "例如：Python、SQL、Excel、Tableau、沟通协作、英文读写",
    awardsPlaceholder: "可选：竞赛、证书、奖学金、作品链接等",
    placeholders: {
      targetRole: "目标岗位",
      fullName: "你的姓名",
      location: "所在城市",
      phone: "联系电话",
      email: "邮箱地址",
      education: "填写教育经历后，这里会生成更正式的表述。",
      experience: "填写实习或项目经历后，这里会拆分为重点成果。",
      skills: "填写技能后，这里会整理为标签。",
      awards: "可填写证书、奖项或其他亮点。"
    },
    templates: {
      clean: ["清爽通用", "适合校招、转岗、通用投递"],
      sidebar: ["侧栏重点", "突出技能、证书、工具栈"],
      executive: ["专业商务", "适合资深岗位、咨询、运营"],
      campus: ["校招简洁", "适合学生、实习、校园招聘"],
      tech: ["技术项目", "突出技能栈、项目和交付结果"],
      data: ["数据分析", "强调指标、工具和分析成果"],
      product: ["产品运营", "适合增长、活动、用户运营岗位"],
      consulting: ["咨询金融", "正式稳重，突出结构化表达"],
      creative: ["创意内容", "适合设计、新媒体、内容岗位"]
    },
    summary(data) {
      const coreSkill = data.skills.slice(0, 3).join("、") || "岗位相关技能";
      return `面向${data.targetRole}岗位，具备${coreSkill}等能力；过往经历覆盖资料整理、任务推进和结果复盘，能够将经历转化为清晰、可投递的简历表达。`;
    }
  },
  en: {
    appTitle: "Resume Generator",
    loadExample: "Use sample",
    generate: "Generate resume",
    editorTitle: "Resume details",
    editorHelp: "Choose a template, add your profile and experience, then download the result.",
    templateLegend: "Templates",
    targetRole: "Target role",
    fullName: "Name",
    location: "Location",
    phone: "Phone",
    email: "Email",
    education: "Education",
    experience: "Internship or project experience",
    skills: "Skills and tools",
    awards: "Certificates, awards, or highlights",
    previewTitle: "Resume preview",
    previewHelp: "Save as HTML or print to PDF after generating.",
    downloadHtml: "Download HTML",
    savePdf: "Save PDF",
    waiting: "Ready",
    changed: "Updated, generate again",
    generated: "Generated",
    downloaded: "HTML downloaded",
    emptyTitle: "Start by filling in the form",
    emptyHelp: "Choose a template, then click Generate resume.",
    summaryTitle: "Profile",
    educationTitle: "Education",
    experienceTitle: "Experience and impact",
    skillsTitle: "Skills",
    awardsTitle: "Certificates and more",
    highlightsTitle: "Highlights",
    htmlTitleSuffix: "'s resume",
    fileSuffix: "resume",
    fallbackPrefix: "Completed role-relevant work: ",
    targetRolePlaceholder: "Example: Data Analyst Intern",
    fullNamePlaceholder: "Example: Jane Lin",
    locationPlaceholder: "Example: Shanghai",
    educationPlaceholder: "School / major / degree / dates / relevant courses or GPA",
    experiencePlaceholder: "For each item: company or project, role, dates, work done, and results.",
    skillsPlaceholder: "Example: Python, SQL, Excel, Tableau, collaboration, business writing",
    awardsPlaceholder: "Optional: competitions, certificates, scholarships, portfolio links",
    placeholders: {
      targetRole: "Target role",
      fullName: "Your name",
      location: "Your city",
      phone: "Phone number",
      email: "Email address",
      education: "Add your education details to create a polished section.",
      experience: "Add internships or projects to turn them into impact bullets.",
      skills: "Add skills to organize them as tags.",
      awards: "Add certificates, awards, or other highlights."
    },
    templates: {
      clean: ["Clean", "General applications, career switch, campus hiring"],
      sidebar: ["Sidebar focus", "Highlights skills, certificates, and tools"],
      executive: ["Executive", "Senior roles, consulting, operations"],
      campus: ["Campus", "Students, internships, campus recruiting"],
      tech: ["Technical", "Skills stack, projects, and delivery outcomes"],
      data: ["Data analysis", "Metrics, tools, and analytical impact"],
      product: ["Product ops", "Growth, campaigns, users, and operations"],
      consulting: ["Consulting", "Formal style with structured presentation"],
      creative: ["Creative", "Design, media, content, and portfolio roles"]
    },
    summary(data) {
      const coreSkill = data.skills.slice(0, 3).join(", ") || "role-relevant skills";
      return `Positioned for ${data.targetRole} roles, with strengths in ${coreSkill}. Experience shows clear ownership, structured execution, and measurable outcomes that translate well into a polished resume.`;
    }
  }
};

const examples = {
  zh: {
    targetRole: "数据分析实习生",
    fullName: "林嘉宁",
    location: "上海",
    phone: "138 0000 0000",
    email: "linjianing@example.com",
    education: "华东理工大学 / 信息管理与信息系统 / 本科 / 2023-2027\n核心课程：统计学、数据库原理、Python 程序设计、商业分析。",
    experience:
      "校园消费数据分析项目 / 项目负责人 / 2026.03-2026.05\n整理 3,000 条模拟消费记录，使用 Excel 和 Python 完成清洗、分类和可视化，发现高频消费时段和品类变化。\n输出 12 页分析报告，提出 3 条运营优化建议。\n\n新媒体社团增长复盘 / 数据成员 / 2025.09-2025.12\n追踪 8 周内容数据，建立阅读量、转化率和互动率看板。\n根据数据调整发布时间和标题结构，使平均互动率提升 18%。",
    skills: "Python、SQL、Excel、PowerPoint、Tableau、数据清洗、可视化、报告撰写、沟通协作",
    awards: "全国大学生市场调研大赛校级二等奖\nCET-6\n校级三等奖学金"
  },
  en: {
    targetRole: "Data Analyst Intern",
    fullName: "Jane Lin",
    location: "Shanghai",
    phone: "138 0000 0000",
    email: "jane.lin@example.com",
    education: "East China University of Science and Technology / Information Management / B.S. / 2023-2027\nRelevant coursework: Statistics, Database Systems, Python Programming, Business Analytics.",
    experience:
      "Campus Consumption Analytics Project / Project Lead / Mar 2026-May 2026\nCleaned and categorized 3,000 simulated transaction records with Excel and Python, then built visualizations to identify peak purchase periods and category trends.\nDelivered a 12-page analysis report with 3 actionable operations recommendations.\n\nStudent Media Growth Review / Data Contributor / Sep 2025-Dec 2025\nTracked 8 weeks of content performance and built a dashboard for views, conversion rate, and engagement rate.\nAdjusted publishing time and headline structure based on data, improving average engagement by 18%.",
    skills: "Python, SQL, Excel, PowerPoint, Tableau, data cleaning, visualization, report writing, collaboration",
    awards: "Campus-level Second Prize, National College Student Market Research Competition\nCET-6\nUniversity Third-class Scholarship"
  }
};

function t(key) {
  return copy[currentLang][key];
}

function valueOf(name) {
  const field = form.elements[name];
  return field && field.value.trim() ? field.value.trim() : t("placeholders")[name];
}

function selectedTemplate() {
  return form.elements.template.value;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[char];
  });
}

function splitLines(value) {
  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitSkills(value) {
  return value
    .split(/[、,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function polishExperience(value) {
  const impactWords =
    currentLang === "zh"
      ? /提升|增长|降低|完成|输出|建立|负责|整理|优化|发现|提出|追踪/
      : /improved|increased|reduced|completed|delivered|built|owned|organized|optimized|identified|proposed|tracked/i;
  return splitLines(value).map((line) => {
    const clean = line.replace(/^[-•\d.\s]+/, "");
    if (impactWords.test(clean)) {
      return clean;
    }
    return `${t("fallbackPrefix")}${clean}`;
  });
}

function renderHeader(data) {
  return `
    <header class="resume-header">
      <h3>${escapeHtml(data.fullName)}</h3>
      <p class="resume-role">${escapeHtml(data.targetRole)}</p>
      <div class="resume-contact">
        <span>${escapeHtml(data.location)}</span>
        <span>${escapeHtml(data.phone)}</span>
        <span>${escapeHtml(data.email)}</span>
      </div>
    </header>
  `;
}

function renderClean(data) {
  return `${renderHeader(data)}${renderMainSections(data)}`;
}

function renderSidebar(data) {
  return `
    <aside class="resume-aside">
      ${renderHeader(data)}
      <section class="resume-section">
        <h4>${escapeHtml(t("skillsTitle"))}</h4>
        <ul class="skill-list">${data.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
      </section>
      <section class="resume-section">
        <h4>${escapeHtml(t("highlightsTitle"))}</h4>
        <ul class="resume-list">${data.awards.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    </aside>
    <div class="resume-main">
      <section class="resume-section">
        <h4>${escapeHtml(t("educationTitle"))}</h4>
        <p>${escapeHtml(data.education.join(" / "))}</p>
      </section>
      <section class="resume-section">
        <h4>${escapeHtml(t("experienceTitle"))}</h4>
        <ul class="resume-list">${data.experience.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    </div>
  `;
}

function renderExecutive(data) {
  return `${renderHeader(data)}${renderMainSections(data)}`;
}

function renderMainSections(data) {
  return `
    <section class="resume-section">
      <h4>${escapeHtml(t("summaryTitle"))}</h4>
      <p>${escapeHtml(copy[currentLang].summary(data))}</p>
    </section>
    <section class="resume-section">
      <h4>${escapeHtml(t("educationTitle"))}</h4>
      <p>${escapeHtml(data.education.join(" / "))}</p>
    </section>
    <section class="resume-section">
      <h4>${escapeHtml(t("experienceTitle"))}</h4>
      <ul class="resume-list">${data.experience.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
    <section class="resume-section">
      <h4>${escapeHtml(t("skillsTitle"))}</h4>
      <ul class="skill-list">${data.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
    </section>
    <section class="resume-section">
      <h4>${escapeHtml(t("awardsTitle"))}</h4>
      <ul class="resume-list">${data.awards.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function collectData() {
  return {
    template: selectedTemplate(),
    targetRole: valueOf("targetRole"),
    fullName: valueOf("fullName"),
    location: valueOf("location"),
    phone: valueOf("phone"),
    email: valueOf("email"),
    education: splitLines(valueOf("education")),
    experience: polishExperience(valueOf("experience")),
    skills: splitSkills(valueOf("skills")),
    awards: splitLines(valueOf("awards"))
  };
}

function generateResume() {
  const data = collectData();
  preview.className = `resume-paper template-${data.template}`;
  if (data.template === "sidebar") {
    preview.innerHTML = renderSidebar(data);
  } else if (data.template === "executive") {
    preview.innerHTML = renderExecutive(data);
  } else {
    preview.innerHTML = renderClean(data);
  }
  hasGenerated = true;
  statusText.textContent = t("generated");
}

function renderEmpty() {
  preview.className = "resume-paper template-clean";
  preview.innerHTML = `
    <div class="resume-empty">
      <div>
        <strong>${escapeHtml(t("emptyTitle"))}</strong>
        <span>${escapeHtml(t("emptyHelp"))}</span>
      </div>
    </div>
  `;
}

function updateTemplateCards() {
  document.querySelectorAll(".template-option").forEach((card) => {
    const input = card.querySelector("input");
    card.classList.toggle("active", input.checked);
  });
}

function updateLanguageButtons() {
  languageButtons.forEach((button) => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = t("appTitle");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.placeholder);
  });
  document.querySelectorAll("[data-template-name]").forEach((node) => {
    node.textContent = t("templates")[node.dataset.templateName][0];
  });
  document.querySelectorAll("[data-template-meta]").forEach((node) => {
    node.textContent = t("templates")[node.dataset.templateMeta][1];
  });

  updateLanguageButtons();
  if (hasGenerated) {
    generateResume();
  } else {
    statusText.textContent = t("waiting");
    renderEmpty();
  }
}

function collectPageStyles() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (error) {
        return "";
      }
    })
    .join("\n");
}

function downloadResume() {
  generateResume();
  const styles = collectPageStyles();
  const lang = currentLang === "zh" ? "zh-CN" : "en";
  const docTitle =
    currentLang === "zh"
      ? `${escapeHtml(valueOf("fullName"))}${t("htmlTitleSuffix")}`
      : `${escapeHtml(valueOf("fullName"))}${t("htmlTitleSuffix")}`;
  const doc = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${docTitle}</title>
  <style>${styles}</style>
</head>
<body>
  ${preview.outerHTML}
</body>
</html>`;
  const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${valueOf("fullName")}-${t("fileSuffix")}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  statusText.textContent = t("downloaded");
}

function loadExample() {
  Object.entries(examples[currentLang]).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value;
    }
  });
  generateResume();
}

form.addEventListener("change", () => {
  updateTemplateCards();
  statusText.textContent = t("changed");
});

form.addEventListener("input", () => {
  statusText.textContent = t("changed");
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

generateButton.addEventListener("click", generateResume);
downloadButton.addEventListener("click", downloadResume);
printButton.addEventListener("click", () => {
  generateResume();
  window.print();
});
loadExampleButton.addEventListener("click", loadExample);

applyLanguage("zh");
