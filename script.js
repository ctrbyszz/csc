let CSC_DATA = [];

// LOAD JSON FROM GITHUB PAGES
fetch("/wynik.json")
  .then(res => res.json())
  .then(data => {
    CSC_DATA = Object.entries(data).map(([code, val]) => ({
      code,
      country: val.country,
      info: val.description || ""
    }));
  });

// TABS
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

// AUTOCOMPLETE
function autocomplete(input, list, key, render) {
  input.oninput = () => {
    list.innerHTML = "";
    const val = input.value.toLowerCase();
    if (!val) return;

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
  };
}

// CSC SEARCH
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

// COUNTRY SEARCH
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
