/**
 * Entry Point - D'Galú Cloud Functions V2
 * Todas las funciones se exportan desde aquí.
 */

// 1. HTTP Functions
export { getGoogleReviews } from "./reviews/getGoogleReviews";

// 2. Auth Triggers (V2 Blocking)
export { createUserProfile } from "./auth/createUserProfile";

// 3. Firestore Triggers
export { updateUserClaims } from "./claims/updateUserClaims";

// 4. Callable Functions (Admin & User Actions)
export { refreshUserClaims } from "./claims/refreshUserClaims";
