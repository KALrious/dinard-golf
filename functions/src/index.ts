const functions = require("firebase-functions");
const FormData = require("form-data");
import axios from "axios";
import { compare } from "bcrypt";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//

// const databaseURL = process.env.DATA_BASE_URL;

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "MY_DATABASE_URL",
};

const DINARD_AUTH_API = "https://dinard.reservations-golf.fr/login-membres.php";
// const DINARD_BOOK_API =
//   "https://dinard.reservations-golf.fr/depart-enregistrement.php";

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

exports.helloWorld = functions.https.onRequest(
  (
    _request: any,
    response: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: string): void; new (): any };
      };
    }
  ) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    const object = ref(db, "2407");
    onValue(object, (snapshot) => {
      const data = snapshot.val();
      functions.logger.info(data, { structuredData: true });
    });
    response.status(200).send("Hello from Firebase!");
  }
);

exports.login = functions.https.onRequest(
  async (
    request: any,
    response: {
      headers: any;
      cookie: (arg0: string, arg1: any, arg3: any) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: string): void; new (): any };
      };
    }
  ) => {
    const { userId, password } = request.body;
    const userRef = ref(db, `${userId}`);
    onValue(userRef, async (snapshot) => {
      const user = snapshot.val();
      if (!user) {
        response.status(404).send("User not found");
        return;
      }
      const isSamePwd = await compare(password, user.password);
      if (!isSamePwd) {
        response.status(401).send("User not found");
        return;
      }
      const formData = new FormData();
      formData.append("nom", userId);
      formData.append("passwd", password);
      axios
        .post(DINARD_AUTH_API, {
          formData,
        })
        .then((res) => {
          response.headers = res.headers;
          response.cookie("nsgcookie", userId, {
            httpOnly: true,
          });
          response.status(200).send("Logged in!");
        });
    });
  }
);

exports.signIn = functions.https.onRequest(
  async (
    request: any,
    response: {
      headers: any;
      cookie: (arg0: string, arg1: any, arg3: any) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: string): void; new (): any };
      };
    }
  ) => {
    const { userId, password } = request.body;
    const formData = new FormData();
    formData.append("nom", userId);
    formData.append("passwd", password);
    functions.logger.info(userId, { structuredData: true });
    functions.logger.info(password, { structuredData: true });
    functions.logger.info(formData, { structuredData: true });
    // const { data } = await axios.post(DINARD_AUTH_API, formData, {
    //   headers: {
    //     Cookies: "nsgcookie=2406",
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    const { data } = await axios({
      method: "post",
      url: DINARD_AUTH_API,
      data: formData,
      headers: {
        //Cookies: "nsgcookie=2406",
        "Content-Type": `multipart/form-data;  boundary=${formData._boundary}`,
      },
      withCredentials: true,
    });
    const totot = data.includes("Espace membres");
    const titi = data.includes("action='login-membres.php'");
    const yop = data.includes("Arnaud GIRAUDET");
    functions.logger.info(data, { structuredData: true });
    functions.logger.info(totot, { structuredData: true });
    functions.logger.info(titi, { structuredData: true });
    functions.logger.info(yop, { structuredData: true });

    // const formData = new FormData();
    // formData.append("jour", "2023-04-16");
    // formData.append("heure", "08:00:00");
    // const { data } = await axios.post(
    //   DINARD_BOOK_API,
    //   {
    //     formData,
    //   },
    //   {
    //     headers: {
    //       Cookies: "nsgcookie=2407",
    //     },
    //   }
    // );
    // functions.logger.info(data, { structuredData: true });
    response.status(200).send("Logged in!");
  }
);
