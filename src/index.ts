import ResyService from "./controllers/ResyService";

const run = async () => {
  const service = new ResyService({
    email: process.env.EMAIL!,
    password: process.env.PWD!,
  });
  const loginResp = await service.generateHeadersAndLogin();
  const data = loginResp.data;
  console.log(loginResp);
};

run();
