const functions = require("firebase-functions");
import { addDays, format, startOfWeek } from "date-fns";
const postManRequest = require("postman-request");

const DINARD_BOOK_API =
  "https://dinard.reservations-golf.fr/depart-enregistrement.php";

exports.book = functions.https.onRequest(
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
    const today = new Date();
    const startOfNextWeek = startOfWeek(today); // start of next week
    const tuesday = addDays(startOfNextWeek, 1); // Tuesday of next week
    const formattedDate = format(tuesday, "yyyy-MM-dd"); // date formatée
    await postManRequest
      .post(DINARD_BOOK_API, {
        form: {
          jour: formattedDate,
          heure: "19:00:00",
          p: "1",
          frequence: "10",
        },
        headers: {
          Cookie: "nsgcookie=2406",
        },
        function(err: any, httpResponse: any, body: any) {
          if (err) {
            functions.logger.info(err, {
              structuredData: true,
            });
          }
          functions.logger.info(httpResponse, {
            structuredData: true,
          });
        },
      })
      .on("response", function (r: any) {
        functions.logger.info(r.statusCode, {
          structuredData: true,
        });
        functions.logger.info(r.headers, {
          structuredData: true,
        });
        if (r.headers.location.includes("confirm=1")) {
          response.status(200).send("Booked");
        } else {
          response.status(400).send("Not Booked");
        }
      });
  }
);
