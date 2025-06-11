export const formatTime = (time) => {
	const formatedTime =
		parseInt(time.split(":")[0]) >= 12
			? parseInt(time.split(":")[0]) === 12
				? `${time} PM`
				: `${parseInt(time.split(":")[0]) - 12}:${time.split(":")[1]} PM`
			: parseInt(time.split(":")[0]) === 0
			? `12:${time.split(":")[1]} AM`
			: `${time} AM`;
	return formatedTime;
};