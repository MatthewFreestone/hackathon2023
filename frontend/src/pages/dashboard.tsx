import HwNavBar from "components/HwNavBar";
import Head from "next/head";
import Image from "next/image";
import DatePicker from 'tailwind-datepicker-react'
import AssignmentCard from "components/AssignmentCard";
import DayCard from "components/DayCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

type Assignment = {
    course: string,
    difficulty: number,
    splittable: boolean,
    due_date: string,
    name: string,
    user: string,
    _id: string,
}

type WorkDay = {
    date: Date,
    percentage: number,
    assignments?: Assignment[],
}

const Dashboard = () => { 
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    const router = useRouter()
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const [startDate, setStartDate] = useState<Date>(currentDate)
    const [endDate, setEndDate] = useState<Date>(currentDate)
    const [anchorDate, setAnchorDate] = useState<Date>(currentDate)

    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false)
    const [showAnchorDatePicker, setShowAnchorDatePicker] = useState<boolean>(false)

    const [endDateInvalid, setEndDateInvalid] = useState<boolean>(false)

    const [assignments, setAssignments] = useState<Assignment[]>([])

    const [workDays, setWorkDays] = useState<WorkDay[]>([])

    const [totalWorkPercentage, setTotalWorkPercentage] = useState<Number>(0)
    const [validWorkPercentage, setValidWorkPercentage] = useState<boolean>(true)

    useEffect(() => {
        if (workDays){
            const percentages = workDays.map((workDay) => workDay.percentage)
            setTotalWorkPercentage(percentages.reduce((a, b) => a + b, 0))
            setValidWorkPercentage(percentages.reduce((a, b) => a + b, 0) === 100)
        }
    }, [workDays])


    useEffect(() => {
        // console.log("startDate: ", startDate)
        // console.log("endDate: ", endDate)
        // console.log("anchorDate: ", anchorDate)
        if (!startDate || !endDate || !anchorDate || endDate < startDate || anchorDate > startDate ) {
            console.log("Selected Dates are Invalid")
            setEndDateInvalid(true)
        } else {
            setEndDateInvalid(false)
        }
    }, [endDate, startDate, anchorDate])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/signin')
        }
        const dest = `${BACKEND_URL}/loaddata?token=${token}`
        axios.get(dest)
        .then((res) => {
            if (res.data.error) {
                console.error("Invalid or Missing Token")
                return
            }
            console.log(res.data)
            setAssignments(res.data.assignments)
        })
        .catch((err) => {
            console.log(err)
        }
        )
    }, [])

    useEffect(() => {
        console.log(assignments)
    }, [assignments])

    const updateAssignments = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/signin')
        }
        let ids = ""
        let difficulties = ""
        let splittables = ""
        assignments.map((assignment) => {
            ids += assignment._id + ","
            difficulties += assignment.difficulty + ","
            splittables += (assignment.splittable || 'false') + ","
        })
        if (ids){
            // remove trailing comma
            ids = ids.slice(0, -1)
            difficulties = difficulties.slice(0, -1)
            splittables = splittables.slice(0, -1)
            const dest = `${BACKEND_URL}/setassignments?token=${token}&ids=${ids}&difficulties=${difficulties}&splittables=${splittables}`
            axios.post(dest)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
        }
    }

    const updateCalendar = () => {
        const token = localStorage.getItem('token')
        const month_year_day = anchorDate.toLocaleString('default', { month: '2-digit', day: '2-digit', year: 'numeric' }).split('/')
        const anchor =  month_year_day[2] + '-' + month_year_day[0] + '-' + month_year_day[1]
        const work_days = startDate.getDate() - anchorDate.getDate()
        const vacation_days = endDate.getDate() - startDate.getDate() + 1
        
        const destination = `${BACKEND_URL}/setcalendar?anchor=${anchor}&work_days=${work_days}&vacation_days=${vacation_days}&token=${token}`
        console.log(`Sending request to ${destination}`)
        axios.post(destination).then((res) => {
            if (res.data.error) {
                console.error("Error in updating calendar")
                return
            }
            console.log(res.data)
            createWorkDayCards(res.data.percents)
            localStorage.setItem('anchorDate', anchorDate.toJSON())
            console.log(workDays)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const datepickerOptions = {
        title: "",
        autoHide: false,
        todayBtn: true,
        clearBtn: true,
        theme: {
            background: endDateInvalid ? "bg-red-500" : "bg-white",
            todayBtn: "",
            clearBtn: "",
            icons: "",
            text: "",
            disabledText: "",
            input: "bg-white",
            inputIcon: "",
            selected: "",
        },
        datepickerClassNames: "top-12",
        language: "en",
    }

    const createWorkDayCards = (percentages: number[]) => {
        let new_workdays: WorkDay[] = []
        // find days between anchorDate and startDate
        for (let i = 0; i < percentages.length; i++) {
            const date = new Date(anchorDate)
            date.setDate(date.getDate() + i)
            new_workdays.push({
                date: date,
                percentage: percentages[i],
                assignments: [],
            })
        }
        setWorkDays(new_workdays)
    }

    const handleSearch = () => {
        if (endDateInvalid) {
            return
        }
        updateAssignments()
        updateCalendar()
        document.location.href = '#availability'
    }

    const handleSubmitPercentage = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/signin')
        }
        const percentages = workDays.map((workDay) => workDay.percentage)
        const destination = `${BACKEND_URL}/setpercentages?token=${token}&percentages=${percentages}`
        axios.post(destination).then((res) => {
            if (res.data.error) {
                console.error("Error in updating percentages")
                return
            }
            console.log(res.data)
            router.push('/results')
        }).catch((err) => {
            console.log(err)
        }
        )
    }

    return (
        <>
            <Head>
                <title>Vacation Planner</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col items-center w-full min-h-screen ">
                <HwNavBar currentTab="Dashboard"/>
                <div className="absolute -z-10">
                    <Image unoptimized src="/dalleImg.png" alt="hero" width={718} height={718} className="blur-3xl scale-x-[2.3] scale-150 opacity-80 " />
                    <Image unoptimized src="/dalleImg.png" alt="hero" width={718} height={718} className="blur-3xl scale-x-[2.3] scale-150 opacity-80 " />
                </div>
                <div className="mt-24 my-8 opacity-100 w-full sm:px-10 px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center my-2">
                        Upcoming Assignments
                    </h2>
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4"> */}
                    <div className="flex justify-center flex-wrap gap-10">
                        {assignments && assignments.length !== 0 && assignments.map((assignment) => {
                            return (
                                <div className="flex justify-center" key={assignment._id}>
                                    <AssignmentCard
                                        assignment={assignment}
                                        onDifficultyChange={(value) => {
                                            console.log("Changing difficulty of ", assignment.name, " to ", value)
                                            assignment.difficulty = value
                                        }}
                                        onChangeSplitable={(value) => {
                                            console.log("Changing splittable of ", assignment.name, " to ", value)
                                            assignment.splittable = value
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {assignments.length === 0 && (

                        <div className="flex flex-col items-center justify-center w-full">
                            <h2 className="text-2xl font-bold tracking-tight text-center text-gray-400 sm:text-3xl my-2">
                                Loading Assignments ...
                            </h2>
                        </div>)
                    }

                </div>
                <div className="relative flex flex-col items-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white-900 sm:text-4xl">
                        I want to take a vacation on
                    </h2>
                    <div className="flex flex-row gap-x-5 items-center mt-4">
                        <div>
                            <DatePicker
                                options={datepickerOptions}
                                // @ts-ignore
                                value={startDate}
                                onChange={(date) => setStartDate(date)}
                                setShow={(value) => setShowStartDatePicker(value)}
                                show={showStartDatePicker}
                            />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-white-900 sm:text-2xl">
                            to
                        </h2>
                        <div>
                            <DatePicker
                                options={datepickerOptions}
                                // @ts-ignore
                                value={endDate}
                                onChange={(date) => setEndDate(date)}
                                setShow={(value) => setShowEndDatePicker(value)}
                                show={showEndDatePicker}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-5">
                        <h2 className="text-lg font-bold tracking-tight text-white-900 sm:text-xl">
                            And I want to start doing extra work on 
                        </h2>
                        <div className="mt-2">
                            {/* anchor date picker */}
                            <DatePicker
                                options={datepickerOptions}
                                // @ts-ignore
                                value={anchorDate}
                                onChange={(date) => setAnchorDate(date)}
                                setShow={(value) => setShowAnchorDatePicker(value)}
                                show={showAnchorDatePicker}
                            />
                        </div>
                    </div>
                    <button 
                        className={`rounded-md lg:px-5 lg:py-3 px-3.5 py-1.5 
                            text-base font-semibold leading-7 text-white shadow-sm
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                            focus-visible:outline-white mt-4 ${endDateInvalid ? "cursor-not-allowed bg-red-500 border-white border disabled " : " bg-darkBlue  hover:bg-lightBlue "}`}
                        onClick={() => {!endDateInvalid && handleSearch()}}
                    >
                        {endDateInvalid ? "Selected Dates are Invalid": "Calculate my work distribution"}
                    </button>
                </div>
                <div className="mt-24 my-8 opacity-100 w-full sm:px-10 px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center my-2">
                        Work Distribution
                    </h1>
                    <a id="availability" className="relative -top-32"></a>
                    <div className="flex flex-row flex-wrap gap-2 justify-center">
                        {workDays.length !== 0 && workDays.map((workDay) => {                        
                            return (
                                <DayCard
                                    date={workDay.date}
                                    percentage={workDay.percentage}
                                    key={workDay.date.toString()}
                                    onPercentageChange={(value) => {
                                        // console.log("Changing percentage of ", workDay.date, " to ", value)
                                        setWorkDays((prev) => {
                                            return prev.map((day) => {
                                                if (day.date.toString() === workDay.date.toString()) {
                                                    return {
                                                        ...day,
                                                        percentage: value,
                                                    }
                                                }
                                                return day
                                            })
                                        })
                                    }}
                                />
                            )
                        })}
                    </div>
                    <div>
                        {workDays.length === 0 && (
                            <div className="flex flex-col items-center justify-center w-full">
                                <h2 className="text-2xl font-bold tracking-tight text-center text-gray-400 sm:text-3xl my-2">
                                    Loading Work Distribution ...
                                </h2>
                            </div>
                        )}
                        {workDays.length !== 0 && (
                            <div className="flex flex-col items-center justify-center w-full mt-4">
                                <div className="text-2xl font-bold tracking-tight text-center sm:text-3xl my-2">
                                    <span>Total Work Percentage: </span>
                                    <span className={validWorkPercentage ? "text-green-500":"text-red-500"}>
                                         {`${totalWorkPercentage}%`}</span>
                                </div>
                                <div>
                                    <button
                                         className={`rounded-md lg:px-5 lg:py-3 px-3.5 py-1.5 
                                         text-base font-semibold leading-7 text-white shadow-sm
                                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                         focus-visible:outline-white mt-4 ${!validWorkPercentage ? "cursor-not-allowed bg-red-500 border-white border disabled " : " bg-darkBlue  hover:bg-lightBlue "}`}
                                     
                                        onClick={validWorkPercentage ? handleSubmitPercentage: () => {}}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
            </main>
        </>
    );
    };


export default Dashboard;