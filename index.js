// Interactive math / AI visual on the hero canvas
function initMathCanvas() {
  const canvas = document.getElementById('mathCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  const nodes = [];
  const NODE_COUNT = 42;

  function createNodes() {
    nodes.length = 0;
    const { width, height } = canvas.getBoundingClientRect();
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35;
      nodes.push({
        baseX: width / 2 + radius * Math.cos(angle),
        baseY: height / 2 + radius * Math.sin(angle),
        offset: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.9,
        size: 1.4 + Math.random() * 1.8
      });
    }
  }

  createNodes();

  function draw() {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    // background grid
    ctx.save();
    ctx.strokeStyle = 'rgba(60, 72, 120, 0.35)';
    ctx.lineWidth = 0.5;
    const step = 36;
    for (let x = 0; x < width + step; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height + step; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // parametric curve (Lissajous-type, to evoke math)
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    for (let i = 0; i <= 600; i++) {
      const a = i / 600 * Math.PI * 2;
      const x = 140 * Math.sin(2 * a + t * 0.8);
      const y = 80 * Math.sin(3 * a + t * 0.6);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const grad = ctx.createLinearGradient(-160, -90, 160, 90);
    grad.addColorStop(0, '#ff7bd8');
    grad.addColorStop(0.5, '#7b5cff');
    grad.addColorStop(1, '#3bc9ff');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(123, 92, 255, 0.9)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    // nodes and connections (AI graph)
    ctx.save();
    ctx.lineWidth = 0.7;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const pulse = Math.sin(t * n.speed + n.offset) * 4;
      const x = n.baseX + pulse;
      const y = n.baseY + pulse * 0.4;

      // connections
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const mx = m.baseX;
        const my = m.baseY;
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = 1 - dist / 130;
          ctx.strokeStyle = `rgba(108, 122, 255, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const pulse = Math.sin(t * n.speed + n.offset) * 4;
      const x = n.baseX + pulse;
      const y = n.baseY + pulse * 0.4;
      const r = n.size + Math.max(0, pulse * 0.12);

      const gradNode = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
      gradNode.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradNode.addColorStop(0.4, 'rgba(255, 123, 216, 0.9)');
      gradNode.addColorStop(1, 'rgba(255, 123, 216, 0)');
      ctx.fillStyle = gradNode;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#050816';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    t += 0.015;
    requestAnimationFrame(draw);
  }

  draw();
}

// Interactive skills orbit
function initSkillsOrbit() {
  const orbit = document.getElementById('skillsOrbit');
  const desc = document.getElementById('skillsOrbitDescription');
  if (!orbit || !desc) return;

  const nodes = Array.from(orbit.querySelectorAll('.orbit-node'));

  // Place nodes on an ellipse
  function layout() {
    const rect = orbit.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = rect.width * 0.34;
    const ry = rect.height * 0.3;

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      node.style.left = `${x - node.offsetWidth / 2}px`;
      node.style.top = `${y - node.offsetHeight / 2}px`;
    });
  }

  window.addEventListener('resize', layout);
  layout();

  const messages = {
    AI: 'I design AI solutions that are ethical, explainable and directly useful in real‑world workflows.',
    Math: 'My mathematics background ensures every model and algorithm rests on a solid theoretical foundation.',
    'Full‑stack':
      'From frontend UX to backend APIs and data pipelines, I can take AI products from idea to production.',
    Teaching:
      'More than a decade in the classroom helps me build AI systems that support real learning – not shortcuts.',
    Leadership:
      'As Founder & CEO, I bridge strategy, communication and technology across teams and stakeholders.'
  };

  nodes.forEach((node) => {
    const label = node.dataset.label || node.textContent?.trim() || '';
    node.addEventListener('mouseenter', () => {
      nodes.forEach((n) => n.classList.remove('active'));
      node.classList.add('active');
      desc.textContent = messages[label] || label;
    });
    node.addEventListener('focus', () => {
      nodes.forEach((n) => n.classList.remove('active'));
      node.classList.add('active');
      desc.textContent = messages[label] || label;
    });
  });
}

// Contact form demo behaviour
function initContactForm() {
  const form = document.getElementById('contactForm');
  const hint = document.getElementById('formHint');
  if (!form || !hint) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hint.textContent =
      'Thank you for your message. This demo form does not send email, but your text is still in the fields so you can copy it into an email to me.';
  });
}

function initYear() {
  const el = document.getElementById('year');
  if (el) {
    el.textContent = new Date().getFullYear().toString();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initMathCanvas();
  initSkillsOrbit();
  initContactForm();
  initYear();
});

