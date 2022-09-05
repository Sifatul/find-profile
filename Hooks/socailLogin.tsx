import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { googleProvider } from "../Utils/auth/providers";
import { getAnalytics, logEvent } from "firebase/analytics";



const googleLogin = () => {
  if (!getAuth()) return
  const auth = getAuth();
  signInWithRedirect(auth, googleProvider)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
const getGoogleRedirectResult = () => {




  const auth = getAuth();
  getRedirectResult(auth)
    .then((result) => {
      console.log("result: ", result)
      if (!result) return

      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) return
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;


      const analytics = getAnalytics();
      logEvent(analytics, 'google login successful');

    }).catch((error) => {
      console.error("getGoogleRedirectResult > error")
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export { googleLogin, getGoogleRedirectResult };