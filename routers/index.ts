import userRouter from "./user.router";
import todoRouter from "./todo.router";

const init = (app: any) => {
  app.use(userRouter);
  app.use(todoRouter)
};

export default {
  init,
};
