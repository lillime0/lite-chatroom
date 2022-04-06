import moment from "moment";

export const formatMessageDate = (text, username = "") => {
  return {
    text,
    username,
    time: moment().format("H:mm")
  };
};
