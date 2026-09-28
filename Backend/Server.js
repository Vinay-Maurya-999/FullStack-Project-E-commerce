import app from "./src/App.js";
import config from "./src/Config/configUrl.js";
import ConnectDB from "./src/Config/DB.js";

await ConnectDB();

app.listen(config.PORT || 6000, () => {
  console.log(`Server is running at PORT ${config.PORT}`);
});
