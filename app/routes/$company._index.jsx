import React from "react";
import { json, redirect } from "@remix-run/node"; // Import json to use in loader
import Companies from "../jsonDummyData/companies.json";
import Employees from "../jsonDummyData/employees.json";
import { useLoaderData } from "@remix-run/react";

const loggedInUserID = 1;

export const loader = async () => {
  try {
    // Find the employee with the logged in user's ID
    const employee = Employees.find((e) => e.id === loggedInUserID);

    if (!employee) {
      return redirect("./errorPage");
    }

    // Check if the employee has a companyID and find that company
    let company = null;
    if (employee && employee.companyID) {
      const companyObj = Companies.find((c) => c.id === employee.companyID);
      if (companyObj) {
        company = companyObj;
      }
    }

    // Return the company name in the loader's response
    return redirect(`./home`);
  } catch (err) {
    return json({ error: err.message });
  }
};
