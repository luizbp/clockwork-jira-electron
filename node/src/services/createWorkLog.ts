import axios from "axios";
import { CreateWorkLogParams } from "../../types/worklogs";

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
  started
}: CreateWorkLogParams) => {
  if (!description) throw new Error("Description not informed");
  if (!task) throw new Error("Task not informed");
  if (!token) throw new Error("Token not informed");
  if (!time) throw new Error("Time not informed");
  if (!started) started = new Date().toISOString();

  return axios.post(
    `https://electrolux.atlassian.net/rest/internal/3/issue/${task}/worklog?adjustEstimate=new&newEstimate=0m`,
    {
      timeSpent: time,
      comment: {
        version: 1,
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: description,
              },
            ],
          },
        ],
      },
      started,
    },
    {
      headers: {
        "content-type": "application/json",
        cookie: `cloud.session.token=${token}`,
        'Timing-Allow-Origin': '*'
      },
    }
  );
};
