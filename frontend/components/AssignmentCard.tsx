import { useState } from "react"
export type AssignmentCardProps = {
    assignment: {
        course: string,
        difficulty: number,
        splittable: boolean,
        due_date: string,
        name: string,
        user: string,
        _id: string,
    },
    onChangeSplitable?: (value: boolean) => void,
    onDifficultyChange?: (value: number) => void,
}
const AssignmentCard = ({ assignment, onChangeSplitable, onDifficultyChange }: AssignmentCardProps) => {
    const [difficulty, setDifficulty] = useState<number>(assignment.difficulty)
    const [splitable, setSplitable] = useState<boolean>(assignment.splittable)

    const handleChangeDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDifficulty = parseInt(e.target.value)
        setDifficulty(newDifficulty)
        if (onDifficultyChange) {
            onDifficultyChange(newDifficulty)
        }
    }

    const handleSplittableChange = () => {
        const newSplitable = !splitable
        setSplitable(newSplitable)
        if (onChangeSplitable) {
            onChangeSplitable(newSplitable)
        }
    }
    return (
        <div className="flex flex-col bg-darkSand rounded-lg shadow-lg p-4 items-center">
            <h2 className="text-lg font-bold tracking-tight text-white-900 sm:text-xl">
                {assignment.course}: {assignment.name}
            </h2>
            <div className="flex flex-row justify-between my-1">
                {/* <h2 className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
                    {assignment.course}
                </h2> */}
                <h2 className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
                    {assignment.due_date}
                </h2>
            </div>

            <div className="flex flex-row justify-around w-full">
                <label className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
                    <span>Splittable? </span>
                    <input
                        type="checkbox"
                        className="form-checkbox rounded h-5 w-5 text-white-900"
                        value={splitable}
                        onChange={handleSplittableChange}
                    />
                </label>
                <label className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
                    <span>Difficulty: </span>
                    <input
                        type="number"
                        className="form-input h-5 w-20 text-black text-sm rounded"
                        onChange={handleChangeDifficulty}
                        value={difficulty}
                    />
                </label>
            </div>
           
        </div>
    )
}

export default AssignmentCard