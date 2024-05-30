import 'reflect-metadata'
import * as express from "express"
import { AppDataSource } from "./data-source"
import "dotenv/config";
import userRoutes from "./routes/user.routes";
import appointmentRoutes from "./routes/appointment.routes"


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', appointmentRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });