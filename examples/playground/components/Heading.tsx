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
  objWithAttrArray: Array<{
    testA: string
    testB: String
  }>
  arrayOfStr: string[]
  strOrNum: string | number | boolean
  arrayOfStrOrNum: (string | number | boolean)[]
  enabled: boolean
  content: string
  test: TestType
  testWithBool: TestTypeWithBool
  stringOneOf: 'testA' | 'testB'
  mixedOneOf: 'testA' | 10 | false
  strongOneOfArray: Array<'testA' | 'testB'>
  onClick?: ClickHandler | Function | ((a: boolean) => void)

  // not eorking yet
  // arrayOfStrCompomsedUnion: Array<'test_value' | string>
  // testWithBoolArray: Array<TestTypeWithBool>
  // testN: Array<string | number | boolean>
}

// export const TestInner: FC<HeadingProps> = ({ content, test = 'bbb' }) => <p>{content}</p>

const Heading: FC<HeadingProps> = ({
  content = 'aaa',
  test = 'ccc',
  enabled = true,
  onClick = e => {
    console.log('h click', e)
  }
}) => (
  <>
    <h1 onClick={onClick as any}>{content}</h1>
    <p>{test}</p>
  </>
)

export default Heading
