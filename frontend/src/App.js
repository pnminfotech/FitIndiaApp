// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AdminRoutes from './routes/AdminRoutes';
// import UserRoutes from './routes/UserRoutes';
// import CoachRoutes from './routes/CoachRoutes';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Default route: redirect root "/" to /user/homepage */}
//         <Route path="/" element={<Navigate to="/user/homepage" />} />

//         {/* Admin routes accessible only via /admin/* */}
//         <Route path="/admin/*" element={<AdminRoutes />} />

//         {/* User routes */}
//         <Route path="/user/*" element={<UserRoutes />} />

//         {/* Coach routes */}
//         <Route path="/coach/*" element={<CoachRoutes />} />

//         {/* Catch-all: redirect any unknown URL to /user/homepage */}
//         <Route path="*" element={<Navigate to="/user/homepage" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AdminRoutes from './routes/AdminRoutes';
// import UserRoutes from './routes/UserRoutes';
// import CoachRoutes from './routes/CoachRoutes';

// function App() {
//   return (
//     <Router basename="/"> {/* Change to "/" if hosting at root */}
//        {/* <Router basename="/GetFitIndia_1">  */}
//       <Routes>
//         <Route path="/admin/*" element={<AdminRoutes />} />
//         <Route path="/user/*" element={<UserRoutes />} />
//         <Route path="/coach/*" element={<CoachRoutes />} />
//         <Route path="*" element={<Navigate to="/user/homepage" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import CoachRoutes from './routes/CoachRoutes';
import TermsAndConditions from './pages/user/TermsAndConditions';
import PrivacyPolicy from './pages/user/PrivacyPolicy';
function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* Default root → user homepage */}
        <Route path="/" element={<Navigate to="/user/homepage" />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* User routes */}
        <Route path="/user/*" element={<UserRoutes />} />

        {/* Coach routes */}
        <Route path="/coach/*" element={<CoachRoutes />} />

        {/* Terms */}
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />

        {/* Catch-all → redirect unknown paths to user homepage */}
        <Route path="*" element={<Navigate to="/user/homepage" />} />
      </Routes>
    </Router>
  );
}

export default App;
