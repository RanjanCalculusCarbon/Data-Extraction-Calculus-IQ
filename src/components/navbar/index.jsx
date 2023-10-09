'use client';

import { useState } from "react";
import Link from "next/link";

function Home() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="font-semibold text-xl tracking-tight">
                        DATA Extraction (Calculus IQ)
                    </span>
                </div>
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
                    >
                        <svg
                            className="fill-current h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
                <div
                    className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"
                        }`}
                >
                    <div className="text-sm lg:flex-grow">
                        <Link href="CPCB">
                            <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer">
                                CPCB
                            </span>
                        </Link>
                        <Link href="National">
                            <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer">
                                National
                            </span>
                        </Link>
                        <Link href="SPCBs_PCCs">
                            <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer">
                                SPCBs/PCCs
                            </span>
                        </Link>
                        <Link href="CertificateAvailabilty">
                            <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white cursor-pointer">
                                Certificate Availability
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Home;
