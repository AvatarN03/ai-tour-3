"use client";
import React, { useState } from "react";

import CurrencyConverter from "@/components/features/tools/CurrencyConvertor";
import { TABS } from "@/lib/utils/constant";
import Emergency from "@/components/features/tools/Emergency";
import ExpenseTracker from "../../../components/features/tools/ExpenseTracker";
import { useTranslation } from "react-i18next";

export default function TravelTools() {
  const [activeTab, setActiveTab] = useState("expense");
  const { t } = useTranslation();


  return (
    <div className="min-h-screen  text-white p-3 md:p-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Travel Tools
        </h1>
        <p className="text-slate-400 mb-8">
          Essential tools to make your travels easier and safer
        </p>

        {/* Tool Tabs */}
        <div className="flex gap-2 md:gap-4 mb-8 flex-wrap border-b-2 border-slate-700 pb-4">
          {TABS.map(({ id, labelKey, icon: Icon, activeColor }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex cursor-pointer items-center gap-1 md:gap-2 p-2 md:p-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? `bg-${activeColor}-600 text-white shadow-lg shadow-${activeColor}-500/50`
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Icon size={20} />
              {t(labelKey)}
            </button>
          ))}
        </div>

        {/* Expense Tracker */}
        {activeTab === "expense" && (
          <ExpenseTracker/>
        )}

        {/* Currency Converter */}
        {activeTab === "currency" && (
          <CurrencyConverter />
        )}

        {/* Emergency Contacts */}
        {activeTab === "emergency" && (
          <Emergency/>
        )}

        {/* AI Assistant
        {activeTab === "ai" && (
          <AITravelAssistant/>
        )} */}
      </div>
    </div>
  );
}
