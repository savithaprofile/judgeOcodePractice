import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cpp from './coding-practices/Cpp'
import Python from './coding-practices/Python'
import SQL from './coding-practices/SQL'
import Java from './coding-practices/Java'

const App = () => {
  return (
    <>
    <nav className="navigation">
      <ul>
        <li><a href="/">Java</a></li>
        <li><a href="/python">Python</a></li>
        <li><a href="/cpp">C++</a></li>
        <li><a href="/sql">SQL</a></li>
      </ul>
    </nav>
    <Router>
      <Routes>
        <Route path="/" element={<Java />} />
        <Route path="/python" element={<Python />} />
        <Route path="/cpp" element={<Cpp />} />
        <Route path="/sql" element={<SQL />} />

      </Routes>
    </Router>
    </>
  )
}

export default App