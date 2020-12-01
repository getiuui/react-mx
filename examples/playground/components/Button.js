export const Test = 'aaa'
export const TestBtn = ({ label = 'test' }) => <p>{label}</p>

export const Button = ({
  text = 'Button',
  info = 'info',
  width = 100,
  height = 30,
  disabled = false,
  style = { background: 'white' },
  onClick = () => {}
}) => (
  <button disabled={disabled} style={{ width, height, ...style }}>
    {text} - {info}
  </button>
)

export default Button
