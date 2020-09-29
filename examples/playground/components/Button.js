import { Input as MXInput } from 'react-mx'
const Button = ({
  text = 'Button',
  width = 100,
  height = 30,
  disabled = true,
  style = { background: 'white' },
  onClick = () => {}
}) => (
  <button disabled={disabled} style={{ width, height, ...style }}>
    {text}
  </button>
)

Button.editableProps = {
  text: MXInput({
    default: 'Button',
    valueType: String,
    isVisibleByDefault: true
  }),
  width: MXInput({
    valueType: Number,
    default: 100
  }),
  height: MXInput({
    valueType: Number,
    default: 30,
    controlProps: {
      type: 'number'
    }
  })
}

export default Button
