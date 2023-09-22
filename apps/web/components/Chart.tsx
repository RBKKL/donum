import React, { FC } from "react";
import {
  format,
  startOfDay,
  startOfHour,
  startOfMonth,
  subDays,
  subHours,
  subMonths,
} from "date-fns";
import { formatEther } from "ethers";
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
import { NewDonationEvent } from "@donum/contracts/types/DonationsStore";
import { StatFramePeriod } from "@donum/shared/constants";

interface ChartProps {
  donations: NewDonationEvent.OutputObject[];
  period: string;
  amountMode?: boolean;
}

const paramsByPeriod = {
  [StatFramePeriod.DAY]: {
    rangeLength: 24,
    sub: subHours,
    start: startOfHour,
    formatString: "hh:mm",
  },
  [StatFramePeriod.WEEK]: {
    rangeLength: 7,
    sub: subDays,
    start: startOfDay,
    formatString: "d.MM",
  },
  [StatFramePeriod.MONTH]: {
    rangeLength: 30,
    sub: subDays,
    start: startOfDay,
    formatString: "d.MM",
  },
  [StatFramePeriod.YEAR]: {
    rangeLength: 12,
    sub: subMonths,
    start: startOfMonth,
    formatString: "MM.yyyy",
  },
};

const Dot: FC<DotProps> = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={4} fill="#EAB308" />
);

const CustomTooltip: FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => (active ? <p>{payload?.[0]?.value}</p> : null);

export const Chart: FC<ChartProps> = ({ donations, period, amountMode }) => {
  if (!period) return <div />;

  const getData = () => {
    const params = paramsByPeriod[period as keyof typeof paramsByPeriod];

    const range: { [key: number]: bigint } = [...new Array(params.rangeLength)]
      .map((i, idx) => params.sub(params.start(Date.now()), idx).getTime())
      .reverse()
      .reduce((a, timestamp) => ({ ...a, [timestamp]: 0n }), {});

    donations.forEach((donation) => {
      const key = params
        .start(Number(donation.timestamp * 1000n)) // convert to ms
        .getTime() as keyof typeof range;

      if (range[key] !== undefined) {
        range[key] = range[key] + (amountMode ? donation.amount : 1n);
      }
    });

    return Object.keys(range).map((keyString) => {
      const key = Number(keyString);
      const amount = range[key as keyof typeof range];
      return {
        date: format(key, params.formatString),
        amount: amountMode ? Number(formatEther(amount)) : Number(amount),
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
