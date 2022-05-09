import ResyService from "./controllers/ResyService";

const run = async () => {
  const service = new ResyService({
    email: process.env.RESY_EMAIL!,
    password: process.env.RESY_PASSWORD!,
  });
  const loginResp = await service.generateHeadersAndLogin();
  const data = loginResp.data;
  console.log(loginResp);
};
