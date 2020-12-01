import { FC } from 'react'

type ClickHandler = (e: any) => void
type TestType = number | string
type TestTypeWithBool = number | string | boolean

export type HeadingProps = {
  obj: Object
  objWithAttr: {
    testA: string
    testB: String
  }
  arrayOfStr: string[]
  arrayOfStrCompomsedUnion: Array<'test_value' | string | TestType>
  enabled: boolean
  content: string
  test: TestType
  testWithBool: TestTypeWithBool
  testWithBoolArray: Array<TestTypeWithBool>
  strongOneOf: 'testA' | 'testB'
  onClick?: ClickHandler | Function | ((a: boolean) => void)
}

export const TestInner: FC<HeadingProps> = ({ content, test = 'bbb' }) => <p>{content}</p>

const Heading: FC<HeadingProps> = ({
  content = 'aaa',
  test = 'ccc',
  enabled = true,
  onClick = e => {
    console.log('h click', e)
  }
}) => <h1 onClick={onClick as any}>{content}</h1>

export default Heading
