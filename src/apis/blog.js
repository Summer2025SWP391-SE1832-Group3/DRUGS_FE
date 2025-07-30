import axios from "axios"
const apiBase = "https://localhost:7045/api"
export const BlogAPI = {
    getAll: () => {
        const result = axios.get(`${apiBase}/Blog`)
        .then((response) => {
            console.log("Blog list", response.data)
        })
        return result
    }
}

export default apiBase