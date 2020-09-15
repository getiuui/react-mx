import Button from '../components/Button'
import Card, { editableProps as CardEditableProps } from '../components/Card'

import { Preview } from 'react-mx'

const Index = () => (
  <Preview components={{ Button, Card }} component="Card" editableProps={{ Card: CardEditableProps }} />
)

export default Index
