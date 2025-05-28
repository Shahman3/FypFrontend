function TypingIndicator() {
  return (
    <div className="">
      <div className="flex flex-row items-center space-x-1 max-w-fit   ">
        <div className="text-md text-body dark:text-white">Typing</div>
        <div className="ticontainer ">
          <div className="flex items-center">
            <div className="tidot"></div>
            <div className="tidot"></div>
            <div className="tidot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
