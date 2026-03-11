// Bootstrap
const routes = {
  '#dashboard': renderDashboard,
  '#calendar': renderCalendar,
  '#workers': renderWorkers,
  '#cars': renderCars,
  '#houses': renderHouses,
  '#tasks': renderTasks
};

async function init() {
  // Load seed data if empty
  const tasks = await FirebaseService.getCollection('tasks');
  if (!tasks.length) {
    fetch('data/seed.json').then(res => res.json()).then(seed => {
      Object.keys(seed).forEach(col => {
        seed[col].forEach(doc => FirebaseService.addDoc(col, doc));
      });
      trigger('data-updated');
    });
  }

  // Quick add
  document.getElementById('quick-add').addEventListener('click', () => taskForm({}, data => FirebaseService.addDoc('tasks', data)));

  // Routing
  window.addEventListener('hashchange', route);
  route();
}

function route() {
  const hash = window.location.hash || '#dashboard';
  (routes[hash] || renderDashboard)();
}

init();
