// Firebase config placeholder
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (uncomment for production)
// const app = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore(app);

// Service layer for CRUD (uses localStorage for demo; replace with db calls)
const FirebaseService = {
  async getCollection(collection) {
    // return (await db.collection(collection).get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return JSON.parse(localStorage.getItem(collection) || '[]');
  },
  async addDoc(collection, data) {
    data.createdAt = new Date().toISOString();
    data.updatedAt = data.createdAt;
    const docs = await this.getCollection(collection);
    const id = `_${collection}_${docs.length + 1}`;
    docs.push({ id, ...data });
    localStorage.setItem(collection, JSON.stringify(docs));
    return id;
  },
  async updateDoc(collection, id, data) {
    data.updatedAt = new Date().toISOString();
    const docs = await this.getCollection(collection);
    const index = docs.findIndex(d => d.id === id);
    if (index !== -1) {
      docs[index] = { ...docs[index], ...data };
      localStorage.setItem(collection, JSON.stringify(docs));
    }
  },
  async deleteDoc(collection, id) {
    let docs = await this.getCollection(collection);
    docs = docs.filter(d => d.id !== id);
    localStorage.setItem(collection, JSON.stringify(docs));
  }
  // Add auth placeholders: firebase.auth().signInWithEmailAndPassword, etc.
};

// For future auth: Listen for user changes and scope data to userId.
