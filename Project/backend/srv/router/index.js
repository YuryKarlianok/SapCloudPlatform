"use strict";

module.exports = (app, server) => {
    app.use("/student", require("./routes/student")());
    app.use("/address", require("./routes/address")());
    app.use("/subject", require("./routes/subject")());
    app.use("/dest", require("./routes/dest")());
};
