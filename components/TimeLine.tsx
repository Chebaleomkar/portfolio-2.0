import { TimeLineData } from "@/utils/data";
import React from "react";

export const TimeLine = () => {
    return (
        <section className="container mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold mb-10 text-center">Timeline</h2>
            <div className="max-w-3xl mx-auto">
                {TimeLineData.map((item, index) => (
                    <div key={index} className="flex items-center justify-center mb-8">
                        <div className="w-24 flex-shrink-0 text-primary font-bold">
                            {item.year}
                        </div>
                        <div className="flex-1 ml-4 p-4 bg-card rounded-lg shadow  ">
                            {item.text}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
