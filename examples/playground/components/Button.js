import { Input } from 'react-mx'
const Button = ({ text = 'Button', width = 100, height = 30, disabled }) => (
  <button disabled={disabled} style={{ width, height }}>
    {text}
  </button>
)

Button.editableProps = {
  text: Input({
    default: 'Button',
    valueType: String,
    isVisibleByDefault: true
  }),
  width: Input({
    valueType: Number,
    default: 100,
    controlProps: {
      type: 'number'
    }
  }),
  height: Input({
    valueType: Number,
    default: 30,
    controlProps: {
      type: 'number'
    }
  })
}

export default Button
