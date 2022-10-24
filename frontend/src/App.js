import {Container} from 'react-bootstrap'
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'

function App() {
  return (
    <Router>
      <Header/>
        <main className='py-3'>
          <Container>
            <Routes>

              <Route exact path='/' element={<HomeScreen />} />

              <Route exact path='/login' element={<LoginScreen />} />
              <Route path='/login/:redirect' element={<LoginScreen />} />
              <Route exact path='/register' element={<RegisterScreen />} />
              <Route path='/register/:redirect' element={<RegisterScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </main>
      <Footer/>
    </Router>
  );
}

export default App;
