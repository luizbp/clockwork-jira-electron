/* eslint-disable jsx-a11y/anchor-is-valid */

import "./index.css";

import {
  BsFillStopCircleFill,
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsFillXCircleFill,
  BsFillPlusCircleFill,
} from "react-icons/bs";

import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ModalWorkLogs } from "../ModalWorkLogs/ModalWorkLogs";
import { ModalManualLog } from "../ModalManualLog/ModalManualLog";
import { workLogsController } from "../../services/SaveDataLocal/workLogsController";
import { getFormattedDate } from "../../helpers/getFormattedDate";
import { useConfig } from "../../contexts/ConfigContext";

export const Timer = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [startDate, setStartDate] = useState<Date>();
  const [StartHour, setStartHour] = useState("");

  const [openModalLogs, setOpenModalLogs] = useState(false);
  const [openModalManualLogs, setOpenModalManualLogs] = useState(false);
  const { timerMode, setTimerMode, task, description, getWorkLog } =
    useConfig();

  useEffect(() => {
    let interval: any = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const clearWorkLog = () => {
    Swal.fire({
      title: "Attention",
      text: `Clear all saved worklogs`,
      showCancelButton: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Clean",
    }).then((result) => {
      if (result.isConfirmed) {
        workLogsController().clearAll();
        getWorkLog();

        Swal.fire({
          icon: "success",
        });
      }
    });
  };

  const deleteWorkLog = (id: string) => {
    Swal.fire({
      title: "Delete Worklog",
      showCancelButton: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        workLogsController().remove(id);
        getWorkLog();
      }
    });
  };

  const validateFields = (): boolean => {
    if (!task) {
      setTimerMode("window");

      Swal.fire({
        title: "Ops...",
        text: "Task not informed",
      });

      return false;
    }

    if (!description) {
      setTimerMode("window");

      Swal.fire({
        title: "Ops...",
        text: "Description not informed",
      });

      return false;
    }

    return true;
  };

  const handleStarPauseResume = (pIsPaused?: boolean) => {
    if (!validateFields()) return;

    if (time === 0) {
      setIsActive(true);
      setIsPaused(false);

      // const fullDate = getFormattedDate(new Date());

      setStartDate(new Date());
      setStartHour(getFormattedDate(new Date()).hour);

      return;
    }
    setIsPaused(pIsPaused || !isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const handleStop = async () => {
    if (!time) return;

    if (!validateFields()) return;

    const hour = Math.floor((time / 3600000) % 60);
    let min = Math.floor((time / 60000) % 60);

    if (Math.floor((time / 1000) % 60) >= 30) {
      min += 1;
    }

    handleStarPauseResume(true);

    setTimerMode("window");

    if (!hour && !min) {
      const result = await Swal.fire({
        title: "Attention",
        text: `Insufficient amount of time Want to reset the timer?`,
        showCancelButton: true,
        confirmButtonColor: "#08979c",
        cancelButtonColor: "#ff4d4f",
        confirmButtonText: "Reset",
      });

      if (result.isConfirmed) {
        handleReset();
      }

      return;
    }

    const completTime = `${hour}h ${min}m`;

    const result = await Swal.fire({
      title: "Save Worklog",
      html: `Time: <b>"${completTime}"</b><br> 
             Task: <b>"${task?.value}"</b><br> 
             Description: <b>"${description?.value}"</b>`,
      showCancelButton: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Save",
    });

    if (result.isConfirmed) {
      const workLog = workLogsController();

      workLog.save({
        newItem: {
          id: Date.now().toString(),
          startDate: startDate?.toISOString() || "",
          startDateFormatted: StartHour,
          description: description?.value || "",
          task: task?.value || "",
          time: completTime,
        },
      });

      getWorkLog();

      Swal.fire({
        icon: "success",
      });
      handleReset();
    }
  };

  return (
    <div className="timer">
      <div className="box-numbers">
        <div className="number">
          {" "}
          {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:{" "}
          <span className="description">h</span>
        </div>
        <div className="number">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:{" "}
          <span className="description">min</span>
        </div>
        <div className="number">
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
          <span className="description">seg</span>
        </div>
      </div>
      <div className="box--timer-controls">
        <a
          className="button--circle-primary"
          id="button-stop"
          href="#"
          title={isActive && !isPaused ? "Stop" : "Start"}
          onClick={() => {
            handleStarPauseResume();
          }}
        >
          {isActive && !isPaused ? (
            <BsFillPauseCircleFill className="color-secundary" />
          ) : (
            <BsFillPlayCircleFill className="color-primary" />
          )}
        </a>
        <a
          className="button--circle-secundary"
          id="button-reset"
          href="#"
          title="Reset"
          onClick={() => {
            handleReset();
          }}
        >
          <BsFillXCircleFill />
        </a>
        <a
          className={`button--circle-secundary ${
            !time ? "color-disabled" : ""
          }`}
          id="button-pause"
          href="#"
          title={"Finish"}
          onClick={async () => {
            await handleStop();
          }}
        >
          <BsFillStopCircleFill />
        </a>
        <a
          className={`button--circle-secundary ${time ? "color-disabled" : ""}`}
          id="button-add-manual"
          href="#"
          title={"Add Manual"}
          onClick={() => {
            setTimerMode("window");
            setOpenModalManualLogs(true);
          }}
        >
          <BsFillPlusCircleFill />
        </a>
      </div>
      {timerMode === "window" && (
        <div className="box--buttons">
          {
            <a
              className="button--primary"
              id="button-stop"
              href="#"
              onClick={() => {
                setOpenModalLogs(true);
              }}
            >
              View WorkLogs{" "}
              <HiDocumentMagnifyingGlass className="color-primary" />
            </a>
          }
        </div>
      )}
      <ModalWorkLogs
        handleClose={() => setOpenModalLogs(false)}
        open={openModalLogs}
        clearLogs={clearWorkLog}
        deleteWorkLog={deleteWorkLog}
      />
      <ModalManualLog
        handleClose={() => setOpenModalManualLogs(false)}
        open={openModalManualLogs}
      />
    </div>
  );
};
