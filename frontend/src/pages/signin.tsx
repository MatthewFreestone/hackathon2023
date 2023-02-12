import { LockClosedIcon } from '@heroicons/react/20/solid'
import { SunIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'next'

export default function signin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: any) => {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        // key error: invalid username
        // token: value

        e.preventDefault()
        const dest = `${BACKEND_URL}/login?username=${username}&password=${password}`
        console.log(dest)
        axios.post(dest).then((res) => {
            if (res.data.error) {
                alert("Bad User or Password")
                return
            }
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('username', username)
            document.location.href = '/dashboard'
        })
        .catch((err) => {
            console.log(err)
        })
    }
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <Image src="/dalleImg.png" alt="hero" width={718} height={718} className="absolute w-screen h-screen blur-2xl opacity-80"/>
      <div className=" relative flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            {/* <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            /> */}
            <SunIcon className='mx-auto h-16 w-auto text-darkSand'/>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-darkSand">
              Sign in to your account
            </h2>
           
          </div>
          <form className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-lightSand focus:outline-none focus:ring-lightSand sm:text-sm"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-lightSand focus:outline-none focus:ring-lightSand sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-darkSand focus:ring-lightSand"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200 font-semibold">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a onClick={() => alert("Hope you remember it!")} className="font-medium text-white hover:text-lightSand hover:cursor-pointer">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-darkSand py-2 px-4 text-sm font-lg text-black font-semibold hover:bg-lightSand hover:text-darkSand focus:outline-none focus:ring-2 focus:ring-lightSand focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-black group-hover:text-darkSand" aria-hidden="true" />
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
