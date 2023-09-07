"use client"
import {useRouter} from 'next/navigation'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

/* If there is no token in the cookies redirect user to Login Page */

const ProtectedRoute = ({children}:any ) => {
    const router = useRouter()

    useEffect(() => {
        const storedToken = Cookies.get('token')

        if (!storedToken)
            router.push("/Login")
    }, [])

    return children
}

export default ProtectedRoute