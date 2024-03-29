import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CreatableSelect from "react-select/creatable";

import "./index.css";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Swal from "sweetalert2";
import { workLogsController } from "../../services/SaveDataLocal/workLogsController";
import { getFormattedDate } from "../../helpers/getFormattedDate";
import { useConfig } from "../../contexts/ConfigContext";

const styleBoxModal = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  "max-width": "500px",
  pt: 2,
  px: 4,
  pb: 3,
};

const styleModal = {
  margin: "50px",
  "z-index": "9",
};

type ModalWorkLogsParams = {
  open: boolean;
  handleClose: any;
};

export const ModalManualLog = ({
  handleClose,
  open,
}: ModalWorkLogsParams) => {
  const [startDate, setStartDate] = useState("");
  const [time, setTime] = useState("");
  const { task, setTask, description, setDescription, optionsTask, optionsDescription, addData, getWorkLog } = useConfig();

  const clearFields = () => {
    setStartDate("");
    setTime("");
  };

  const save = () => {
    const fullDate = getFormattedDate(new Date(startDate));
    const dateFormated = `${fullDate.date} - ${fullDate.hour}`;

    if (!description || !task) return;

    Swal.fire({
      title: "Save Worklog",
      html: `Time: <b>"${time}"</b><br> 
             Task: <b>"${task.value}"</b><br> 
             Description: <b>"${description.value}"</b><br>
             Start Date: <b>"${dateFormated}"</b><br> 
             `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#08979c",
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        const workLog = workLogsController();

        workLog.save({
          newItem: {
            id: Date.now().toString(),
            startDate: new Date(startDate).toISOString(),
            startDateFormatted: fullDate.hour,
            description: description.value,
            task: task.value,
            time,
          },
        });

        getWorkLog();

        Swal.fire({
          title: "Saved successfully!",
          icon: "success",
        });
        clearFields();
        handleClose();
      }
    });
  };

  return (
    <Modal
      sx={styleModal}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-manual-log"
    >
      <Box sx={styleBoxModal}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign={"center"}
        >
          Manual WorkLog
        </Typography>
        <div className="box--fields">
          <div>
            <label htmlFor="startDate">Start Date</label>
            <TextField
              value={startDate}
              onChange={({ target: { value } }) => setStartDate(value)}
              fullWidth
              id="startDate"
              type={"datetime-local"}
            />
          </div>
          <div>
            <label htmlFor="task">Task</label>
            <CreatableSelect
              isClearable
              id="select-task"
              onChange={(task) => {
                setTask(task);
              }}
              onCreateOption={(task) =>
                addData("task", {
                  value: task.toUpperCase(),
                  label: task.toUpperCase(),
                })
              }
              options={optionsTask}
              value={
                task
                  ? {
                      value: task.value.toUpperCase(),
                      label: task.label.toUpperCase(),
                    }
                  : null
              }
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <CreatableSelect
              isClearable
              id="select-description"
              onChange={(description) => {
                setDescription(description);
              }}
              onCreateOption={(description) =>
                addData("description", {
                  value: description,
                  label: description,
                })
              }
              options={optionsDescription}
              value={description}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <TextField
              value={time}
              onChange={({ target: { value } }: any) => setTime(value)}
              fullWidth
              id="time"
              placeholder="Ex: 1h 10m"
            />
          </div>
        </div>
        <Box className="box--modal-buttons">
          <Button
            variant="contained"
            onClick={save}
            color="primary"
            className="button--clear-worklogs"
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              clearFields();
              handleClose();
            }}
            className="button--cancel-worklogs"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
