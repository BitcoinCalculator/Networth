async function renderDashboard() {
  const content = document.getElementById('content');
  content.innerHTML = '<div class="dashboard"></div>';
  const dashboard = content.querySelector('.dashboard');

  // Fetch all items
  const tasks = await FirebaseService.getCollection('tasks');
  const carMaints = await FirebaseService.getCollection('car_maintenances');
  const houseMaints = await FirebaseService.getCollection('house_maintenances');
  // ... fetch others

  // Flatten and apply recurrence
  const allItems = [...tasks, ...carMaints, ...houseMaints].flatMap(item => generateRecurrences(item, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 3))));

  // Group by priority
  const groups = { urgent: [], mid: [], low: [] };
  allItems.forEach(item => {
    item.priority = calculatePriority(item.effectiveDate || item.dueDate, item.priority);
    groups[item.priority].push(item);
  });

  // Render sections
  ['urgent', 'mid', 'low'].forEach(prio => {
    const section = document.createElement('div');
    section.classList.add('priority-section');
    section.innerHTML = `<h3>${prio.charAt(0).toUpperCase() + prio.slice(1)}</h3>`;
    groups[prio].forEach(item => {
      const card = document.createElement('div');
      card.classList.add('item-card');
      card.innerHTML = `
        <span class="priority-badge ${prio}">${prio}</span>
        <h4>${item.title || item.type}</h4>
        <p>Due: ${formatDate(item.dueDate)} ${isOverdue(item.dueDate) ? '<span class="overdue">(Overdue)</span>' : ''}</p>
        <p>Category: ${item.category || 'Maintenance'}</p>
        <button>Complete</button> <button>Edit</button> <button>Delete</button>
      `;
      // Add event listeners for actions
      card.querySelector('button:nth-child(1)').addEventListener('click', () => completeItem(item));
      // ...
      section.appendChild(card);
    });
    dashboard.appendChild(section);
  });

  // Add filters/search logic
  document.getElementById('search').addEventListener('input', () => { /* filter and re-render */ });
}

async function completeItem(item) {
  item.status = 'completed';
  if (item.log) item.log.push({ completedDate: new Date().toISOString(), notes: '' });
  await FirebaseService.updateDoc(item.carId ? 'car_maintenances' : item.houseId ? 'house_maintenances' : 'tasks', item.id, item);
  trigger('data-updated');
}

// Listen for updates
on('data-updated', renderDashboard);
