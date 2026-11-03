(() => {
  const map = document.getElementById('cann-capability-map');
  const heading = document.getElementById('全栈课程体系地图');
  const domainList = map?.querySelector('.capability-domain-list');
  const detail = map?.querySelector('.capability-course-detail');
  if (!map || !heading || !domainList || !detail) return;

  const intro = heading.nextElementSibling;
  const tableWrap = intro?.nextElementSibling;
  const table = tableWrap?.querySelector('table');
  if (!table) return;

  const clean = (text) => text.replace(/\s+/g, ' ').trim();
  const rows = [...table.querySelectorAll('tbody tr')]
    .filter((row) => row.cells.length > 1 && row.querySelector('td'))
    .map((row) => ({
      name: clean(row.cells[0].textContent),
      stages: [...row.cells].slice(1),
    }));

  function setEmptyState() {
    const empty = document.createElement('div');
    empty.className = 'capability-empty';
    empty.innerHTML = '<span class="empty-line" aria-hidden="true"></span><strong>选择一个课程方向</strong><p>课程阶段和资源入口会显示在这里。</p>';
    detail.replaceChildren(empty);
  }

  function renderCourse(row, activeButton) {
    domainList.querySelectorAll('.capability-domain').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === activeButton));
    });

    detail.replaceChildren();
    const head = document.createElement('div');
    head.className = 'capability-detail-head';
    const title = document.createElement('div');
    title.innerHTML = '<small>COURSE PATH</small>';
    const name = document.createElement('h3');
    name.textContent = row.name;
    title.append(name);
    const levelHint = document.createElement('span');
    levelHint.textContent = '由基础到进阶';
    head.append(title, levelHint);
    detail.append(head);

    const levelNames = ['初级', '中级', '高级'];
    const labels = document.createElement('div');
    labels.className = 'capability-level-head';
    levelNames.forEach((label, index) => {
      const item = document.createElement('span');
      item.dataset.step = `0${index + 1}`;
      item.textContent = label;
      labels.append(item);
    });
    detail.append(labels);

    const stages = document.createElement('div');
    stages.className = 'capability-level-list';
    let nextStage = 1;
    row.stages.forEach((cell) => {
      const span = Math.max(1, Number(cell.getAttribute('colspan')) || 1);
      const start = nextStage;
      nextStage += span;
      const end = Math.min(3, start + span - 1);
      const item = document.createElement('article');
      item.className = 'capability-level-item';
      item.dataset.level = start === end ? levelNames[start - 1] : `${levelNames[start - 1]}至${levelNames[end - 1]}`;
      item.style.gridColumn = `${start} / span ${Math.min(span, 4 - start)}`;
      if (clean(cell.textContent) === '—') {
        const empty = document.createElement('span');
        empty.className = 'level-empty';
        empty.textContent = '该阶段暂无课程';
        item.append(empty);
      } else {
        [...cell.childNodes].forEach((node) => item.append(node.cloneNode(true)));
      }
      stages.append(item);
    });
    detail.append(stages);
  }

  rows.forEach((row) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'capability-domain';
    button.textContent = row.name;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => renderCourse(row, button));
    domainList.append(button);
  });

  if (tableWrap) {
    const note = document.createElement('div');
    note.className = 'catalog-map-note';
    note.innerHTML = '<div><strong>课程矩阵已整理到首页能力地图</strong><p>点选课程方向，即可查看初级、中级和高级资源。</p></div><a href="#cann-capability-map">打开 CANN 全栈能力地图 ›</a>';
    tableWrap.replaceWith(note);
  }

  setEmptyState();
})();
