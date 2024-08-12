/*
    Code Reades Email, First Name, Last Name from CSV file
    Creates Email Patters which can be imported into dynamic DB
*/

const fs = require("fs");
const papaparse = require("papaparse");
const csv = require("fast-csv");
const path = require("path");
const util = require("util");
let pLimit = require("p-limit");
const { generateEmailPattern } = require("./dynamicEmailPattern");

const limit = pLimit(1);

function createFolderAndWriterObj(FolderPath, FileName, fileCategoryType) {
  var writerObject = {},
    counter = {};

  for (let CatType of fileCategoryType) {
    //Make Directory
    var newFolder = path.join(FolderPath, `/processedFile/${CatType}`);

    fs.mkdirSync(newFolder, { recursive: true }, (err) => {
      if (err) throw err;
    });

    //Writer Stream
    writerObject[CatType] = csv.format({ headers: true, objectMode: true });
    writerObject[CatType].pipe(
      fs.createWriteStream(path.join(newFolder, `${CatType}_${FileName}`), {
        encoding: "utf-8",
      })
    );

    counter[CatType] = 0;
  }

  counter["Total"] = 0;

  return { writerObject, counter };
}

async function processRecord(category, writeStream, rowRec, counter, wraperFn) {
  counter[category] = counter[category] + 1;
  writeStream[category].write(rowRec, wraperFn);
}

function streamPasue(readStream, Tracker) {
  Tracker.readCnt++;
  if (Tracker.readCnt - Tracker.processCnt > 1) {
    readStream.pause();
  }
}

function streamResume(readStream, Tracker) {
  Tracker.processCnt++;
  if (Tracker.readCnt - Tracker.processCnt < 1) {
    readStream.resume();
  }
}

let checkColData = (rowRec, mapData, Operator) => {
  let MissingCol = "",
    cnt = 0;
  for (let colName of Object.values(mapData)) {
    if (!rowRec[colName] || rowRec[colName]?.trim().length < 1) {
      MissingCol = MissingCol + colName + ", ";
      cnt++;
    }
  }

  if (Operator == "any") {
    if (cnt >= Object.values(mapData).length) {
      return MissingCol;
    }
    return "";
  }
  return MissingCol;
};

function processFile(fileDetails, fileCategoryType, csvFileColumnMApping) {
  return new Promise((resolve, reject) => {
    const { folderPath, filepath, name: fileName, ext } = fileDetails;

    let papaParserReadStream = papaparse.parse(papaparse.NODE_STREAM_INPUT, {
      header: true,
      worker: true,
      download: true,
      skipEmptyLines: true,
      encoding: "utf8",
    });

    const readStream = fs.createReadStream(filepath);
    let Tracker = { readCnt: 0, processCnt: 0 };

    readStream.pipe(papaParserReadStream);

    let { writerObject: writeStream, counter } = createFolderAndWriterObj(
      folderPath,
      fileName + ext,
      fileCategoryType
    );

    process.stdout.write("\tProcessing Data");

    papaParserReadStream.on("data", (_rowRec) => {
      streamPasue(readStream, Tracker);
      limit(async () => {
        counter["Total"] = counter["Total"] + 1;

        //This is only for local run and tracking
        if (counter["Total"] % 10000 == 0) {
          process.stdout.write(".");
        }
        //--------------------------------------------------------
        let rowRec = {};
        rowRec.status = "";
        rowRec.reason = "";
        rowRec.data = "";
        rowRec.current_email = "";
        rowRec.first_name = "";
        rowRec.last_name = "";

        rowRec = Object.assign(rowRec, _rowRec);

        var wraperFn = () => {
          streamResume(readStream, Tracker);
        };

        //Check for Manditory Fields
        var MissingCol = "",
          ProcessType = "";

        MissingCol =
          MissingCol +
          checkColData(rowRec, csvFileColumnMApping.manditory, "all");

        //Check if Either if firstName or lastName or middleName is missing.
        MissingCol =
          MissingCol +
          checkColData(rowRec, csvFileColumnMApping.eitherOfOne, "any");

        ProcessType = fileCategoryType[fileCategoryType.length - 1]; //Default Sucessfully

        if (MissingCol) {
          //write to All Manditory Fields
          //"ManditoryFieldsPresent";
          rowRec.status = "Failed";
          rowRec.reason = "Validation Failed";
          rowRec.data = `Missing Manditory Fields - ${MissingCol}`;
          ProcessType = fileCategoryType[1]; //"MissingManditoryFields";

          processRecord(ProcessType, writeStream, rowRec, counter, wraperFn);
          return;
        }

        //Adding to DB
        try {
          let _input = {
            email: rowRec[csvFileColumnMApping.manditory.email],
            firstName: rowRec[csvFileColumnMApping.eitherOfOne.firstName] || "",
            middleName:
              rowRec[csvFileColumnMApping.eitherOfOne.middleName] || "",
            lastName: rowRec[csvFileColumnMApping.eitherOfOne.lastName] || "",
            verifiedData: {
              type: "custom-Old-RightLead",
              lastVerifiedDateAndTime: "2020-12-27",
            },
          };

          //auth0|624c225b18c02901576515d7 -> Sukhdev Kushwaha
          var processedPattern = await generateEmailPattern(
            _input,
            "auth0|624c225b18c02901576515d7",
            "2021-12-27 10:30:00"
          );
          // rowRec.status = "Sucess";
          // rowRec.data = JSON.stringify(t);
          ProcessType = fileCategoryType[2];
          processRecord(
            ProcessType,
            writeStream,
            processedPattern,
            counter,
            wraperFn
          );
        } catch (err) {
          rowRec.status = "Failed";
          rowRec.reason = err.message || err.err;
          rowRec.data = err.stack || JSON.stringify(err.desc) || err;

          ProcessType = fileCategoryType[1];
          processRecord(ProcessType, writeStream, rowRec, counter, wraperFn);
        }
        return;
      });
    });

    papaParserReadStream.on("error", (err) => {
      limit.clearQueue();
      reject(err);
    });

    papaParserReadStream.on("end", () => {
      // writeStream = null;
      limit(async () => {
        console.log(" ");
        console.log("\tEnd function called", JSON.stringify(Tracker));
        while (Tracker.readCnt !== Tracker.processCnt) {
          await sleep(3000);
          console.log(
            "\tWaiting for process to completed",
            JSON.stringify(Tracker)
          );
        }
        resolve(JSON.stringify(counter, null, ""));
      });
    });
  });
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

const getFiles = (folderPath) => {
  const files = [];
  fs.readdirSync(folderPath).forEach((filename) => {
    const name = path.parse(filename).name;
    const filepath = path.resolve(folderPath, filename);
    const ext = path.extname(filepath);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if (isFile && ext == ".csv")
      files.push({ folderPath, filepath, name, ext });
  });
  return files;
};

async function init(folderPath) {
  //basic setup

  //Creating Temp Folder
  const tempFolderPath = path.join(folderPath, `/temp`);
  fs.mkdirSync(tempFolderPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const logs = fs.createWriteStream(tempFolderPath + "/counterLog.txt", {
    flags: "w",
  });

  return { logs };
}

async function statFolderProcessing(
  folderPath,
  fileCategoryType,
  csvFileColumnMApping
) {
  //This init can be removed as it creates local logs
  const { logs } = await init(folderPath);

  //Getting Files list from Folder
  const files = getFiles(folderPath);

  var totoalFiles = files.length,
    countProcess = 0;

  if (files.length == 0) {
    console.log("No CSV File found in Folder " + folderPath);
    return;
  }

  if (fileCategoryType.length == 0) {
    console.log("fileCategoryType - Not Define" + folderPath);
    return;
  }
  if (
    !csvFileColumnMApping ||
    Object.values(csvFileColumnMApping).filter((val) => val).length < 1
  ) {
    console.log("No Manditory Column found");
    return;
  }

  for (let x in files) {
    let file = files[x];
    countProcess++;
    console.log("\n" + file.name);
    console.log(
      "\tStarted: " + " Total of " + countProcess + " / " + totoalFiles
    );
    let processStats = await processFile(
      file,
      fileCategoryType,
      csvFileColumnMApping
    );

    logs.write(`${file.name} - |Stats| - ${processStats}` + "\r\n");
    console.log(`\t|Stats| - ${processStats}`);
    console.log("\tWriting Counts Completed");
    // delete processStats;
  }
  console.log("\nProcessing of all files have been Completed");
  logs.close();
}

(() => {
  // Create a readable stream from the CSV file.
  let folderPath = "/home/sukhi/Downloads/Email_Pattern/Email_Files/Files/",
    fileCategoryType = [
      "Missing_Manditory_Fields",
      "Error_Processing",
      "Sucessfully_Processed",
    ];

  let csvFileColumnMApping = {
    manditory: {
      email: "current_email",
    },
    eitherOfOne: {
      firstName: "first_name",
      lastName: "last_name",
      middleName: "",
    },
  };

  statFolderProcessing(folderPath, fileCategoryType, csvFileColumnMApping);
})();
