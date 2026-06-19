/*
 * TermuxHub - Firebase Core Configuration
 */

// Production values go here.
const firebaseConfig = {
    apiKey: "AIzaSyBiAfANzitY35I4Y1tQfcK3g6kh73krBV0",
    authDomain: "termuxhub-4421c.firebaseapp.com",
    projectId: "termuxhub-4421c",
    storageBucket: "termuxhub-4421c.firebasestorage.app",
    messagingSenderId: "60237970654",
    appId: "1:60237970654:web:73dadeb8f258a0665f564f",
    measurementId: "G-49EM1CQRZM"
};

let firebaseApp = null;
let useFirebase = false;
let firebaseAnalytics = null;

try {
    // Check if configuration has valid production variables
    if (firebaseConfig.apiKey && 
        firebaseConfig.apiKey !== "AIzaSyD_PLACEHOLDER_KEY_VAL_MAPPED_TO_APP" && 
        !firebaseConfig.apiKey.includes("PLACEHOLDER")) {
        
        firebaseApp = firebase.initializeApp(firebaseConfig);
        useFirebase = true;
        console.log("Firebase App established securely in context.");
        
        // Initialize Analytics if the script is imported
        if (typeof firebase.analytics === 'function') {
            firebaseAnalytics = firebase.analytics();
            console.log("Firebase Analytics initialized successfully.");
        }
    } else {
        console.warn("Using local sandbox database. Firebase authentication keys are placeholders.");
    }
} catch (error) {
    console.error("Firebase module initialization exception: ", error);
}
