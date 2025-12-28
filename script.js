let CSC_DATA = [];

// IMPORTANT: correct path for GitHub Pages project repo
fetch("./wynik.json")
  .then(res => {
    if (!res.ok) throw new Error("Cannot load wynik.json");
    return res.json();
  })
  .then(data => {
    CSC_DATA = data.map(item => ({
      code: item.code.toUpperCase(),
      country: item.country,
      info: item.description || ""
    }));
    console.log("CSC loaded:", CSC_DATA.length);
  })
  .catch(err => {
    console.error(err);
    alert("Error loading CSC data");
  });

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

// Autocomplete
function autocomplete(input, list, key, render) {
  input.addEventListener("input", () => {
    list.innerHTML = "";
    const val = input.value.toLowerCase();
    if (!val || CSC_DATA.length === 0) return;

    CSC_DATA.filter(c => c[key].toLowerCase().includes(val))
      .slice(0, 10)
      .forEach(c => {
        const li = document.createElement("li");
        li.textContent = key === "code" ? c.code : c.country;
        li.onclick = () => {
          input.value = li.textContent;
          list.innerHTML = "";
          render();
        };
        list.appendChild(li);
      });
  });
}

// CSC search
autocomplete(
  cscInput,
  cscSuggest,
  "code",
  () => {
    const c = CSC_DATA.find(x => x.code === cscInput.value.toUpperCase());
    cscResult.innerHTML = c ? `
      <div class="card">
        <b>CSC:</b> ${c.code}<br>
        <b>Country:</b> ${c.country}<br>
        <b>Info:</b> ${c.info}
      </div>` : "";
  }
);

// Country search
autocomplete(
  countryInput,
  countrySuggest,
  "country",
  () => {
    const val = countryInput.value.toLowerCase();
    countryResult.innerHTML = CSC_DATA
      .filter(c => c.country.toLowerCase().includes(val))
      .map(c => `
        <div class="card">
          <b>${c.code}</b><br>${c.info}
        </div>`).join("");
  }
);
