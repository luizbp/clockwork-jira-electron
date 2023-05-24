import axios from "axios";
type CreateWorkLogParams = {
  task: string;
  description: string;
  time: string;
  started: string;
  token: string;
};

// createWorkLog({
//   description: description.value,
//   task: task.value,
//   started: new Date().toISOString(),
//   time: completTime,
//   token: ''
// })

export const createWorkLog = async ({
  description,
  task,
  token,
  time,
  started,
}: CreateWorkLogParams) => {
  if (!description) throw new Error("Description not informed");
  if (!task) throw new Error("Task not informed");
  if (!token) throw new Error("Token not informed");
  if (!time) throw new Error("Time not informed");
  if (!started) started = new Date().toISOString();

  return axios.post(`https://work-log-api.onrender.com/v1/createworklog/`, {
    description,
    task,
    token,
    time,
    started,
  }, {
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.32.2',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'CF-Ray': '7b9472033ae11b1c-GRU',
      'ETag': 'W/"3f-TGcd1ysMGviAe01mVM86KdWwYiE"',
      'Vary': 'Accept-Encoding',
      'x-powered-by': 'Express',
      'x-render-origin-server': 'Render',
      'Server': 'cloudflare',
      'Content-Encoding': 'br',
      'alt-svc': 'h3=":443"; ma=86400, h3-29=":443"; ma=86400'
    }
  });
};
