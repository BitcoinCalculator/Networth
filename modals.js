// Reusable modals
function showModal(title, content, onSave) {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal">
      <h2>${title}</h2>
      ${content}
      <button onclick="this.closest('#modal-overlay').classList.add('hidden')">Cancel</button>
      <button class="save">Save</button>
    </div>
  `;
  overlay.querySelector('.save').addEventListener('click', () => {
    onSave();
    overlay.classList.add('hidden');
  });
  overlay.classList.remove('hidden');
}

function confirmDelete(onConfirm) {
  showModal('Confirm Delete', '<p>Are you sure?</p>', onConfirm);
}

// Example form for task
function taskForm(data = {}, onSave) {
  const content = `
    <input type="text" placeholder="Title" value="${data.title || ''}">
    <select>
      <option>Category</option>
      <option value="health">Health</option>
      <!-- Add more -->
    </select>
    <input type="date" placeholder="Due Date" value="${data.dueDate || ''}">
    <!-- Add recurrence, priority, etc. -->
  `;
  showModal('Add/Edit Task', content, () => {
    // Collect form data
    const formData = { /* parse inputs */ };
    onSave(formData);
  });
}
// Similar for worker, car, etc.
