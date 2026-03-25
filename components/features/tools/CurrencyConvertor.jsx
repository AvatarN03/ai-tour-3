"use client";
import React, { useState, useEffect } from "react";

import { ArrowRightLeft } from "lucide-react";
import axios from "axios";
import { currencyMeta } from "@/lib/constants";

function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState("");
  const [rates, setRates] = useState({});

  // Fetch rates for top 15 currencies
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await axios.get("/api/tools");

        const data = res.data;
        setRates(data);

      } catch (error) {
        console.error("Error fetching rates:", error);
        setResult("Error fetching rates");
      }
    }
    fetchRates();
  }, []);

  // Perform conversion
  useEffect(() => {
    if (!rates[from] || !rates[to]) {
      setResult("");
      return;
    }
    const converted = amount * (rates[to] / rates[from]);
    setResult(Number.isFinite(converted) ? converted.toFixed(4) : "Invalid");
  }, [amount, from, to, rates]);

  const currencyList = Object.keys(rates).sort();

  return (
    <div>
      <div className="w-full bg-white dark:bg-gray-800 rounded-md shadow-xl p-2 md:p-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-6 text-center">
          Currency Converter
        </h2>
        <div className="space-y-6">
          <div className="flex w-full items-center justify-around">

            {/* Input and From currency */}
            <div className="flex flex-col gap-4 max-w-sm">
              <input
                type="number"
                min="0"
                step="any"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
              <select
                className="w-full cursor-pointer sm:flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {currencyList.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
                aria-label="Swap currencies"
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer text-white shadow transition"
              >
                <ArrowRightLeft />
              </button>
            </div>

            {/* Result and To currency */}
            <div className="flex flex-col justify-between gap-4 items-center  space-y-2 max-w-sm">

              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none"
                value={result}
                readOnly
                aria-label="Converted amount"
              />
              <select
                className="w-full cursor-pointer mx-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {currencyList.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>

          </div>
          {/* Display all rates */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center p-4 md:p-8 rounded-4xl border-b-2">
              Equivalent Amounts in Other Currencies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
              {currencyList.filter(cur => cur !== to).map((cur) => {
                const convertedAmount = amount * (rates[cur] / rates[from]);

                return (<div
                  key={cur}
                  className="bg-gray-50 group  dark:bg-gray-700 rounded-lg shadow cursor-pointer p-3 flex w-full  justify-around items-center font-bold relative text-lg from-blue-300 dark:from-blue-600 to-cyan-600 hover:bg-gradient-to-tr hover:flex-row"
                >
                  <div className="text-gray-600 flex flex-col items-center justify-center dark:text-gray-200">
                    <span>{cur}</span>
                    <span className="font-serif text-xs">{currencyMeta[cur]?.country}</span>

                  </div>
                  <span className="transition-all duration-75 ease-in-out  text-gray-600 dark:text-gray-200">
                    {Number.isFinite(convertedAmount)
                      ? convertedAmount.toFixed(4)
                      : "N/A"}
                  </span>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;
