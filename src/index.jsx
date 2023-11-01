import {React , Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './Component/App'
import Loader from './Component/Loader'
import Notify from './Component/Notify'
import Navbar from './Component/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
	
    <main>
      <Router>
        <Suspense fallback={<Loader />}> 
          
		      <Routes>
            
            <Route path="/" element={<App />}  />
            <Route path="/notify" element={<Notify />}  />
        
          
          </Routes>

        </Suspense>
      </Router>
    
    </main>
    
)