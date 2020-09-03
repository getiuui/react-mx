import dynamic from 'next/dynamic'

const Preview = dynamic(() => import('../components/preview'), {
  ssr: false
})

const Index = () => (
  <div>
    <Preview />
  </div>
)

export default Index
