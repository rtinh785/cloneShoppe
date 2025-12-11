import Footer from '../../components/Footer'
import SubHeader from '../../components/SubHeader/index'
interface Props {
  children?: React.ReactNode
  title: string
}

const SubLayout = ({ children, title }: Props) => {
  return (
    <div>
      <SubHeader title={title} />
      {children}
      <Footer />
    </div>
  )
}

export default SubLayout
