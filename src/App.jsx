import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreateGroup from './pages/CreateGroup';
import CreatePost from './pages/CreatePost';
import GroupDetail from './pages/GroupDetail';
import Groups from './pages/Groups';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto py-6">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/new" element={<CreateGroup />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                <Route path="/posts/new" element={<CreatePost />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
