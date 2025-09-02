import mongoose from "mongoose"

mongoose.connect("mongodb+srv://volpinivini:zyBdjK5PThWa9plv@mycluster.oe7rhah.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster");

let db = mongoose.connection;

export default db;