const axios = require("axios");
const EMAIL_PATTERNS = require("./email-patterns.json");
const md5 = require("md5");

const addDynamicEmail = (_input) => {
  const inputs = _input;
  if (!inputs.email || !inputs.email.trim()) {
    throw new Error("Missing Manditory Email");
  }

  let data = JSON.stringify({
    email: inputs.email.trim(),
    firstName: inputs.firstName || "",
    middleName: inputs.middleName || "",
    lastName: inputs.lastName || "",
    verifiedData: {
      type: "custom-Old-RightLead",
      lastVerifiedDateAndTime: "2020-12-27T15:29:04.722Z",
    },
  });

  // url: "https://dev.da.rightleads.io/api/v1/dynamicEmailPattern",
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://beta.da.rightleads.io/api/v1/dynamicEmailPattern",
    headers: {
      "Content-Type": "application/json",
      Cookie:
        "idToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJEWXlNRVZHTTBKQ1FrRXdNakUxTWtZMlJUWTFPREZCT0ROR09VVXlPRVZHUkRBMFJqUXdRUSJ9.eyJ1c2VyX2dyb3VwcyI6WyJBZ2VudCAoYmV0YS1wcm9kKSJdLCJ1c2VyX3JvbGVzIjpbImFnZW50Il0sInVzZXJfcGVybWlzc2lvbnMiOltdLCJ1c2VyX21ldGFkYXRhIjp7ImlzRVVMQUFjY2VwdGVkIjp0cnVlfSwibG9naW5fc3RhdHMiOnsibGFzdF9pcCI6IjI0MDE6NDkwMDoxYzk2OjllZWU6ZjFmNjo4ZjQ5OmJiZWQ6ZjExNyIsImxhc3RfbG9naW4iOiIyMDI0LTAzLTExVDEwOjEzOjMwLjczN1oiLCJsYXN0X2xvZ2luX2dlbyI6eyJjaXR5TmFtZSI6Ik11bWJhaSIsImNvdW50cnlOYW1lIjoiSW5kaWEiLCJ0aW1lWm9uZSI6IkFzaWEvS29sa2F0YSJ9LCJsb2dpbl9jb3VudCI6MzN9LCJ1c2VyX2lkIjoiYXV0aDB8NjEzNWEzNzg0NjBmYTAwMDZhMjk1MDA1IiwiY2xpZW50SUQiOiI3NkJYOVp0ZzRsamJySTBtRnpxWUk2bU4wMW12b3FSUyIsImNyZWF0ZWRfYXQiOiIyMDIxLTA5LTA2VDA1OjEzOjI4LjA0N1oiLCJlbWFpbCI6ImJldGEuYWdlbnQzQG5leHNhbGVzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpZGVudGl0aWVzIjpbeyJ1c2VyX2lkIjoiNjEzNWEzNzg0NjBmYTAwMDZhMjk1MDA1IiwicHJvdmlkZXIiOiJhdXRoMCIsImNvbm5lY3Rpb24iOiJhbHQtcmlnaHRsZWFkcyIsImlzU29jaWFsIjpmYWxzZX1dLCJuYW1lIjoiYmV0YS5hZ2VudDNAbmV4c2FsZXMuY29tIiwibmlja25hbWUiOiJiZXRhLmFnZW50MyIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80N2NkYWVhYzM4NTMxNDhiZGI0MjEyM2FlZTdkZGFkZj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmJlLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDI0LTAzLTExVDEwOjEzOjMwLjcyM1oiLCJhcHBfbWV0YWRhdGEiOnt9LCJncm91cHMiOlsiQWdlbnQgKGJldGEtcHJvZCkiXSwicm9sZXMiOlsiYWdlbnQiXSwicGVybWlzc2lvbnMiOltdLCJpc3MiOiJodHRwczovL2lubm92YXRpb24uYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYxMzVhMzc4NDYwZmEwMDA2YTI5NTAwNSIsImF1ZCI6Ijc2Qlg5WnRnNGxqYnJJMG1GenFZSTZtTjAxbXZvcVJTIiwiaWF0IjoxNzEwMTUyMDExLCJleHAiOjE3MTAxODgwMTF9.iC6uVkavPzuFT1MgHLSw1GgGp2-XXDmqiaRUau0ACwg4K961omWIq03blT7SgDgHMQOOt5OATDNaPxcRvRGeWhJgDMmcouVtRq36375jsaQSWv7bUHzrup7Ms0dqFzmKXKLsIc9-u2Sa2zQDQPDW9k6GIRzzs0JkYebo4d1LzyVcO13X5JVx9Lt3d0G6cpqb0_i7aQVFZbxxL3QxCq97b9AdcApo2GpxZ7Rb2SVsqIuzXIa-zEA9GG2L2_HFe4x965kJu1XIyxbVEn1UIfEHzbR9wJ4LGvcwZqoeUJ75oVE2J5LuWMfREDGHh44gs_X7UxQJgs5rbwxJTmCooqScRQ",
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios
      .request(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
};

async function generateEmailPattern(_inputs, userId, dateTime) {
  const inputs = {
    email: _inputs.email,
    firstName: _inputs.firstName || "",
    middleName: _inputs.middleName || "",
    lastName: _inputs.lastName || "",
    website: _inputs.website || null,
    verifiedData: _inputs.verifiedData || {},
    createdBy: userId,
    createdAt: dateTime,
    updatedBy: userId,
    updatedAt: dateTime,
  };

  const email = inputs.email.toLowerCase().trim();
  const name = {};
  name.firstName = inputs.firstName.toLowerCase().trim() || "";
  name.middleName = inputs.middleName.toLowerCase().trim() || "";
  name.lastName = inputs.lastName.toLowerCase().trim() || "";

  const emailDomain = email.substring(email.lastIndexOf("@") + 1);

  const dynamicEmailPatternData = {};

  try {
    dynamicEmailPatternData.email = md5(email);
    dynamicEmailPatternData.emailDomain = emailDomain;
    dynamicEmailPatternData.pattern = getPatternOfEmail(
      email,
      name,
      emailDomain
    );
    dynamicEmailPatternData.website = inputs.website || null;
    dynamicEmailPatternData.verifiedData = JSON.stringify(
      inputs.verifiedData || {}
    );
    dynamicEmailPatternData.updatedAt = inputs.updatedAt || inputs.createdAt;
    dynamicEmailPatternData.createdAt = inputs.createdAt;
    dynamicEmailPatternData.createdBy = inputs.createdBy;
    dynamicEmailPatternData.updatedBy = inputs.updatedBy || inputs.createdBy;

    // const result = await DynamicEmailPattern.create(dynamicEmailPatternData);

    return dynamicEmailPatternData;
  } catch (e) {
    throw e;
  }
}

function getPatternOfEmail(email, _name, domain) {
  let name = _name;

  name = generateInitialOfName(name);

  const keys = Object.keys(EMAIL_PATTERNS);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const patternCode = EMAIL_PATTERNS[key];
    const res = matchEmailPattern(email, name, domain, patternCode);
    if (res) {
      return patternCode;
    }
  }

  // throw new Error("Email Pattern is not Match");
  throw {
    message: "Invalid Email",
    desc: "Name and Email Pattern is not Match",
  };
}

function matchEmailPattern(email, _name, domain, patternCode) {
  const name = _name;

  const genratedEmail = getEmailFromPattern(patternCode, name, domain);

  return email === genratedEmail;
}

function generateInitialOfName(_name) {
  const name = _name;

  name.firstNameInitial = name.firstName[0] || "";
  name.middleNameInitial = name.middleName[0] || "";
  name.lastNameInitial = name.lastName[0] || "";

  if (name.firstName && name.firstName.length === 1) {
    name.firstName = "";
  }
  if (name.middleName && name.middleName.length === 1) {
    name.middleName = "";
  }
  if (name.lastName && name.lastName.length === 1) {
    name.lastName = "";
  }
  return name;
}

function getEmailFromPattern(patternCode, name, domain) {
  const {
    firstName,
    middleName,
    lastName,
    firstNameInitial,
    middleNameInitial,
    lastNameInitial,
  } = name;
  let generatedEmail = "";

  const defaultMiddleName = "[MIDDLE_NAME]";
  const defaultMiddleNameIntial = "[MIDDLE_NAME_INITIAL]";
  switch (patternCode) {
    case EMAIL_PATTERNS.first:
      generatedEmail = `${firstName}@${domain}`;
      break;
    case EMAIL_PATTERNS.last:
      generatedEmail = `${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_dot_last:
      generatedEmail = `${firstName}.${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_underscore_last:
      generatedEmail = `${firstName}_${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_last:
      generatedEmail = `${firstName}${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_first:
      generatedEmail = `${lastName}${firstName}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_dot_first:
      generatedEmail = `${lastName}.${firstName}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_underscore_first:
      generatedEmail = `${lastName}_${firstName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_last_initial:
      generatedEmail = `${firstName}${lastNameInitial}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_dot_last_initial:
      generatedEmail = `${firstName}.${lastNameInitial}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_initial_first:
      generatedEmail = `${lastNameInitial}${firstName}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_initial_dot_first:
      generatedEmail = `${lastNameInitial}.${firstName}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_initial_underscore_first:
      generatedEmail = `${lastNameInitial}_${firstName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_initial_dot_last:
      generatedEmail = `${firstNameInitial}.${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_initial_underscore_last:
      generatedEmail = `${firstNameInitial}_${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_initial_last:
      generatedEmail = `${firstNameInitial}${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_dot_first_initial:
      generatedEmail = `${lastName}.${firstNameInitial}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_underscore_first_initial:
      generatedEmail = `${lastName}_${firstNameInitial}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_first_initial:
      generatedEmail = `${lastName}${firstNameInitial}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_initial_last_initial:
      generatedEmail = `${firstNameInitial}${lastNameInitial}@${domain}`;
      break;
    case EMAIL_PATTERNS.last_initial_first_initial:
      generatedEmail = `${lastNameInitial}${firstNameInitial}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_middle_last:
      generatedEmail = `${firstName}${
        middleName || defaultMiddleName
      }${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_dot_middle_dot_last:
      generatedEmail = `${firstName}.${
        middleName || defaultMiddleName
      }.${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_underscore_middle_underscore_last:
      generatedEmail = `${firstName}_${
        middleName || defaultMiddleName
      }_${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_dot_middle_initial_dot_last:
      generatedEmail = `${firstName}.${
        middleNameInitial || defaultMiddleNameIntial
      }.${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_underscore_middle_initial_underscore_last:
      generatedEmail = `${firstName}_${
        middleNameInitial || defaultMiddleNameIntial
      }_${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_middle_initial_last:
      generatedEmail = `${firstName}${
        middleNameInitial || defaultMiddleNameIntial
      }${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_initial_middle_initial_dot_last:
      generatedEmail = `${firstNameInitial}${
        middleNameInitial || defaultMiddleNameIntial
      }.${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_initial_middle_initial_underscore_last:
      generatedEmail = `${firstNameInitial}${
        middleNameInitial || defaultMiddleNameIntial
      }_${lastName}@${domain}`;
      break;
    case EMAIL_PATTERNS.first_initial_middle_initial_last:
      generatedEmail = `${firstNameInitial}${
        middleNameInitial || defaultMiddleNameIntial
      }${lastName}@${domain}`;
      break;
    default:
      break;
  }
  return generatedEmail;
}

module.exports = { addDynamicEmail, generateEmailPattern };
