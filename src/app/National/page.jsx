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

// DataTable Component to render data in table format based on the new API format
function DataTable({ table }) {
    if (!table) return null;

    return (
        <>
            <h2 className="text-xl font-bold mb-4">{table.heading}</h2>
            <table className="min-w-full bg-white border border-gray-300 mb-8">
                <thead>
                    <tr>
                        {table.headers.map((header, idx) => (
                            <th key={idx} className="border border-gray-300 px-4 py-2">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

// Main Home Component
export default function Home() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = "https://eprplastic.cpcb.gov.in/epr/api/v1.0/pibo/dashboard/national_dashboard_table";
                const postData = { year: "2023" };
                const response = await axios.post(url, postData);

                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <div className="mt-6 text-6xl text-center bold">National DATA</div>
            <div className="p-8">
                {data.map((tableData, idx) => (
                    <div key={idx}>
                        <DataTable table={generateTable(tableData)} />
                        <button
                            onClick={() => triggerCSVDownload(tableData.tableData, `${tableData.heading}.csv`)}
                            className="bg-blue-500 text-white px-4 py-2 mb-4"
                        >
                            Download CSV
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function generateTable(apiTable) {
    const heading = apiTable.heading;
    const headerContent = apiTable.tableData.headerContent;
    const bodyContent = apiTable.tableData.bodyContent;

    // Extracting headers
    const headers = headerContent.map(header => header.label);

    // Extracting rows
    const rows = bodyContent.map(row => headerContent.map(header => row[header.value]));

    return {
        heading,
        headers,
        rows
    };
}
