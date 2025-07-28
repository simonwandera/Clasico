import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import Products from './components/products'
import ProductsTable from './components/products'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProductsTable>

      </ProductsTable>
    </>
  )
}

export default App
