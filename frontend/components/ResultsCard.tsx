import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
export type DayCardProps = {
    date: Date,
    assignments?: string[],
}
const ResultsCard = ({ date, assignments }: DayCardProps) => {

    return (
        <>
            <div className="max-w-sm">
                <div className="border border-gray-400 rounded bg-lightSand rounded-b p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-2">
                        <div className="text-gray-900 font-bold text-xl mb-2">{date.toDateString().slice(0,-5)}</div>
                    </div>
                    <div className="flex items-center">
                        <ol className="text-sm text-black">
                            {assignments?.map((assignment, index) => {
                                return <li key={index}>{index+1}: {assignment}</li>
                            })
                            }
                        </ol>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ResultsCard

