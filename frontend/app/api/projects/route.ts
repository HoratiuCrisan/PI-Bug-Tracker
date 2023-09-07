import Cookies from 'js-cookie'

interface ProjectProps {
    project: Project
}

interface Project {
    title: string,
    description: string,
    status: string,
    priority: string,
    projectManager: string,
    deadline: Date,
    finishDate: Date,
    creationDate: Date
}

interface Members {
    pid: string,
    members: string[] | undefined
}

interface ItemIdToDelete {
    itemIdToDelete: number | null
}

interface ItemTitleToDelete {
    itemTitleToDelete: string | null
}

interface MyProject {
    email: string
}

const CreateProjectApi = async({project} : ProjectProps) => {
    try {
        const response =  await fetch("https://localhost:7181/api/Project/Create-Project", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "title": project.title,
                "description": project.description,
                "status": project.status,
                "priority": project.priority,
                "projectManager": project.projectManager,
                "creationDate": project.creationDate,
                "deadline": project.deadline,
                "finishDate": project.finishDate
            })
        })
        return response
    } catch (error) {
        console.error("Failed to create project:\n", error)
    }
}

export const AddUserProjectId = async(createPID:Members) => {
    
    try {
        const response = await fetch("https://localhost:7181/api/Project/Add-User-Id", {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                "pid": createPID.pid,
                "members": createPID.members
            })
        })
        return response
    } catch (error) {
        console.error("Failed to add PID\n", error)
    }
}

export const GetProjects = async() => {
    try {
        const response = await fetch("https://localhost:7181/api/Project/Get-Projects", {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json"
            }
        })

        if (response.ok)
            return JSON.parse(await response.text())
    } catch (error) {
        console.error("Failed to fetch projects")
    }
}

export const GetArchivedProjects = async() => {
    try {
        const response = await fetch("https://localhost:7181/api/Project/Get-Archived-Projects", {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        if (response.ok)
            return JSON.parse(await response.text())
    } catch (error) {
        console.error("Failed to fetch projects")
    }
}

export const GetMyProject = async ({email} : MyProject) => {
    try {
        const response = await fetch("https://localhost:7181/api/Project/Get-My-Project/" + email, {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json"
            }
        })
        if (response.ok)
            return JSON.parse(await response.text())
    } catch (error) {
        console.error("Failed to fetch projects")
    }
} 

export const DeleteProject = async ({itemIdToDelete} : ItemIdToDelete) => {
    try {
        const response = await fetch("https://localhost:7181/api/Project/Delete-Project/" + itemIdToDelete, {
            method: 'DELETE',
            headers: {
                "Content-Type" : "application/json"
            }
        })
        if (response.ok)
            return "deleted"
    } catch (error) {
        console.error("Failed to fetch projects")
    }
} 

export const RemovePID = async ({itemTitleToDelete}:ItemTitleToDelete) => {
    try {
        const response = await fetch("https://localhost:7181/api/Project/Remove-ProjectId/" + itemTitleToDelete, {
            method: 'PUT', 
            headers: {
                'Content-Type' : "application/json"
            }
        })

        if (response.ok)
            return "pid deleted"
    } catch (error) {
        console.error("Failed to remove pid\n", error)
    }
}

export const CompleteProject = async ({prop} : any) => {
    try {
        const response = await fetch("https://localhost:7181/api/Project/Complete-Project/" + prop.pid, {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json"
            }
        })
        if (response.ok)
            return "deleted"
    } catch (error) {
        console.error("Failed to fetch projects")
    }
} 

export const ArchiveProject = async ({prop} : any) => {
    try {
        const response = await fetch("https://localhost:7181/api/Project/Archive-Project/" + prop.pid, {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json"
            }
        })
        if (response.ok)
            return "deleted"
    } catch (error) {
        console.error("Failed to fetch projects")
    }
} 

export default CreateProjectApi; 