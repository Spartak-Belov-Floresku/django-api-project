import {Container} from 'react-bootstrap'
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen'

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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </main>
      <Footer/>
    </Router>
  );
}

export default App;
