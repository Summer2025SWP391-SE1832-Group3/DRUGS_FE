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
import CreateAccountAdmin from '../pages/CreateAccountAdmin'
import AccountListAdmin from '../pages/AccountListAdmin'

import BlogList from '../pages/blog/BlogList'
import BlogDetails from '../pages/blog/BlogDetails'
import BlogByUserId from '../pages/blog/BlogByUserId'
import ManageCourse from '../pages/course/ManageCourse'


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
          <Route path="blogList" element={<BlogList/>}/>
          <Route path="blogDetails/:id" element={<BlogDetails/>}/>
          <Route path="blogByUserId/:userId" element={<BlogByUserId/>}/>
          <Route path="createAccountAdmin" element={<CreateAccountAdmin/>}/>
          <Route path="accountListAdmin" element={<AccountListAdmin/>}/>
       
          <Route path="manageCourse" element={<ManageCourse/>}/>
        </Route>

      </Routes>
    </div>
  )
}