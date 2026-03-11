// Date utilities
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function daysUntil(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
}

function calculatePriority(dueDate, manualPriority) {
  if (manualPriority) return manualPriority;
  const days = daysUntil(dueDate);
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'mid';
  return 'low';
}

function isOverdue(dueDate) {
  return daysUntil(dueDate) < 0;
}

// Recurrence engine: Generate instances within a date range
function generateRecurrences(item, startRange, endRange) {
  const instances = [];
  let current = new Date(item.dueDate || item.startDate);
  const end = item.recurrence.endAfter ? new Date(item.recurrence.endAfter) : new Date(endRange);
  while (current <= end) {
    instances.push({ ...item, effectiveDate: current.toISOString() });
    switch (item.recurrence.type) {
      case 'daily': current.setDate(current.getDate() + item.recurrence.interval); break;
      case 'weekly': current.setDate(current.getDate() + 7 * item.recurrence.interval); break;
      case 'biweekly': current.setDate(current.getDate() + 14 * item.recurrence.interval); break;
      case 'monthly': current.setMonth(current.getMonth() + item.recurrence.interval); break;
      case 'quarterly': current.setMonth(current.getMonth() + 3 * item.recurrence.interval); break;
      case 'yearly': current.setFullYear(current.getFullYear() + item.recurrence.interval); break;
      case 'custom': current.setDate(current.getDate() + item.recurrence.interval); break;
      default: return [item];
    }
  }
  return instances.filter(inst => new Date(inst.effectiveDate) >= new Date(startRange));
}

// Global pub/sub for state changes
const events = {};
function on(event, callback) { events[event] = events[event] || []; events[event].push(callback); }
function trigger(event, data) { (events[event] || []).forEach(cb => cb(data)); }
