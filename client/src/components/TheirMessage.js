function TheirMessage({ message }) {
  return (
    <div className="theirmessage">
      <div className="theirmessage--container">
        <p>{message.text}</p>
      </div>
      <p className="theirmessage--info">{message.time}</p>
    </div>
  );
}

export default TheirMessage;
