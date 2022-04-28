import CSVFileValidator from "csv-file-validator";
export class CSVValidator {
  static async validate(file) {
    const config = {
      headers: [
        {
          name: "owner_1_first_name",
          inputName: "owner_1_first_name",
          required: true,
        },
        {
          name: "owner_1_last_name",
          inputName: "owner_1_last_name",
          required: true,
        },
        {
          name: "owner_1_numbers",
          inputName: "owner_1_numbers",
          required: true,
          isArray: true,
        },
        {
          name: "owner_2_first_name",
          inputName: "owner_2_first_name",
        },
        {
          name: "owner_2_last_name",
          inputName: "owner_2_last_name",
        },
        {
          name: "owner_2_numbers",
          inputName: "owner_2_numbers",
          isArray: true,
        },
        {
          name: "property_full_address",
          inputName: "property_full_address",
          required: true,
        },
        {
          name: "property_zip",
          inputName: "property_zip",
          required: true,
        },
        {
          name: "property_county",
          inputName: "property_county",
          required: true,
        },
        {
          name: "property_state",
          inputName: "property_state",
          required: true,
        },
        {
          name: "property_apn",
          inputName: "property_apn",
          required: true,
        },
        {
          name: "active",
          inputName: "active",
        },
      ],
    };
    try {
      const data = await CSVFileValidator(file, config);
      return Promise.resolve(data);
    } catch (err) {
      console.log(err);
    }
  }

  // readFile(file) {
  //   const fr = new FileReader();

  //   const CHUNK_SIZE = 1024;
  //   let offset = 0;
  //   fr.onload = function () {
  //     console.log("still reading file");

  //     let buffer = new Uint8Array(fr.result);
  //     let snippet = new TextDecoder("utf-8").decode(buffer);
  //     // for (let i = 0; i < buffer.length; i++) {
  //     //     if (buffer[i] === 10) {
  //     //         let snippet = new TextDecoder('utf-8').decode(buffer.slice(i + 1, i + 20));
  //     //         console.log(i, snippet);

  //     //     }
  //     // }

  //     console.log(snippet);
  //     offset += CHUNK_SIZE;
  //     seek();
  //   };

  //   seek();

  //   function seek() {
  //     if (offset >= file.size) {
  //       // No \r or \n found. The column size is equal to the full
  //       // file size
  //       return;
  //     }
  //     var slice = file.slice(offset, offset + CHUNK_SIZE);
  //     fr.readAsArrayBuffer(slice);
  //   }
  // }
}
