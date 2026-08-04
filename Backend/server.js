require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")
const routes = require("./src/routes")


const PORT = process.env.PORT || 5000;

// DataBase connection
connectDB()

// ALLROUTES CONNECT
app.use("/api", routes);



app.listen(PORT , () => {
    console.log("Server Is Running...");
})