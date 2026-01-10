import { useContext, useEffect } from 'react'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import { LocalStorageEvenTarget } from './utils/auth'
import { AppContext } from './context/app.context'
function App() {
  const routerElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEvenTarget.addEventListener('clearLSEvent', () => {
      reset()
    })
    return () => {
      LocalStorageEvenTarget.removeEventListener('clearLSEvent', () => {
        reset()
      })
    }
  }, [reset])
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
