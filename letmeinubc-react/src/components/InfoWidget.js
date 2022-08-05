const InfoWidget = (props) => {
  return (
    <div className="bg-cool-blue text-white rounded-lg flex items-center flex-col shadow-lg gap-2 w-44">
      <h2 className="text-xl p-6 pb-0">{props.title}</h2>
      <div className="flex justify-center items-center">{props.icon}</div>
    </div>
  );
};

export default InfoWidget;
