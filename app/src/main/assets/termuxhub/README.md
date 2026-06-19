# TermuxHub - Educational Companion & AI Handbook

> **Learn • Install • Build**  
> *Assembled with ❤️ by Maya*

---

## Technical Stack Overview

TermuxHub is structured using a hybrid PWA/Android paradigm. This directory is self-contained and ready to execute inside any mobile browser, **Acode project workspaces**, or wrapped natively in standard **Android WebView Containers** as presented here.

- **Frontend Core**: W3C standard HTML5, CSS3, Vanilla ECMAScript 6 JavaScript.
- **Micro-database**: local sandbox files caching (`data/categories.json` + `data/tools.json`).
- **State engine**: HTML5 W3C Standard DOM Storage (`localStorage`).
- **Real-time Synchronization**: Google Firebase Client SDK (Authentication & Cloud Firestore).
- **Intelligent Inference**: Google Gemini 3.5 Flash via native Kotlin background API Bridge.

---

## Directory Schema (termuxhub/)

```text
termuxhub/
├── index.html                   # Central SPA Layout Shell
├── style.css                    # Futuristic dark style presets (glassmorphism overlay)
├── script.js                    # SPA Router, list filters, clipboard handlers, and Gemini bridges
├── manifest.json                # PWA standard installation configurations
├── service-worker.js            # Standalone offline caching specifications
├── assets/                      # Application icons and decorative vector symbols
├── data/
│   ├── categories.json          # Standard syllabus categories database
│   └── tools.json               # Terminal commands syntax schema
├── firebase/
│   ├── firebase-config.js       # Firebase SDK keys initialization file
│   ├── auth.js                  # Authentication wrappers (Google Sign-In vs Guest Mode)
│   └── firestore.js             # User data cloud databases backup syncing logic
├── pages/                       # SPA view templates loaded relative to origin
│   ├── splash.html              
│   ├── disclaimer.html          
│   ├── login.html               
│   ├── home.html                
│   ├── category.html            
│   ├── tool.html                
│   ├── favorites.html           
│   ├── settings.html            
│   └── about.html               
└── components/                  # Reusable modular DOM rendering components
    ├── navbar.js                
    ├── searchbar.js             
    ├── categoryCard.js          
    ├── toolCard.js              
    ├── button.js                
    └── modal.js                 
```

---

## Standard Cloud Sync Settings (Firebase Setup)

To activate real Firebase synchronization on production instead of Sandbox fallbacks, simply replace placeholders inside `/firebase/firebase-config.js` with your coordinates:

1. Create a standard Web project inside the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firebase Authentication** and choose the **Google Provider**.
3. Provision a **Cloud Firestore** project (start in Test Mode or write appropriate read/write rules).
4. Extract your configuration bundle and paste it into `/firebase/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_NATIVE_FIREBASE_KEY_HERE",
       authDomain: "your-app.firebaseapp.com",
       projectId: "your-app",
       storageBucket: "your-app.appspot.com",
       messagingSenderId: "12345678",
       appId: "1:1234:web:abcd"
   };
   ```

---

## APK Conversion Guidelines (Acode & Standalone Builders)

To compile this folder physically into a standalone portable Android installation file (`.apk`), choose from these two primary options:

### Option A: Using the AI Studio Built-in Native Compiler (Easiest)
This template integrates an Android wrapper container. 
1. Build and compile the app inside AI Studio by running **`compile_applet`** task or using the sidebar menus.
2. Under project settings, select **Export APK/AAB** or push directly to GitHub, downloading the compiled `.apk` binary instantly onto any device!

### Option B: Wrapping via Capacitor JS / Cordova (Local Acode Developer Workflow)
If you wish to manage compilation directly on your phone using command lines or build directories:

1. Initialize a standard Node workspace inside Acode terminal environment:
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli
   ```
2. Configuration initialization:
   ```bash
   npx cap init TermuxHub com.aistudio.termuxhub --web-dir=.
   ```
3. Add the native Android SDK platforms:
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```
4. Copy assets and sync configurations:
   ```bash
   npx cap copy
   npx cap sync
   ```
5. Open compiled paths inside Android Studio on your workstation or compile directly utilizing Gradle commands to assemble the release binaries!

---

*Built with ❤️ by Maya*
