let finalArr = [];

function callAPI() {
  //To accept the number of advices
  let number = document.getElementById("adviceNum").value;
  finalArr = [];
  //clear the results div
  let resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  //input number between 2 to 30
  if (number >= 2 && number <= 30) {
    let promiseArr = [];
    let resultArr = [];
    //collect all the requests in promise array
    //call advice api using getAdvice method
    for (let i = 1; i <= number; i++) {
      promiseArr.push(getAdvice(i));
    }

    Promise.all(promiseArr).then((res) => {
      //send advices recieved from 1st API
      //to get translated version through getTranslatedText
      for (let i = 0; i < res.length; i++) {
        resultArr.push(getTranslatedText(res[i].slip));
      }
      //sort the data with // ID
      Promise.all(resultArr).then((data) => {
        finalArr.sort((a, b) => {
          return a.id - b.id;
        });
        //display the final output
        finalArr.forEach((element) => {
          let childDiv = document.createElement("div");
          childDiv.className = "advice";
          childDiv.innerHTML = `
  <span>${element.advice}</span><br>
  <span>${element.translated}</span>`;
          resultDiv.appendChild(childDiv);
        });
      });
    });
  } else {
    alert("Kindly enter a number between 2 and 30");
  }
}

function getAdvice(index) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.adviceslip.com/advice/${index}`)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      });
  });
}

function getTranslatedText(obj) {
  return new Promise((resolve, reject) => {
    fetch("https://translate.argosopentech.com/translate", {
        method: "POST",
        body: JSON.stringify({
          q: obj.advice,
          source: "en",
          target: "es",
          format: "text",
        }),
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.json())
      .then((data) => {
        finalArr.push({
          id: obj.id,
          advice: obj.advice,
          translated: data.translatedText,
        });
        resolve(data);
      });
  });
}
