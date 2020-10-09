import { Preview, loader } from 'react-mx'

const componentLoader = loader({
  components: file => import(`../components/${file}`),
  pages: file => import(`./${file}`)
})

const Index = () => {
  return <Preview componentLoader={componentLoader} />
}

export default Index
