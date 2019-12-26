/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oStudent, req) {
		oStudent.changedBy = "DebugStudent";
    return oStudent;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('student get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/student", req, res);

        try {
            tracer.exiting("/student", "Student Get works");
            res.type("application/json").status(201).send(JSON.stringify({text: "Student Get works"}));
        } catch (e) {
            tracer.catching("/student", e);
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oStudent = _prepareObject(req.body, req);
				    oStudent.stid = await db.getNextval("stid");

            const sSql = "INSERT INTO \"STUDENT\" VALUES(?,?)";
						const aValues = [ oStudent.stid, oStudent.name ];

						console.log(aValues);
						console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oStudent));
        } catch (e) {
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oStudent = _prepareObject(req.body, req);
            const sSql = "UPDATE \"STUDENT\" SET \"NAME\" = ? WHERE \"STID\" = ?";
						const aValues = [ oStudent.name, oStudent.stid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send(JSON.stringify(oStudent));
        } catch (e) {
            next(e);
        }
    });

    return app;
};
