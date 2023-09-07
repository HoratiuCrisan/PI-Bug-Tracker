import Cookies from "js-cookie"

interface Props {
    email: string
}

const fetchUsers = async () => {
    try {
        const response = await fetch("https://localhost:7181/api/User/Get-Users", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })

        if (response.ok)
            return JSON.parse(await response.text())
    }catch (error) {
        console.error("Failed to fetch users: \n", error)
    }
}

export const MakeAdmin = async ({email}:Props) => {
    try {
        const response = await fetch("https://localhost:7181/api/Auth/Make-Admin", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
                "email": email
            })
        })
        if (response.ok)
            return "User is admin"
    } catch (error) {
        console.error("Failed to make admin", error)
    }
}

export const MakeDeveloper = async ({email}:Props) => {
    try {
        const response = await fetch("https://localhost:7181/api/Auth/Make-Developer", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
                "email": email
            })
        })
        if (response.ok)
            return "User is developer"
    } catch (error) {
        console.error("Failed to make admin", error)
    }
}

export const MakeProjectManager = async ({email}:Props) => {
    try {
        const response = await fetch("https://localhost:7181/api/Auth/Make-Project-Manager", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
                "email": email
            })
        })
        if (response.ok)
            return "User is now a project manager"
    } catch (error) {
        console.error("Failed to make admin", error)
    }
}



export default fetchUsers