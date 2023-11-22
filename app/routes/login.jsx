import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import React from "react";
import Companies from "../jsonDummyData/companies.json";
import Employees from "../jsonDummyData/employees.json";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("id");
  const password = formData.get("password");

  const employee = Employees.find((e) => e.id.toString() === userId);

  if (employee) {
    const company = Companies.find((c) => c.id === employee.companyID);

    if (company) {
      return redirect(`/${company.name.toLowerCase()}`);
    }
  }

  return json({ error: "Invalid credentials" });
};

export default function Login() {
  return (
    <div className="flex justify-center items-center w-full h-[90vh]">
      <Form method="post" className="flex flex-col items-center justify-center">
        <input
          type="text"
          name="id"
          placeholder="id..."
          className="border-2 p-2 m-2"
        />
        <input
          type="password"
          name="password"
          placeholder="password..."
          className="border-2 p-2 m-2"
        />
        <button type="submit" className="border-2 p-2 m-2">
          Login
        </button>
      </Form>
    </div>
  );
}
