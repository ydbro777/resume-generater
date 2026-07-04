const form = document.querySelector("#resumeForm");
const preview = document.querySelector("#resumePreview");
const statusText = document.querySelector("#statusText");
const generateButton = document.querySelector("#generateButton");
const downloadButton = document.querySelector("#downloadButton");
const printButton = document.querySelector("#printButton");
const loadExampleButton = document.querySelector("#loadExampleButton");

const exampleData = {
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
};

const placeholders = {
  targetRole: "目标岗位",
  fullName: "你的姓名",
  location: "所在城市",
  phone: "联系电话",
  email: "邮箱地址",
  education: "填写教育经历后，这里会生成更正式的表述。",
  experience: "填写实习或项目经历后，这里会拆分为重点成果。",
  skills: "填写技能后，这里会整理为标签。",
  awards: "可填写证书、奖项或其他亮点。"
};

function valueOf(name) {
  const field = form.elements[name];
  return field && field.value.trim() ? field.value.trim() : placeholders[name];
}

function selectedTemplate() {
  return form.elements.template.value;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
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
  return splitLines(value).map((line) => {
    const clean = line.replace(/^[-•\d.\s]+/, "");
    if (/提升|增长|降低|完成|输出|建立|负责|整理|优化|发现|提出|追踪/.test(clean)) {
      return clean;
    }
    return `围绕目标岗位完成：${clean}`;
  });
}

function renderClean(data) {
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
    ${renderMainSections(data)}
  `;
}

function renderSidebar(data) {
  return `
    <aside class="resume-aside">
      <header class="resume-header">
        <h3>${escapeHtml(data.fullName)}</h3>
        <p class="resume-role">${escapeHtml(data.targetRole)}</p>
        <div class="resume-contact">
          <span>${escapeHtml(data.location)}</span>
          <span>${escapeHtml(data.phone)}</span>
          <span>${escapeHtml(data.email)}</span>
        </div>
      </header>
      <section class="resume-section">
        <h4>技能</h4>
        <ul class="skill-list">${data.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
      </section>
      <section class="resume-section">
        <h4>亮点</h4>
        <ul class="resume-list">${data.awards.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    </aside>
    <div class="resume-main">
      <section class="resume-section">
        <h4>教育经历</h4>
        <p>${escapeHtml(data.education.join(" / "))}</p>
      </section>
      <section class="resume-section">
        <h4>经历与成果</h4>
        <ul class="resume-list">${data.experience.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    </div>
  `;
}

function renderExecutive(data) {
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
    ${renderMainSections(data)}
  `;
}

function renderMainSections(data) {
  return `
    <section class="resume-section">
      <h4>个人概览</h4>
      <p>${escapeHtml(buildSummary(data))}</p>
    </section>
    <section class="resume-section">
      <h4>教育经历</h4>
      <p>${escapeHtml(data.education.join(" / "))}</p>
    </section>
    <section class="resume-section">
      <h4>经历与成果</h4>
      <ul class="resume-list">${data.experience.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
    <section class="resume-section">
      <h4>技能</h4>
      <ul class="skill-list">${data.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
    </section>
    <section class="resume-section">
      <h4>证书与其他</h4>
      <ul class="resume-list">${data.awards.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function buildSummary(data) {
  const coreSkill = data.skills.slice(0, 3).join("、") || "岗位相关技能";
  return `面向${data.targetRole}岗位，具备${coreSkill}等能力；过往经历覆盖资料整理、任务推进和结果复盘，能够将经历转化为清晰、可投递的简历表达。`;
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
  statusText.textContent = "已生成";
}

function renderEmpty() {
  preview.className = "resume-paper template-clean";
  preview.innerHTML = `
    <div class="resume-empty">
      <div>
        <strong>从左侧填写信息开始</strong>
        <span>选择一个模板，再点击“生成简历”。</span>
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
  const doc = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(valueOf("fullName"))}的简历</title>
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
  link.download = `${valueOf("fullName")}-简历.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  statusText.textContent = "已下载 HTML";
}

function loadExample() {
  Object.entries(exampleData).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value;
    }
  });
  generateResume();
}

form.addEventListener("change", () => {
  updateTemplateCards();
  statusText.textContent = "已更新，待生成";
});

form.addEventListener("input", () => {
  statusText.textContent = "已更新，待生成";
});

generateButton.addEventListener("click", generateResume);
downloadButton.addEventListener("click", downloadResume);
printButton.addEventListener("click", () => {
  generateResume();
  window.print();
});
loadExampleButton.addEventListener("click", loadExample);

renderEmpty();
