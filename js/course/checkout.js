const checkToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  const data = {
    "token": token,
  }
  // console.log(params);
  try {
    const res = await accountAPI.checkToken(data);
    // console.log(res.data);
    if (!res.success) {
      
    }
  } catch (error) {
    console.log(error);
  }
}

(() => {
})()