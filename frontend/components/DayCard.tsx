import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
export type DayCardProps = {
    date: Date,
    percentage: number,
    assignments?: {
        course: string,
        difficulty: number,
        splittable: boolean,
        due_date: string,
        name: string,
        user: string,
        _id: string,
    }[],
    onPercentageChange?: (percentage: number) => void,
}
const DayCard = ({ date, percentage, assignments, onPercentageChange }: DayCardProps) => {
    const [showAssignments, setShowAssignments] = useState(false)
    const [allocatedPercentage, setAllocatedPercentage] = useState(percentage)

    const handleChangePercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '' || !Number(e.target.value)) {
            setAllocatedPercentage(0)
            if (onPercentageChange) {
                onPercentageChange(0)
            }
            return
        }
        const newPercent = parseInt(e.target.value)
        setAllocatedPercentage(newPercent)
        if (onPercentageChange) {
            onPercentageChange(newPercent)
        }
    }

    return (
        <>
            <div className="max-w-sm w-min">
                <div className="border border-gray-400 rounded bg-lightSand rounded-b p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-8">
                        <div className="text-gray-900 font-bold text-xl mb-2">{date.toDateString().slice(0,-5)}</div>
                        <div className="text-gray-700 text-base">
                            <div className="flex flex-row gap-x-1">
                                <span className="font-bold pr-2"> Percentage of Work: </span>
                                <button title="Increase" onClick={() => handleChangePercentage({ target: { value: percentage - 1 } })} >
                                    <MinusIcon className="h-5 w-5 text-darkBlue" />
                                </button>
                                <input
                                    className="font-bold w-10 bg-lightSand text-darkBlue text-center"
                                    value={percentage} 
                                    onChange={handleChangePercentage}
                                />
                                <button title="Decrease" onClick={() => handleChangePercentage({ target: { value: percentage + 1 } })} className="text-gray-600 hover:text-gray-900">
                                    <PlusIcon className="h-5 w-5 text-darkBlue" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="text-sm">
                            {/* <p className="text-gray-900 leading-none">{assignment.user}</p> */}
                            <p className="text-gray-600">{assignments?.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default DayCard

