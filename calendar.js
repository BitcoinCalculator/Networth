let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

async function renderCalendar() {
  const content = document.getElementById('content');
  content.innerHTML = '<div class="calendar-header"><button id="prev-month">&lt;</button><h2 id="month-title"></h2><button id="next-month">&gt;</button></div><div class="calendar"></div>';
  updateMonthTitle();

  const calendar = content.querySelector('.calendar');
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Add weekday headers
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
    const header = document.createElement('div');
    header.textContent = day;
    calendar.appendChild(header);
  });

  // Pad start
  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement('div'));
  }

  // Fetch data
  const tasks = await FirebaseService.getCollection('tasks');
  const schedules = await FirebaseService.getCollection('schedules');
  const carMaints = await FirebaseService.getCollection('car_maintenances');
  const houseMaints = await FirebaseService.getCollection('house_maintenances');
  const workers = await FirebaseService.getCollection('workers');

  // Generate recurrences for the month
  const startRange = new Date(currentYear, currentMonth, 1);
  const endRange = new Date(currentYear, currentMonth + 1, 0);
  const allItems = [...tasks, ...carMaints, ...houseMaints].flatMap(item => generateRecurrences(item, startRange, endRange));

  // Render days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.classList.add('day-cell');
    cell.innerHTML = `<span class="day-number">${day}</span>`;
    const cellDate = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];

    // Add schedules (worker initials)
    schedules.forEach(sch => {
      if (cellDate >= sch.startDate && cellDate <= sch.endDate) {
        const worker = workers.find(w => w.id === sch.workerId);
        if (worker) {
          const initial = document.createElement('span');
          initial.classList.add('worker-initial');
          initial.style.background = worker.color;
          initial.textContent = worker.initials;
          cell.appendChild(initial);
        }
      }
    });

    // Add items
    allItems.forEach(item => {
      const itemDate = (item.effectiveDate || item.dueDate).split('T')[0];
      if (itemDate === cellDate) {
        const label = document.createElement('div');
        label.textContent = item.title || item.type;
        label.style.background = getCategoryColor(item.category); // Define function
        cell.appendChild(label);
      }
    });

    // Add maintenance icons (e.g., emoji for car/house)
    // ...

    // Click to add/edit
    cell.addEventListener('click', () => showDayModal(cellDate));

    calendar.appendChild(cell);
  }

  // Nav buttons
  document.getElementById('prev-month').addEventListener('click', () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); });
  document.getElementById('next-month').addEventListener('click', () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); });

  // Drag for schedules (implement with mousedown/mouseup)
  // ...
}

function updateMonthTitle() {
  document.getElementById('month-title').textContent = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
}

function showDayModal(date) {
  // Show modal with items on that day, add schedule/task
}

function getCategoryColor(category) {
  const colors = { health: '#2196F3', chores: '#8BC34A' /* etc. */ };
  return colors[category] || '#CCC';
}

on('data-updated', renderCalendar);
