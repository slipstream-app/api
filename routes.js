const express = require("express");
const RaceController = require("./controllers/RaceController");
const LapController = require("./controllers/LapController");
const UserController = require("./controllers/UserController");
const verifyJwt = require("./helpers/verifyJwt");
const PilotController = require("./controllers/PilotController");
const InvitationController = require("./controllers/InvitationController");

const routes = express.Router();

routes.get("/users", verifyJwt, UserController.list);
routes.post("/users", UserController.create);
routes.post("/login", UserController.login);
routes.post("/refresh", UserController.refreshToken);
routes.get("/users/:id", UserController.show);
routes.get("/users/:id", UserController.show);
routes.get("/users/:id", UserController.show);
//races
routes.get("/me/races/", verifyJwt, RaceController.listMyRaces);
routes.get("/races", verifyJwt, RaceController.list);
routes.get("/races/:id", verifyJwt, RaceController.show);
routes.post("/races", verifyJwt, RaceController.create);
routes.post("/races/pdf", verifyJwt, RaceController.createFromPdf);
//laps
routes.get("/laps", verifyJwt, LapController.list);
routes.post("/laps", verifyJwt, LapController.create);
routes.post("/laps-pdf", verifyJwt, LapController.createFromPdf);
// pilots
routes.get("/pilots", verifyJwt, PilotController.list);
routes.post("/pilots", verifyJwt, PilotController.create);
routes.post("/pilots-pdf", verifyJwt, PilotController.createFromPdf);
routes.put("/pilots-redeem/:id", verifyJwt, PilotController.redeem);
routes.put("/pilots/:id", verifyJwt, PilotController.update);
routes.delete("/pilots/:id", verifyJwt, PilotController.delete);

//invitations
routes.get("/invitations", verifyJwt, InvitationController.list);
routes.post("/invitations", verifyJwt, InvitationController.create);
module.exports = routes;
