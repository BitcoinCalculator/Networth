async function renderWorkers() {
  const content = document.getElementById('content');
  content.innerHTML = '<h2>Workers</h2><button>Add Worker</button><div class="list"></div>';
  content.querySelector('button').addEventListener('click', () => addWorker());

  const workers = await FirebaseService.getCollection('workers');
  const list = content.querySelector('.list');
  workers.forEach(worker => {
    const item = document.createElement('div');
    item.innerHTML = `<span style="color: ${worker.color}">${worker.initials}</span> ${worker.name} <button>Edit</button> <button>Delete</button>`;
    item.querySelector('button:nth-child(1)').addEventListener('click', () => editWorker(worker));
    item.querySelector('button:nth-child(2)').addEventListener('click', () => deleteWorker(worker.id));
    list.appendChild(item);
  });
}

function addWorker() {
  // Use modal with form
  showModal('Add Worker', /* form HTML */, async (data) => {
    await FirebaseService.addDoc('workers', data);
    trigger('data-updated');
  });
}

function editWorker(worker) {
  // Similar, update
}

async function deleteWorker(id) {
  confirmDelete(async () => {
    await FirebaseService.deleteDoc('workers', id);
    trigger('data-updated');
  });
}

// Similar for schedules in calendar

on('data-updated', () => { if (window.location.hash === '#workers') renderWorkers(); });
