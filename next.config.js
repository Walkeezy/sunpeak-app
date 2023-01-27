const withTranspile = require("next-transpile-modules")(["ol", "rlayers"]);
module.exports = withTranspile({ experimental: { esmExternals: "loose" } });
