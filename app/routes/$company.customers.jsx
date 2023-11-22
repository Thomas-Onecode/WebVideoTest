import React, { useState, useEffect } from "react";
import { useLoaderData, Form } from "@remix-run/react";
import {
  login,
  getCustomers,
  createCustomer,
  updateCustomer,
} from "../services/firebase/firebase";
import EmployeesData from "../jsonDummyData/employees.json";
import CustomersData from "../jsonDummyData/customers.json";
import HistoryData from "../jsonDummyData/history.json";

const loggedInUserID = 1;

export const loader = async () => {
  const loggedInEmployee = EmployeesData.find((e) => e.id === loggedInUserID);

  if (!loggedInEmployee) {
    return null;
  }

  const customersOfSameCompany = CustomersData.filter(
    (c) => c.companyID === loggedInEmployee.companyID
  );

  const historyOfCustomers = HistoryData;

  return { customersOfSameCompany, historyOfCustomers };
};

export default function Customers() {
  const { customersOfSameCompany, historyOfCustomers } = useLoaderData();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState();
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const [openCreateCustomerModule, setOpenCreateCustomerModule] =
    useState(false);
  const [openCreateCustomerCSV, setOpenCreateCustomerCSV] = useState(false);

  /*************ASYNC FUNCTIONS**************/
  // #region async functions
  // initial fetching data
  async function fetchData() {
    try {
      const log = await login("thomas@onecode.dk", "onecode123");
      console.log(log);
    } catch (error) {
      console.error("Error logging in: ", error);
    }
    try {
      const customersQuerySnapshot = await getCustomers("123");
      const customerData = [];
      customersQuerySnapshot.forEach((doc) => {
        customerData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  }

  // create
  const handleCreateCustomer = async () => {
    await createCustomer("123", {
      countryCode: "45",
      email: "customer@test.dk",
      name: "Sousu Pedersen",
      phoneNumber: "42414244",
    });
  };

  // update
  const handleUpdateCustomer = async () => {
    await updateCustomer("123", "6AUB5xUkR0b9IqmXb8u1nQnENpW2", {
      name: "Thomas Bickman 2",
    });
  };
  // #endregion

  /************HELPER FUNCTIONS**********/
  // #region helper functions

  // open create customer module
  const handleOpenCreateCustomerModule = () => {
    setOpenCreateCustomerModule(
      (openCreateCustomerModule) => !openCreateCustomerModule
    );
    setOpenCreateCustomer(false);
    setOpenCreateCustomerCSV(false);
  };

  // open create customer
  const handleOpenCreateCustomer = () => {
    setOpenCreateCustomer((openCreateCustomer) => !openCreateCustomer);
    setOpenCreateCustomerModule(false);
  };

  // open create customer from csv
  const handleOpenCreateCustomerFromCSV = () => {
    setOpenCreateCustomerCSV((openCreateCustomerCSV) => !openCreateCustomerCSV);
    setOpenCreateCustomerModule(false);
  };

  // close create form
  const handleCloseCreateForm = () => {
    setOpenCreateCustomer(false);
    setOpenCreateCustomerCSV(false);
  };

  // edit customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
  };

  // close edit form
  const handleCloseEditForm = () => {
    setEditingCustomer(null);
  };

  // #endregion

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl text-center my-4">Customers</h1>
      {/* add customer */}
      <button
        type="button"
        onClick={handleOpenCreateCustomerModule}
        className="m-2"
      >
        Add Customer
      </button>

      {/* table */}
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
                Phone Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sent Mails
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers &&
              customers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      +{customer.countryCode} {customer.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.numberOfEmailSend}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        type="button"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* edit customer */}
      {editingCustomer && (
        <Form
          method="post"
          className="p-4 mb-20 fixed bottom-0 z-80 w-full flex flex-col items-center bg-white"
        >
          <input
            type="text"
            name="name"
            defaultValue={editingCustomer.name}
            className="p-2 border-2 rounded-lg"
          />
          <input
            type="email"
            name="email"
            defaultValue={editingCustomer.email}
            className="p-2 border-2 rounded-lg"
          />
          <button
            type="submit"
            onClick={handleCloseEditForm}
            className="border-2 px-4 py-1 rounded-lg w-full"
          >
            Accept
          </button>
        </Form>
      )}

      {/* create customer */}
      {openCreateCustomerModule && (
        <div className="p-4 mb-20 fixed bottom-0 z-80 w-full flex flex-col items-center bg-white">
          <button
            type="button"
            onClick={handleOpenCreateCustomer}
            className="w-full mb-4"
          >
            Add Customer
          </button>
          <button
            type="button"
            onClick={handleOpenCreateCustomerFromCSV}
            className="w-full mb-4"
          >
            Add Customer from CSV
          </button>
        </div>
      )}

      {openCreateCustomer && (
        <Form className="p-4 mb-20 fixed bottom-0 z-80 w-full flex flex-col items-center bg-white">
          <input
            type="text"
            name="name"
            placeholder="name..."
            className="p-2 border-2 rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="email..."
            className="p-2 border-2 rounded-lg"
          />
          <input
            type="number"
            name="countryCode"
            placeholder="phone country code... + is added automatically"
            className="p-2 border-2 rounded-lg"
          />
          <input
            type="number"
            name="phoneNumber"
            placeholder="phone number..."
            className="p-2 border-2 rounded-lg"
          />
          <button
            type="submit"
            onClick={handleCloseCreateForm}
            className="border-2 px-4 py-1 rounded-lg w-full mb-4"
          >
            Add Customer
          </button>
        </Form>
      )}

      {openCreateCustomerCSV && (
        <Form className="p-4 mb-20 fixed bottom-0 z-80 w-full flex flex-col items-center bg-white">
          <input
            type="file"
            name="csvFile"
            className="p-2 border-2 rounded-lg mb-4"
          />
          <button
            type="submit"
            onClick={handleCloseCreateForm}
            className="border-2 px-4 py-1 rounded-lg w-full mb-4"
          >
            Add Customer
          </button>
        </Form>
      )}
    </div>
  );
}
