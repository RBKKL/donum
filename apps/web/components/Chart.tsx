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
import { formatEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { Periods } from "@donum/shared/constants";

interface ChartProps {
  donations: NewDonationEventObject[];
  period: string;
  amountMode?: boolean;
}

const paramsByPeriod = {
  [Periods.DAY]: {
    rangeLength: 24,
    sub: subHours,
    start: startOfHour,
    formatString: "hh:mm",
  },
  [Periods.WEEK]: {
    rangeLength: 7,
    sub: subDays,
    start: startOfDay,
    formatString: "d.MM",
  },
  [Periods.MONTH]: {
    rangeLength: 30,
    sub: subDays,
    start: startOfDay,
    formatString: "d.MM",
  },
  [Periods.YEAR]: {
    rangeLength: 12,
    sub: subMonths,
    start: startOfMonth,
    formatString: "MM.yyyy",
  },
};

const Dot: FC<DotProps> = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={4} fill="#EAB308" />
);

const CustomTooltip: FC<TooltipProps<number, string>> = ({ active, payload }) =>
  active ? <p>{payload?.[0]?.value}</p> : null;

export const Chart: FC<ChartProps> = ({ donations, period, amountMode }) => {
  if (!period) return <div />;

  const getData = () => {
    const params = paramsByPeriod[period as keyof typeof paramsByPeriod];

    const range: { [key: number]: BigNumber } = [
      ...new Array(params.rangeLength),
    ]
      .map((i, idx) => params.sub(params.start(Date.now()), idx).getTime())
      .reverse()
      .reduce((a, timestamp) => ({ ...a, [timestamp]: BigNumber.from(0) }), {});

    donations.forEach((donation) => {
      const key = params
        .start(donation.timestamp.mul(1000).toNumber())
        .getTime() as keyof typeof range;

      if (range[key] !== undefined) {
        range[key] = range[key].add(amountMode ? donation.amount : 1);
      }
    });

    return Object.keys(range).map((keyString) => {
      const key = Number(keyString);
      const amount = range[key as keyof typeof range];
      return {
        date: format(key, params.formatString),
        amount: amountMode ? Number(formatEther(amount)) : amount.toNumber(),
      };
    });
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
        <YAxis
          stroke="#FFFFFF"
          domain={[0, (dataMax: number) => (dataMax * 1.1).toFixed(3)]}
        />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid stroke="#3F3F46" opacity={0.5} />
        <Area
          isAnimationActive={false}
          type="monotone"
          dataKey="amount"
          stroke="#EAB308"
          strokeWidth={2}
          fillOpacity={0.1}
          fill="url(#gradient)"
          dot={<Dot />}
          activeDot={<Dot />}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
