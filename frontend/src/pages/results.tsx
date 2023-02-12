import HwNavBar from "components/HwNavBar"
import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import ResultsCard from "components/ResultsCard"
import DayCard from "components/DayCard"

type WorkDay = {
    date: Date,
    assignments?: string[],
}

const results = () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    const [results, setResults] = useState([])
    const router = useRouter()
    const [anchorDate, setAnchorDate] = useState<Date>(new Date())
    const [dayCards, setDayCards] = useState<WorkDay[]>([])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (localStorage.getItem('anchorDate')) {
            setAnchorDate(new Date(localStorage.getItem('anchorDate')))
        }
        if (!token) {
            router.push('/signin')
        }
        const dest = `${BACKEND_URL}/getschedule?token=${token}`
        axios.get(dest).then((res) => {
            if (res.data.error) {
                alert("Bad User or Password")
                return
            }
            console.log(res.data)
            setResults(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        if (results.length === 0) return
        // console.log(results)
        let wordDays: WorkDay[]  = []
        let day = new Date(anchorDate)
        for (let [key, value] of Object.entries(results)) {
            let c_day = new Date(day)
            c_day.setDate(c_day.getDate() + parseInt(key))
            wordDays.push({
                date: c_day,
                assignments: value
            })
        }
        setDayCards(wordDays)
    }, [results, anchorDate])


    return (
        <>
        <Head>
            <title>Vacation Planner</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col items-center w-full min-h-screen ">
            <HwNavBar />
            <div className="absolute -z-10">
                <Image src="/dalleImg.png" alt="hero" width={718} height={718} className="blur-3xl scale-x-[2.3] scale-150 opacity-80 " />
            </div>
            <div className="relative w-full lg:px-8 px-6 mt-32">
                <h1 className="text-4xl font-bold text-center my-4" 
                >
                    Your Study Plan</h1>
                <div className="flex flex-row gap-2 flex-wrap justify-center">
                    {dayCards.map((day, index) => {
                        return <ResultsCard key={index} date={day.date} assignments={day.assignments} />
                    })
                    }
                </div>
            </div>
        </main>
        </>
    )
}

export default results