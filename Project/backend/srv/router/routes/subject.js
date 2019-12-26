/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oSubject, req) {
    return oSubject;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('Subject get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/subject", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"SUBJECT\"";
            const subject = await db.executeUpdate(sSql, []);
            tracer.exiting("/subject", "Subject Get works");
            res.type("application/json").status(201).send(JSON.stringify(subject));
        } catch (e) {
            tracer.catching("/subject", e);
            next(e);
        }
    });


    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oSubject = _prepareObject(req.body, req);
	    oSubject.suid = await db.getNextval("suid");

            const sSql = "INSERT INTO \"SUBJECT\" VALUES(?,?,?)";
	    const aValues = [ oSubject.suid, oSubject.stid, oSubject.name ];
	    console.log(aValues);
	    console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oSubject));
        } catch (e) {
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oSubject = _prepareObject(req.body, req);
            const sSql = "UPDATE \"SUBJECT\" SET \"STID\" = ?, \"NAME\" = ? WHERE \"SUID\" = ?";
	    const aValues = [ oSubject.stid, oSubject.name, oSubject.suid];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send(JSON.stringify(oSubject));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:suid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const suid = req.params.suid;
            console.log(req.params.suid)

            const sSql = "DELETE FROM \"SUBJECT\" WHERE \"SUID\" = ?";
            const aValues = [ suid ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send("Success");
        } catch (e) {
            next(e);
        }
    });

    return app;
};
