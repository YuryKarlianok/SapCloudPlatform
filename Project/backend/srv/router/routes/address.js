/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oAddress, req) {
    return oAddress;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('Address get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/address", req, res);
        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"ADDRESS\"";
            const address = await db.executeUpdate(sSql, []);
            tracer.exiting("/address", "Address Get works");
            res.type("application/json").status(201).send(JSON.stringify(address));
        } catch (e) {
            tracer.catching("/address", e);
            next(e);
        }
    });

    app.get("/:adid", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('Address get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/address", req, res);
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;
            console.log(req.params.adid);
            const sSql = "SELECT * FROM \"ADDRESS\" WHERE \"ADID\" = ? ";
	    const aValues = [ adid ];
            const address = await db.executeUpdate(sSql, aValues);
            tracer.exiting("/address", "Address Get works");
            res.type("application/json").status(201).send(JSON.stringify(address));
        } catch (e) {
            tracer.catching("/address", e);
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const oAddress = _prepareObject(req.body, req);
	    oAddress.adid = await db.getNextval("adid");
            const sSql = "INSERT INTO \"ADDRESS\" VALUES(?,?,?,?,?)";
	    const aValues = [ oAddress.adid, oAddress.stid, oAddress.city, oAddress.strt, oAddress.hnum ];
	    console.log(aValues);
	    console.log(sSql);
            await db.executeUpdate(sSql, aValues);
            res.type("application/json").status(201).send(JSON.stringify(oAddress));
        } catch (e) {
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const oAddress = _prepareObject(req.body, req);
            const sSql = "UPDATE \"ADDRESS\" SET \"STID\" = ?, \"CITY\" = ?, \"STRT\" = ?, \"HNUM\" = ? WHERE \"ADID\" = ?";
	    const aValues = [ oAddress.stid, oAddress.city, oAddress.strt, oAddress.hnum, oAddress.adid];
            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);
            res.type("application/json").status(200).send(JSON.stringify(oAddress));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;
            console.log(req.params.adid)
            const sSql = "DELETE FROM \"ADDRESS\" WHERE \"ADID\" = ?";
            const aValues = [ adid ];
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
