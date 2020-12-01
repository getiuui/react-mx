import TestCMP from '../components/ComponentWithStyled'
const Test = () => (
  <div className="test">
    <TestCMP />
    <style jsx>{`
      .test {
        width: 200px;
        height: 200px;
      }
    `}</style>
  </div>
)

export default Test
