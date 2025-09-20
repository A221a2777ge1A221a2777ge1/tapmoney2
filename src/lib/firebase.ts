// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZUSu_83sbbBWY05j8utRGcJINe-piX7Q",
  authDomain: "studio-980394390-69a7e.firebaseapp.com",
  projectId: "studio-980394390-69a7e",
  storageBucket: "studio-980394390-69a7e.appspot.com",
  messagingSenderId: "75415047103",
  appId: "1:75415047103:web:8c7fcb802bcc0a870aef0a"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app };
