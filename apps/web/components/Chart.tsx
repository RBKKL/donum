import React, { FC } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  DotProps,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  format,
  startOfDay,
  startOfHour,
  startOfMonth,
  subDays,
  subHours,
  subMonths,
} from "date-fns";
import { NewDonationEventObject } from "@donum/contracts/types/DonationsStore";
import {
  DAY_IN_MS,
  MONTH_IN_MS,
  WEEK_IN_MS,
  YEAR_IN_MS,
} from "@donum/shared/constants";

interface ChartProps {
  donations: NewDonationEventObject[];
  period: number;
}

const paramsByPeriod = {
  [DAY_IN_MS]: {
    rangeLength: 24,
    sub: subHours,
    start: startOfHour,
    formatString: "hh:mm",
  },
  [WEEK_IN_MS]: {
    rangeLength: 7,
    sub: subDays,
    start: startOfDay,
    formatString: "d.MM",
  },
  [MONTH_IN_MS]: {
    rangeLength: 30,
    sub: subDays,
    start: startOfDay,
    formatString: "d.MM",
  },
  [YEAR_IN_MS]: {
    rangeLength: 24,
    sub: subMonths,
    start: startOfMonth,
    formatString: "MM.yyyy",
  },
};

const Dot: FC<DotProps> = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={4} fill="#EAB308" />
);

const CustomTooltip: FC<TooltipProps<number, string>> = ({ active, payload }) =>
  active ? <p>{`${payload?.[0]?.name}: ${payload?.[0]?.value}`}</p> : null;

export const Chart: FC<ChartProps> = ({ donations, period }) => {
  if (!period) return <div />;

  const getData = () => {
    const params = paramsByPeriod[period as keyof typeof paramsByPeriod];

    const range = [...new Array(params.rangeLength)]
      .map((i, idx) => params.sub(params.start(Date.now()), idx).getTime())
      .reverse()
      .reduce((a, timestamp) => ({ ...a, [timestamp]: 0 }), {});

    donations.forEach((donation) => {
      const key = params
        .start(donation.timestamp.mul(1000).toNumber())
        .getTime() as keyof typeof range;
      if (range[key] !== undefined) {
        range[key]++;
      }
    });

    return Object.keys(range).map((key) => ({
      date: format(Number(key), params.formatString),
      amount: range[key as keyof typeof range],
    }));
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={getData()} margin={{ right: 55 }}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#18181B" />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" angle={-10} stroke="#FFFFFF" />
        <YAxis stroke="#FFFFFF" />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid stroke="#3F3F46" opacity={0.5} />
        <Area
          isAnimationActive={false}
          type="monotone"
          dataKey="amount"
          stroke="#EAB308"
          strokeWidth={4}
          fillOpacity={0.1}
          fill="url(#gradient)"
          dot={<Dot />}
          activeDot={<Dot />}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
