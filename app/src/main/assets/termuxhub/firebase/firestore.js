/*
 * TermuxHub - Firestore Database Module
 */

window.FirestoreModule = {
    // Current user's cached profile and data arrays
    userDataCache: {
        favorites: [],
        recentlyViewed: [],
        settings: {
            darkMode: true,
            notifications: true,
            language: "English"
        }
    },
    
    // Loads profile references from Firestore or LocalStorage
    loadUserData: function(uid) {
        return new Promise((resolve) => {
            if (useFirebase && uid && uid !== "guest_session_anonymous") {
                const db = firebase.firestore();
                db.collection("users").doc(uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const data = doc.data();
                            this.userDataCache = {
                                favorites: data.favoriteTools || [],
                                recentlyViewed: data.recentlyViewed || [],
                                settings: data.settings || { darkMode: true, notifications: true, language: "English" }
                            };
                            this.saveLocalBackup();
                            resolve(this.userDataCache);
                        } else {
                            // First time login - Provision new doc
                            const initial = this.getBlankProfile();
                            this.saveOnlineProfile(uid, initial)
                                .then(() => resolve(initial));
                        }
                    })
                    .catch((error) => {
                        console.error("Firestore get error (using local fallback cache): ", error);
                        this.loadFromLocalBackup();
                        resolve(this.userDataCache);
                    });
            } else {
                this.loadFromLocalBackup();
                resolve(this.userDataCache);
            }
        });
    },
    
    saveOnlineProfile: function(uid, profileData) {
        if (!useFirebase || !uid || uid === "guest_session_anonymous") {
            return Promise.resolve();
        }
        
        const db = firebase.firestore();
        return db.collection("users").doc(uid).set({
            displayName: AuthModule.currentUser?.displayName || "Student",
            email: AuthModule.currentUser?.email || "anonymous@termuxhub.org",
            photoURL: AuthModule.currentUser?.photoURL || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            favoriteTools: profileData.favorites,
            recentlyViewed: profileData.recentlyViewed,
            settings: profileData.settings
        }, { merge: true })
        .then(() => {
            console.log("Firestore cloud sync completed successfully.");
        })
        .catch((err) => {
            console.error("Firestore cloud sync failure: ", err);
        });
    },
    
    toggleFavorite: function(uid, toolId) {
        const index = this.userDataCache.favorites.indexOf(toolId);
        if (index > -1) {
            this.userDataCache.favorites.splice(index, 1);
        } else {
            this.userDataCache.favorites.push(toolId);
        }
        
        this.saveLocalBackup();
        return this.saveOnlineProfile(uid, this.userDataCache)
            .then(() => this.userDataCache.favorites);
    },
    
    addRecentView: function(uid, toolId) {
        // Filter out existing and put at front
        this.userDataCache.recentlyViewed = this.userDataCache.recentlyViewed.filter(id => id !== toolId);
        this.userDataCache.recentlyViewed.unshift(toolId);
        
        // Trim to last 15 items to save space
        if (this.userDataCache.recentlyViewed.length > 15) {
            this.userDataCache.recentlyViewed.pop();
        }
        
        this.saveLocalBackup();
        this.saveOnlineProfile(uid, this.userDataCache);
    },
    
    updateSettings: function(uid, key, value) {
        this.userDataCache.settings[key] = value;
        this.saveLocalBackup();
        this.saveOnlineProfile(uid, this.userDataCache);
    },
    
    clearRecentlyViewed: function(uid) {
        this.userDataCache.recentlyViewed = [];
        this.saveLocalBackup();
        return this.saveOnlineProfile(uid, this.userDataCache);
    },
    
    clearFavorites: function(uid) {
        this.userDataCache.favorites = [];
        this.saveLocalBackup();
        return this.saveOnlineProfile(uid, this.userDataCache);
    },

    // Sandbox backup routines
    getBlankProfile: function() {
        return {
            favorites: [],
            recentlyViewed: [],
            settings: { darkMode: true, notifications: true, language: "English" }
        };
    },
    
    saveLocalBackup: function() {
        localStorage.setItem('termux_userdata_profile', JSON.stringify(this.userDataCache));
    },
    
    loadFromLocalBackup: function() {
        const stored = localStorage.getItem('termux_userdata_profile');
        if (stored) {
            this.userDataCache = JSON.parse(stored);
        } else {
            this.userDataCache = this.getBlankProfile();
        }
    }
};
