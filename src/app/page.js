"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Convert JSON data to CSV format
function convertToCSV(json) {
  const header = json.headerContent.map((h) => `"${h.label}"`).join(",");
  const body = json.bodyContent
    .map((row) => {
      return json.headerContent
        .map((header) => `"${row[header.key] || ""}"`)
        .join(",");
    })
    .join("\n");

  return `${header}\n${body}`;
}

// Trigger a download for CSV content
function triggerCSVDownload(data, filename = "data.csv") {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Skeleton Loader Component for data loading placeholder
function SkeletonLoader() {
  return (
    <>
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-400 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// DataTable Component to render data in table format
function DataTable({ data }) {
  if (!data) return <SkeletonLoader />;

  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          {data.headerContent.map((header) => (
            <th key={header.key} className="border border-gray-300 px-4 py-2">
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.bodyContent &&
          data.bodyContent.length > 0 &&
          data.bodyContent.map((row, index) => (
            <tr key={index}>
              {data.headerContent.map((header) => (
                <td
                  key={header.key}
                  className="border border-gray-300 px-4 py-2"
                >
                  {row[header.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

// Main Home Component
export default function Home() {
  const [firstAPI, setFirstAPI] = useState(null);
  const [secondAPI, setSecondAPI] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          "https://eprplastic.cpcb.gov.in/epr/api/v1.0/pibo/list_national_cpcb_dashboard_applications",
          "https://eprplastic.cpcb.gov.in/epr/api/v1.0/pibo/list_national_cpcb_epr_target",
        ];
        const postData = { year: "2022-23" };
        const [response1, response2] = await Promise.all(
          urls.map((url) => axios.post(url, postData))
        );

        setFirstAPI(response1.data.piboRegistrationList);
        setSecondAPI(response2.data.piboRegistrationList);
      } catch (error) {
        console.error("Error fetching data:", error);
      };
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">
        Application Status for PIBO Registration (F.Y. 22-23)
      </h2>
      {firstAPI ? (
        <button
          onClick={() => triggerCSVDownload(firstAPI, "firstAPI_data.csv")}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Download CSV
        </button>
      ) : (
        <div className="bg-gray-400 animate-pulse w-32 h-8 rounded mb-4"></div>
      )}
      <DataTable data={firstAPI} />
      <h2 className="text-xl font-bold mt-8 mb-4">
        EPR Target of Registered PIBOs (F.Y. 22-23)
      </h2>
      {secondAPI ? (
        <button
          onClick={() => triggerCSVDownload(secondAPI, "secondAPI_data.csv")}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Download CSV
        </button>
      ) : (
        <div className="bg-gray-400 animate-pulse w-32 h-8 rounded mb-4"></div>
      )}
      <DataTable data={secondAPI} />
    </div>
  );
}
