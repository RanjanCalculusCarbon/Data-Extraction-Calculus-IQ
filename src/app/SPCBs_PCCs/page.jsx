'use client';

import { useState, useEffect } from "react";
import axios from "axios";

// Convert JSON data to CSV format
function convertToCSV(json) {
    const header = json.headerContent.map((h) => `"${h.label}"`).join(",");
    const body = json.bodyContent
        .map((row) => {
            return json.headerContent
                .map((header) => `"${row[header.value || header.key] || ""}"`)
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

function Card({ card }) {
    return (
        <div className="border p-4 m-4">
            <h3 className="font-bold">{card.label}</h3>
            <p>Total Received: {card.totalRecieved}</p>
            <ul>
                {card.items.map((item, index) => (
                    <li key={index}>
                        {item.label}: {item.value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function DataTable({ data }) {
    if (!data) return null;

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 m-4">
                <thead>
                    <tr>
                        {data.headerContent.map((header) => (
                            <th key={header.value || header.key} className="border border-gray-300 px-4 py-2">
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.bodyContent &&
                        data.bodyContent.map((row, index) => (
                            <tr key={index}>
                                {data.headerContent.map((header) => (
                                    <td
                                        key={header.value || header.key}
                                        className="border border-gray-300 px-4 py-2"
                                    >
                                        {row[header.value || header.key] || "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
            {data.bodyContent.length > 0 && (
                <button
                    onClick={() => triggerCSVDownload(data, "table_data.csv")}
                    className="bg-blue-500 text-white px-4 py-2 mb-4"
                >
                    Download CSV
                </button>
            )}
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post("https://eprplastic.cpcb.gov.in/epr/api/v1.0/pibo/dashboard/dashboard_spcb", {
                    "state_id": 1
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-4xl text-center mt-6">Dashboard</h1>

            <div className="flex flex-wrap justify-around">
                {data.cards.map((card, index) => (
                    <Card key={index} card={card} />
                ))}
            </div>

            {data.tables.map((table, index) => (
                <div key={index}>
                    <h2 className="text-2xl mt-4 mb-2">{table.heading}</h2>
                    <DataTable data={table.tableData} />
                </div>
            ))}

            <div>
                <h2 className="text-2xl mt-4 mb-2">{data.EPRSummaryTable.heading}</h2>
                <DataTable data={data.EPRSummaryTable.tableData} />
            </div>
        </div>
    );
}
