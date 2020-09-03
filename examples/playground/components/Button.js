const Button = ({ text = 'Button', width = 100, height = 30, disabled }) => (
  <button disabled={disabled} style={{ width, height }}>
    {text}
  </button>
)

Button.editableProps = {
  text: {
    key: 'text',
    type: String,
    default: 'Button',
    control: {
      type: 'input',
      default: true,
      label: 'Button Text',
      options: {
        placeholder: 'enter button text'
      }
    }
  },
  width: {
    key: 'width',
    type: Number,
    default: 100,
    control: {
      type: 'input',
      label: 'Width',
      options: {
        type: 'number',
        placeholder: 'button width'
      }
    }
  },
  height: {
    key: 'width',
    type: Number,
    default: 30,
    control: {
      type: 'input',
      options: {
        type: 'number'
      }
    }
  }
}

export default Button
