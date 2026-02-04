
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, getIdToken } from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private app: any;
    private auth: any;

    constructor() {
        this.app = initializeApp(environment.firebase);
        this.auth = getAuth(this.app);
    }

    async signInWithGoogle(): Promise<string> {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider);
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;

            // The signed-in user info.
            const user = result.user;

            // Get Firebase ID Token
            const idToken = await getIdToken(user);
            return idToken;
        } catch (error: any) {
            console.error('Firebase Auth Error', error);
            throw error;
        }
    }
}
