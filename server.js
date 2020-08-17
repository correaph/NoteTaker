//Mounting express server and adding required libs
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8081;
var path = require("path");
var fs = require("fs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});

//Initializing storage array/file
var dbFile = path.join(__dirname, "/db/db.json");
var notesArray = [];
try {
    notesArray = JSON.parse(fs.readFileSync(dbFile));
} catch (err) {
    console.log(err);
}

//Mapping routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/api/notes", function(req, res) {
    res.json(notesArray);
});
app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    newNote.id = notesArray.length + 1;
    notesArray.push(newNote);
    fs.writeFileSync(dbFile, JSON.stringify(notesArray));
    res.json(notesArray);
});
app.delete("/api/notes/:id", function(req, res) {
    var idDelete = req.params.id;
    notesArray = notesArray.filter((element) => { return (element.id != idDelete) });
    fs.writeFileSync(dbFile, JSON.stringify(notesArray));
    res.json(notesArray);
});
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});