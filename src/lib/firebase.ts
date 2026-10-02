import { initializeApp, getApps, getApp } from 'firebase/app';
import type { User } from 'firebase/auth';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { TarotReading, ReadingNote, UserProfile, PatternAnalytics, CustomSpread } from '../types';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Safely initialize Firestore to prevent module crash if named database or Firestore service is initializing
function initFirestore() {
  const dbId = firebaseConfigJson.firestoreDatabaseId || undefined;
  if (dbId) {
    try {
      return getFirestore(app, dbId);
    } catch (err) {
      console.warn(`Firestore named database "${dbId}" unavailable, trying default:`, err);
    }
  }
  try {
    return getFirestore(app);
  } catch (err) {
    console.warn('Firestore service initialization notice:', err);
    try {
      return getFirestore();
    } catch (e) {
      return null as any;
    }
  }
}

export const db = initFirestore();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged
};
export type { User };

// ERROR HANDLING SCHEMA & HELPERS
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test as required by skill
async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore backend connection test: Client is in offline mode.');
    }
  }
}
testConnection();

// USER PROFILE
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      try {
        localStorage.setItem(`tarot_user_profile_${uid}`, JSON.stringify(data));
      } catch (e) {
        // ignore storage quota errors
      }
      return data;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    // Fallback to local storage cache if available
    try {
      const cached = localStorage.getItem(`tarot_user_profile_${uid}`);
      if (cached) {
        return JSON.parse(cached) as UserProfile;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }
}

export async function createOrUpdateUserProfile(
  user: User,
  updates: Partial<UserProfile> = {}
): Promise<UserProfile> {
  const path = `users/${user.uid}`;
  const existing = await getUserProfile(user.uid);

  const profileData: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || existing?.displayName || 'Seeker',
    email: user.email || existing?.email || null,
    createdAt: existing?.createdAt || new Date().toISOString(),
    preferenceTheme: updates.preferenceTheme || existing?.preferenceTheme || 'luxury_gold',
    defaultDeck: updates.defaultDeck || existing?.defaultDeck || 'classic_gold',
    disclaimerAccepted: updates.disclaimerAccepted ?? existing?.disclaimerAccepted ?? true,
    disclaimerAcceptedAt: updates.disclaimerAcceptedAt || existing?.disclaimerAcceptedAt || new Date().toISOString(),
    ...(updates.zodiacSign ? { zodiacSign: updates.zodiacSign } : (existing?.zodiacSign ? { zodiacSign: existing.zodiacSign } : {}))
  };

  // Cache locally first for instant offline readiness
  try {
    localStorage.setItem(`tarot_user_profile_${user.uid}`, JSON.stringify(profileData));
  } catch (e) {
    // ignore
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, profileData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  return profileData;
}

// READINGS
export async function saveReading(
  userId: string,
  reading: Omit<TarotReading, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const path = `users/${userId}/readings`;
  const readingsRef = collection(db, 'users', userId, 'readings');
  const now = new Date().toISOString();
  
  const payload = {
    ...reading,
    userId,
    createdAt: now,
    updatedAt: now,
    isFavorite: reading.isFavorite || false
  };

  let docId = 'reading_' + Date.now();
  try {
    const docRef = await addDoc(readingsRef, payload);
    docId = docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }

  // Always sync local cache
  try {
    const cachedStr = localStorage.getItem(`tarot_user_readings_${userId}`);
    const existingList: TarotReading[] = cachedStr ? JSON.parse(cachedStr) : [];
    const newReading: TarotReading = { id: docId, ...payload };
    const updatedList = [newReading, ...existingList.filter(r => r.id !== docId)];
    localStorage.setItem(`tarot_user_readings_${userId}`, JSON.stringify(updatedList));
  } catch (e) {
    // ignore
  }

  return docId;
}

export async function getUserReadings(userId: string): Promise<TarotReading[]> {
  const path = `users/${userId}/readings`;
  try {
    const readingsRef = collection(db, 'users', userId, 'readings');
    const q = query(readingsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    
    const readings = snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as TarotReading[];

    try {
      localStorage.setItem(`tarot_user_readings_${userId}`, JSON.stringify(readings));
    } catch (e) {
      // ignore
    }

    return readings;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    try {
      const cached = localStorage.getItem(`tarot_user_readings_${userId}`);
      if (cached) {
        return JSON.parse(cached) as TarotReading[];
      }
    } catch (e) {
      // ignore
    }
    return [];
  }
}

export async function getReadingById(userId: string, readingId: string): Promise<TarotReading | null> {
  const path = `users/${userId}/readings/${readingId}`;
  try {
    const docRef = doc(db, 'users', userId, 'readings', readingId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as TarotReading;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }

  // Fallback to local readings list
  try {
    const cached = localStorage.getItem(`tarot_user_readings_${userId}`);
    if (cached) {
      const list = JSON.parse(cached) as TarotReading[];
      const found = list.find(r => r.id === readingId);
      if (found) return found;
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export async function toggleFavoriteReading(userId: string, readingId: string, isFavorite: boolean): Promise<void> {
  const path = `users/${userId}/readings/${readingId}`;
  try {
    const docRef = doc(db, 'users', userId, 'readings', readingId);
    await updateDoc(docRef, {
      isFavorite,
      updatedAt: new Date().toISOString()
    });

    const favRef = doc(db, 'users', userId, 'favorites', readingId);
    if (isFavorite) {
      await setDoc(favRef, {
        readingId,
        userId,
        savedAt: new Date().toISOString()
      });
    } else {
      await deleteDoc(favRef);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }

  // Sync local cache
  try {
    const cached = localStorage.getItem(`tarot_user_readings_${userId}`);
    if (cached) {
      const list = JSON.parse(cached) as TarotReading[];
      const updated = list.map(r => r.id === readingId ? { ...r, isFavorite } : r);
      localStorage.setItem(`tarot_user_readings_${userId}`, JSON.stringify(updated));
    }
  } catch (e) {
    // ignore
  }
}

export async function deleteReading(userId: string, readingId: string): Promise<void> {
  const path = `users/${userId}/readings/${readingId}`;
  try {
    const docRef = doc(db, 'users', userId, 'readings', readingId);
    await deleteDoc(docRef);
    
    // clean up favorite reference if exists
    const favRef = doc(db, 'users', userId, 'favorites', readingId);
    try {
      await deleteDoc(favRef);
    } catch (e) {
      // ignore
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }

  // Sync local cache
  try {
    const cached = localStorage.getItem(`tarot_user_readings_${userId}`);
    if (cached) {
      const list = JSON.parse(cached) as TarotReading[];
      const updated = list.filter(r => r.id !== readingId);
      localStorage.setItem(`tarot_user_readings_${userId}`, JSON.stringify(updated));
    }
  } catch (e) {
    // ignore
  }
}

// NOTES
export async function addReadingNote(userId: string, readingId: string, text: string): Promise<ReadingNote> {
  const path = `users/${userId}/notes`;
  const notesRef = collection(db, 'users', userId, 'notes');
  const now = new Date().toISOString();
  
  const payload = {
    readingId,
    userId,
    text,
    createdAt: now
  };

  let noteId = 'note_' + Date.now();
  try {
    const docRef = await addDoc(notesRef, payload);
    noteId = docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }

  return { id: noteId, ...payload };
}

export async function getReadingNotes(userId: string, readingId: string): Promise<ReadingNote[]> {
  const path = `users/${userId}/notes`;
  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const q = query(notesRef, where('readingId', '==', readingId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as ReadingNote[];
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

// PATTERN ANALYTICS
export function computePatternAnalytics(readings: TarotReading[]): PatternAnalytics {
  const cardCounts: Record<string, { name: string; count: number; suit: string }> = {};
  const spreadCounts: Record<string, number> = {};
  const moodCounts: Record<string, number> = {};

  readings.forEach(r => {
    // Spread count
    const sTitle = r.spreadTitle || r.spreadType;
    spreadCounts[sTitle] = (spreadCounts[sTitle] || 0) + 1;

    // Mood count
    if (r.mood) {
      moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
    }

    // Cards
    r.cards?.forEach(c => {
      const key = c.name;
      if (!cardCounts[key]) {
        cardCounts[key] = { name: c.name, count: 0, suit: c.suit || 'major' };
      }
      cardCounts[key].count += 1;
    });
  });

  const sortedCards = Object.values(cardCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalReadings: readings.length,
    mostFrequentCards: sortedCards,
    spreadCounts,
    moodCounts
  };
}

// CUSTOM SPREADS
export async function saveCustomSpread(
  userId: string,
  spread: Omit<CustomSpread, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const path = `users/${userId}/customSpreads`;
  const spreadsRef = collection(db, 'users', userId, 'customSpreads');
  const now = new Date().toISOString();

  const payload = {
    ...spread,
    userId,
    createdAt: now,
    updatedAt: now
  };

  let docId = 'spread_' + Date.now();
  try {
    const docRef = await addDoc(spreadsRef, payload);
    docId = docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }

  // Sync local cache
  try {
    const cachedStr = localStorage.getItem(`tarot_user_custom_spreads_${userId}`);
    const existingList: CustomSpread[] = cachedStr ? JSON.parse(cachedStr) : [];
    const newSpread: CustomSpread = { id: docId, ...payload };
    const updatedList = [newSpread, ...existingList.filter(s => s.id !== docId)];
    localStorage.setItem(`tarot_user_custom_spreads_${userId}`, JSON.stringify(updatedList));
  } catch (e) {
    // ignore
  }

  return docId;
}

export async function getUserCustomSpreads(userId: string): Promise<CustomSpread[]> {
  const path = `users/${userId}/customSpreads`;
  try {
    const spreadsRef = collection(db, 'users', userId, 'customSpreads');
    const q = query(spreadsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    const list = snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as CustomSpread[];

    try {
      localStorage.setItem(`tarot_user_custom_spreads_${userId}`, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    try {
      const cached = localStorage.getItem(`tarot_user_custom_spreads_${userId}`);
      if (cached) {
        return JSON.parse(cached) as CustomSpread[];
      }
    } catch (e) {
      // ignore
    }
    return [];
  }
}

export async function updateCustomSpread(
  userId: string,
  spreadId: string,
  updates: Partial<CustomSpread>
): Promise<void> {
  const path = `users/${userId}/customSpreads/${spreadId}`;
  try {
    const docRef = doc(db, 'users', userId, 'customSpreads', spreadId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }

  // Local storage update
  try {
    const cachedStr = localStorage.getItem(`tarot_user_custom_spreads_${userId}`);
    if (cachedStr) {
      const list = JSON.parse(cachedStr) as CustomSpread[];
      const updated = list.map(s => s.id === spreadId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s);
      localStorage.setItem(`tarot_user_custom_spreads_${userId}`, JSON.stringify(updated));
    }
  } catch (e) {
    // ignore
  }
}

export async function deleteCustomSpread(userId: string, spreadId: string): Promise<void> {
  const path = `users/${userId}/customSpreads/${spreadId}`;
  try {
    const docRef = doc(db, 'users', userId, 'customSpreads', spreadId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }

  // Local storage update
  try {
    const cachedStr = localStorage.getItem(`tarot_user_custom_spreads_${userId}`);
    if (cachedStr) {
      const list = JSON.parse(cachedStr) as CustomSpread[];
      const updated = list.filter(s => s.id !== spreadId);
      localStorage.setItem(`tarot_user_custom_spreads_${userId}`, JSON.stringify(updated));
    }
  } catch (e) {
    // ignore
  }
}

