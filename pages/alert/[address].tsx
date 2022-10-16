import { NextPage } from "next";
import { ResponsiveImage } from "@components/ResponsiveImage";

const AlertPage: NextPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center bg-green-screen">
      <ResponsiveImage src="/assets/images/default_avatar.gif" />
      <h1 className="text-center pt-2.5 text-yellow-500 text-3xl font-bold text-border-2">
        0x5F...0aa3 sent 0.001 ETH
      </h1>
      <p className="text-center pt-2.5 text-zinc-50 text-border-1 leading-none text-xl">
        100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это
        хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном
        общежитии с тараканами, клопами и одинокой мышью в духовке, а моим
        соседом был татуировщик Саня из Северобайкальск
      </p>
    </div>
  );
};

export default AlertPage;
