const functions = require("firebase-functions");
import { format } from "date-fns";
const postManRequest = require("postman-request");

const DINARD_BOOK_API =
  "https://dinard.reservations-golf.fr/depart-enregistrement.php";

exports.scheduleBook = functions.pubsub.schedule("0 1 * * 5").onRun(
  async (
    _request: any,
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
    const today = new Date(); // Récupère la date actuelle
    const daysUntilNextThursday = (11 - today.getDay()) % 7; // Calcule le nombre de jours jusqu'au prochain jeudi (11 correspond au code de jour pour jeudi, modulo 7 pour éviter les résultats négatifs)
    const nextThursday = new Date(
      today.getTime() + daysUntilNextThursday * 86400000
    ); // Ajoute le nombre de jours au timestamp de la date actuelle pour obtenir la date du prochain jeudi
    const formattedDate = format(nextThursday, "yyyy-MM-dd"); // date formatée
    await postManRequest
      .post(DINARD_BOOK_API, {
        form: {
          jour: formattedDate,
          heure: "12:30:00",
          p: "1",
          frequence: "10",
          /** Jean Gautier */
          m1: "2390",
          /** Bernard L */
          m2: "2602",
          /** Daniel Gautier */
          m3: "2389",
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
