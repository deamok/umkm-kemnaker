import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBThyb0LGMsjn1wOBghqynoP-aPFeR560o",
  authDomain: "jajan-yuk-5e71a.firebaseapp.com",
  projectId: "jajan-yuk-5e71a",
  storageBucket: "jajan-yuk-5e71a.firebasestorage.app",
  messagingSenderId: "101557606291",
  appId: "1:101557606291:web:1201d603f323ea5614ba66"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
