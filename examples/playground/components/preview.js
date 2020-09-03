import Button from './Button'
import Card, { editableProps as CardEditableProps } from './Card'

import { Preview } from 'react-mx'
const Index = () => (
  <div>
    <Preview components={{ Button, Card }} editableProps={{ Card: CardEditableProps }} />
  </div>
)

export default Index
