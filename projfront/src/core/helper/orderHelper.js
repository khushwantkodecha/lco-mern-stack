const { API } = require('../../backend');

export const createOrder = (userId, token, oderData) => {
  return fetch(`${API}/order/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order: oderData }),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};
