import { createWorkLog } from "../services/createWorkLog";

export const WorkLogController = {
  create: async (req: any, res: any) => {
    try {
      const data = req.body;

      if(!data) throw new Error("Data Not found");
      

      await createWorkLog(data)

      res.status(200).json({
        responseInfo: {
          statusCode: 200,
          msg: "Create successfully",
        },
      });
    } catch(err) {
      console.error("TCL: err", err)
      res.status(400).json({
        responseInfo: {
          statusCode: 400,
          msg: "Error",
        },
      });
    }
  }
}