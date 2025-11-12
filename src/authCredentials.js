// ======================
// 🔹 Getter Functions
// ======================
export function getBearerToken() {
  const token = localStorage.getItem('token');
  return token || null;
}

export function getUserData() {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

export function getUserId() {
  const user = getUserData();
  return user?.user_id || null;
}

export function getUserEmail() {
  const user = getUserData();
  return user?.email || null;
}

export function getUserRole() {
  const user = getUserData();
  return user?.role || null;
}

// ======================
// 🔹 Setter Functions
// ======================
export function setBearerToken(token) {
  localStorage.setItem('token', token);
}

export function setUserData(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
