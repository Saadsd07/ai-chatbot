import { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';

function App() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => setMessage(data.message))
         .catch((err) => console.error(err));
   }, []);

   return (
      <>
         <div className="bg-red-200">{message}</div>
         <Button>Click me</Button>
      </>
   );
}

export default App;
