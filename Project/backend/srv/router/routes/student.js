/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oStudent, req) {
    return oStudent;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('Student get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/student", req, res);
        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"STUDENT\"";
            const student = await db.executeUpdate(sSql, []);
            tracer.exiting("/student", "Student Get works");
            res.type("application/json").status(201).send(JSON.stringify(student));
        } catch (e) {
            tracer.catching("/student", e);
            next(e);
        }
    });

    app.get("/:stid", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('Student get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/student", req, res);
        try {
            const db = new dbClass(req.db);
            const stid = req.params.stid;
            console.log(req.params.stid);
            const sSql = "SELECT * FROM \"STUDENT\" WHERE \"STID\" = ? ";
	    const aValues = [ stid ];
            const student = await db.executeUpdate(sSql, aValues);
            tracer.exiting("/student", "Student Get works");
            res.type("application/json").status(201).send(JSON.stringify(student));
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
	    const aValues = [ oStudent.name, oStudent.stid];
            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);
            res.type("application/json").status(200).send(JSON.stringify(oStudent));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:stid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const stid = req.params.stid;
            console.log(req.params.stid)
            const sSql = "DELETE FROM \"STUDENT\" WHERE \"STID\" = ?";
            const aValues = [ stid ];
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
