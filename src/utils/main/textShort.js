export const textSubStings = (text, maxLength) => {
  const displayText =
    text.length < maxLength ? text : text.substring(0, maxLength) + "...";
  return displayText;
};
