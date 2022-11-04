const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fieldSize: 2 * 1024 * 1024 },
  })
);

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/single", async (req, res, next) => {
  try {
    // geting file object
    // make sure to pass enctype="multipart/form-data" attribute in html form element
    const file = req.files.sFile;
    // uniqu file name
    const fileName = new Date().getTime().toString() + path.extname(file.name);

    // path name of uploaded file
    const savePath = path.join(__dirname, "public", "uploads", fileName);

    // checking if file size is too big provided in the fileupload configuration
    if (file.truncated) {
      throw new Error("File size is too big");
    }

    // only accept specific file type
    if (file.mimetype !== "image/jpeg") {
      throw new Error("Only Jpegs are supported");
    }
    console.log(savePath);
    file.mv(savePath);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

app.post("/multiple", async (req, res, next) => {
  try {
    const files = req.files.mFile;
    const promises = files.map((file) => {
      const savePath = path.join(__dirname, "public", "uploads", file.name);

      return file.mv(savePath);
    });

    await Promise.all(promises);
    res.redirect("/");
  } catch (error) {
    res.send(error.message);
  }
});
app.listen(5000, () => {
  console.log("server running @ port 5000");
});
