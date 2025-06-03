import React from 'react'
import { Routes, Route } from 'react-router-dom'
import App from '../App'
import AppLayouts from '../components/layouts/AppLayouts'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import CourseList from '../pages/CourseList'


export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<AppLayouts/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="courseList" element={<CourseList/>}/>
        </Route>

      </Routes>
    </div>
  )
}
