import { CSVValidator } from "./lib/csv-validator";

onmessage = (e) => {
  console.log(e.data);
  const reader = new FileReader();

  reader.onload = function (ee) {
    CSVValidator.validate(e.data).then((res) => {
      postMessage(res);
    });
  };

  reader.readAsText(e.data);
};
