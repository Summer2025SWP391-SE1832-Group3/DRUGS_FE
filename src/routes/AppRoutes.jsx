import React from 'react'
import { Routes, Route } from 'react-router-dom'
import App from '../App'
import AppLayouts from '../components/layouts/AppLayouts'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import CourseList from '../pages/course/CourseList'
import BlogManager from '../pages/blog/BlogManager'
import AccountListAdmin from '../pages/AccountListAdmin'

import BlogList from '../pages/blog/BlogList'
import BlogDetails from '../pages/blog/BlogDetails'
import BlogByUserId from '../pages/blog/BlogByUserId'
import ManageCourse from '../pages/course/ManageCourse'
import ManageSurvey from '../pages/survey/ManageSurvey'
import SurveyList from '../pages/survey/SurveyList'
import SubmitSurvey from '../pages/survey/SubmitSurvey'
import SurveyResult from '../pages/survey/SurveyResult'
import CourseDetailsMember from '../pages/course/CourseDetailsMember'
import CourseDetailsManage from '../pages/course/CourseDetailsManage'
import MemberCourses from '../pages/course/MemberCourses'

export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<AppLayouts/>}>
          <Route index element={<Home/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="accountListAdmin" element={<AccountListAdmin/>}/>
          {/* Course */}
          <Route path="courseList" element={<CourseList/>}/>
          <Route path="manageCourse" element={<ManageCourse/>}/>
          <Route path="courseDetailsMember/:id" element={<CourseDetailsMember/>}/>
          <Route path="courseDetailsManage/:id" element={<CourseDetailsManage/>}/>
          <Route path="memberCourses/:userId" element={<MemberCourses/>}/>
          {/* Blog */}
          <Route path="blogManager" element={<BlogManager/>}/>
          <Route path="blogList" element={<BlogList/>}/>
          <Route path="blogDetails/:id" element={<BlogDetails/>}/>
          <Route path="blogByUserId/:userId" element={<BlogByUserId/>}/>
          {/* Survey */}
          <Route path="manageSurvey" element={<ManageSurvey/>}/>
          <Route path="surveyList" element={<SurveyList/>}/>
          <Route path="survey/do/:id" element={<SubmitSurvey/>}/>
          <Route path="survey/result/:id" element={<SurveyResult/>}/>
        </Route>

      </Routes>
    </div>
  )
}