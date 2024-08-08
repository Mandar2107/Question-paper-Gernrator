import './App.css';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { AddUnit, Chapter, Dashboard, Home, Login, Register, Unit, GeneratePaper, QuestionPreview, Profile, PreviousPDF, PdfViewer, ForgotPassword, NotFound } from './screens'
import { getAuth } from 'firebase/auth'
import './style/style.css'
import StudentHome from './screens/StudentHome'
import AdminHome from'./screens/Dashboard'
import Profile1 from './screens/Profile1';
import AdminAddQuestion from './screens/AdminAddQuestion';
import QuestionBank from './screens/QuestionBank';
import QuestionList from './screens/QuestionList'
import Attendance from './components/Attendance';
function App() {

  const { id } = useParams(1)

  const auth = getAuth()
  const user = auth.currentUser;

  return (
    <BrowserRouter>

      <Routes>
        <Route index element={<Login />} path="/" />
        <Route index element={<Login />} path="/Login" />

        <Route index element={<PdfViewer />} path="/test/:id" />
        <Route element={<Register />} path="Register" />
        <Route element={<ForgotPassword />} path="Forgot" />
        <Route element={<PdfViewer />} path="Testing" />
        <Route element={<NotFound />} path="*" />


        <Route element={<Home />} path="Home" >
          <Route element={<Profile />} path="Profile" />
          <Route element={<Dashboard />} path="" />
          <Route element={<AddUnit />} path="AddUnit" />
          <Route element={<Unit />} path="Unit/:id" />
          <Route element={<Chapter />} path="Unit/:id/Chapter/:chapterId" />
          <Route element={<QuestionPreview />} path="Unit/:id/Chapter/:chapterId/Question/:qId?" />
          <Route element={<GeneratePaper />} path="Unit/:id/Generate" />
          <Route element={<PreviousPDF />} path="Unit/:id/Previous" />
        </Route>
        <Route path="/" element={<Register />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/Home" element={<AdminHome />} />
        <Route path='/profile1' element={<Profile1 />} />
        <Route path="/admin-add-question" element={<AdminAddQuestion />} />
       {/* // <Route path="/question-bank" element={<QuestionBank />} /> */}
          <Route path="screens/QuestionList" element={<QuestionList />} />
          <Route path="/question-bank" element={<QuestionList />} />
          <Route path="/attendance" element={<Attendance />} /> {/* Add this line */}
          



      </Routes>
    </BrowserRouter>
  );
}


export default App;
