/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */
// MUST RETURN PROMISES.
// look the libraries to see if it retuns a promise.
const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
// const unzip = (pathIn, pathOut) => {
//   fs.createReadStream("path/to/archive.zip").pipe(
//     unzipper.Extract({ path: "output/path" })
//   );
// };
// const unzip = (pathIn, pathOut) => {
//   fs.createReadStream("./myfile.zip")
//     .pipe(unzipper.Parse())
//     .on("entry", (entry) => entry.autodrain())
//     .promise()
//     .then(
//       () => console.log("done"),
//       (e) => console.log("error", e)
//     );
// };

const unzip = async (pathIn, pathOut) => {
  return fs
    .createReadStream(pathIn)
    .pipe(unzipper.Extract({ path: pathOut }))
    .promise()
    .then(() => console.log("Extraction complete"))
    .catch((err) => console.log(err));
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      filepath = [];
      if (err) {
        reject(err);
      } else {
        files.forEach((file) => {
          let fullPath = path.join(dir, file);
          var ext = path.extname(file);
          if (ext === ".png") {
            filepath.push(fullPath);
          }
        });
        // console.log(filepath);
        resolve(filepath);
      }
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
function grayScale(pathIn, pathOut) {
  var fs = require("fs"),
    PNG = require("pngjs").PNG;
  //   array.forEach((element) => {});

  pathIn.forEach((file, index) => {
    // console.log("next one");
    fs.createReadStream(file)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            // GRAY = R+G+B/3
            // (this.data[idx] + this.data[idx + 1]+ this.data[idx + 2])/3

            // inverted color to gray
            let gray =
              (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
            // and reduce opacity
            //   this.data[idx + 3] = gray >> 1;
          }
        }
        this.pack().pipe(
          fs.createWriteStream(path.join(pathOut + "/" + index + "out.png"))
        );
      });
  });
}

module.exports = {
  unzip,
  readDir,
  grayScale,
};
