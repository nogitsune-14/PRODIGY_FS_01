import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "user",
    password: "sha$123",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/signup", (req, res) => {
    res.render("index2.ejs");
});

app.post("/signup", async (req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];
    await db.query("INSERT INTO signup (email, password) VALUES ($1 , $2)", [
      email,
      password
    ]);

    res.redirect("/signup");
});

app.post("/submit", async(req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];
    const dbpassword = await db.query("SELECT password FROM signup WHERE email = $1", [email]);
    if (dbpassword.rows.length !== 0) {
        const data = dbpassword.rows[0];
        const pwd = data.password;
        if (password == pwd){
            res.send("Welcome home!! " + email);
        } else {
            res.send("password does not match");
    }
    }    

});


app.listen(port, () => {
    console.log(`server is listening at port ${port} `);
});