import axios from "axios"
import apiBase from "./blog"

export const AccountAPI =  {
    register: (value) => {
        const result = axios.post(`${apiBase}/Account/register`,
            value
        )
        return result
    },

    login: (value) => {
        axios.post(`${apiBase}/Account/login`,
            value
        )
        .then((response)=> {
            console.log(response)
        })
    } 
}