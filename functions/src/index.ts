const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
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
    response.status(200).send("Hello from Firebase!");
  }
);
