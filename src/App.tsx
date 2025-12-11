import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
function App() {
  const routerElements = useRouteElements()

  return (
    <>
      <div className='root'>
        {routerElements}
        <ToastContainer />
      </div>
    </>
  )
}

export default App
