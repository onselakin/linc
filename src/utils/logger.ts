const getTimeStamp = () => {
  const date = new Date();
  return [
    date.getHours().toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
    date.getSeconds().toString().padStart(2, '0'),
    date.getMilliseconds().toString().padStart(2, '0'),
  ].join(':');
};

const log = (message: string, style?: string) => {
  console.log(
    `[%c${getTimeStamp()}] %c${message}`,
    `font-family: 'Ubuntu Mono'; font-size: 14px; color: red`,
    `font-family: 'Ubuntu Mono'; font-size: 14px; ${style}`
  );
};

export default log;
