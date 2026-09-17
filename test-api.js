// Test API Configuration
import { doGetApiCall, doPostApiCall } from "./utils/apiConfig.js";

const testAPI = async () => {
  console.log("Testing API Configuration...");

  // Test GET request
  try {
    const getResponse = await doGetApiCall({
      url: "http://116.193.129.229:8085/api/test",
    });
    console.log("GET Response:", getResponse);
  } catch (error) {
    console.log("GET Error:", error.message);
  }

  // Test POST request
  try {
    const postResponse = await doPostApiCall({
      url: "http://116.193.129.229:8085/api/user/login",
      bodyData: { test: "data" },
    });
    console.log("POST Response:", postResponse);
  } catch (error) {
    console.log("POST Error:", error.message);
  }
};

testAPI();
