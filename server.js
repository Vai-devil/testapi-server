const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const pg = require("pg");

const db = knex({
	client: "pg",
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
});

console.log(
	db
		.select("*")
		.from("userdata")
		.then(data => {
			console.log(data);
		})
);

const app = express();

// const db = {
// 	users: [
// 		{
// 			id: "1",
// 			name: "vai",
// 			email: "vai@gmail.com",
// 			pass: "cookies"
// 		},
// 		{
// 			id: "2",
// 			name: "Sri",
// 			email: "sri@gmail.com",
// 			pass: "hello"
// 		},
// 		{
// 			id: "3",
// 			name: "Aish",
// 			email: "Aish@gmail.com",
// 			pass: "hello"
// 		}
// 	]
// };

app.use(cors());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.get("/", (req, res) => {
	res.json("We are workings");
});

app.post("/signin", (req, res) => {
	// for (var i = 0; i < db.users.length; i++) {
	// 	if (
	// 		req.body.email === db.users[i].email &&
	// 		req.body.pass === db.users[i].pass
	// 	) {
	// 		res.json(db.users[i]);
	// 	} else res.json("fail");
	// 	console.log(req.body);
	// }
	db.select("email", "pass", "id")
		.from("userdata")
		.where("email", "=", req.body.email)
		.then(data => {
			if (data != [])
				if (data[0].pass === req.body.pass) {
					res.json(data[0]);
				} else res.json("fail");
			console.log(data);
		})
		.catch(err => res.json("Wrong Id Password"));
});

app.post("/register", (req, res) => {
	const { email, name, pass } = req.body;
	db("userdata")
		.insert({
			email: email,
			name: name,
			pass: pass,
			joined: new Date()
		})
		.then(user => {
			res.json("success");
		})
		.catch(err => res.json("error"));
});

// app.get("/card/:id", (req, res) => {
// 	var { id } = req.params;
// 	var found = false;
// 	db.users.forEach(user => {
// 		if (user.id === id) {
// 			found = true;
// 			return res.json(user);
// 		}
// 	});
// });

app.listen(process.env.PORT || 5000, () => {
	console.log(`Server Running on ${process.env.PORT}`);
});

/*
	/  --> root says hello
	/signin --> POST = success/fail
	/register --> POST = user
	/card --> Get = results.
	*/
