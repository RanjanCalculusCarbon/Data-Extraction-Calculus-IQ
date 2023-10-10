'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

function PWPPage() {
    const [data, setData] = useState([]);
    const [detailsData, setDetailsData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post('https://eprplastic.cpcb.gov.in/epr/api/v1.0/pibo/dashboard/dashboard_pwp');
                setData(response.data.data[0].tableData.bodyContent);
                setDetailsData(response.data.data[1].tableData.bodyContent);
            } catch (error) {
                console.error("Error fetching the data", error);
            }
        }
        fetchData();
    }, []);

    const downloadData = (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Summary Of Plastic Waste Processor Registration</h2>
            <button
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 border border-blue-700 rounded shadow"
                onClick={() => downloadData(data, 'summary_data.json')}
            >
                Download Summary Data
            </button>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow-md">
                <thead className="bg-blue-200">
                    <tr>
                        {['State/UT', 'In Process', 'Not Approved', 'Registration Issued', 'Total Received'].map(header => (
                            <th key={header} className="py-2 px-4 border-b border-gray-300 text-left">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.state} className="hover:bg-gray-100">
                            {['state', 'inProgress', 'notApproved', 'registrationIssued', 'totalReceived'].map(key => (
                                <td key={key} className="py-2 px-4 border-b border-gray-300">{item[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-2xl font-bold my-4 mt-8">Details by State and PWP Class</h2>
            <button
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 border border-blue-700 rounded shadow"
                onClick={() => downloadData(detailsData, 'details_data.json')}
            >
                Download Details Data
            </button>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow-md">
                <thead className="bg-blue-200">
                    <tr>
                        {['State/UT', 'PWP Class', 'In Process', 'Not Approved', 'Registration Issued', 'Total Received'].map(header => (
                            <th key={header} className="py-2 px-4 border-b border-gray-300 text-left">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {detailsData.map(item => (
                        item.data.map(detail => (
                            <tr key={detail.pwpClass} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b border-gray-300">{item.state}</td>
                                {['pwpClass', 'inProgress', 'notApproved', 'registrationIssued', 'totalReceived'].map(key => (
                                    <td key={key} className="py-2 px-4 border-b border-gray-300">{detail[key]}</td>
                                ))}
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PWPPage;

