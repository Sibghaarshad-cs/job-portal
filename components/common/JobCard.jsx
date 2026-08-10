"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
Building2,
MapPin,
CalendarDays,
} from "lucide-react";

export default function JobCard({
title,
company,
location,
salaryMin,
salaryMax,
salaryCurrency,
category,
jobType,
postedDate,
href = "/login",
}) {
const originalCurrency = salaryCurrency || "PKR";

const [displayCurrency, setDisplayCurrency] = useState(
originalCurrency
);

const [exchangeRates, setExchangeRates] = useState(null);
const [loadingRate, setLoadingRate] = useState(false);

useEffect(() => {
async function getExchangeRates() {
if (displayCurrency === originalCurrency) {
setExchangeRates(null);
return;
}

  try {
    setLoadingRate(true);

    const response = await fetch(
      `https://open.er-api.com/v6/latest/${originalCurrency}`
    );

    if (!response.ok) {
      throw new Error("Failed to get exchange rates");
    }

    const data = await response.json();

    setExchangeRates(data.rates);
  } catch (error) {
    console.error("Currency conversion error:", error);
    setExchangeRates(null);
  } finally {
    setLoadingRate(false);
  }
}

getExchangeRates();

}, [displayCurrency, originalCurrency]);

let convertedMin = Number(salaryMin);
let convertedMax = Number(salaryMax);

if (
displayCurrency !== originalCurrency &&
exchangeRates &&
exchangeRates[displayCurrency]
) {
const rate = exchangeRates[displayCurrency];

convertedMin = Number(salaryMin) * rate;
convertedMax = Number(salaryMax) * rate;

}

function getCurrencySymbol(currency) {
if (currency === "PKR") return "Rs ";
if (currency === "USD") return "$";
if (currency === "EUR") return "€";
if (currency === "GBP") return "£";

return currency + " ";

}

return (
<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

  {/* Title */}
  <h3 className="text-2xl font-semibold text-gray-900">
    {title}
  </h3>

  {/* Company */}
  <div className="flex items-center gap-2 mt-2 text-gray-500">
    <Building2 size={16} />
    <span>{company}</span>
  </div>

  {/* Tags */}
  <div className="flex flex-wrap gap-3 mt-5">

    <span className="bg-green-100 text-green-700 text-sm px-4 py-1 rounded-full">
      {jobType}
    </span>

    <span className="bg-violet-100 text-violet-700 text-sm px-4 py-1 rounded-full">
      {category}
    </span>

  </div>

  {/* Bottom */}
  <div className="mt-8 flex items-end justify-between">

    {/* Location and Date */}
    <div>

      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <MapPin size={16} />
        {location}
      </div>

      <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
        <CalendarDays size={16} />
        {postedDate}
      </div>

    </div>

    {/* Salary */}
    <div className="text-right">

      <h2 className="text-2xl font-bold text-violet-600">

        {loadingRate
          ? "Converting..."
          : `${getCurrencySymbol(displayCurrency)}${convertedMin.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )} - ${getCurrencySymbol(displayCurrency)}${convertedMax.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )}`}

      </h2>

      {/* View Currency */}
      <div className="mt-2 flex items-center justify-end gap-2">

        <span className="text-xs text-gray-500">
          View in:
        </span>

        <select
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value)}
          className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
        >

          <option value="PKR">
            PKR
          </option>

          <option value="USD">
            USD
          </option>

          <option value="EUR">
            EUR
          </option>

          <option value="GBP">
            GBP
          </option>

        </select>

      </div>

      {/* Apply Button */}
      <Link
        href={href}
        className="mt-4 inline-block border border-violet-600 text-violet-600 px-6 py-2.5 rounded-xl hover:bg-violet-600 hover:text-white transition text-center"
      >
        Apply Now
      </Link>

    </div>

  </div>

</div>

);
}