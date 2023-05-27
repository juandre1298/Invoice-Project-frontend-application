export const guardarArchivo = (e) => {
  var file = e.target.files[0]; //the file
  var reader = new FileReader(); //this for convert to Base64
  reader.readAsDataURL(e.target.files[0]); //start conversion...
  reader.onload = async function (e) {
    //.. once finished..
    var rawLog = reader.result.split(",")[1]; //extract only thee file data part
    var dataSend = {
      dataReq: { data: rawLog, name: file.name, type: file.type },
      fname: "uploadFilesToGoogleDrive",
    }; //preapre info to send to API
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbw4txtjL418Y9FFV0DE3Q2RoNqVZASrKAdlafEqI8nCL1srrokwIq18lLClbxC3zGV9/exec", //your AppsScript URL
      { method: "POST", body: JSON.stringify(dataSend) }
    );
    const data = await response.json();
    console.log(data);
    return data;
  };
};
