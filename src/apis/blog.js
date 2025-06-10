import axios from "axios"

export const BlogAPI = {
    getAll: () => {
        const result = axios.get("https://localhost:7045/api/Blog")
        .then((response) => {
            console.log("Blog list", response.data)
        })
        return result
    }
}