(() => {
  const grid = document.querySelector('#audience .audience-grid');
  if (!grid) return;

  const buttons = [...grid.querySelectorAll('[data-audience]')];
  const roleProfiles = {
    beginner: {
      top: ['basic-learning', 'learning-paths', 'learning-progress', 'practice-modes'],
      resources: ['resource-preparation'],
      paths: ['mainline-training', 'mainline-inference', 'mainline-operator', 'mainline-appdev', 'mainline-recsys'],
      stages: ['train', 'infer', 'operator', 'app', 'recsys'],
      tracks: [],
      extras: [],
      teachingCards: []
    },
    llm: {
      top: ['learning-paths', 'learning-progress', 'practice-modes'],
      resources: ['resource-path-details'],
      paths: ['mainline-training', 'mainline-inference'],
      stages: ['train', 'infer'],
      tracks: ['train', 'infer'],
      extras: [],
      teachingCards: []
    },
    operator: {
      top: ['learning-paths', 'learning-progress', 'practice-modes'],
      resources: ['resource-path-details'],
      paths: ['mainline-operator'],
      stages: ['operator'],
      tracks: ['operator'],
      extras: [],
      teachingCards: []
    },
    application: {
      top: ['learning-paths', 'learning-progress', 'practice-modes'],
      resources: ['resource-path-details'],
      paths: ['mainline-appdev'],
      stages: ['app'],
      tracks: ['app'],
      extras: [],
      teachingCards: []
    },
    aiapp: {
      top: ['practice-modes', 'community-learning'],
      resources: ['resource-course-index'],
      paths: [],
      stages: [],
      tracks: [],
      extras: ['mainline-ai-appdev'],
      teachingCards: []
    },
    recommender: {
      top: ['learning-paths', 'learning-progress', 'practice-modes'],
      resources: ['resource-path-details'],
      paths: ['mainline-recsys'],
      stages: ['recsys'],
      tracks: ['recsys'],
      extras: [],
      teachingCards: []
    },
    teacher: {
      top: ['teacher-support', 'practice-modes', 'community-learning'],
      resources: ['resource-teaching'],
      paths: [],
      stages: [],
      tracks: [],
      extras: ['teacher-support'],
      teachingCards: ['resource-teaching-card']
    },
    competition: {
      top: ['practice-modes', 'community-learning'],
      resources: ['resource-teaching'],
      paths: [],
      stages: [],
      tracks: [],
      extras: ['competition'],
      teachingCards: ['resource-teaching-card'],
      competitionFocus: true
    },
    community: {
      top: ['community-learning'],
      resources: ['resource-teaching', 'resource-updates'],
      paths: [],
      stages: [],
      tracks: [],
      extras: ['技术博客', '参与贡献', '代码学习与问答'],
      teachingCards: ['resource-community-card']
    }
  };

  const universalSections = ['cann-capability-map'];
  const topSections = [
    'teacher-support', 'basic-learning', 'learning-paths', 'learning-progress',
    'cann-capability-map', 'practice-modes', 'community-learning'
  ];
  const resourceSections = [
    'resource-preparation', 'resource-path-details', 'resource-course-index',
    'resource-teaching', 'resource-updates'
  ];
  const resourceGroups = document.querySelector('#main .resource-groups');
  const pathCards = [...document.querySelectorAll('#learning-paths .path-grid > a')];
  const stageRows = [...document.querySelectorAll('#learning-progress .learning-stage-row')];
  const trackCards = [...document.querySelectorAll('#resource-path-details .resource-card[data-kind]')];
  const extraCards = [...document.querySelectorAll('#community-learning .extras-grid > a')];
  const teaching = document.getElementById('resource-teaching');
  const teachingCards = teaching ? [...teaching.querySelectorAll('.resource-grid > .resource-card')] : [];
  const teachingCard = document.getElementById('resource-teaching-card');
  const competitionSection = document.getElementById('competition');
  const aiAppRow = document.getElementById('mainline-ai-appdev')?.closest('tr');
  let activeRole = 'beginner';

  function decodeHash(value) {
    const raw = String(value || '').replace(/^#/, '');
    try {
      return decodeURIComponent(raw);
    } catch (_) {
      return raw;
    }
  }

  function linkedTarget(element) {
    const href = element.getAttribute('href') || '';
    return href.startsWith('#') ? decodeHash(href) : '';
  }

  function setCompetitionFocus(enabled) {
    if (!teachingCard || !competitionSection) return;
    teachingCard.classList.toggle('is-competition-focus', enabled);
    const sourceSections = [...teachingCard.querySelectorAll(':scope > .source-section')];
    const targetSource = competitionSection.parentElement;
    teachingCard.querySelector(':scope > .resource-summary').hidden = enabled;
    sourceSections.forEach((section) => {
      section.hidden = enabled && section !== targetSource;
      [...section.children].forEach((child) => {
        child.hidden = enabled && child !== competitionSection;
      });
    });
  }

  function applyRole(roleId) {
    const profile = roleProfiles[roleId];
    if (!profile) return;
    activeRole = roleId;
    document.body.dataset.audience = roleId;

    buttons.forEach((button) => {
      const selected = button.dataset.audience === roleId;
      button.setAttribute('aria-pressed', String(selected));
    });

    topSections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) section.hidden = !profile.top.includes(id) && !universalSections.includes(id);
    });

    resourceSections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) section.hidden = !profile.resources.includes(id);
    });

    if (resourceGroups) {
      resourceGroups.hidden = !resourceSections.some((id) => {
        const section = document.getElementById(id);
        return section && !section.hidden;
      });
    }

    pathCards.forEach((card) => {
      card.hidden = !profile.paths.includes(linkedTarget(card));
    });

    stageRows.forEach((row) => {
      row.hidden = !profile.stages.includes(row.dataset.kind);
    });

    trackCards.forEach((card) => {
      card.hidden = !profile.tracks.includes(card.dataset.kind);
    });

    extraCards.forEach((card) => {
      const title = card.querySelector('strong')?.textContent.trim() || '';
      const target = linkedTarget(card);
      card.hidden = !(profile.extras.includes(target) || profile.extras.includes(title));
    });

    teachingCards.forEach((card) => {
      card.hidden = !profile.teachingCards.includes(card.id);
    });
    setCompetitionFocus(Boolean(profile.competitionFocus));

    const preparationRoleCard = document.querySelector('#resource-preparation .resource-card[data-kind="roles"]');
    if (preparationRoleCard) preparationRoleCard.hidden = true;

    const courseIndex = document.getElementById('resource-course-index');
    if (courseIndex && aiAppRow) {
      courseIndex.querySelectorAll('tbody tr').forEach((row) => {
        row.hidden = roleId === 'aiapp' && row !== aiAppRow;
      });
    }

    const quickPanel = document.querySelector('.side .quick-panel');
    if (quickPanel) {
      const quickLinks = [...quickPanel.querySelectorAll('a')];
      quickLinks.forEach((link) => {
        const target = linkedTarget(link);
        const allowed = (target === 'teacher-support' && roleId === 'teacher') ||
          (target === 'competition' && roleId === 'competition') ||
          (target === 'mainline-ai-appdev' && roleId === 'aiapp');
        link.hidden = !allowed;
      });
      quickPanel.hidden = !quickLinks.some((link) => !link.hidden);
    }
  }

  function showAllTrackDetails() {
    const section = document.getElementById('resource-path-details');
    if (section) section.hidden = false;
    trackCards.forEach((card) => {
      card.hidden = false;
    });
    if (resourceGroups) resourceGroups.hidden = false;
  }

  function navigateToHash(targetId) {
    const encoded = '#' + encodeURIComponent(targetId);
    if (location.hash === encoded) {
      requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ block: 'start' }));
    } else {
      location.hash = encodeURIComponent(targetId);
    }
  }

  function roleForTarget(id) {
    const direct = {
      'basic-learning': 'beginner',
      'resource-preparation': 'beginner',
      'cann-basics': 'beginner',
      'mainline-training': 'llm',
      'mainline-inference': 'llm',
      swanlab: 'llm',
      'mainline-operator': 'operator',
      'mainline-appdev': 'application',
      'mainline-ai-appdev': 'aiapp',
      'mainline-recsys': 'recommender',
      'resource-course-index': 'aiapp',
      'teacher-support': 'teacher',
      'resource-teaching-card': 'teacher',
      'teacher-materials': 'teacher',
      'course-collaboration': 'teacher',
      competition: 'competition',
      '技术博客': 'community',
      '科研案例': 'community',
      '参与贡献': 'community',
      'resource-community-card': 'community',
      'resource-updates': 'community',
      'latest-news': 'community'
    };
    if (direct[id]) return direct[id];
    if (id === 'learning-paths' || id === 'learning-progress' || id === 'resource-path-details') {
      return roleProfiles[activeRole].paths.length ? activeRole : 'beginner';
    }
    if (id === 'practice-modes') {
      return roleProfiles[activeRole].top.includes(id) ? activeRole : 'beginner';
    }
    if (id === 'community-learning') {
      return ['aiapp', 'teacher', 'competition', 'community'].includes(activeRole) ? activeRole : 'community';
    }
    return '';
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      applyRole(button.dataset.audience);
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || grid.contains(link)) return;
    const targetId = linkedTarget(link);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (targetId === 'resource-path-details' && !roleProfiles[activeRole].tracks.length) {
      event.preventDefault();
      applyRole('beginner');
      showAllTrackDetails();
      navigateToHash(targetId);
      return;
    }
    const role = roleForTarget(targetId);
    if (!role || role === activeRole || !target) return;
    event.preventDefault();
    applyRole(role);
    navigateToHash(targetId);
  });

  const initialTarget = decodeHash(location.hash);
  const initialRole = roleForTarget(initialTarget);
  applyRole(initialRole || 'beginner');
  if (initialTarget === 'resource-path-details') showAllTrackDetails();
})();
