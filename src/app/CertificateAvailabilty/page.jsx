'use client';

import React, { useRef, useEffect } from 'react';
import { useState } from "react";
import axios from "axios";
import * as echarts from 'echarts';

// Convert JSON data to CSV format
function convertToCSV(data) {
    const header = Object.keys(data[0]).map(key => `"${key}"`).join(",");
    const body = data.map(row => {
        return Object.values(row).map(value => `"${value}"`).join(",");
    }).join("\n");

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

function PIBOData({ data, heading }) {
    return (
        <div className="border p-4 m-4">
            <h3 className="font-bold">{heading}</h3>
            <ul>
                {data.statusList.map((item, index) => (
                    <li key={index}>
                        {item.statusText}: {item.countValue}
                    </li>
                ))}
            </ul>
            <button
                onClick={() => triggerCSVDownload(data.statusList, `${heading.replace(/ /g, "_")}_data.csv`)}
                className="bg-blue-500 text-white px-4 py-2 mt-4"
            >
                Download CSV
            </button>
        </div>
    );
}

function EChart({ options }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const chartInstance = echarts.init(chartRef.current);
            chartInstance.setOption(options);
        }
    }, [options]);

    return <div ref={chartRef} style={{ height: '400px', width: '100%' }}></div>;
}

export default function DashboardNational() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post("https://eprplastic.cpcb.gov.in/epr/api/v1.0/pibo/dashboard/dashboard_national", {
                    "year": "2022"
                });
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-4xl text-center mt-6">Certificate Availability</h1>

            <div className="flex flex-wrap justify-around">
                {data.pibo.map((item, index) => (
                    <PIBOData key={index} data={item} heading={item.heading} />
                ))}
            </div>

            <div className="m-4">
                {data.charts.map((chart, index) => (
                    <div key={index}>
                        <h2 className="text-2xl mt-4 mb-2">{chart.heading}</h2>
                        <EChart options={chart.options} />
                        <button
                            onClick={() => triggerCSVDownload(chart.options.series[0].data, `${chart.heading.replace(/ /g, "_")}_chart_data.csv`)}
                            className="bg-blue-500 text-white px-4 py-2 mt-4"
                        >
                            Download Chart Data as CSV
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
