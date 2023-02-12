import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
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
        if (e.target.value === '' || !Number(e.target.value)) {
            setDifficulty(0)
            if (onDifficultyChange) {
                onDifficultyChange(0)
            }
            return
        }
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
    // return <></>
    return (
        <>
            <div className="max-w-sm w-min">
                <div className="border border-gray-400 rounded bg-lightSand rounded-b p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-8">
                        <p className="text-sm text-gray-600 flex items-center">
                            {assignment.course}
                        </p>
                        <div className="text-gray-900 font-bold text-xl mb-2">{assignment.name}</div>
                        <div className="text-gray-700 text-base">
                            <div className="flex flex-row gap-x-1">
                                <span className="font-bold pr-2"> Difficulty: </span>
                                {/* @ts-ignore */}
                                <button title="Increase" onClick={() => handleChangeDifficulty({ target: { value: difficulty - 1 } })} 
                                    className="text-darkBlue hover:text-gray-900"
                                    >
                                    <MinusIcon className="h-5 w-5" />
                                </button>
                                <input
                                    className="font-bold w-10 bg-lightSand text-darkBlue text-center"
                                    value={difficulty} 
                                    onChange={handleChangeDifficulty}
                                />
                                {/* @ts-ignore */}
                                <button title="Decrease" onClick={() => handleChangeDifficulty({ target: { value: difficulty + 1 } })} 
                                    className="text-darkBlue hover:text-gray-900">
                                    <PlusIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div>
                                <label className="font-bold pr-2"> Splittable? 
                                    <input
                                        type="checkbox"
                                        checked={splitable}
                                        className="form-checkbox rounded mx-2 h-5 w-5 text-white-900"
                                        onChange={handleSplittableChange}
                                        />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="text-sm">
                            {/* <p className="text-gray-900 leading-none">{assignment.user}</p> */}
                            <p className="text-gray-600">{assignment.due_date}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default AssignmentCard


// const alternate = () => (
// <div className="flex flex-col bg-darkSand rounded-lg shadow-lg p-4 items-center">
//              <h2 className="text-lg font-bold tracking-tight text-white-900 sm:text-xl">
//                  {assignment.course}: {assignment.name}
//              </h2>
//              <div className="flex flex-row justify-between my-1">
//                  {/* <h2 className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
//                      {assignment.course}
//                  </h2> */}
//                  <h2 className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
//                      {assignment.due_date}
//                  </h2>
//              </div>
//              <div className="flex flex-row justify-around w-full">
//                  <label className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
//                      <span>Splittable? </span>
//                      <input
//                          type="checkbox"
//                          checked={splitable}
//                          className="form-checkbox rounded h-5 w-5 text-white-900"
//                          onChange={handleSplittableChange}
//                      />
//                  </label>
//                  <label className="text-sm font-bold tracking-tight text-white-900 sm:text-xl">
//                      <span>Difficulty: </span>
//                      <input
//                          type="number"
//                          className="form-input h-5 w-20 text-black text-sm rounded"
//                          onChange={handleChangeDifficulty}
//                          value={difficulty}
//                      />
//                  </label>
//              </div>
           
//         </div>)