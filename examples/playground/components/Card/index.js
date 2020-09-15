const Card = ({ title = 'Card Title', content = 'Card Content', width = 200, height = 200 }) => (
  <div
    style={{
      margin: '10px',
      backgroundColor: '#fff',
      borderRadius: 8,
      boxShadow: '0px -2px 4px rgba(128, 128, 128, 0.1),0px 2px 4px rgba(120, 120, 120, 0.25)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width,
      height
    }}
  >
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
)

export { default as editableProps } from './editableProps.json'

export default Card
