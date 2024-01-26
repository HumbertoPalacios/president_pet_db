fetch("/api/presidents")
  .then((res) => res.json())
  .then((data) => {
    console.log("student data", data);
  });