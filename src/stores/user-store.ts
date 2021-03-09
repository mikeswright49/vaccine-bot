import firebase from "firebase";
import { getFirebaseConfig } from "../config/firebase-config";

export type User = {
  id: string;
  vaccinated: boolean;
  last_notified: string;
  notified: boolean;
  location_regex: string;
  phone_number: string;
};
export class UserStore {
  public static database: firebase.database.Database;

  public static async init(username: string, password: string) {
    if (!firebase.apps.length) {
      firebase.initializeApp(getFirebaseConfig());
      await firebase.auth().signInWithEmailAndPassword(username, password);
    }
    if (!UserStore.database) {
      UserStore.database = firebase.database();
    }
  }

  public static async getUsers(): Promise<User[]> {
    const users = (await UserStore.database.ref("users").get()).val();
    return users;
  }

  public static async getUser(userId: string): Promise<User> {
    return (await UserStore.database.ref(`users/${userId}`).get()).val();
  }

  public static async updateUser(user: User): Promise<void> {}
}
