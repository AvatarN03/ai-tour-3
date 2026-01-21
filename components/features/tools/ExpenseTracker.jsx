"use client";
import React, { useEffect, useState } from "react";
import { DollarSign, Plus, Trash2, Globe } from "lucide-react";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loadingRates, setLoadingRates] = useState(true);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    currency: "INR",
  });
  const [globalCurrency, setGlobalCurrency] = useState("INR");

  const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF"];

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "Fr",
  };

  // ✅ Fetch exchange rates from API route
  useEffect(() => {
   const fetchRates = async () => {
  const res = await fetch("/api/rates");
  const data = await res.json();
  console.log(data)
  setExchangeRates(data); 
  setLoadingRates(false)
};

    fetchRates();
  }, []);

const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (
    !exchangeRates ||
    Object.keys(exchangeRates).length === 0 ||
    !exchangeRates[fromCurrency] ||
    !exchangeRates[toCurrency]
  ) {
    return amount; // fallback if rates not ready
  } 

  // All rates are relative to EUR
  // Convert `fromCurrency -> EUR -> toCurrency`
  const amountInEUR = amount / exchangeRates[fromCurrency]; // convert to EUR first
  const converted = amountInEUR * exchangeRates[toCurrency]; // then to target
  return converted;
};


  const addExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setExpenses((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...newExpense,
          amount: parseFloat(newExpense.amount),
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewExpense({ category: "", amount: "", currency: globalCurrency });
    }
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // ✅ Wait for rates to load
  if (loadingRates) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 dark:text-gray-300">
        Loading currency rates...
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, exp) => {
    const convertedAmount = convertCurrency(
      exp.amount,
      exp.currency,
      globalCurrency
    );
    return sum + convertedAmount;
  }, 0);

  const getCategoryIcon = (category) => {
    const lower = category.toLowerCase();
    if (lower.includes("food") || lower.includes("restaurant")) return "🍽️";
    if (lower.includes("hotel") || lower.includes("accommodation")) return "🏨";
    if (lower.includes("transport") || lower.includes("flight")) return "✈️";
    if (lower.includes("activity") || lower.includes("tour")) return "🎭";
    if (lower.includes("shopping")) return "🛍️";
    return "💰";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md p-3 md:p-6 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-colors">
        <div className="flex justify-between items-start md:items-center mb-6 w-full flex-col md:flex-row gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Expense Tracker
          </h2>

          <div className="flex items-center md:justify-end justify-between gap-4">
            {/* 🌍 Global Currency Selector */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-900 rounded-lg px-4 py-2 border border-gray-300 dark:border-slate-700">
              <Globe size={20} className="text-blue-500" />
              <select
                value={globalCurrency}
                onChange={(e) => {
                  setGlobalCurrency(e.target.value);
                  setNewExpense({ ...newExpense, currency: e.target.value });
                }}
                className="bg-transparent cursor-pointer text-gray-900 dark:text-white focus:outline-none font-medium"
              >
                {currencies.map((curr) => (
                  <option
                    key={curr}
                    value={curr}
                    className="bg-white dark:bg-slate-800"
                  >
                    {curr}
                  </option>
                ))}
              </select>
            </div>

            {/* 💰 Total Display */}
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {currencySymbols[globalCurrency]} {totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* ➕ Add New Expense */}
        <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-2 md:p-4 mb-6 border border-gray-300 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Add New Expense
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Category (e.g., Food, Hotel)"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && addExpense()}
              className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addExpense}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>
        </div>

        {/* 📜 Expenses List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Expenses
          </h3>
          {expenses.length === 0 ? (
            <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-8 text-center border border-gray-300 dark:border-slate-700">
              <DollarSign
                className="mx-auto mb-3 text-gray-400 dark:text-slate-600"
                size={48}
              />
              <p className="text-gray-500 dark:text-slate-400">
                No expenses yet. Add your first expense to start tracking!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => {
                const convertedAmount = convertCurrency(
                  expense.amount,
                  expense.currency,
                  globalCurrency
                );
                return (
                  <div
                    key={expense.id}
                    className="bg-gray-100 dark:bg-slate-900 rounded-lg p-2 md:p-4 flex flex-col md:flex-row items-center justify-between border border-gray-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-2xl">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">
                          {expense.category}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {expense.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center md:justify-end justify-between w-full md:w-auto mt-2 p-2 bg-gray-200 dark:bg-slate-800 rounded-md gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {currencySymbols[globalCurrency]}{" "}
                          {convertedAmount.toFixed(2)}
                        </p>
                        {expense.currency !== globalCurrency && (
                          <p className="text-xs text-gray-500 dark:text-slate-500">
                            ({currencySymbols[expense.currency]}{" "}
                            {expense.amount.toFixed(2)} {expense.currency})
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 📊 Summary Statistics */}
        {expenses.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 border border-gray-300 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">
                Average Expense
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currencySymbols[globalCurrency]}{" "}
                {(totalExpenses / expenses.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 border border-gray-300 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {expenses.length}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 border border-gray-300 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">
                Highest Expense
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {currencySymbols[globalCurrency]}{" "}
                {Math.max(
                  ...expenses.map((e) =>
                    convertCurrency(e.amount, e.currency, globalCurrency)
                  )
                ).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
