import React from 'react'
import { Routes, Route } from 'react-router-dom'
import App from '../App'
import AppLayouts from '../components/layouts/AppLayouts'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import CourseList from '../pages/course/CourseList'
import BlogManager from '../pages/BlogManager'


export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<AppLayouts/>}>
          <Route index element={<Home/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path= "profile" element={<Profile/>}/>
          <Route path="courseList" element={<CourseList/>}/>
          <Route path="blogManager" element={<BlogManager/>}/>
        </Route>

      </Routes>
    </div>
  )
}