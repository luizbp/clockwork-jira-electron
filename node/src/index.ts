import express from 'express';
import { WorkLogController } from './controllers/WorkLogController';
const app = express()
const port = 3000

app.use(express.json());
app.post('/v1/createworklog', WorkLogController.create)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})