// Data models
class BaseModel {
  constructor(data) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.status = data.status || 'pending';
    this.priority = data.priority || 'low';
  }
}

class Worker extends BaseModel {
  constructor(data) {
    super(data);
    this.name = data.name;
    this.initials = data.initials;
    this.color = data.color;
    this.role = data.role;
    this.notes = data.notes;
  }
}

class Schedule extends BaseModel {
  constructor(data) {
    super(data);
    this.workerId = data.workerId;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.notes = data.notes;
  }
}

class Car extends BaseModel {
  constructor(data) {
    super(data);
    this.make = data.make;
    this.model = data.model;
    this.year = data.year;
    this.nickname = data.nickname;
    this.plate = data.plate;
    this.vin = data.vin;
    this.mileage = data.mileage;
    this.notes = data.notes;
  }
}

class Maintenance extends BaseModel {
  constructor(data) {
    super(data);
    this.type = data.type;
    this.dueDate = data.dueDate;
    this.interval = data.interval; // days
    this.mileageInterval = data.mileageInterval;
    this.recurrence = data.recurrence || { type: 'none', interval: 1 };
    this.notes = data.notes;
    this.log = data.log || [];
  }
}

class House extends BaseModel {
  constructor(data) {
    super(data);
    this.name = data.name;
    this.address = data.address;
    this.notes = data.notes;
  }
}

class Task extends BaseModel {
  constructor(data) {
    super(data);
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.startDate = data.startDate;
    this.dueDate = data.dueDate;
    this.endDate = data.endDate;
    this.recurrence = data.recurrence || { type: 'none', interval: 1 };
    this.tags = data.tags || [];
    this.associatedId = data.associatedId; // car/house/worker
    this.notes = data.notes;
  }
}
