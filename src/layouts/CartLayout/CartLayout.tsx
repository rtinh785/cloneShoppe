import CartHeader from '../../components/CartHeader'
import Footer from '../../components/Footer'

interface Props {
  children?: React.ReactNode
}

const CartLayout = ({ children }: Props) => {
  return (
    <>
      <CartHeader />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default CartLayout
