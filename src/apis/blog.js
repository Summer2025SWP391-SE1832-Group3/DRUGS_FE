import axios from "axios"

export default apiBase = "https://localhost:7045/api"
export const BlogAPI = {
    getAll: () => {
        const result = axios.get(`${apiBase}/Blog`)
        .then((response) => {
            console.log("Blog list", response.data)
        })
        return result
    }
}