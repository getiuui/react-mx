const CompWithStyled = ({ text = 'text' }) => (
  <div className="container">
    <span className="aaa">{text}</span>
    <style jsx>{`
      .container {
        width: 100px;
        height: 100px;
        background-color: cyan;
      }
      .aaa {
        color: blue;
        font-size: 40px;
      }
    `}</style>
  </div>
)
export default CompWithStyled
