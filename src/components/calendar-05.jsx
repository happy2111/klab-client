"use client";
import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export default function Calendar05({ selected, onSelect }) {

  return (
    <Calendar
      mode="range"
      defaultMonth={selected?.from}
      selected={selected}
      onSelect={onSelect}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  );
}
