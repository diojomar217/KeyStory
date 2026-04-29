"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  UserPlus,
} from "lucide-react";

type Totals = {
  total: number;
  yes: number;
  no: number;
  maybe: number;
  companions: number;
  totalAttendees?: number;
};

const statItems = (totals: Totals) => [
  {
    key: "attendees",
    label: "Total Attendees",
    value: totals.totalAttendees ?? totals.yes,
    icon: Users,
    iconWrap:
      "bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-emerald-600",
    valueText: "text-slate-900",
    border: "border-emerald-100/80",
  },
  {
    key: "total",
    label: "Total RSVPs",
    value: totals.total,
    icon: Users,
    iconWrap:
      "bg-gradient-to-br from-rose-100 via-white to-rose-50 text-rose-600",
    valueText: "text-slate-900",
    border: "border-rose-100/80",
  },
  {
    key: "yes",
    label: "Attending",
    value: totals.yes,
    icon: CheckCircle2,
    iconWrap:
      "bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-emerald-600",
    valueText: "text-slate-900",
    border: "border-emerald-100/80",
  },
  {
    key: "no",
    label: "Not Attending",
    value: totals.no,
    icon: XCircle,
    iconWrap:
      "bg-gradient-to-br from-rose-100 via-white to-red-50 text-rose-500",
    valueText: "text-slate-900",
    border: "border-rose-100/80",
  },
  {
    key: "maybe",
    label: "Maybe",
    value: totals.maybe,
    icon: Clock3,
    iconWrap:
      "bg-gradient-to-br from-amber-100 via-white to-amber-50 text-amber-600",
    valueText: "text-slate-900",
    border: "border-amber-100/80",
  },
  {
    key: "companions",
    label: "Companions",
    value: totals.companions,
    icon: UserPlus,
    iconWrap:
      "bg-gradient-to-br from-fuchsia-100 via-white to-pink-50 text-fuchsia-600",
    valueText: "text-slate-900",
    border: "border-fuchsia-100/80",
  },
];

export default function StatsCards({ totals }: { totals: Totals }) {
  const items = statItems(totals);

  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: index * 0.05 }}
            whileHover={{ y: -2, scale: 1.01 }}
            className={[
              "group relative overflow-hidden rounded-[24px] border",
              item.border,
              "bg-white/80 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]",
              "px-4 py-4",
            ].join(" ")}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_45%)] pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/80 shadow-sm",
                  item.iconWrap,
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  {item.label}
                </p>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <div className={`text-3xl font-semibold leading-none ${item.valueText}`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">
                    RSVP
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}