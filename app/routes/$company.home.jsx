import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import EmployeesData from "../jsonDummyData/employees.json";
import CustomersData from "../jsonDummyData/customers.json";
import HistoryData from "../jsonDummyData/history.json";
import { Chart } from "react-google-charts";
import { format, subDays } from "date-fns";
import {
  getCompany,
  login,
  getEmployees,
  getCustomers,
} from "../services/firebase/firebase";

export const loader = async () => {
  const employeesOfCompany = EmployeesData.filter(
    (employee) => employee.companyID === 1
  );

  const employeeIDs = employeesOfCompany.map((employee) => employee.id);

  const historyOfSameCompany = HistoryData.filter((history) =>
    employeeIDs.includes(history.createdBy)
  );

  return { historyOfSameCompany };
};

export default function History() {
  const { historyOfSameCompany } = useLoaderData();
  const [company, setCompany] = useState();

  async function fetchData() {
    await login("thomas@onecode.dk", "onecode123");
    const companyData = await getCompany("123");
    setCompany(companyData);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => format(date, "dd/MM");

  // Function to generate past 7 days dates including today
  const generatePastWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(formatDate(subDays(new Date(), i)));
    }
    return dates.reverse();
  };

  // Function to count items per date
  const countItemsPerDate = (history, dates) => {
    return dates.map((date) => {
      const count = history.filter((item) => {
        const itemDate = item.date.split("/").slice(0, 2).join("/");
        return itemDate === date;
      }).length;
      return [date, count];
    });
  };

  // Usage
  const pastWeekDates = generatePastWeekDates();
  const data = [
    ["Date", "Amount"],
    ...countItemsPerDate(historyOfSameCompany, pastWeekDates),
  ];

  const options = {
    chart: {
      title: "Videos Sent",
      subtitle: "Videos Sent from the last 7 days",
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-10">
        <h1>{company?.name}</h1>
        <h2>Ansatte Navn!</h2>
      </div>
      <div className="w-full lg:w-1/2 shadow-lg p-4 rounded-lg">
        <Chart
          chartType="Bar"
          width="100%"
          height="300px"
          data={data}
          options={options}
        />
      </div>
      <div>
        <h1 className="text-xl text-center my-4">History</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll border-separate border-spacing-x-2 border-spacing-y-4">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Create By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sent To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Link
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyOfSameCompany &&
                historyOfSameCompany.map((history) => (
                  <React.Fragment key={history.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {history.createdBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {history.sentTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {history.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {history.link}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
