function MyMessage({ message }) {
  return (
    <div className="mymessage">
      <div className="mymessage--container">
        <p>{message.text}</p>
      </div>
      <p className="mymessage--info">{message.time}</p>
    </div>
  );
}

export default MyMessage;
