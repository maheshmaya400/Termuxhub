/*
 * TermuxHub - Firebase Authentication Module
 */

window.AuthModule = {
    // Current signed-in user object
    currentUser: null,
    
    // Checks standard cookies or local storage context for current logins
    init: function(onAuthStateChanged) {
        if (useFirebase) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.currentUser = {
                        uid: user.uid,
                        displayName: user.displayName || "Termux Student",
                        email: user.email || "student@termuxhub.org",
                        photoURL: user.photoURL || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60"
                    };
                } else {
                    this.currentUser = null;
                }
                if (typeof onAuthStateChanged === 'function') onAuthStateChanged(this.currentUser);
            });
        } else {
            // Read from local storage mock session
            const stored = localStorage.getItem('termux_mock_user');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            } else {
                this.currentUser = null;
            }
            if (typeof onAuthStateChanged === 'function') onAuthStateChanged(this.currentUser);
        }
    },
    
    signInWithGoogle: function() {
        return new Promise((resolve, reject) => {
            if (useFirebase) {
                const provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider)
                    .then((result) => {
                        this.currentUser = {
                            uid: result.user.uid,
                            displayName: result.user.displayName,
                            email: result.user.email,
                            photoURL: result.user.photoURL
                        };
                        resolve(this.currentUser);
                    })
                    .catch((error) => {
                        console.error("Google authentication popup error: ", error);
                        // Fallback to Redirect if Popups are disabled or blocked in WebView context
                        firebase.auth().signInWithRedirect(provider)
                            .then(() => resolve(null))
                            .catch(err => reject(err));
                    });
            } else {
                // Mock user Google login (perfect for demonstration sandbox)
                const mockUser = {
                    uid: "guest_google_user_3955",
                    displayName: "Mahesh Maya",
                    email: "maheshmaya1437@gmail.com",
                    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                };
                localStorage.setItem('termux_mock_user', JSON.stringify(mockUser));
                this.currentUser = mockUser;
                setTimeout(() => resolve(mockUser), 600);
            }
        });
    },
    
    signInAsGuest: function() {
        return new Promise((resolve) => {
            const guestUser = {
                uid: "guest_session_anonymous",
                displayName: "Guest Voyager",
                email: "guest@termuxhub.sandbox",
                photoURL: null
            };
            localStorage.setItem('termux_mock_user', JSON.stringify(guestUser));
            this.currentUser = guestUser;
            setTimeout(() => resolve(guestUser), 300);
        });
    },
    
    signOut: function() {
        return new Promise((resolve, reject) => {
            if (useFirebase) {
                firebase.auth().signOut()
                    .then(() => {
                        this.currentUser = null;
                        resolve();
                    })
                    .catch(err => reject(err));
            } else {
                localStorage.removeItem('termux_mock_user');
                this.currentUser = null;
                resolve();
            }
        });
    }
};
