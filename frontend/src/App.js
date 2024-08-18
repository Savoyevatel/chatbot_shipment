import { Container } from 'react-bootstrap'

import Header from "./components/Header";
import Footer from './components/Footer';
import HomeScreen from './components/HomeScreen';


function App() {
  return (
    <div>
      <Header/>
      <main className='py-3'>
        <Container>
        <h1 className='text-center'>Efficient Cargo delivery services</h1>
        <HomeScreen/>
        </Container>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
