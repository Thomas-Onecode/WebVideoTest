import React, { useState, useEffect } from "react";
import { useLoaderData, Form } from "@remix-run/react";
import EmployeesData from "../jsonDummyData/employees.json";
import { login, getEmployees, updateEmployee } from "../services/firebase/firebase";

const loggedInUserID = 1;

export const loader = async () => {
  const loggedInEmployee = EmployeesData.find((e) => e.id === loggedInUserID);

  if (!loggedInEmployee) {
    return null;
  }

  const employeesOfSameCompany = EmployeesData.filter(
    (e) => e.companyID === loggedInEmployee.companyID
  );

  return employeesOfSameCompany;
};

export const action = async () => {
  return null;
};

export default function Employees() {
  const employeesOfSameCompany = useLoaderData();
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employees, setEmployees] = useState();

  async function fetchData() {
    try {
      const log = await login("thomas@onecode.dk", "onecode123");
      console.log(log);
    } catch (error) {
      console.error("Error logging in: ", error);
    }
    try {
      const employeeQuerySnapshot = await getEmployees("123");
      const employeeData = [];
      employeeQuerySnapshot.forEach((doc) => {
        employeeData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateEmployee = async () => {
    await updateEmployee("123", "6AUB5xUkR0b9IqmXb8u1nQnENpW2", {firstName: "Thomas2"})
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };
  const handleCloseForm = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="relative">
      <h1 className="text-xl text-center my-4">Employees</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll border-separate border-spacing-x-2 border-spacing-y-4">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Edit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Accepted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees &&
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.roles[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.accepted ? (
                      <p className="bg-green-200 p-2 p-button">Accepted</p>
                    ) : (
                      <Form method="post">
                        <button type="submit" className="bg-red-200 p-2">
                          Accept
                        </button>
                      </Form>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {editingEmployee && (
        <Form
          method="post"
          className="p-4 mb-20 fixed bottom-0 z-80 w-full flex flex-col items-center"
        >
          <input
            type="text"
            name="firstName"
            defaultValue={editingEmployee.firstName}
          />
          <input
            type="text"
            name="lastName"
            defaultValue={editingEmployee.lastName}
          />
          <button
            type="submit"
            onClick={handleCloseForm}
            className="border-2 px-4 py-1 rounded-lg w-full"
          >
            Accept
          </button>
        </Form>
      )}
    </div>
  );
}
