const goToRegister = document.getElementById("goToRegister");
const goToLogin = document.getElementById("goToLogin");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formTitle = document.getElementById("formTitle");

goToRegister.onclick = () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  formTitle.textContent = "Register Account";
};

goToLogin.onclick = () => {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
  formTitle.textContent = "Login Portal";
};

async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

document.getElementById("registerBtn").onclick = async () => {
  const username = regUsername.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();
  const msg = registerMsg;

  if (!username || !email || !password) {
    msg.textContent = "Please fill all fields!";
    msg.className = "error";
    return;
  }

  if (localStorage.getItem(email)) {
    msg.textContent = "Email already registered!";
    msg.className = "error";
    return;
  }

  const hashed = await hashPassword(password);
  localStorage.setItem(email, JSON.stringify({ username, email, password: hashed, verified: true }));
  msg.textContent = "Registered successfully!";
  msg.className = "success";
};

document.getElementById("loginBtn").onclick = async () => {
  const user = loginEmail.value.trim();
  const pass = loginPassword.value.trim();
  const msg = loginMsg;

  for (let i = 0; i < localStorage.length; i++) {
    const data = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (data.email === user || data.username === user) {
      const hashed = await hashPassword(pass);
      if (hashed === data.password) {
        msg.textContent = "Login successful!";
        msg.className = "success";
        return;
      }
    }
  }

  msg.textContent = "Invalid credentials!";
  msg.className = "error";
};
